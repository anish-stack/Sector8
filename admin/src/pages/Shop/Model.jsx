import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const Modal = ({ onClose, editData, setEditData, handleUpdate }) => {
    const [formData, setFormData] = useState({
        ShopName: editData.ShopName || '',
        UserName: editData.UserName || '',

        ContactNumber: editData.ContactNumber || '',
        Email: editData.Email || '',
        ListingPlan: editData.ListingPlan || '',
        // Initialize ShopAddress fields
        ShopAddress: {
            ...editData.ShopAddress,
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('ShopAddress.')) {
            // Handle nested ShopAddress fields
            const nestedField = name.split('.')[1];
            setFormData({
                ...formData,
                ShopAddress: {
                    ...formData.ShopAddress,
                    [nestedField]: value,
                },
            });
            setEditData({
                ...editData,
                ShopAddress: {
                    ...editData.ShopAddress,
                    [nestedField]: value,
                },
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
            setEditData({
                ...editData,
                [name]: value,
            });
        }
    };

    const handleUpdateClick = () => {
        handleUpdate();
        toast.success('Shop details updated successfully');
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 overflow-auto">
            <div className="bg-white h-[700px] p-2 overflow-scroll rounded-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Edit Shop Details</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <label className="block mb-4">
                    Shop Name:
                    <input
                        type="text"
                        name="ShopName"
                        value={formData.ShopName}
                        onChange={handleChange}
                        className="border px-3 py-2 mt-1 w-full"
                    />
                </label>
                <label className="block mb-4">
                    User Name:
                    <input
                        type="text"
                        name="UserName"
                        value={formData.UserName}
                        onChange={handleChange}
                        className="border px-3 py-2 mt-1 w-full"
                    />
                </label>
                <label className="block mb-4">
                    Location:
                    <input
                        type="text"
                        name="ShopAddress.ShopAddressStreet"
                        value={formData.ShopAddress?.ShopAddressStreet || ''}
                        onChange={handleChange}
                        className="border px-3 py-2 mt-1 w-full"
                    />
                </label>
                <label className="block mb-4">
                    Contact Number:
                    <input
                        type="text"
                        name="ContactNumber"
                        value={formData.ContactNumber}
                        onChange={handleChange}
                        className="border px-3 py-2 mt-1 w-full"
                    />
                </label>
                <label className="block mb-4">
                    Email:
                    <input
                        type="email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleChange}
                        className="border px-3 py-2 mt-1 w-full"
                    />
                </label>
                <label className="block mb-4">
                    Listing Plan:
                    <select
                        name="ListingPlan"
                        value={formData.ListingPlan}
                        onChange={handleChange}
                        className="border px-3 py-2 mt-1 w-full"
                    >
                        <option value="Free">Free</option>
                        <option value="Gold">Gold</option>
                        <option value="Silver">Silver</option>
                    </select>
                </label>
                <label className="block mb-4">
                    Pin Code:
                    <input
                        type="text"
                        name="ShopAddress.PinCode"
                        value={formData.ShopAddress?.PinCode || ''}
                        onChange={handleChange}
                        className="border px-3 py-2 mt-1 w-full"
                    />
                </label>
                <label className="block mb-4">
                    Shop No:
                    <input
                        type="text"
                        name="ShopAddress.ShopNo"
                        value={formData.ShopAddress?.ShopNo || ''}
                        onChange={handleChange}
                        className="border px-3 py-2 mt-1 w-full"
                    />
                </label>
                <label className="block mb-4">
                    NearBy LandMark:
                    <input
                        type="text"
                        name="ShopAddress.NearByLandMark"
                        value={formData.ShopAddress?.NearByLandMark || ''}
                        onChange={handleChange}
                        className="border px-3 py-2 mt-1 w-full"
                    />
                </label>

                <button onClick={handleUpdateClick} className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
            </div>
        </div>
    );
};

export default Modal;
