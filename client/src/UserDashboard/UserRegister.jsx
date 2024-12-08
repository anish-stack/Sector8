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
    LandMarkCoordinates: '',
    ShopCategory: '',
    ListingPlan: 'Free',
    HowMuchOfferPost: '',
    Password: ''
};
const BackendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
// console.log(BackendUrl)
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
            const response = await axios.post(`https://api.naideal.com/Fetch-Current-Location`, {
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
    const handleGeoCode = async (landmark) => {
        if (!landmark) {
            toast.error('Please enter landmark to proceed')
            return
        }
        try {
            const response = await axios.get(`https://api.naideal.com/geocode?address=${landmark}`)
            const locationData = response.data;
            console.log(locationData)
            setFormData((prev) => ({
                ...prev,
                LandMarkCoordinates: {
                    type: 'Point',
                    coordinates: [locationData?.longitude, locationData?.latitude]
                }
            }))
        } catch (error) {
            console.log(error)

        }
    }

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

            <div className="w-full max-w-7xl mx-auto grid lg:grid-cols-2 grid-cols-1 bg-white mt-2 overflow-hidden">
                {/* Left Section (Image Area) */}

                <div className="relative w-[90%]">
                    <img
                        src="https://img.freepik.com/free-photo/sign-up-form-button-graphic-concept_53876-123684.jpg?t=st=1733212070~exp=1733215670~hmac=21a57814be47023867b3796844d342f4dc2c574100bdcfdfb88d4128e25c38b2&w=740"
                        alt="Sign Up"
                        className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="absolute inset-0 flex justify-center items-center text-white">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold">Welcome Back!</h2>
                            <p className="mt-2 text-lg">If you already have an account, please sign in to access your account and explore our latest offers.</p>
                            <div className="mt-6">
                                <a
                                    href="/Shop-login"
                                    className="inline-block mx-2 px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg text-lg font-medium transition-colors duration-200"
                                >
                                    Sign In
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-col items-center justify-center ">
                    <h2 className="text-4xl  font-extrabold text-center text-gray-800 ">
                        Register Your Shop
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6 p-5 w-full ">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700">Username</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.UserName}
                                    onChange={(e) => setFormData({ ...formData, UserName: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700">Shop Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.ShopName}
                                    onChange={(e) => setFormData({ ...formData, ShopName: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={formData.Email}
                                    onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-700">Contact Number</label>
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
                            GeoCode={handleGeoCode}
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
                            <label className="block text-sm font-semibold mb-2 text-gray-700">Password</label>
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