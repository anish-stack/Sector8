import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ShopLogin = () => {
  const [formData, setFormData] = useState({
    Email: "",
    Password: ""
  });
  const BackendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BackendUrl}/login-shop-user`, formData);
      // Assuming your server responds with some data upon successful login
      // console.log('Login Successful:', response.data);

      const data = response.data.token;

      if (response.data.login.ListingPlan === 'Free') {
        toast.success('Login Successful');
        localStorage.setItem('ShopToken', data);
        window.location.href = "/Shop-Dashboard";
      } else if (response.data.login.ListingPlan === 'Silver' || response.data.login.ListingPlan === 'Gold') {
        // Check if payment is done
        if (response.data.login.PaymentDone === true) {
          toast.success('Login Successful');
          localStorage.setItem('ShopToken', data);
          window.location.href = "/Shop-Dashboard";
        } else {
          toast.error('Payment is not done.');
        }
      }

      setFormData({
        Email: '',
        Password: ''
      });

      // Redirect or perform any other action upon successful login

    } catch (error) {
      console.error('Login Error:', error);
      toast.error('Login Failed. Please check your credentials.');
    }
  };


  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to Shop account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              Email
            </label>
            <div className="mt-2">
              <input
                id="Email"
                name="Email"
                type="email"
                autoComplete="Email"
                required
                value={formData.Email}
                onChange={handleChange}
                className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="text-sm">
                <a href="/Forget-Password" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="Password"
                name="Password"
                type="Password"
                autoComplete="current-password"
                required
                value={formData.Password}
                onChange={handleChange}
                className="block px-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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

        {/* <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{' '}
          <a href="/User-register-by-Partner/7458" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Start Your First Post Free On Today
          </a>
        </p> */}
      </div>
    </div>
  );
};

export default ShopLogin;
