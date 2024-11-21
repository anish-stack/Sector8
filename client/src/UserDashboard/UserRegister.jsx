import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const UserRegister = ({ locationDetails }) => {
    const [data, setData] = useState([])
    const [city, setCity] = useState([])
    const [packages, setPackages] = useState([]);
    const BackendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL
    const [formData, setFormData] = useState({
        UserName: "",
        ShopName: "",
        ContactNumber: "",
        Email: "",
        ShopAddress: {
            City: "",
            PinCode: "",
            ShopNo: "",
            ShopAddressStreet: "",
            NearByLandMark: "",
            ShopLongitude: "",
            ShopLatitude: ""
        },
        ListingPlan: '', // Default to empty string
        price: 0,
        ShopCategory: "",
        CustomCategory: "",  // New field for custom category
        HowMuchOfferPost: "",
        Password: "",
    });

    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const currentStep = query.get('step');
        if (currentStep) {
            setStep(parseInt(currentStep));
        }

        const savedData = localStorage.getItem('formData');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
    }, [location]);

    useEffect(() => {
        localStorage.setItem('formData', JSON.stringify(formData));
    }, [formData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Validate contact number field for mobile devices
        if (name === 'ContactNumber') {
            // Allow only numeric input and restrict to 10 digits
            const regex = /^[0-9]{0,10}$/;
            if (!regex.test(value)) {
                // Display a toast or error message for invalid input
                toast.error('Please enter a valid contact number (10 digits)');
                return;
            }
        }
        if (name === 'Email') {
            // Automatically append @gmail.com if not present
            let email = value.trim();
            if (!email.includes('@')) {
                email += '@gmail.com';
            }
            setFormData(prevState => ({
                ...prevState,
                [name]: email
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }

        if (name === 'ListingPlan') {
            updatePrice(value);
        }
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(`${BackendUrl}/admin-get-categories`)
            const data = response.data.data
            console.log(data)
            setData(data)
        } catch (error) {
            console.log(error)
        }
    }
    const fetchPackages = async () => {
        try {
            const response = await axios.get(`${BackendUrl}/admin-packages`);
            setPackages(response.data.packages);

            console.log(response.data.packages)
        } catch (error) {
            console.log('Error fetching packages:', error);
        }
    };

    const fetchCity = async () => {
        try {
            const response = await axios.get(`${BackendUrl}/admin-get-city`);
            const data = response.data
            setCity(data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchData()
        fetchCity()
        fetchPackages()
    }, [])
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            ShopAddress: {
                ...prevState.ShopAddress,
                [name]: value
            }
        }));
    };

    const nextStep = () => {
        // Check if required fields in Step 1 are filled
        const { UserName, ShopName, ContactNumber, Email, ShopAddress: { PinCode } } = formData;
        if (!UserName || !ShopName || !ContactNumber || !Email || !PinCode) {
            toast.error('Please fill in all required fields before proceeding.');
            return;
        }

        // Proceed to the next step if all fields are filled
        setStep(prevStep => {
            const newStep = prevStep + 1;
            navigate(`?step=${newStep}`);
            return newStep;
        });
    };


    const prevStep = () => {
        setStep(prevStep => {
            const newStep = prevStep - 1;
            navigate(`?step=${newStep}`);
            return newStep;
        });
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            // Validate required fields before submission
            if (!validateForm()) {
                return;
            }

            const response = await axios.post(`${BackendUrl}/register-list-user`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('B2bToken')}`
                }
            });

            // Handle response based on ListingPlan
            if (formData.ListingPlan === 'Free') {
                toast.success('Shop listed successfully.');
                localStorage.removeItem('formData');  // Clear form data after successful submission
            } else {
                // Handle payment process for Silver or Gold plan
                const order = response.data.order;

                const options = {
                    key: "rzp_test_gwvXwuaK4gKsY3",
                    amount: order?.amount || null,
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
                    notes: {
                        "address": "Razorpay Corporate Office"
                    },
                    theme: {
                        "color": "#121212"
                    }
                };

                const razorpay = new window.Razorpay(options);
                razorpay.on('payment.failed', function (response) {
                    toast.error('Payment failed. Please try again.');
                });
                razorpay.open();
            }

            toast.success('Shop listed successfully. Make your first post!');
            localStorage.removeItem('formData');  // Clear form data after successful submission
        } catch (error) {
            toast.error('There was an error registering: ' + error.response?.data?.message || 'Unknown error');
            console.error('There was an error:', error);
        }
    };

    const validateForm = () => {
        const { UserName, ShopName, ContactNumber, Email, ShopAddress: { PinCode } } = formData;
        if (!UserName || !ShopName || !ContactNumber || !Email || !PinCode) {
            toast.error('Please fill in all required fields.');
            return false;
        }

        // Additional validations can be added here as needed

        return true;
    };

    const updatePrice = (plan) => {
        // Example function to update price based on selected plan
        let price = 0;
        switch (plan) {
            case 'Silver':
                price = 100; // Example price for Silver plan
                break;
            case 'Gold':
                price = 200; // Example price for Gold plan
                break;
            default:
                price = 0; // Default to free plan
                break;
        }
        setFormData(prevState => ({
            ...prevState,
            price: price
        }));
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl m-4 w-full">
                <div className="mb-4 text-center">
                    <h1 className="text-2xl font-bold">List Your Shop in a Simple Two-Step Process</h1>
                </div>
                <div className="flex justify-center mb-8">
                    <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 1 ? 'bg-orange-500 text-white' : 'bg-gray-300'}`}>
                            1
                        </div>
                        <div className="w-32 h-1 bg-gray-300"></div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step === 2 ? 'bg-orange-500 text-white' : 'bg-gray-300'}`}>
                            2
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-lg font-semibold mb-4">User Registration Form</h2>
                    <form onSubmit={handleSubmit}>
                        {/* Step 1: Basic Information */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <label className="block">
                                    <span className="text-gray-700">Username:</span>
                                    <input
                                        type="text"
                                        name="UserName"
                                        value={formData.UserName}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        required
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-gray-700">Shop Name:</span>
                                    <input
                                        type="text"
                                        name="ShopName"
                                        value={formData.ShopName}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        required
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-gray-700">Contact Number:</span>
                                    <input
                                        type="text"
                                        name="ContactNumber"
                                        value={formData.ContactNumber}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        required
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-gray-700">Email:</span>
                                    <input
                                        type="email"
                                        name="Email"
                                        value={formData.Email}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        required
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-gray-700">Password:</span>
                                    <input
                                        type="Password"
                                        name="Password"
                                        value={formData.Password}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        required
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-gray-700">City:</span>
                                    <select
                                        name="City"
                                        value={formData.ShopAddress.City}
                                        onChange={handleAddressChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        required
                                    >
                                        <option value="">Select City</option>
                                        {city.map((city) => (
                                            <option key={city._id} value={city.cityName}>
                                                {city.cityName}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label className="block">
                                    <span className="text-gray-700">Pin Code:</span>
                                    <input
                                        type="text"
                                        name="PinCode"
                                        value={formData.ShopAddress.PinCode}
                                        onChange={handleAddressChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        required
                                    />
                                </label>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        {/* Step 2: Additional Information */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <label className="block">
                                    <span className="text-gray-700">House No / Shop No / Apartment No</span>
                                    <input
                                        type="text"
                                        name="ShopNo"
                                        value={formData.ShopAddress.ShopNo}
                                        onChange={handleAddressChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        required
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-gray-700">Street Address</span>
                                    <input
                                        type="text"
                                        name="ShopAddressStreet"
                                        value={formData.ShopAddress.ShopAddressStreet}
                                        onChange={handleAddressChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        required
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-gray-700">Any Near landmark</span>
                                    <input
                                        type="text"
                                        name="NearByLandMark"
                                        value={formData.ShopAddress.NearByLandMark}
                                        onChange={handleAddressChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        required
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-gray-700">Shop Category:</span>
                                    <select
                                        name="ShopCategory"
                                        value={formData.ShopCategory}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {data.map((packages) => (
                                            <option key={packages._id} value={packages.CategoriesName}>
                                                {packages.CategoriesName}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label className="block">
                                    <span className="text-gray-700">Listing Plan:</span>
                                    <select
                                        name="ListingPlan"
                                        value={formData.ListingPlan}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        required
                                    >
                                        <option value="">Select Plan</option>
                                        {packages.map((packages) => (
                                            <option value={packages.packageName} key={packages._id}>{packages.packageName}</option>
                                        ))}
                                    </select>
                                </label>
                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                                    >
                                        Register
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>

    );
};

export default UserRegister;
