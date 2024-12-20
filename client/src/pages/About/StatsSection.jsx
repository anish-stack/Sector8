import React, { useEffect, useState } from 'react';

export function StatsSection() {
  const stats = [
    { number: 10000, label: "Active Businesses & Partner" },
    { number: 50, label: "Major Cities Covered" },
    { number: 100000, label: "Daily Deals & Offer Monthly Visitors" },
    { number: 95, label: "Fastest Growing Community" },
  ];

 
  const useCounter = (target, duration = 2) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let start = 0;
      const end = target;
      const totalFrames = duration * 60; 
      let frame = 0;
      const increment = end / totalFrames;

      const counterInterval = setInterval(() => {
        frame++;
        start += increment;
        setCount(Math.floor(start));

        if (frame >= totalFrames) {
          clearInterval(counterInterval);
          setCount(end); // Ensure it reaches the exact target
        }
      }, 1000 / 60); // 60 FPS

      return () => clearInterval(counterInterval); // Clean up interval on component unmount
    }, [target, duration]);

    return count;
  };

  return (
    <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-8 sm:p-12 my-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => {
          const count = useCounter(stat.number, 2); // You can adjust duration here
          return (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-purple-800 mb-2">
                {count}{stat.number > 1000 && "+"} {/* Add '+' for large numbers */}
              </div>
              <div className="text-sm sm:text-base text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
