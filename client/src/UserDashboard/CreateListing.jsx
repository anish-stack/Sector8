import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

const CreateListing = ({ isOpen, onClose, fetchMyShopDetails }) => {
    const [btnLoading, setBtnLoading] = useState(false);
    const [formData, setFormData] = useState({
        Title: '',
        Details: '',
        tags: "",
        Items: [{ itemName: '', Discount: '', dishImages: [], MrpPrice: '' }],
        Pictures: []
    });
    const [imagePreviews, setImagePreviews] = useState([]);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

    useEffect(() => {
        const isFormIncomplete = !formData.Title || !formData.Details || formData.Items.some(item => !item.itemName || !item.Discount);
        const isImageLimitExceeded = formData.Pictures.length > 5;
        setIsSubmitDisabled(isFormIncomplete || isImageLimitExceeded);
    }, [formData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'tags') {
            const tags = value.split(',').map(tag => tag.trim());
            setFormData({ ...formData, tags: tags });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleItemChange = (index, e) => {
        const { name, value, files } = e.target;
        const items = [...formData.Items];
        if (name === 'dishImages') {
            items[index][name] = files ? Array.from(files) : [];
        } else {
            items[index][name] = value;
        }
        setFormData({ ...formData, Items: items });
    };



    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (formData.Pictures.length + files.length > 5) {
            toast.error('You can only upload a maximum of 5 images.');
            return;
        }
        setFormData({ ...formData, Pictures: [...formData.Pictures, ...files] });

        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...previews]);
    };

    const handleImageRemove = (index) => {
        const updatedPictures = [...formData.Pictures];
        updatedPictures.splice(index, 1);

        const updatedPreviews = [...imagePreviews];
        updatedPreviews.splice(index, 1);

        setFormData({ ...formData, Pictures: updatedPictures });
        setImagePreviews(updatedPreviews);
    };

    const token = localStorage.getItem('ShopToken');
    const BackendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'Items') {
                    formData.Items.forEach((item, index) => {
                        data.append(`Items[${index}].itemName`, item.itemName);
                        data.append(`Items[${index}].Discount`, item.Discount);
                        data.append(`Items[${index}].MrpPrice`, item.MrpPrice);
                        item.dishImages.forEach((file, fileIndex) => {
                            data.append(`Items[${index}].dishImages[${fileIndex}]`, file);
                        });
                    });
                } else if (key === 'Pictures') {
                    formData.Pictures.forEach(file => {
                        data.append('images', file);
                    });
                } else if (key === 'tags') {
                    // Convert tags to a comma-separated string if your backend needs it that way
                    data.append('tags', formData.tags.join(', '));
                } else {
                    data.append(key, formData[key]);
                }
            });

            setBtnLoading(true);
            const response = await axios.post(`${BackendUrl}/Create-Post`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success(response.data.msg);
            onClose();
            window.location.reload();
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.msg || 'Something went wrong.');
        } finally {
            setBtnLoading(false);
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
            <Toaster />
            {btnLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                    <div className="loader"></div>
                </div>
            )}
            <div className={`bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-screen ${btnLoading ? 'opacity-50' : ''}`}>
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-semibold">Create Post</h1>
                    <button onClick={onClose} className="text-red-500 hover:text-red-700">Close</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 mb-1">
                        <div className="mb-1">
                            <label className="block text-gray-700 font-medium mb-2">Title <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="Title"
                                value={formData.Title}
                                onChange={handleInputChange}
                                className="w-full border-black px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-1">
                            <label className="block text-gray-700 font-medium mb-2">Details <span className="text-red-500">*</span></label>
                            <textarea
                                name="Details"
                                value={formData.Details}
                                onChange={handleInputChange}
                                className="w-full border-black px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-1">
                        <label className="block text-gray-700 font-medium mb-2">Add posters [Upto 5 Pictures Please upload] <span className="text-red-500">*</span></label>
                        <input
                            type="file"
                            multiple
                            name='images'
                            onChange={handleImageChange}
                            className="w-full border-black px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <div className="grid grid-cols-4 gap-2 mt-4">
                            {imagePreviews.map((src, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={src}
                                        alt={`Preview ${index}`}
                                        className="w-full border-black h-24 object-cover rounded-md"
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-0 right-0 w-[1.4rem] h-[1.4rem] flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-700"
                                        onClick={() => handleImageRemove(index)}
                                    >
                                        <i className="fa-solid text-sm fa-minus"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    {formData.Pictures.length > 5 && (
                        <div className="text-red-500 text-sm mb-4">You can only upload a maximum of 5 images.</div>
                    )}
                    <div className="mb-1 border-t-2 border-t-black-500 border-solid pt-2">
                        <label className="block text-gray-700 font-medium mb-2">Item <span className="text-red-500">*</span></label>
                        {formData.Items.map((item, index) => (
                            <div key={index} className="mb-4">
                                <div className="flex items-center mb-4 space-x-4">
                                    <input
                                        type="text"
                                        name="itemName"
                                        placeholder="Item Name"
                                        value={item.itemName}
                                        onChange={(e) => handleItemChange(index, e)}
                                        className="w-full border-black px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <input
                                        type="number"
                                        name="Discount"
                                        placeholder="Discount"
                                        value={item.Discount}
                                        onChange={(e) => handleItemChange(index, e)}
                                        className="w-1/3 border-black px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="MrpPrice"
                                        placeholder="MrpPrice"
                                        value={item.MrpPrice}
                                        onChange={(e) => handleItemChange(index, e)}
                                        className="w-1/3 border-black px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <input
                                    type="file"
                                    name="dishImages"
                                    multiple
                                    onChange={(e) => handleItemChange(index, e)}
                                    className="w-full border-black px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        ))}
                    </div>
                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}

                            placeholder="Enter tags separated by commas"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitDisabled}
                        className={`w-full py-2 text-white rounded-md transition-all duration-300 ease-in-out ${isSubmitDisabled
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                            }`}
                    >
                        {btnLoading ? "Please Wait.." : "Post It"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateListing;
