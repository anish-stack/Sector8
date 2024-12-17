import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Grid } from 'lucide-react';
import 'react-loading-skeleton/dist/skeleton.css';
import { Link } from 'react-router-dom';

const Category = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const BackendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

    const itemsPerPage = {
        sm: 6,
        md: 8,
        lg: 16
    };

    const getItemsPerPage = () => {
        if (window.innerWidth >= 1024) return itemsPerPage.lg;
        if (window.innerWidth >= 768) return itemsPerPage.md;
        return itemsPerPage.sm;
    };

    const [displayCount, setDisplayCount] = useState(getItemsPerPage());

    useEffect(() => {
        const handleResize = () => {
            setDisplayCount(getItemsPerPage());
            setCurrentPage(0); // Reset to first page on resize
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${BackendUrl}/admin-get-categories`);
            setData(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const nextPage = () => {
        setCurrentPage(prev =>
            prev + 1 >= Math.ceil(data.length / displayCount) ? 0 : prev + 1
        );
    };

    const prevPage = () => {
        setCurrentPage(prev =>
            prev - 1 < 0 ? Math.ceil(data.length / displayCount) - 1 : prev - 1
        );
    };

    const visibleCategories = data.slice(
        currentPage * displayCount,
        (currentPage + 1) * displayCount
    );

    const CategoryCard = ({ category }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group"
        >
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                <Link to={`/Post-by-categories?filter=Categories&Name=${category._id}&title=${category.CategoriesName}`} className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors duration-300">
                        <img
                            src={category.CategoriesImage.imageUrl}
                            alt={category.CategoriesName}
                            className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
                            loading="lazy"
                        />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-700 group-hover:text-blue-400 transition-colors duration-300 text-center">
                        {category.CategoriesName}
                    </h3>
                </Link>
            </div>
        </motion.div>
    );

    const LoadingSkeleton = () => (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col items-center space-y-4">
                <Skeleton circle width={64} height={64} />
                <Skeleton width={80} height={20} />
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* <div className="mb-10 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                    Browse Categories
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Explore our wide range of categories
                </p>
            </div> */}

            <div className="relative">
                {!loading && data.length > displayCount && (
                    <>
                        <motion.button
                            // whileHover={{ scale: 1.1 }}
                            // whileTap={{ scale: 0.9 }}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 rounded-full bg-white shadow-lg text-gray-700 hover:bg-gray-50 hover:text-blue-400 transition-colors duration-300 hidden sm:block"
                            onClick={prevPage}
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </motion.button>

                        <motion.button
                            // whileHover={{ scale: 1.1 }}
                            // whileTap={{ scale: 0.9 }}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 rounded-full bg-white shadow-lg text-gray-700 hover:bg-gray-50 hover:text-blue-400 transition-colors duration-300 hidden sm:block"
                            onClick={nextPage}
                            aria-label="Next page"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </motion.button>
                    </>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            Array(displayCount)
                                .fill(0)
                                .map((_, index) => (
                                    <LoadingSkeleton key={index} />
                                ))
                        ) : (
                            visibleCategories.map((category, index) => (
                                <CategoryCard
                                    key={category.id || index}
                                    category={category}
                                />
                            ))
                        )}
                    </AnimatePresence>
                </div>

                {!loading && data.length > displayCount && (
                    <div className="mt-6 flex justify-center gap-2 sm:hidden">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-full bg-white shadow-md text-gray-700 hover:bg-gray-50"
                            onClick={prevPage}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-full bg-white shadow-md text-gray-700 hover:bg-gray-50"
                            onClick={nextPage}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </motion.button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Category;