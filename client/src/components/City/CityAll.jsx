import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const CityAll = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get('http://localhost:7485/api/v1/admin-get-city');
        setCities(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cities:', error);
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Title Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Serving these great cities! See if we're in your area.
          </h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </motion.div>

        {/* Cities Marquee */}
        <div className="relative">
          <motion.div 
            className="flex space-x-8 whitespace-nowrap"
            animate={{ 
              x: [0, -1000],
              transition: {
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 20,
                  ease: "linear",
                }
              }
            }}
          >
            {/* Double the cities array to create seamless loop */}
            {[...cities, ...cities].map((city, index) => (
              <motion.div
                key={index}
                className="inline-flex items-center bg-white px-6 py-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MapPin className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-lg font-semibold text-gray-800">
                  {city.cityName}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>


      </div>
    </div>
  );
};

export default CityAll;