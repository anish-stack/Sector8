import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchProduct = () => {
    // Extract query parameters from URL
    const searchParams = new URLSearchParams(window.location.search);
    const city = searchParams.get('city');
    const pincode = searchParams.get('pincode');
    const WhatYouWant = searchParams.get('query');
    const shopCategory = searchParams.get('ShopCategory');
    const searchType = searchParams.get('searchType');


    // State for search results, loading indicator, and pagination
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [resultsPerPage] = useState(8); // Number of results per page
    const [totalPages, setTotalPages] = useState(0);
    const [filter, setFilter] = useState(''); // Filter by Gold, Silver, Free

    // State for form data
    const [formData] = useState({
        City: city,
        PinCode: pincode,
        WhatYouWant: WhatYouWant,
        ShopCategory: shopCategory,
        searchType:searchType
    });
    const BackendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.post(`${BackendUrl}/search`, {
                    formData,
                    filter // Pass filter as part of the request
                });

                const data = response.data.listings; // Assuming response is an object with a 'listings' property

                // Sort data based on HowMuchOfferPost in descending order
                data.sort((a, b) => b.ShopDetails.HowMuchOfferPost - a.ShopDetails.HowMuchOfferPost);

                // Filter out items where HowMuchOfferPost is 0
                const filteredData = data.filter(item => item.ShopDetails.HowMuchOfferPost !== 0);

                setSearchResults(filteredData);
                setTotalPages(Math.ceil(filteredData.length / resultsPerPage)); // Calculate total pages
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setLoading(false);
        };

        fetchData();
    }, [formData, filter]); // Trigger useEffect when formData or filter changes

    // Pagination - Previous page
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Pagination - Next page
    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Handle filtering
    const handleFilter = async (selectedFilter) => {
        setFilter(selectedFilter);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    // Calculate current results to display based on pagination
    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResults = searchResults.slice(indexOfFirstResult, indexOfLastResult);

    return (
        <>
            <div className="p-4 max-w-7xl mx-auto mt-9 mb-5 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {/* Filter buttons */}

                {/* Search results */}
                {loading ? (
                    <div className='w-full min-h-screen flex items-center justify-center loading'><svg viewBox="25 25 50 50">
                        <circle r="20" cy="50" cx="50"></circle>
                    </svg></div>
                ) : currentResults.length > 0 ? (
                    <>
                        {currentResults.map((result, index) => (
                            <a
                                href={`/View-More-Offers/Shop-profile/${result.ShopDetails._id}/${result?.ShopDetails.ShopName.replace(/\s+/g, '-') || "N/A"}`}
                                key={index}
                                className="border rounded-lg overflow-hidden shadow-lg animate__animated animate__fadeIn"
                            >
                                <div className="relative">
                                    <img
                                        src={result?.Pictures[0]?.ImageUrl || `https://via.placeholder.com/300x200`} // Placeholder image if no pictures are available
                                        alt={`Image for ${result.ShopDetails.ShopName}`}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute top-0 right-0 p-2 bg-white text-gray-700 rounded-bl-lg">
                                        {result.ShopDetails.ListingPlan}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-bold mb-2">{result.ShopDetails.ShopName}</h3>
                                    <p className="text-gray-700 mb-2">
                                        {result.ShopDetails.ShopAddress.ShopAddressStreet}, {result.ShopDetails.ShopAddress.NearByLandMark}
                                    </p>
                                    <p className="text-gray-700 mb-2">PinCode: {result.ShopDetails.ShopAddress.PinCode}</p>
                                    <p className="text-gray-700 mb-2">Email: {result.ShopDetails.Email}</p>
                                    <p className="text-gray-700 mb-2">Contact Number: {result.ShopDetails.ContactNumber}</p>
                                    <div>
                                        <div>
                                            {result.ShopDetails.HowMuchOfferPost === 0 ? (
                                                <p>No offer</p>
                                            ) : (
                                                <p>Offer available: {result.ShopDetails.HowMuchOfferPost || 0}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </>
                ) : (
                    <p className="text-center">No data found.</p>
                )}
            </div>
            <div className="flex m-4 items-center justify-center mt-8">
                <button
                    onClick={prevPage}
                    className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l ${currentPage === 1 ? 'cursor-not-allowed' : ''
                        }`}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <button
                    onClick={nextPage}
                    className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r ${currentPage === totalPages ? 'cursor-not-allowed' : ''
                        }`}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </>
    );
};

export default SearchProduct;
