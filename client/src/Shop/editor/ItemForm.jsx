import React, { useState } from 'react';
import { Trash2, Image as ImageIcon } from 'lucide-react';

const ItemForm = ({ item, index, imagePreviews, onItemChange, onDishImageChange, onRemoveItem }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    // Handle image selection and preview
    const handleImageSelect = (e) => {
        const file = e.target.files[0];
       
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result); // Set the selected image preview
                onDishImageChange(index, 0, e); // Pass the file to the parent component
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-800">Item {index + 1}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        Product Details
                    </span>
                </div>
                <button
                    onClick={() => onRemoveItem(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="Remove Item"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <label className="block">
                    <span className="text-gray-700 font-medium">Item Name</span>
                    <input
                        type="text"
                        name="itemName"
                        value={item.itemName}
                        onChange={(e) => onItemChange(index, e)}
                        className="mt-1 w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700 font-medium">Discount (%)</span>
                    <input
                        type="number"
                        name="Discount"
                        value={item.Discount}
                        onChange={(e) => onItemChange(index, e)}
                        className="mt-1 w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        max="100"
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700 font-medium">MRP Price</span>
                    <input
                        type="number"
                        name="MrpPrice"
                        value={item.MrpPrice}
                        onChange={(e) => onItemChange(index, e)}
                        className="mt-1 w-full px-4 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        min="0"
                    />
                </label>
            </div>

            <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-blue-500" />
                    Product Images
                </h4>

                <div className="gap-4">
                    {item.dishImages && item.dishImages.map((dishImage, dishIndex) => (
                        <div key={dishIndex} className="relative group">
                            <div className="rounded-lg overflow-hidden">
                                {dishImage.ImageUrl && (
                                    <img
                                        src={dishImage.ImageUrl}
                                        alt={`Product ${index + 1} - Image ${dishIndex + 1}`}
                                        className="w-32 h-32 object-cover"
                                    />
                                )}
                                {imagePreviews[index * 10 + dishIndex] && (
                                    <img
                                        src={imagePreviews[index * 10 + dishIndex]}
                                        alt={`New Preview ${dishIndex + 1}`}
                                        className="w-32 h-32 object-cover"
                                    />
                                )}

                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all">
                                    <label className="absolute inset-0 flex items-center justify-center cursor-pointer">
                                        <input
                                            type="file"
                                            onChange={(e) => onDishImageChange(index, dishIndex, e)}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                        <span className="bg-white px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                                            Change Image
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Show the Upload button if there are no images */}
                    {item.dishImages.length === 0 && (
                        <div className="w-full flex justify-center">
                            <button
                                type='button'
                                onClick={() => document.getElementById(`image-upload-${index}`).click()}
                                className="bg-blue-500 text-white px-6 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Upload Image
                            </button>
                            <input
                                id={`image-upload-${index}`}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageSelect}
                            />
                            {selectedImage && (
                                <img
                                    src={selectedImage}
                                    alt="Selected Image Preview"
                                    className="mt-4 w-32 h-32 object-cover"
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ItemForm;
