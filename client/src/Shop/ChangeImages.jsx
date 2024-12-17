import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { X, Upload, AlertCircle, CheckCircle2, ImageIcon } from 'lucide-react';

const ChangeImages = ({ data, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateImage = (file) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Please select a valid image file (JPEG, PNG, or WebP)');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('Image size should be less than 5MB');
    }
  };

  const handleImageChange = useCallback((event, index) => {
    const file = event.target.files[0];
    setError('');
    
    if (!file) return;

    try {
      validateImage(file);
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
      setSelectedImageIndex(index);
    } catch (err) {
      setError(err.message);
      event.target.value = '';
    }
  }, []);

  const handleImageUpload = async (publicId) => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccessMessage('');

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      await axios.post(
        `http://localhost:7485/api/v1/Other/update_img?publicId=${publicId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      setSuccessMessage('Image uploaded successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        setSelectedImage(null);
        setPreviewImage(null);
        setSelectedImageIndex(null);
      }, 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-blue-500" />
            Update Images
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-600">{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <p className="text-green-600">{successMessage}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="mb-6 text-gray-600">
          <p className="text-sm">
            Select an image to update. Supported formats: JPEG, PNG, WebP (Max size: 5MB)
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid overflow-auto grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {data.map((image, index) => (
            <div key={image._id} className="relative group">
              <div className="aspect-square h-44 rounded-lg overflow-hidden border-2 border-gray-200 relative">
                {/* Current Image */}
                <img
                  src={image.ImageUrl}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Preview Overlay */}
                {selectedImageIndex === index && previewImage && (
                  <div className="absolute inset-0 bg-black bg-opacity-50">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Upload Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                  <label className="cursor-pointer p-3 bg-white bg-opacity-90 rounded-lg shadow-lg transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
                    <input
                      type="file"
                      onChange={(e) => handleImageChange(e, index)}
                      className="hidden"
                      accept="image/jpeg,image/png,image/webp"
                    />
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <Upload className="w-4 h-4" />
                      Choose New Image
                    </div>
                  </label>
                </div>
              </div>

              {/* Image Label */}
              <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded-md text-xs font-medium text-gray-600 shadow-sm">
                Image {index + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Upload Button */}
        {selectedImage && (
          <div className="flex justify-center">
            <button
              onClick={() => handleImageUpload(data[selectedImageIndex]?.public_id)}
              disabled={isUploading}
              className={`
                px-6 py-3 rounded-lg font-medium text-white
                flex items-center gap-2 transition-all
                ${isUploading 
                  ? 'bg-blue-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'}
              `}
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Confirm Upload
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangeImages;