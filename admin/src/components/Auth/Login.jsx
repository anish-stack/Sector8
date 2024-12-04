import React, { useState } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [settings, setSettings] = useState({})
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('https://api.naideal.com/api/v1/get-setting');
        if (response.data.success) {
          setSettings(response.data.data);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching settings:', error.message);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send login request to backend
      const response = await axios.post('https://api.naideal.com/admin-login', formData);

      // Check if login is successful
      if (response.data.login) {
        // Encrypt session data
        const encryptedData = CryptoJS.AES.encrypt(
          JSON.stringify(response.data), // Convert object to string before encryption
          'secret-key') // Use a secret key for encryption
          .toString();

        // Save encrypted data to sessionStorage
        toast.success("Login successful")
        sessionStorage.setItem('loginData', encryptedData);
        window.location.reload()
        console.log('Login successful, data stored in session');
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div className=''>
      <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Nai Deal"
            src={settings?.logo || "https://placehold.co/600x200"}
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 capitalize text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your Admin account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full border px-2 border-black rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="Password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full border px-2 border-black rounded-md py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
