import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus } from 'lucide-react';
import ShopProfile from './ShopProfile';
import MyPost from './MyPost';
import CreateListing from './CreateListing';
import toast from 'react-hot-toast';

const ShopDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('ShopToken');
  const [shopDetails, setShopDetails] = useState(null);
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const BackendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  const fetchMyShopDetails = async () => {
    try {
      const response = await axios.get(`${BackendUrl}/My-Shop-Details`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response.data.user);
      setShopDetails(response.data.user);
    } catch (error) {
      console.error('Error fetching shop details:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('ShopToken');
        navigate('/Shop-login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/Shop-login');
      return;
    }
    fetchMyShopDetails();
  }, [token, navigate]);

  const handleUploadProfile = async () => {
    if (!profile) {
      toast.error('Please Choose Your Profile Pic For Shop');
      return;
    }
    const formData = new FormData();
    formData.append('image', profile);
    try {
      const response = await axios.post(
        'http://localhost:7485/api/v1/Upload-Profile-Image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Handle successful response
      toast.success('Profile image uploaded successfully');
      fetchMyShopDetails(); // Refresh shop details after upload
    } catch (error) {
      console.error('Error uploading profile image:', error);
      toast.error('Failed to upload profile image');
    }
  };

  const handleUpgradePackage = (id) => {
    navigate(`/upgrade-package/${id}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/Shop-login');
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Shop Profile */}
          <div className="lg:col-span-1">
            <ShopProfile
              shopDetails={shopDetails}
              onUpgradePackage={() => handleUpgradePackage(shopDetails?._id)}
              onLogout={handleLogout}
              onProfileUpload={handleUploadProfile}
              setProfile={setProfile}
            />
          </div>

          {/* Right Column - Posts */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">My Posts</h2>
                  <p className="text-gray-600">
                    {shopDetails ? (
                      `${shopDetails.HowMuchOfferPost || "0"} / ${
                        shopDetails.PackagePlanIssued 
                      } posts used`
                    ) : "Loading..."}
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateListingOpen(true)}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Create Post
                </button>
              </div>

              <MyPost fetchMyShopDetails={fetchMyShopDetails} />
            </div>
          </div>
        </div>
      </div>

      {isCreateListingOpen && (
        <CreateListing
          isOpen={isCreateListingOpen}
          onClose={() => setIsCreateListingOpen(false)}
        />
      )}
    </div>
  );
};

export default ShopDashboard;
