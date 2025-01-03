import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import ImageUploader from 'react-image-upload';
import 'react-image-upload/dist/index.css';

const AllBanners = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [banners, setBanners] = useState([]);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    RedirectPageUrl: '',
    BannerUrl: '',
    file: null,
  });

  const ITEMS_PER_PAGE = 8;
  const token = localStorage.getItem('Sr-token');
  const API_BASE_URL = 'https://api.naideal.com/api/v1';

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/get-offer-Banner`);
      setBanners(data.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleModalOpen = (banner = null) => {
    setSelectedBanner(banner);
    setFormValues({
      RedirectPageUrl: banner?.RedirectPageUrl || '',
      BannerUrl: banner?.Banner?.url || '',
      file: null,
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBanner(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('RedirectPageUrl', formValues.RedirectPageUrl);
    if (formValues.file) {
      formData.append('image', formValues.file.file);
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (selectedBanner) {
        await axios.put(
          `${API_BASE_URL}/update-offer-Banner/${selectedBanner._id}`,
          formData,
          config
        );
      } else {
        await axios.post(`${API_BASE_URL}/Create-Offer-Banner`, formData, config);
      }

      fetchBanners();
      handleModalClose();
    } catch (error) {
      console.error('Failed to submit banner:', error);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;

    setIsLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/delete-offer-Banner/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBanners();
    } catch (error) {
      console.error('Failed to delete banner:', error);
    }
    setIsLoading(false);
  };

  const paginatedBanners = banners
    .slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE)
    .reverse();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Banner Management</h1>
        <button
          onClick={() => handleModalOpen()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg 
                    transition-colors duration-200 flex items-center gap-2"
        >
          <span className="hidden sm:inline">Add New Banner</span>
          <span className="sm:hidden">+</span>
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {/* Banners Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedBanners.map((banner, index) => (
            <div key={banner._id || index} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative h-48">
                <img
                  src={banner?.Banner?.url}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <a
                  href={banner.RedirectPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:text-indigo-800 truncate block mb-2"
                >
                  {banner.RedirectPageUrl}
                </a>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleModalOpen(banner)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg
                              transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg
                              transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {banners.length > ITEMS_PER_PAGE && (
        <div className="mt-8">
          <ReactPaginate
            pageCount={Math.ceil(banners.length / ITEMS_PER_PAGE)}
            onPageChange={({ selected }) => setCurrentPage(selected)}
            containerClassName="flex justify-center gap-2"
            pageClassName="px-3 py-1 rounded-lg hover:bg-gray-100"
            pageLinkClassName="text-gray-700"
            activeClassName="bg-indigo-600 text-white hover:bg-indigo-700"
            previousClassName="px-3 py-1 rounded-lg hover:bg-gray-100"
            nextClassName="px-3 py-1 rounded-lg hover:bg-gray-100"
            disabledClassName="opacity-50 cursor-not-allowed"
          />
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {selectedBanner ? 'Edit Banner' : 'Add New Banner'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Redirect URL
                  </label>
                  <input
                    type="text"
                    name="RedirectPageUrl"
                    value={formValues.RedirectPageUrl}
                    onChange={(e) => setFormValues({ ...formValues, RedirectPageUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                              focus:ring-indigo-600 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Image
                  </label>
                  <ImageUploader
                    onFileAdded={(imageFile) => setFormValues({ ...formValues, file: imageFile })}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4"
                  />
                </div>

                {formValues.BannerUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Banner
                    </label>
                    <img
                      src={formValues.BannerUrl}
                      alt="Current Banner"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg
                              transition-colors duration-200"
                  >
                    {selectedBanner ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg
                              transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBanners;