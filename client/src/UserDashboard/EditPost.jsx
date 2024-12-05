import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditPost = () => {
    const query = new URLSearchParams(window.location.search);
    const id = query.get('id');
    const token = localStorage.getItem('ShopToken');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        Title: '',
        Details: '',
        Items: []
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]); // State for image previews
    const BackendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`${BackendUrl}/My-Shop-Post`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const post = response.data.data.find(p => p._id === id);
                if (post) {
                    setFormData({
                        Title: post.Title,
                        Details: post.Details,
                        Items: post.Items,
                    });
                    setImages(post.Pictures);
                    setLoading(false);
                } else {
                    setError('Post not found');
                    setLoading(false);
                }
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchPost();
    }, [id, token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const updatedItems = formData.Items.map((item, i) =>
            i === index ? { ...item, [name]: value } : item
        );
        setFormData({ ...formData, Items: updatedItems });
    };

    const handleImageChange = (index, e) => {
        const updatedImages = [...images];
        updatedImages[index] = {
            ...updatedImages[index],
            file: e.target.files[0]
        };
        setImages(updatedImages);

        // Update image preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    const handleDishImageChange = (itemIndex, dishIndex, e) => {
        const updatedItems = [...formData.Items];
        updatedItems[itemIndex].dishImages[dishIndex] = {
            ...updatedItems[itemIndex].dishImages[dishIndex],
            file: e.target.files[0]
        };
        setFormData({ ...formData, Items: updatedItems });

        // Update image preview
        const reader = new FileReader();
        reader.onloadend = () => {
            const updatedPreviews = [...imagePreviews];
            updatedPreviews[itemIndex * 10 + dishIndex] = reader.result;
            setImagePreviews(updatedPreviews);
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const formDataToSubmit = new FormData();
        formDataToSubmit.append('Title', formData.Title);
        formDataToSubmit.append('Details', formData.Details);
        formData.Items.forEach((item, index) => {
            formDataToSubmit.append(`Items[${index}].itemName`, item.itemName);
            formDataToSubmit.append(`Items[${index}].Discount`, item.Discount);
            formDataToSubmit.append(`Items[${index}].MrpPrice`, item.MrpPrice);

            formDataToSubmit.append(`Items[${index}].public_id`, item.public_id);
            item.dishImages.forEach((dishImage, dishIndex) => {
                if (dishImage.file) {
                    formDataToSubmit.append(`dishImages`, dishImage.file);
                }
            });
        });

        images.forEach((image, index) => {
            if (image.file) {
                formDataToSubmit.append(`images`, image.file);
            }
        });

        try {
            const response = await axios.put(`${BackendUrl}/My-Shop-Edit-post/${id}`, formDataToSubmit, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
            navigate(`/Shop-Dashboard`);
        } catch (err) {
            setError(err.message);
            console.log(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="min-h-screen  bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <div className="border-b pb-4 mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Edit Your Post</h2>
                <p className="text-gray-600 mt-2">Update your post information and media</p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-8">
                {/* Title Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <label className="block text-lg font-semibold text-gray-800 mb-4">
                        Post Title
                        <input
                            type="text"
                            name="Title"
                            value={formData.Title}
                            onChange={handleInputChange}
                            className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            placeholder="Enter post title"
                            required
                        />
                    </label>
                </div>

                {/* Details Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <label className="block text-lg font-semibold text-gray-800 mb-4">
                        Post Details
                        <textarea
                            name="Details"
                            value={formData.Details}
                            onChange={handleInputChange}
                            rows={4}
                            className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            placeholder="Enter post details"
                            required
                        />
                    </label>
                </div>

                {/* Items Section */}
                {formData.Items.map((item, itemIndex) => (
                    <div key={itemIndex} className="bg-gray-50 p-6 rounded-lg">
                        <div className="flex items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Item {itemIndex + 1}</h3>
                            <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                Product Details
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label className="block">
                                <span className="text-gray-700 font-medium">Item Name</span>
                                <input
                                    type="text"
                                    name="itemName"
                                    value={item.itemName}
                                    onChange={(e) => handleItemChange(itemIndex, e)}
                                    className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </label>

                            <label className="block">
                                <span className="text-gray-700 font-medium">Discount</span>
                                <input
                                    type="text"
                                    name="Discount"
                                    value={item.Discount}
                                    onChange={(e) => handleItemChange(itemIndex, e)}
                                    className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </label>

                            <label className="block">
                                <span className="text-gray-700 font-medium">MRP Price</span>
                                <input
                                    type="text"
                                    name="MrpPrice"
                                    value={item.MrpPrice}
                                    onChange={(e) => handleItemChange(itemIndex, e)}
                                    className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </label>
                        </div>

                        {/* Dish Images */}
                        <div className="mt-6">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4">Product Images</h4>
                            {item.dishImages && item.dishImages.length > 0 ? (
                                item.dishImages.map((dishImage, dishIndex) => (
                                    <div key={dishIndex} className="mb-6 p-4 bg-white rounded-lg shadow-sm">
                                        <div className="flex flex-wrap items-center gap-6">
                                            <div className="space-y-4">
                                                {dishImage.ImageUrl && (
                                                    <div className="relative inline-block">
                                                        <img
                                                            src={dishImage.ImageUrl}
                                                            alt={`Dish ${dishIndex + 1}`}
                                                            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                                                        />
                                                        <span className="absolute bottom-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                                                            Current
                                                        </span>
                                                    </div>
                                                )}
                                                {imagePreviews[itemIndex * 10 + dishIndex] && (
                                                    <div className="relative inline-block">
                                                        <img
                                                            src={imagePreviews[itemIndex * 10 + dishIndex]}
                                                            alt={`New Preview ${dishIndex + 1}`}
                                                            className="w-32 h-32 object-cover rounded-lg border-2 border-blue-400"
                                                        />
                                                        <span className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                                            New
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-grow">
                                                <input
                                                    type="file"
                                                    onChange={(e) => handleDishImageChange(itemIndex, dishIndex, e)}
                                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="mb-6">
                                    <input
                                        type="file"
                                        onChange={(e) => handleDishImageChange(itemIndex, 0, e)}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        required
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Main Images Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Post Images</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {images && images.map((image, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                                <div className="flex flex-wrap items-center gap-6">
                                    <div className="space-y-4">
                                        {image.ImageUrl && (
                                            <div className="relative inline-block">
                                                <img
                                                    src={image.ImageUrl}
                                                    alt={`Image ${index + 1}`}
                                                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                                                />
                                                <span className="absolute bottom-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                                                    Current
                                                </span>
                                            </div>
                                        )}
                                        {imagePreviews[index] && (
                                            <div className="relative inline-block">
                                                <img
                                                    src={imagePreviews[index]}
                                                    alt={`New Preview ${index + 1}`}
                                                    className="w-32 h-32 object-cover rounded-lg border-2 border-blue-400"
                                                />
                                                <span className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                                    New
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <input
                                            type="file"
                                            onChange={(e) => handleImageChange(index, e)}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        disabled={submitting}
                        className={`
                            px-8 py-3 rounded-lg text-white font-semibold text-lg
                            ${submitting 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all duration-150'}
                            shadow-lg hover:shadow-xl
                        `}
                    >
                        {submitting ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                            </span>
                        ) : (
                            'Update Post'
                        )}
                    </button>
                </div>
            </form>
        </div>
    </div>
    );
};

export default EditPost;
