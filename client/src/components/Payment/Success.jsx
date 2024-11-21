import React from 'react';
import successImage from './pngwing.com (7).png'; // Adjust the path as necessary

const Success = () => {
  const handleProceed = () => {
    // Add logic to proceed further or navigate to another page
    console.log('Proceeding further...');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 p-4">
      <img
        src={successImage}
        alt="Success"
        className="w-1/4 mb-8 animate-bounce"
      />
      <div className="text-green-600 text-3xl font-bold mb-4">
        Success!
      </div>
      <div className="text-gray-700 text-lg mb-8 text-center">
        Your operation was successful. You can proceed further.
      </div>
      <button
        onClick={handleProceed}
        className="bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-green-700 transition duration-300"
      >
        Proceed
      </button>
    </div>
  );
}

export default Success;
