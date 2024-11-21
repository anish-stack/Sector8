import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const AllListings = () => {
    const [listings, setListings] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    const BackendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

    const fetchData = useCallback(async () => {
        try {
            const response = await axios.get(`${BackendUrl}/get-Listing`);
            const data = response.data.data;
            setListings(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching listings:', error);
            setError(true);
            setLoading(false);
        }
    }, [BackendUrl]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return (
            <div className='max-w-screen-xl mx-auto px-4 py-5'>
                <h1 className="text-3xl font-bold mb-8 text-center">Explore Listings</h1>
                <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                    {Array(16).fill().map((_, index) => (
                        <Skeleton key={index} height={300} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return <div>Something went wrong. Please try again later.</div>;
    }

    const handleShowMore = () => {
        setShowAll(true);
    };

    const handleShowLess = () => {
        setShowAll(false);
    };

    return (
        <div className='max-w-screen-xl mx-auto px-4 py-5'>
            <h1 className="text-3xl font-bold mb-8 text-center">Explore Listings</h1>
            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                {listings.slice(0, showAll ? listings.length : 40).map((item, index) => {
                    if (!item || !item.listing || !item.shopDetails) {
                        return null;
                    }

                    return (
                        <Link
                            to={`/Single-Listing/${item.listing._id}/${item.listing.Title.replace(/\s+/g, '-')}`}
                            className='bg-white relative overflow-hidden cursor-pointer rounded-lg shadow-md p-4'
                            key={index}
                        >

                            <img
                                src={item.listing.Pictures[0]?.ImageUrl}
                                alt={item.listing.Title}
                                loading='lazy'
                                className='w-full h-20 aspect-w-1 aspect-h-1 md:h-48 object-cover mb-4 rounded-lg'
                            />
                            {item.shopDetails.ListingPlan !== 'Free' && (
                                <div className="absolute top-2 left-2 bg-gradient-to-br from-green-400 to-green-500 text-white py-1 px-5 rounded-full text-left text-sm font-semibold">
                                    <i class="fa-solid fa-circle-check"></i>  Verified
                                </div>
                            )}

                            <p className='text-lg font-semibold mb-2'>{item.listing.Title}</p>
                            <p className="text-sm truncate text-gray-700 mb-2">
                                {item.shopDetails ? (
                                    <>
                                        {item.shopDetails.ShopAddress.NearByLandMark || "N/A"},{' '}
                                        <address>
                                            {item.shopDetails.ShopAddress.PinCode || "N/A"},{' '}
                                            {item.shopDetails.ShopAddress.ShopAddressStreet || "N/A"}
                                        </address>
                                    </>
                                ) : (
                                    "N/A"
                                )}
                            </p>
                            {item.listing.Items.length > 0 && (
                                <div className='flex truncate items-center'>
                                    <span className='bg-green-500 text-white py-1 px-1 whitespace-nowrap md:px-2 rounded-full text-sm font-semibold mr-2'>
                                        {item.listing.Items[0]?.Discount}% Off
                                    </span>
                                    <span className='text-gray-700'>{item.listing.Items[0]?.itemName}</span>
                                </div>
                            )}
                        </Link>
                    );
                })}
            </div>

            {!showAll && listings.length > 40 && (
                <div className='flex justify-center mt-8'>
                    <button
                        onClick={handleShowMore}
                        className='bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 text-white py-2 px-6 rounded-full shadow-md transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400'
                        style={{ maxWidth: '200px' }}
                    >
                        View More
                    </button>
                </div>
            )}

            {showAll && (
                <div className='flex justify-center mt-8'>
                    <button
                        onClick={handleShowLess}
                        className='bg-gradient-to-r from-red-600 to-red-600 hover:from-red-700 hover:to-red-700 text-white py-2 px-6 rounded-full shadow-md transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400'
                    >
                        Show Less
                    </button>
                </div>
            )}
        </div>
    );
};

export default AllListings;
