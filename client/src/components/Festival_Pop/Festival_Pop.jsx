import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MoveRight } from 'lucide-react';

const Festival_Pop = ({ pathName }) => {
    const [data, setData] = useState(null);
    const [modelVisible, setModelVisible] = useState(true);
    const CLOSE_DURATION = 20000; // 20 seconds
    const REAPPEAR_DURATION = 120000; // 2 minutes

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `https://api.naideal.com/api/v1/get-festival-Banner-query?onWhicPage=${pathName}`
            );
            if (response.data.success && response.data.data.length > 0) {
                setData(response.data.data[0]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pathName]);

    const handleClose = () => {
        const currentTime = new Date().getTime();
        sessionStorage.setItem('isCloseClick', 'true');
        sessionStorage.setItem('isCloseClickTime', currentTime.toString());
        setModelVisible(false);
    };

    useEffect(() => {
        const storedCloseTime = sessionStorage.getItem('isCloseClickTime');
        const storedCloseStatus = sessionStorage.getItem('isCloseClick');

        if (storedCloseStatus === 'true' && storedCloseTime) {
            const timePassed = new Date().getTime() - parseInt(storedCloseTime);
            setModelVisible(timePassed >= CLOSE_DURATION);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            sessionStorage.removeItem('isCloseClick');
            sessionStorage.removeItem('isCloseClickTime');
            setModelVisible(true);
        }, REAPPEAR_DURATION);

        return () => clearTimeout(timer);
    }, []);

    if (!data || !modelVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm z-50"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl"
                >
                    {/* Close Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleClose}
                        className="absolute top-4 right-4 z-10 p-2 bg-white/90 rounded-full 
                                 shadow-lg hover:bg-white transition-colors duration-200"
                    >
                        <X className="w-6 h-6 text-gray-800" />
                    </motion.button>

                    <div className="flex md:min-h-[400px] flex-col md:flex-row">
                        {/* Image Section */}
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-full md:w-1/2 md:h-[300px]h-[202px] relative overflow-hidden"
                        >
                            <img
                                src={data.Banner.url}
                                alt="Festival Banner"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        </motion.div>

                        {/* Content Section */}
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="w-full md:w-1/2 p-6 md:p-8 flex flex-col items-center justify-center gap-3"
                        >
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-2xl md:text-3xl font-bold text-gray-800 mb-4"
                            >
                                {data.Para}
                            </motion.h2>

                            <motion.a
                                href={data.RedirectPageUrl}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="group flex items-center justify-center gap-2 bg-gradient-to-r 
                                         from-indigo-600 to-blue-500 text-white py-3 px-6 rounded-xl
                                         font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                <span>{data.ButtonText}</span>
                                <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.a>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Festival_Pop;