import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Gift } from 'lucide-react';

const OfferBanner = () => {
    // State management
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const SLIDES_PER_VIEW = 3;
    const SLIDE_INTERVAL = 3000;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://api.naideal.com/api/v1/get-offer-Banner');
                if (response.data.success) {
                    setData(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Auto-slide functionality
    useEffect(() => {
        if (data.length <= SLIDES_PER_VIEW) return;

        const interval = setInterval(() => {
            setDirection(1);
            setCurrentIndex((prevIndex) => {
                const nextIndex = prevIndex + SLIDES_PER_VIEW;
                return nextIndex >= data.length ? 0 : nextIndex;
            });
        }, SLIDE_INTERVAL);

        return () => clearInterval(interval);
    }, [data.length]);

    // Get current slides
    const getCurrentSlides = () => {
        const slides = data.slice(currentIndex, currentIndex + SLIDES_PER_VIEW);
        if (slides.length < SLIDES_PER_VIEW) {
            slides.push(...data.slice(0, SLIDES_PER_VIEW - slides.length));
        }
        return slides;
    };

    // Navigate to the next slide
    const goToNextSlide = () => {
        setDirection(1);
        setCurrentIndex((prevIndex) => {
            const nextIndex = prevIndex + SLIDES_PER_VIEW;
            return nextIndex >= data.length ? 0 : nextIndex;
        });
    };

    // Navigate to the previous slide
    const goToPrevSlide = () => {
        setDirection(-1);
        setCurrentIndex((prevIndexs) => {
            const prevIndex = prevIndexs - SLIDES_PER_VIEW;
            return prevIndex < 0 ? data.length - SLIDES_PER_VIEW : prevIndex;
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <section className="py-12 px-4 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Gift className="w-8 h-8 text-blue-600" />
                        <h2 className="text-3xl font-bold text-gray-800">Special Offers</h2>
                    </div>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover amazing deals and exclusive offers curated just for you.
                        Don't miss out on these limited-time opportunities!
                    </p>
                </motion.div>

                {/* Slider Section */}
                <div className="relative overflow-hidden">
                    <div className="flex justify-center items-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                className="flex flex-col md:flex-row gap-4 px-4"
                                initial={{ x: direction > 0 ? 1000 : -1000, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: direction > 0 ? -1000 : 1000, opacity: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30,
                                    duration: 0.5
                                }}
                            >
                                {getCurrentSlides().slice(0, 3).map((image, index) => (
                                    <motion.div
                                        key={`${image._id}-${index}`}
                                        whileHover={{ scale: 1.05 }}
                                        className="w-full md:w-1/3 aspect-video rounded-xl overflow-hidden shadow-lg"
                                    >
                                        <a
                                            href={image.RedirectPageUrl}
                                            className="block relative h-full group"
                                        >
                                            <img
                                                src={image.Banner.url}
                                                alt={`Offer ${index + 1}`}
                                                className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                                    <motion.span
                                                        initial={{ y: 20, opacity: 0 }}
                                                        whileHover={{ y: 0, opacity: 1 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="inline-block bg-white text-green-600 font-semibold px-4 py-2 rounded-lg shadow-lg"
                                                    >
                                                        View Offer
                                                    </motion.span>
                                                </div>
                                            </div>
                                        </a>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Navigation Controls */}
                {/* <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
                    <button
                        onClick={goToPrevSlide}
                        className="text-white bg-indigo-600 hover:bg-indigo-700 p-2 rounded-full"
                    >
                        &#8592;
                    </button>
                </div>
                <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
                    <button
                        onClick={goToNextSlide}
                        className="text-white bg-indigo-600 hover:bg-indigo-700 p-2 rounded-full"
                    >
                        &#8594;
                    </button>
                </div> */}

                {/* Progress Indicators */}
                <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: Math.ceil(data.length / SLIDES_PER_VIEW) }).map((_, index) => (
                        <motion.div
                            key={index}
                            className={`h-2 rounded-full ${Math.floor(currentIndex / SLIDES_PER_VIEW) === index
                                ? 'w-8 bg-indigo-600'
                                : 'w-2 bg-gray-300'
                                }`}
                            initial={false}
                            animate={{
                                width: Math.floor(currentIndex / SLIDES_PER_VIEW) === index ? 32 : 8,
                                backgroundColor: Math.floor(currentIndex / SLIDES_PER_VIEW) === index
                                    ? '#4F46E5'
                                    : '#D1D5DB'
                            }}
                            transition={{ duration: 0.3 }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OfferBanner;
