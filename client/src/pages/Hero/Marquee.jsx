import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Marquee = () => {
  const [announcements, setAnnouncements] = useState([]);

  const API_URL = 'http://localhost:7485/api/v1/get-all-marquees';

  // Fetch all marquees when the component mounts
  useEffect(() => {
    const fetchMarquees = async () => {
      try {
        const response = await axios.get(API_URL);
        if (response.data.success) {
          // Assuming the response contains an array of marquees
          setAnnouncements(response.data.data.map(marquee => marquee.title)); // Adjust based on API response
        } else {
          console.error('Failed to fetch marquees:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching marquees:', error.message);
      }
    };

    fetchMarquees();
  }, []); // Empty dependency array means this effect runs only once when the component mounts

  return (
    <div>
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 overflow-hidden py-2">
        <div className="flex animate-marquee whitespace-nowrap">
          {announcements.concat(announcements).map((text, index) => (
            <span
              key={index}
              className="mx-4 text-white font-medium"
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
