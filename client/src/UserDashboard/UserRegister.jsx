import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeolocated } from 'react-geolocated';
import axios from 'axios';
import toast from 'react-hot-toast';
import LocationInput from './LocationInput';
import PackageSelector from './PackageSelector';
import CategorySelector from './CategorySelector';

const initialFormData = {
    UserName: '',
    Email: '',
    ContactNumber: '',
    ShopName: '',
    ShopAddress: {
        City: '',
        PinCode: '',
        ShopAddressStreet: '',
        ShopLatitude: '',
        ShopLongitude: '',
        ShopNo: '',
        NearByLandMark: ''
    },
    ShopCategory: '',
    ListingPlan: 'Free',
    HowMuchOfferPost: '',
    Password: ''
};
const BackendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
console.log(BackendUrl)
const UserRegister = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [categories, setCategories] = useState([]);
    const [packages, setPackages] = useState([]);
    const navigate = useNavigate();

    const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
        positionOptions: { enableHighAccuracy: false },
        userDecisionTimeout: 5000,
    });

    useEffect(() => {
        fetchCategories();
        fetchPackages();
    }, []);

    useEffect(() => {
        if (coords) {
            fetchCurrentLocation();
        }
    }, [coords]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${BackendUrl}/admin-get-categories`);
            setCategories(response.data.data);
        } catch (error) {
            toast.error('Error fetching categories');
        }
    };

    const fetchPackages = async () => {
        try {
            const response = await axios.get(`${BackendUrl}/admin-packages`);
            setPackages(response.data.packages);
        } catch (error) {
            toast.error('Error fetching packages');
        }
    };

    const fetchCurrentLocation = async () => {
        if (!coords) return;

        try {
            const response = await axios.post(`http://localhost:7485/Fetch-Current-Location`, {
                lat: coords.latitude,
                lng: coords.longitude
            });

            const locationData = response.data.data;
            setFormData(prev => ({
                ...prev,
                ShopAddress: {
                    ...prev.ShopAddress,
                    City: locationData.address?.city || '',
                    PinCode: locationData.address?.postalCode || '',
                    ShopAddressStreet: locationData.address?.completeAddress || '',
                    ShopLatitude: locationData.address?.lat || '',
                    ShopLongitude: locationData.address?.lng || ''
                }
            }));
        } catch (error) {
            toast.error('Error fetching location');
        }
    };

    const handleSubmit = async (e) => {
        console.log(formData)
        e.preventDefault();
        try {
            const response = await axios.post(`${BackendUrl}/register-list-user`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('B2bToken')}`
                }
            });

            if (formData.ListingPlan === 'Free') {
                toast.success('Shop listed successfully');
                navigate('/Shop-login');
            } else {
                const order = response.data.order;
                const options = {
                    key: "rzp_test_gQGRDFaoEskOdr",
                    amount: order?.amount,
                    currency: "INR",
                    name: "Nai Deal",
                    description: `Payment For Plans Name ${formData.ListingPlan}`,
                    image: "https://i.pinimg.com/originals/9e/ff/85/9eff85f9a3f9540bff61bbeffa0f6305.jpg",
                    order_id: order?.id,
                    callback_url: `${BackendUrl}/paymentverification`,
                    prefill: {
                        name: formData.UserName,
                        email: formData.Email,
                        contact: formData.ContactNumber
                    },
                    theme: { color: "#121212" }
                };

                const razorpay = new window.Razorpay(options);
                razorpay.on('payment.failed', () => {
                    toast.error('Payment failed. Please try again.');
                });
                razorpay.open();
            }

            localStorage.removeItem('formData');
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
      
        <>
               <h2 className="text-4xl mt-5 font-extrabold text-center text-gray-800 ">
                        Register Your Shop
                    </h2>
            <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 grid-cols-1 bg-white mt-4 overflow-hidden">
                {/* Left Section (Image Area) */}
                
                <div className="relative  flex items-center justify-center p-6">
                    <img
                        src="https://img.freepik.com/free-vector/shop-with-sign-we-are-open_23-2148562563.jpg?t=st=1733121386~exp=1733124986~hmac=b6a8e1440a9bd46879579a0a7387c3b2904a79b3867201bf8a8e00fad0a5ae8a&w=740"
                        alt="Shop Illustration"
                        className="rounded-md shadow-md w-full  object-cover"
                    />
                  
                </div>

                {/* Right Section */}
                <div className="flex flex-col items-center justify-center ">
             

                    <form onSubmit={handleSubmit} className="space-y-6 p-5 w-full ">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Username</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.UserName}
                                    onChange={(e) => setFormData({ ...formData, UserName: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Shop Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.ShopName}
                                    onChange={(e) => setFormData({ ...formData, ShopName: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={formData.Email}
                                    onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Contact Number</label>
                                <input
                                    type="tel"
                                    value={formData.ContactNumber}
                                    onChange={(e) => setFormData({ ...formData, ContactNumber: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Location Information */}
                        <LocationInput
                            formData={formData}
                            setFormData={setFormData}
                            isGeolocationAvailable={isGeolocationAvailable}
                            isGeolocationEnabled={isGeolocationEnabled}
                        />

                        {/* Category and Package Selection */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <CategorySelector
                                categories={categories}
                                value={formData.ShopCategory}
                                onChange={(category) => setFormData({ ...formData, ShopCategory: category })}
                            />

                            <PackageSelector
                                packages={packages}
                                value={formData.ListingPlan}
                                onChange={(plan) => setFormData({ ...formData, ListingPlan: plan })}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">Password</label>
                            <input
                                type="password"
                                required
                                value={formData.Password}
                                onChange={(e) => setFormData({ ...formData, Password: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-3 px-6 bg-indigo-600 text-white text-lg font-semibold rounded-md shadow hover:bg-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Register Shop
                        </button>
                    </form>
                </div>
            </div>
        </>
     

    );
}

export default UserRegister