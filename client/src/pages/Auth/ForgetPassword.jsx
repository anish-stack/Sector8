import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowLeft, KeyRound } from 'lucide-react';
import axios from 'axios';

const ForgetPassword = () => {
    const [formData, setFormData] = useState({
        Email: '',
        newPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const BackendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage('');

        try {
            const res = await axios.post(`${BackendUrl}/Create-Forget-Password`, formData);
            console.log(res.data)
            setLoading(false);
            setSuccessMessage('Password change request successful. Check your email for further instructions.');
            setTimeout(() => {
                window.location.href = "/login"
            }, 3000)
        } catch (error) {
            setLoading(false);
            if (error.response?.data?.msg) {
                setError(error.response.data.msg);
            } else {
                setError('Something went wrong. Please try again later.');
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const buttonVariants = {
        hover: { scale: 1.02 },
        tap: { scale: 0.98 },
        disabled: { opacity: 0.6 }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <motion.div
                className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >

                <div className="p-8">
                    <motion.div
                        className="text-center mb-8"
                        variants={itemVariants}
                    >
                        <motion.div
                            className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4"
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                        >
                            <KeyRound className="w-8 h-8 text-indigo-600" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
                        <p className="text-gray-600 mt-2">Enter your email and new password below</p>
                    </motion.div>
                    <AnimatePresence mode="wait">
                        {(error || successMessage) && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`text-sm text-center p-3 rounded-lg ${error ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                                    }`}
                            >
                                {error || successMessage}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    name="Email"
                                    value={formData.Email}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    placeholder="Enter new password"
                                    required
                                />
                            </div>
                        </motion.div>

                        <motion.button
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            animate={loading ? "disabled" : "visible"}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                />
                            ) : (
                                "Reset Password"
                            )}
                        </motion.button>



                        <motion.div
                            variants={itemVariants}
                            className="text-center"
                        >
                            <motion.a
                                href="/Shop-Login"
                                className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                                whileHover={{ x: -3 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back to Login
                            </motion.a>
                        </motion.div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgetPassword;