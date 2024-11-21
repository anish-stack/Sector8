import React from 'react';
import failedImage from './pngwing.com (8).png'; // Adjust the path as necessary

const Failed = () => {
  const handleRetry = () => {
    // Add logic to retry the action or navigate back
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <img
        src={failedImage}
        alt="Failed"
        className="w-1/4 mb-8 animate-bounce"
      />
      <div className="text-red-600 text-3xl font-bold mb-4">
        Something Went Wrong!
      </div>
      <div className="text-gray-700 text-lg mb-8 text-center">
        We are sorry, but the operation failed. Please try again later.
      </div>
      <button
        onClick={handleRetry}
        className="bg-red-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-red-700 transition duration-300"
      >
        Retry
      </button>
    </div>
  );
}

export default Failed;
