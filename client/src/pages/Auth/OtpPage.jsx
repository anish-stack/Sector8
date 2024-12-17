import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {  useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const OtpPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const partnerEmail = searchParams.get('email') || '';
  const resendOTP = searchParams.get('resendOTP') === 'true';
  const BackendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  const [formData, setFormData] = useState({
    PartnerEmail: partnerEmail,
    otp: ''
  });
  

  const [errors, setErrors] = useState({});
  const [resendDisabled, setResendDisabled] = useState(resendOTP); // Set resendDisabled based on query param
  const [timer, setTimer] = useState(resendOTP ? 120 : 0); // Set timer based on query param

  useEffect(() => {
    let interval;
    if (resendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendDisabled(false);
    }

    return () => clearInterval(interval);
  }, [resendDisabled, timer]);

  useEffect(() => {
    // Clear resendOTP query param after handling it
    if (resendOTP) {
      const params = new URLSearchParams(location.search);
      params.delete('resendOTP');
    }
  }, [resendOTP, location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.otp.match(/^\d{6}$/)) {
      formErrors.otp = 'OTP must be a 6-digit number';
    }
    if (!formData.PartnerEmail) {
      formErrors.PartnerEmail = 'Email address is required';
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
    try {
      const res = await axios.post(`${BackendUrl}/verify-otp-register`, formData);
      console.log('OTP submitted:', res);
      toast.success('OTP verified successfully!');
      window.location.href="/Partner-Dashboard"

      // Redirect to another page or handle success as needed
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Failed to verify OTP. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    setResendDisabled(true);
    setTimer(120); // 2 minutes timer
    setFormData({ ...formData, otp: '' }); // Clear OTP input

    try {
      const res = await axios.post(`${BackendUrl}/resend-otp-register`, { PartnerEmail: formData.PartnerEmail });
      console.log('OTP resent:', res);
      toast.success('OTP resent successfully!');
      // Update URL query parameter
      const params = new URLSearchParams(location.search);
      params.set('resendOTP', 'true');
    //   history.replace({ search: params.toString() });

    } catch (error) {
      console.error('Error resending OTP:', error);
      toast.error('Failed to resend OTP. Please try again.');
      setResendDisabled(false);
      setTimer(0);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="https://res.cloudinary.com/dglihfwse/image/upload/c_thumb,w_200,g_face/v1733212496/naideal-logo_fajvxe.png"
          alt="Your Company"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verify your email
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="PartnerEmail" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="PartnerEmail"
                  name="PartnerEmail"
                  type="email"
                  value={formData.PartnerEmail}
                  onChange={handleChange}
                  disabled
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.PartnerEmail && (
                  <p className="text-red-500 text-xs mt-1">{errors.PartnerEmail}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                OTP
              </label>
              <div className="mt-1">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.otp && (
                  <p className="text-red-500 text-xs mt-1">{errors.otp}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={!formData.otp || !formData.PartnerEmail}
              >
                Verify OTP
              </button>
            </div>
          </form>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Didn't receive the OTP?
            </span>
            <button
              onClick={handleResendOtp}
              disabled={resendDisabled}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 disabled:text-gray-400"
            >
              {resendDisabled ? `Resend OTP in ${timer}s` : 'Resend OTP'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
