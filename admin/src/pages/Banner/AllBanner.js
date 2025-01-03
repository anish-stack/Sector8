import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {Link} from 'react-router-dom'
const AllBanner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [updatedImage, setUpdatedImage] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState(false);

  // Fetch all banners
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://api.naideal.com/api/v1/get-banner");
      const { data } = response.data;
      setBanners(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch banners");
      setLoading(false);
    }
  };

  // Delete banner
  const handleDelete = async (id, publicId) => {
    try {
      await axios.delete(`https://api.naideal.com/api/v1/delete-banner/${id}`, {
        data: { public_id: publicId }, // Pass the Cloudinary public_id for deletion
      });
      toast.success("Banner deleted successfully");
      fetchBanners(); // Refresh banners
    } catch (error) {
      toast.error("Failed to delete banner");
    }
  };

  // Open modal for updating banner
  const handleUpdateClick = (banner) => {
    setSelectedBanner(banner);
    setUpdatedStatus(banner.active);
    setModalVisible(true);
  };

  // Update banner
  const handleUpdate = async () => {
    if (!selectedBanner) return;
    setLoading(true)
    const formData = new FormData();

    // Attach image only if updated
    if (updatedImage) {
      formData.append("image", updatedImage);
    }

    // Attach active status
    formData.append("active", Boolean(updatedStatus));

    try {
      await axios.post(
        `https://api.naideal.com/api/v1/update-banner/${selectedBanner._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Banner updated successfully");
      setModalVisible(false);
      setLoading(false)

      fetchBanners(); // Refresh banners
    } catch (error) {
      console.log(error)
        setLoading(false)

      toast.error("Failed to update banner");
    }
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedBanner(null);
    setUpdatedImage(null);
  };

  // Fetch banners on mount
  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <div className="max-w-7xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
<div className="flex justify-between items-center mb-6">
  <h2 className="text-2xl font-bold text-gray-800">All Banners</h2>
  <Link 
    to="/create-banner" 
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
  >
    Create Banner
  </Link>
</div>


      {loading ? (
        <p className="text-center text-gray-500">Loading banners...</p>
      ) : banners.length > 0 ? (
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 p-2">Image</th>
              <th className="border border-gray-200 p-2">Status</th>
              <th className="border border-gray-200 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner._id} className="text-center">
                <td className="border border-gray-200 p-2">
                  <img
                    src={banner.image.url}
                    alt="Banner"
                    className="h-20 w-auto mx-auto"
                  />
                </td>
                <td className="border border-gray-200 p-2">
                  {banner.active ? "Active" : "Inactive"}
                </td>
                <td className="border border-gray-200 p-2 space-x-2">
                  <button
                    onClick={() => handleUpdateClick(banner)}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() =>
                      handleDelete(banner._id, banner.image.public_id)
                    }
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500">No banners found</p>
      )}

      {/* Update Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-4">Update Banner</h3>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Upload Image</label>
              <input
                type="file"
                onChange={(e) => setUpdatedImage(e.target.files[0])}
                className="block w-full border border-gray-300 rounded px-2 py-1"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Status</label>
              <select
                value={updatedStatus}
                onChange={(e) => setUpdatedStatus(e.target.value === "true")}
                className="block w-full border border-gray-300 rounded px-2 py-1"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {loading ? 'Please Wait':'Save'}
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBanner;
