import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function ImageSlider() {
    const [slides, setSlides] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    const fetchSlides = async () => {
        try {
            const response = await axios.get("https://api.naideal.com/api/v1/get-banner-active");
            if (response.data.success) {
                setSlides(response.data.data); // Update state with fetched banners
            } else {
                console.error("Failed to fetch slides:", response.data.message);
            }
        } catch (error) {
            console.error("Error fetching slides:", error.message);
        }
    };

    // Fetch slides on component mount
    useEffect(() => {
        fetchSlides();
    }, []);

    // Handle slide transitions only if slides are present
    useEffect(() => {
        if (slides.length > 0) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }, 3000);

            return () => clearInterval(timer); // Cleanup on unmount or slides change
        }
    }, [slides]);

    return (
        <div className="absolute inset-0 z-0">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
                        ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                    style={{
                        backgroundImage: `url("${slide.image?.url}")`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat'
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/20 to-black/70" />
                </div>
            ))}

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all
                        ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50'}`}
                    />
                ))}
            </div>
        </div>
    );
}
