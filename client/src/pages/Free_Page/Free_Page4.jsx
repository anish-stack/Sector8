import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Hero Component
const Hero = ({ title, description, mainImage }) => (
    <div
        className="relative h-[60vh] overflow-hidden"
        style={{
            backgroundImage: `url(${mainImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}
    >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30">
            <div className="container mx-auto px-4 h-full flex flex-col justify-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                    {title}
                </h1>
                <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
                    {description}
                </p>
            </div>
        </div>
    </div>
);

// Content Renderer Component
const ContentRenderer = ({ htmlContent }) => (
    <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
);

function Free_Page4() {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPages = async () => {
            try {
                const response = await axios.get('https://api.naideal.com/api/v1/Other/get-free-page');
                // console.log("object",response.data)
                setPages(response.data);
                setLoading(false);
            } catch (error) {
                toast.error('Failed to fetch pages');
                setLoading(false);
            }
        };

        fetchPages();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (pages.length === 0) {
        return null;
    }

    
    const page = pages[3];
    // console.log("page",page)
    
    return (
        page.isContentShow && (
            <div className="min-h-screen bg-gray-50">
                <Hero
                    title={page.title}
                    description={page.description}
                    mainImage={page.MainImage}
                />

                <main className="container mx-auto px-4 py-12">
                    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 lg:p-12">
                        {page.isContentShow && (
                            <div className="space-y-8">
                                <ContentRenderer htmlContent={page.HtmlContent} />
                            </div>
                        )}
                    </div>

                    {page?.isButton && page?.buttonLink && (
                        <div className="mt-12 text-center">
                            <a
                                href={page.buttonLink}
                                className="inline-block text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                                style={{
                                    background: `linear-gradient(to right, ${page.b1}, ${page.b2})`,
                                }}
                            >
                                {page.buttonText}
                            </a>
                        </div>
                    )}
                </main>
            </div>
        )
    );
};

export default Free_Page4
