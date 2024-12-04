import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Save, X, Upload, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const EditPost = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const id = searchParams.get('id');
    const shopId = searchParams.get('shopId');

    const [formData, setFormData] = useState({
        Title: '',
        Details: '',
        Items: []
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        fetchPost();
    }, [id, shopId]);

    const fetchPost = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin-get-post?id=${shopId}`);
            const post = response.data.data.find(p => p._id === id);

            if (!post) {
                throw new Error('Post not found');
            }

            setFormData({
                Title: post.Title,
                Details: post.Details,
                Items: post.Items,
            });
            setImages(post.Pictures);
        } catch (err) {
            setError(err.message);
            showNotification(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 5000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            Items: prev.Items.map((item, i) =>
                i === index ? { ...item, [name]: value } : item
            )
        }));
    };

    const handleImagePreview = (file, index, type, itemIndex = null) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === 'main') {
                setImagePreviews(prev => {
                    const newPreviews = [...prev];
                    newPreviews[index] = reader.result;
                    return newPreviews;
                });
            } else {
                setImagePreviews(prev => {
                    const newPreviews = [...prev];
                    newPreviews[`item_${itemIndex}_${index}`] = reader.result;
                    return newPreviews;
                });
            }
        };
        reader.readAsDataURL(file);
    };

    const handleImageChange = (index, e, type = 'main', itemIndex = null) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showNotification('Please upload only image files', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showNotification('Image size should be less than 5MB', 'error');
            return;
        }

        if (type === 'main') {
            setImages(prev => {
                const newImages = [...prev];
                newImages[index] = { ...newImages[index], file };
                return newImages;
            });
        } else {
            setFormData(prev => ({
                ...prev,
                Items: prev.Items.map((item, idx) =>
                    idx === itemIndex
                        ? {
                            ...item,
                            dishImages: item.dishImages.map((img, imgIdx) =>
                                imgIdx === index ? { ...img, file } : img
                            )
                        }
                        : item
                )
            }));
        }

        handleImagePreview(file, index, type, itemIndex);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;

        try {
            setSubmitting(true);
            const formDataToSubmit = new FormData();

            // Append basic information
            formDataToSubmit.append('Title', formData.Title);
            formDataToSubmit.append('Details', formData.Details);

            // Append items
            formData.Items.forEach((item, index) => {
                formDataToSubmit.append(`Items[${index}].itemName`, item.itemName);
                formDataToSubmit.append(`Items[${index}].Discount`, item.Discount);
                formDataToSubmit.append(`Items[${index}].MrpPrice`, item.MrpPrice);
                formDataToSubmit.append(`Items[${index}].public_id`, item.public_id || '');

                if (item.dishImages) {
                    item.dishImages.forEach((image) => {
                        if (image.file) {
                            formDataToSubmit.append('dishImage', image.file);
                        }
                    });
                }
            });

            // Append main images
            images.forEach((image) => {
                if (image.file) {
                    console.log("Big Image", image.file)
                    formDataToSubmit.append('MainImage', image.file);
                }
            });

            await axios.put(
                `${process.env.REACT_APP_BACKEND_URL}/admin-Shop-Edit-post?id=${shopId}&ListingId=${id}`,
                formDataToSubmit,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );

            showNotification('Post updated successfully');
            navigate('/All-Post');
        } catch (err) {
            showNotification(err.message || 'Error updating post', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-semibold text-gray-800">Error Loading Post</h2>
                <p className="text-gray-600 mt-2">{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
            {notification.show && (
                <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
                    } text-white`}>
                    {notification.message}
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Edit Post</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            name="Title"
                            value={formData.Title}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Details
                        </label>
                        <textarea
                            name="Details"
                            value={formData.Details}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>
                </div>

                {/* <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-800">Images</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={imagePreviews[index] || image.ImageUrl}
                    alt={`Preview ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer p-2 bg-white rounded-full">
                      <Upload className="w-5 h-5 text-gray-800" />
                      <input
                        type="file"
                        onChange={(e) => handleImageChange(index, e)}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> */}

                <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-gray-800">Items</h2>
                    {formData.Items.map((item, itemIndex) => (
                        <div key={itemIndex} className="p-4 bg-gray-50 rounded-lg space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Item Name
                                    </label>
                                    <input
                                        type="text"
                                        name="itemName"
                                        value={item.itemName}
                                        onChange={(e) => handleItemChange(itemIndex, e)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Price (₹)
                                    </label>
                                    <input
                                        type="number"
                                        name="MrpPrice"
                                        value={item.MrpPrice}
                                        onChange={(e) => handleItemChange(itemIndex, e)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Discount (%)
                                    </label>
                                    <input
                                        type="number"
                                        name="Discount"
                                        value={item.Discount}
                                        onChange={(e) => handleItemChange(itemIndex, e)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Item Images
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {item.dishImages.map((image, imageIndex) => (
                                        <div key={imageIndex} className="relative group">
                                            <button onClick={(e) => handleImageChange(imageIndex, e, 'item', itemIndex)}>Uplaod New Image</button>

                                            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100">
                                                <img
                                                    src={imagePreviews[`item_${itemIndex}_${imageIndex}`] || image.ImageUrl}
                                                    alt={`Item ${itemIndex + 1} Preview ${imageIndex + 1}`}
                                                    className="object-cover w-full h-full"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <label className="cursor-pointer p-2 bg-white rounded-full">
                                                        <Upload className="w-5 h-5 text-gray-800" />
                                                        <input
                                                            type="file"
                                                            onChange={(e) => handleImageChange(imageIndex, e, 'item', itemIndex)}
                                                            className="hidden"
                                                            accept="image/*"
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        disabled={submitting}
                        className={`flex items-center px-6 py-2 rounded-md text-white ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                            } transition-colors`}
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5 mr-2" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPost;