import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';

const PostByCategories = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [postsPerPage] = useState(8);

    const query = new URLSearchParams(window.location.search);
    const categoryName = query.get('Name');
    const title = query.get('title');

    const BackendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

    useEffect(() => {
        fetchPosts();
    }, [categoryName]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get(`${BackendUrl}/Post-by-categories/${categoryName}`);

            setPosts(data);
        } catch (error) {
            if (error?.response?.status === 404) {
                setError('No posts found in this category.');
                return;
            }
            console.error('Error fetching posts:', error);
            setError('Failed to load posts. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Filter and sort posts
    const filteredPosts = posts.filter(post =>
        post.Title.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'discount') return Math.max(...b.Items.map(i => i.Discount)) - Math.max(...a.Items.map(i => i.Discount));
        return 0;
    });

    // Pagination
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || posts.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100">
                <div className="text-center bg-white p-8 rounded-xl max-w-md w-full">
                    <i className="fa-solid fa-circle-exclamation text-5xl text-red-500 mx-auto mb-6"></i>

                    <h2 className="text-3xl font-semibold text-gray-900 mb-4">{error}</h2>
                    <div className="space-y-4">
                        <button
                            onClick={fetchPosts}
                            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => window.location.href = "/listings"}
                            className="w-full px-6 py-3 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
                        >
                            Explore Other Offers
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gray-50"
        >
            {/* Hero Section */}
            <div className="bg-gradient-to-r mt-[60px] from-purple-600 to-blue-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl font-bold mb-4">{title}</h1>
                        <p className="text-xl text-purple-100">
                            Discover amazing offers and deals
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search posts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Filter className="w-5 h-5 text-gray-400" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="discount">Highest Discount</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    <AnimatePresence>
                        {currentPosts.map((post, index) => (
                            <motion.div
                                key={post._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                            >
                                <div className="relative aspect-[4/3]">
                                    <img
                                        src={post.Items[0]?.dishImages[0]?.ImageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
                                        alt={post.Title}
                                        className="w-full h-full object-cover"
                                    />
                                    {post.shopDetails?.ListingPlan !== 'Free' && (
                                        <div className="absolute top-3 left-3 flex items-center gap-1 bg-green-500/90 backdrop-blur-sm text-white py-1.5 px-3 rounded-full text-sm font-medium">
                                            <CheckCircle className="w-4 h-4" />
                                            <span>Verified</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                                        {post.Title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {post.Details}
                                    </p>
                                    <Link
                                        to={`/Single-Listing/${post._id}/${post.Title.replace(/\s+/g, '-')}`}
                                        className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-lg ${currentPage === page
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white border border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg bg-white border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default PostByCategories;