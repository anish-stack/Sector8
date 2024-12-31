import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast'; // Optional: Use for better notifications

const CreateBanner = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      setLoading(true);

      const response = await axios.post(
        'http://localhost:7485/api/v1/create-banner',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success(response.data.message || 'Banner uploaded successfully!');
      setImage(null); // Clear the image after successful upload
    } catch (error) {
      console.log(error)
      toast.error(
        error.response?.data?.message || 'Failed to upload the banner.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Create Banner Home
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
        </div>

        {image && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Selected file: <span className="font-medium">{image.name}</span>
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          } focus:outline-none`}
        >
          {loading ? 'Uploading...' : 'Upload Banner'}
        </button>
      </form>
    </div>
  );
};

export default CreateBanner;
