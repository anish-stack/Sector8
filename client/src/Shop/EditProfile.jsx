import React, { useState, useEffect } from 'react';
import axios from 'axios'
const EditProfile = ({ profile, isOpen, OnClose }) => {
    const [updateData, setUpdateData] = useState({
        UserName: '',
        ShopName: '',
        ContactNumber: '',
        Email: '',
    });
    const [isLoading, setIsLoading] = useState(false);  // Loading state

    // Effect to set initial data when the profile prop is passed
    useEffect(() => {
        if (profile && isOpen) {
            setUpdateData({
                UserName: profile.UserName || '',
                ShopName: profile.ShopName || '',
                ContactNumber: profile.ContactNumber || '',
                Email: profile.Email || '',
            });
        }
    }, [profile, isOpen]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdateData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the token exists in localStorage
        const token = localStorage.getItem('ShopToken');
        if (!token) {
            // Clear localStorage and redirect to login
            localStorage.clear();
            window.location.href = '/login';
            return;
        }

        setIsLoading(true);  // Start loading

        try {
            const res = await axios.post('https://api.naideal.com/api/v1/Upload-Profile-Details', updateData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            // Handle success (you can add more logic based on the response here)
            console.log('Updated Profile:', res.data);
            window.location.reload()
            OnClose();  // Close the modal after submit

        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setIsLoading(false);  // Stop loading
        }
    };

    // Don't render modal if isOpen is false
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/3">
                <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="UserName">
                            UserName
                        </label>
                        <input
                            type="text"
                            id="UserName"
                            name="UserName"
                            value={updateData.UserName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="ShopName">
                            Shop Name
                        </label>
                        <input
                            type="text"
                            id="ShopName"
                            name="ShopName"
                            value={updateData.ShopName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="ContactNumber">
                            Contact Number
                        </label>
                        <input
                            type="text"
                            id="ContactNumber"
                            name="ContactNumber"
                            value={updateData.ContactNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="Email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="Email"
                            name="Email"
                            value={updateData.Email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex justify-between items-center mt-6">
                        <button
                            type="button"
                            onClick={OnClose}
                            className="py-2 px-4 bg-gray-300 rounded-lg hover:bg-gray-400 focus:outline-none"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`py-2 px-4 ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none'}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
