import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Building2, Phone, Mail, User } from 'lucide-react';

const PartnerRegister = () => {
    const [formData, setFormData] = useState({
        PartnerName: '',
        PartnerEmail: '',
        PartnerContactDetails: '',
        Password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const BackendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => {
            const updatedData = { ...prevState, [name]: value };
            console.log('Updated FormData:', updatedData); // Log to see the changes
            return updatedData;
        });
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        let newErrors = {};

        if (!formData.PartnerName.trim()) {
            newErrors.PartnerName = 'Name is required';
        }

        if (!formData.PartnerEmail.trim()) {
            newErrors.PartnerEmail = 'Email is required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.PartnerEmail)) {
            newErrors.PartnerEmail = 'Invalid email address';
        }

        if (!formData.PartnerContactDetails.trim()) {
            newErrors.PartnerContactDetails = 'Contact number is required';
        } else if (!/^[0-9]{10}$/.test(formData.PartnerContactDetails)) {
            newErrors.PartnerContactDetails = 'Contact number must be 10 digits';
        }

        if (!formData.Password) {
            newErrors.Password = 'Password is required';
        } else if (formData.Password.length < 6) {
            newErrors.Password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response = await axios.post(`${BackendUrl}/Create-Register`, formData);
            toast.success(response.data.message);
            window.location.href = `/Otp?email=${formData.PartnerEmail}&Partner-register=true&Date=${Date.now()}`;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(errorMessage);
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen mt-8 bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl shadow-xl flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform duration-300"
                >
                    <Building2 className="w-12 h-12 text-white" />
                </motion.div>

                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    Partner Registration
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Join our network of trusted partners
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-gray-100"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="PartnerName" className="block text-sm font-medium text-gray-700 mb-1">
                                Partner Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fa-solid fa-user  text-gray-400"></i>
                                    {/* <User className="h-5 w-5" /> */}
                                </div>
                                <input
                                    id="PartnerName"
                                    name="PartnerName"
                                    type="text"
                                    value={formData.PartnerName || ''}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 pr-3 py-2.5 rounded-xl border ${errors.PartnerName ? 'border-red-300' : 'border-gray-300'
                                        } shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                                    placeholder="Enter your name"
                                />
                            </div>
                            {errors.PartnerName && (
                                <p className="mt-1 text-sm text-red-600">{errors.PartnerName}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="PartnerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="PartnerEmail"
                                    name="PartnerEmail"
                                    type="email"
                                    value={formData.PartnerEmail || ''}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 pr-3 py-2.5 rounded-xl border ${errors.PartnerEmail ? 'border-red-300' : 'border-gray-300'
                                        } shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.PartnerEmail && (
                                <p className="mt-1 text-sm text-red-600">{errors.PartnerEmail}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="PartnerContactDetails" className="block text-sm font-medium text-gray-700 mb-1">
                                Contact Number
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="PartnerContactDetails"
                                    name="PartnerContactDetails"
                                    type="tel"
                                    value={formData.PartnerContactDetails || ''}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 pr-3 py-2.5 rounded-xl border ${errors.PartnerContactDetails ? 'border-red-300' : 'border-gray-300'
                                        } shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                                    placeholder="10-digit mobile number"
                                />
                            </div>
                            {errors.PartnerContactDetails && (
                                <p className="mt-1 text-sm text-red-600">{errors.PartnerContactDetails}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="Password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fa-regular fa-eye text-gray-400"></i>
                                    {/* <Eye className="h-5 w-5 " /> */}
                                </div>
                                <input
                                    id="Password"
                                    name="Password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.Password || ''}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 pr-3 py-2.5 rounded-xl border ${errors.Password ? 'border-red-300' : 'border-gray-300'
                                        } shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                                    placeholder="Create a strong password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <i className="fa-regular fa-eye-slash text-gray-400"></i>
                                        // <EyeOff className="h-5 w-5 " />
                                    ) : (
                                        <i className="fa-regular fa-eye text-gray-400"></i>
                                    )}
                                </button>
                            </div>
                            {errors.Password && (
                                <p className="mt-1 text-sm text-red-600">{errors.Password}</p>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold disabled:bg-indigo-300"
                            >
                                {isLoading ? 'Registering...' : 'Register'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default PartnerRegister;
