import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for HTTP requests

const PasswordChangeOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    otp: '',
    error: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  // Extracting email from query parameters
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('Email');
  const BackendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (!email) {
        navigate('/404'); // Redirect to 404 page if Email parameter is not found
    }
  }, [email, history]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BackendUrl}/verify-Otp-For-ForgetPassword`, {
        PasswordChangeOtp: formData.otp,
        Email: email
      });
      if (res.status === 200) {
        // Handle successful OTP verification
        setSuccessMessage('OTP verified successfully');
        // Example: Redirect to password change page after successful verification
        // history.push('/change-password'); // Uncomment and replace with your actual route
      } else {
        const errorData = res.data;
        setFormData({
          ...formData,
          error: errorData.msg || 'Failed to verify OTP'
        });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setFormData({
        ...formData,
        error: 'Failed to verify OTP'
      });
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Verify OTP for Password Change
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium leading-6 text-gray-900">
              OTP
            </label>
            <div className="mt-2">
              <input
                id="otp"
                name="otp"
                type="text"
                autoComplete="off"
                required
                value={formData.otp}
                onChange={handleChange}
                className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {formData.error && (
            <div className="text-red-600 mt-2">
              {formData.error}
            </div>
          )}

          {successMessage && (
            <div className="text-green-600 mt-2">
              {successMessage}
            </div>
          )}

          <div className="mt-4">
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Verify OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeOtp;
