import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast'
const PartnerRegister = () => {
    const [formData, setFormData] = useState({
        PartnerName: '',
        PartnerEmail: '',
        PartnerContactDetails: '',
        Password: ''
    });
    const BackendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        let formErrors = {};
        if (!formData.PartnerContactDetails.match(/^[0-9]*$/)) {
            formErrors.PartnerContactDetails = 'Contact number must contain only numbers';
        }
        return formErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`${BackendUrl}/Create-Register`, formData);
            console.log(response.data);
            toast.success(response.data.message)
            window.location.href = `/Otp?email=${formData.PartnerEmail}&Partner-register=true&Date=${Date.now()}`;
        } catch (error) {
            console.error(error);
            setLoading(false);
            toast.error(error.response.data.message)
        }
    };

    return (
        <div>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        className="mx-auto h-10 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Register as a Partner
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="PartnerName" className="block text-sm font-medium leading-6 text-gray-900">
                                Partner Name
                            </label>
                            <div className="mt-2">
                                <input
                                    id="PartnerName"
                                    name="PartnerName"
                                    type="text"
                                    value={formData.PartnerName}
                                    onChange={handleChange}
                                    required
                                    className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="PartnerEmail" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <div className="mt-2">
                                <input
                                    id="PartnerEmail"
                                    name="PartnerEmail"
                                    type="email"
                                    value={formData.PartnerEmail}
                                    onChange={handleChange}
                                    required
                                    className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="PartnerContactDetails" className="block text-sm font-medium leading-6 text-gray-900">
                                Contact Number
                            </label>
                            <div className="mt-2">
                                <input
                                    id="PartnerContactDetails"
                                    name="PartnerContactDetails"
                                    type="text"
                                    value={formData.PartnerContactDetails}
                                    onChange={handleChange}
                                    required
                                    className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                                {errors.PartnerContactDetails && (
                                    <p className="text-red-500 text-xs mt-1">{errors.PartnerContactDetails}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="Password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="Password"
                                    name="Password"
                                    type="password"
                                    value={formData.Password}
                                    onChange={handleChange}
                                    required
                                    className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                disabled={loading}
                            >
                                {loading ? (
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zM12 16a4 4 0 100-8 4 4 0 000 8z"
                                        ></path>
                                    </svg>
                                ) : (
                                    'Register'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PartnerRegister;
