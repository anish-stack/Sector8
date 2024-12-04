import React, { useState } from 'react';
import { Package, Mail, Phone, MapPin, LogOut, Crown, EllipsisVertical, Trash } from 'lucide-react';
import EditProfile from './EditProfile';

const ShopProfile = ({ shopDetails, onUpgradePackage, onLogout, onProfileUpload, setProfile, onDeleteAccount }) => {
    const [loading, setLoading] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State to manage the delete modal visibility
    const [deleteReason, setDeleteReason] = useState(''); // State to manage the delete reason

    const handleProfileChange = (event) => {
        setProfile(event.target.files[0]);
    };

    const OnClose = () => {
        setEdit(false);
    };

    const handleUploadClick = () => {
        setLoading(true);
        onProfileUpload().finally(() => {
            setLoading(false);
        });
    };

    const handleDeleteAccount = () => {
        // Call the parent function to handle account deletion
        onDeleteAccount(deleteReason);
        setShowDeleteModal(false); // Close the modal after deletion
    };

    return (
        <>
            <div className="bg-white shadow rounded-lg p-6 transform hover:scale-[1.01] transition-all relative">
                <div className="relative">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-all duration-300"
                    >
                        <EllipsisVertical className="w-5 h-5" />
                    </button>
                    {menuOpen && (
                        <div className="absolute z-[999] left-0 mt-2 w-48 bg-white shadow-lg rounded-lg text-sm text-gray-700">
                            <button
                                onClick={() => setEdit(!edit)}
                                className="w-full text-left px-4 py-2 hover:bg-gray-200"
                            >
                                Edit Profile
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(true)} // Show delete confirmation modal
                                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200"
                            >
                                Delete Profile
                            </button>
                            <button
                                onClick={onLogout}
                                className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <img
                            src={shopDetails?.ProfilePic || `https://source.unsplash.com/400x400/?shop,store&random=${Math.random()}`}
                            className="w-32 h-32 rounded-full object-cover mb-4 ring-4 ring-blue-100"
                            alt="Shop Profile"
                        />
                        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-2 py-1 rounded-full">
                            {shopDetails?.ListingPlan || 'Basic'}
                        </span>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-800">{shopDetails?.ShopName || "My Shop"}</h1>
                    <p className="text-gray-600 mb-4">{shopDetails?.ShopCategory || "General"}</p>

                    <div className="w-full space-y-3">
                        <div className="flex items-center text-gray-700">
                            <Package className="w-5 h-5 mr-2" />
                            <span>Package: {shopDetails?.ListingPlan || "Basic"}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <Mail className="w-5 h-5 mr-2" />
                            <span>{shopDetails?.Email || "email@example.com"}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <Phone className="w-5 h-5 mr-2" />
                            <span>{shopDetails?.ContactNumber || "N/A"}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <MapPin className="w-5 h-5 mr-2" />
                            <span className="truncate">
                                {shopDetails?.ShopAddress?.ShopAddressStreet || "Address not set"}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 w-full space-y-3">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfileChange}
                            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-white file:bg-blue-500 file:hover:bg-blue-600"
                        />
                        <button
                            onClick={handleUploadClick}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-300"
                            disabled={loading}
                        >
                            {loading ? (
                                <span>Uploading...</span>
                            ) : (
                                <span>Upload Profile Image</span>
                            )}
                        </button>

                        <button
                            onClick={onUpgradePackage}
                            className="w-full flex whitespace-nowrap items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white py-3 px-5 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out"
                        >
                            <Crown className="w-6 h-6" />
                            <span className="text-lg font-semibold">Upgrade Your Package</span>
                        </button>
                    </div>
                </div>
            </div>

            {edit && (
                <EditProfile profile={shopDetails} isOpen={edit} OnClose={OnClose} />
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <div className="text-center">
                            <Trash className="w-10 h-10 text-red-600 mx-auto mb-4" />
                            <h2 className="text-2xl font-semibold text-gray-800">Are you sure you want to delete your profile?</h2>
                            <p className="text-gray-600 mt-2">You will lose all your leads and customers. This action is irreversible.</p>
                            <textarea
                                className="w-full mt-4 p-2 border rounded-lg"
                                placeholder="Tell us why you're deleting your profile..."
                                value={deleteReason}
                                onChange={(e) => setDeleteReason(e.target.value)}
                            />
                            <div className="mt-4 flex justify-center gap-4">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg"
                                >
                                    Delete Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ShopProfile;
