import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Building2, AlertCircle } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    PartnerEmail: "",
    Password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const BackendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.PartnerEmail || !formData.Password) {
      setError("All fields are required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.PartnerEmail)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (formData.Password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(`${BackendUrl}/login`, formData);
      const { token } = response.data;
      
      localStorage.setItem('B2bToken', token);
      toast.success('Login Successful! Redirecting to dashboard...');
      
      setFormData({
        PartnerEmail: '',
        Password: ''
      });

      setTimeout(() => {
        window.location.href = "/Partner-Dashboard";
      }, 1000);

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col justify-center px-4 sm:px-6 lg:px-8"
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

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Partner Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your partner dashboard
          </p>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-gray-100"
        >
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 rounded-lg bg-red-50 flex items-center gap-2 text-red-700"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="PartnerEmail" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="PartnerEmail"
                  name="PartnerEmail"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.PartnerEmail}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  placeholder="partner@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="Password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="text-sm">
                  <a href="/Forget-Password" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-1 relative">
                <input
                  id="Password"
                  name="Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.Password}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

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
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600">
              Not a Partner?{' '}
              <a 
                href="/Register-Partner?query=send-by-admin&registerdate=2024-07-17T12:53:20.737Z" 
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
              >
                Become Our Partner
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;