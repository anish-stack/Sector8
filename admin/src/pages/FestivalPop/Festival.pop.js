import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import ImageUploader from 'react-image-upload';
import { Pencil, Trash, Plus, X } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import 'react-image-upload/dist/index.css';

const Input = ({ label, name, value, onChange, type = 'text', required = true }) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                focus:ring-indigo-600 focus:border-transparent transition-all
                duration-200 hover:border-indigo-400"
        />
    </div>
);

const Button = ({ onClick, type = 'button', variant = 'primary', isLoading, children }) => {
    const baseClasses = "px-6 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium";
    const variants = {
        primary: "bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-indigo-400",
        secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
        danger: "bg-red-50 hover:bg-red-100 text-red-600"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isLoading}
            className={`${baseClasses} ${variants[variant]}`}
        >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : children}
        </button>
    );
};

const FestivalPop = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [banners, setBanners] = useState([]);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formValues, setFormValues] = useState({
        RedirectPageUrl: '',
        BannerUrl: '',
        file: null,
        ButtonText: '',
        active: '',
        Para: '',
        onWhicPage: '',
        dealy: ''
    });

    const ITEMS_PER_PAGE = 8;
    const token = localStorage.getItem('Sr-token');
    const API_BASE_URL = 'http://localhost:7485/api/v1';

    const fetchBanners = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get(`${API_BASE_URL}/get-festival-Banner`);
            setBanners(data.data);
            toast.success('Banners loaded successfully');
        } catch (error) {
            toast.error('Failed to load banners');
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
            ButtonText: banner?.ButtonText || '',
            active: banner?.active || '',
            Para: banner?.Para || '',
            onWhicPage: banner?.onWhicPage || '',
            dealy: banner?.dealy || ''
        });
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formValues)
        setIsSubmitting(true);
        const formData = new FormData();
        Object.keys(formValues).forEach(key => {
            if (key !== 'file' && key !== 'BannerUrl') {
                formData.append(key, formValues[key]);
            }
        });

        if (formValues.file) {
            formData.append('image', formValues.file.file);
        }

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            if (selectedBanner) {
                await axios.put(
                    `${API_BASE_URL}/update-festival-Banner/${selectedBanner._id}`,
                    formData,
                    config
                );
                toast.success('Banner updated successfully');
            } else {
                await axios.post(`${API_BASE_URL}/Create-festival-Banner`, formData, config);
                toast.success('Banner created successfully');
            }
            fetchBanners();
            setIsModalOpen(false);
        } catch (error) {
            toast.error(selectedBanner ? 'Failed to update banner' : 'Failed to create banner');
            console.error('Failed to submit banner:', error);
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this banner?')) return;

        setIsLoading(true);
        try {
            await axios.delete(`${API_BASE_URL}/delete-festival-Banner/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Banner deleted successfully');
            fetchBanners();
        } catch (error) {
            toast.error('Failed to delete banner');
            console.error('Failed to delete banner:', error);
        }
        setIsLoading(false);
    };

    const paginatedBanners = banners
        .slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE)
        .reverse();

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            {/* <Toaster position="top-right" /> */}

            {/* Header */}
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Festival Pop Ups Management</h1>
                    <Button onClick={() => handleModalOpen()} variant="primary">
                        <Plus className="w-5 h-5" />
                        <span className="hidden sm:inline">Add New Banner</span>
                    </Button>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
                    </div>
                )}

                {/* Banners Grid */}
                {!isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {paginatedBanners.map((banner) => (
                            <div key={banner._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="relative h-48 rounded-t-xl overflow-hidden">
                                    <img
                                        src={banner.Banner.url}
                                        alt="Banner"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4 space-y-3">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-600">Redirect URL:</p>
                                        <a
                                            href={banner.RedirectPageUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-indigo-600 hover:text-indigo-800 truncate block"
                                        >
                                            {banner.RedirectPageUrl}
                                        </a>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <p className="font-medium text-gray-600">Button:</p>
                                            <p className="text-gray-800">{banner.ButtonText || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-600">Page:</p>
                                            <p className="text-gray-800">{banner.onWhicPage || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-600">Delay:</p>
                                            <p className="text-gray-800">{banner.dealy || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-600">Status:</p>
                                            <p className="text-gray-800">{banner.active ? 'Active' : 'Inactive'}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            onClick={() => handleModalOpen(banner)}
                                            variant="secondary"
                                            className="flex-1"
                                        >
                                            <Pencil className="w-4 h-4" />
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(banner._id)}
                                            variant="danger"
                                            className="flex-1"
                                        >
                                            <Trash className="w-4 h-4" />
                                            Delete
                                        </Button>
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
                            pageClassName="px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                            pageLinkClassName="text-gray-700"
                            activeClassName="!bg-indigo-600 !text-white hover:!bg-indigo-700"
                            previousClassName="px-3 py-1 rounded-lg hover:bg-gray-100"
                            nextClassName="px-3 py-1 rounded-lg hover:bg-gray-100"
                            disabledClassName="opacity-50 cursor-not-allowed"
                        />
                    </div>
                )}

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {selectedBanner ? 'Edit Banner' : 'Add New Banner'}
                                    </h2>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <Input
                                        label="Redirect URL"
                                        name="RedirectPageUrl"
                                        value={formValues.RedirectPageUrl}
                                        onChange={handleInputChange}
                                    />

                                    <Input
                                        label="Button Text"
                                        name="ButtonText"
                                        value={formValues.ButtonText}
                                        onChange={handleInputChange}
                                    />

                                    <Input
                                        label="Paragraph"
                                        name="Para"
                                        value={formValues.Para}
                                        onChange={handleInputChange}
                                    />

                                    <Input
                                        label="Page Location"
                                        name="onWhicPage"
                                        value={formValues.onWhicPage}
                                        onChange={handleInputChange}
                                    />

                                    <Input
                                        label="Delay (ms)"
                                        name="dealy"
                                        type="number"
                                        value={formValues.dealy}
                                        onChange={handleInputChange}
                                    />

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Status
                                        </label>
                                        <select
                                            name="active"
                                            value={formValues.active}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                               focus:ring-indigo-600 focus:border-transparent"
                                        >
                                            <option value="">Select Status</option>
                                            <option value="true">Active</option>
                                            <option value="false">Inactive</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Banner Image
                                        </label>
                                        <ImageUploader
                                            onFileAdded={(imageFile) => setFormValues({ ...formValues, file: imageFile })}
                                            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4"
                                        />
                                    </div>

                                    {formValues.BannerUrl && (
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Current Banner
                                            </label>
                                            <img
                                                src={formValues.BannerUrl}
                                                alt="Current Banner"
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                        </div>
                                    )}

                                    <div className="flex gap-4 pt-4">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            isLoading={isSubmitting}
                                            className="flex-1"
                                        >
                                            {selectedBanner ? 'Update Banner' : 'Create Banner'}
                                        </Button>
                                        <Button
                                            onClick={() => setIsModalOpen(false)}
                                            variant="secondary"
                                            className="flex-1"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FestivalPop;