import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Building2, AlertCircle, Phone, Mail, User } from 'lucide-react';

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
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
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

    const InputField = ({ name, label, type, icon: Icon, placeholder }) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Icon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    id={name}
                    name={name}
                    type={name === 'Password' ? (showPassword ? 'text' : 'password') : type}
                    value={formData[name]}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2.5 rounded-xl border ${
                        errors[name] ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200`}
                    placeholder={placeholder}
                />
                {name === 'Password' && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                        )}
                    </button>
                )}
            </div>
            <AnimatePresence mode="wait">
                {errors[name] && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-1 text-sm text-red-600"
                    >
                        {errors[name]}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );

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
                        <InputField
                            name="PartnerName"
                            label="Partner Name"
                            type="text"
                            icon={User}
                            placeholder="Enter your name"
                        />
                        <InputField
                            name="PartnerEmail"
                            label="Email Address"
                            type="email"
                            icon={Mail}
                            placeholder="you@example.com"
                        />
                        <InputField
                            name="PartnerContactDetails"
                            label="Contact Number"
                            type="tel"
                            icon={Phone}
                            placeholder="10-digit mobile number"
                        />
                        <InputField
                            name="Password"
                            label="Password"
                            type="password"
                            icon={Eye}
                            placeholder="Create a strong password"
                        />

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex justify-center items-center py-3 px-4 rounded-xl text-white font-medium transition-all duration-200 
                                ${isLoading 
                                    ? 'bg-indigo-400 cursor-not-allowed' 
                                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}`}
                        >
                            {isLoading ? (
                                <span className="inline-flex items-center">
                                    <span className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2" />
                                    Registering...
                                </span>
                            ) : (
                                'Register'
                            )}
                        </motion.button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        Already registered?{' '}
                        <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                            Sign in to your account
                        </a>
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default PartnerRegister;