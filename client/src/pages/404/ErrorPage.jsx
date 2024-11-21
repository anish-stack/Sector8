import React from 'react';
import ErrorImage from './404.png'; // Import your error image

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-center">
          <img src={ErrorImage} alt="Error" className="w-40 h-40" />
        </div>
        <div className="text-center mt-6">
          <h2 className="text-3xl font-bold text-gray-800">Oops! Page Not Found</h2>
          <p className="mt-2 text-sm text-gray-600">The page you are looking for might have been removed or doesn't exist.</p>
          <p className="mt-1 text-sm text-gray-600">Let's get you back on track:</p>
          <div className="mt-4">
            <a href="/" className="text-indigo-600 hover:underline">Go back to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
