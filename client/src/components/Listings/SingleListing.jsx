import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AllListings from './AllListings';
import Store from './store.png';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SingleListing = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const BackendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [id]);

    const fetchSingleData = async () => {
        try {
            const response = await axios.get(`${BackendUrl}/get-listing/${encodeURIComponent(id)}`);
            const data = response.data.data;
            setListing(data);
            setLoading(false);
        } catch (error) {
            console.log('Error fetching single data:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSingleData();
    }, [id]);

    if (loading) {
        return (
            <div className='max-w-screen-xl mx-auto px-4 py-5'>
                <Skeleton height={50} count={1} />
                <Skeleton height={30} width={200} count={1} />
                <Skeleton height={200} count={1} />
                <Skeleton height={30} count={5} />
            </div>
        );
    }

    return (
        <div className='max-w-screen-xl mx-auto px-4 py-5'>
            {/* Breadcrumbs */}
            <nav className="mb-8 text-gray-700" aria-label="Breadcrumb">
                <ol className="list-reset flex">
                    <li>
                        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
                    </li>
                    <li><span className="mx-2">/</span></li>
                    <li>
                        <Link to="/listings" className="text-blue-600 hover:underline">Listings</Link>
                    </li>
                    <li><span className="mx-2">/</span></li>
                    <li className="text-gray-500 truncate">{listing.Title}</li>
                </ol>
            </nav>

            <h1 className="text-lg md:text-3xl lg:text-4xl font-bold mb-8 text-center">{listing.Title}</h1>

            <div className="max-w-screen-xl mx-auto p-4">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
                    <div className="lg:col-span-4">
                        {/* Image Gallery */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="grid grid-cols-1 gap-2">
                                <img
                                    src={listing.Pictures[0]?.ImageUrl}
                                    alt={listing.Title}
                                    className="w-full object-contain rounded-lg shadow-lg"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {listing.Pictures.slice(1, 5).map((pic, index) => (
                                    <img
                                        key={index}
                                        src={pic.ImageUrl}
                                        alt={listing.Title}
                                        className="w-full object-cover rounded-lg shadow-lg"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="bg-white rounded-lg p-6 mb-8">
                            <div className="flex items-center lg:flex-row flex-col justify-between mt-4">
                                <div className="flex lg:flex-row flex-col items-center">
                                    <img
                                        src={Store}
                                        alt={listing.shopDetails?.ShopName || "Shop Logo"}
                                        className="w-12 h-12 object-cover rounded-full"
                                    />
                                    <div className="ml-4">
                                        <h3 className="text-xl font-semibold">{listing.shopDetails?.ShopName || "N/A"}</h3>
                                        <p className="text-gray-700">{listing.shopDetails?.ShopCategory || "N/A"}</p>
                                        <p className="text-gray-700">Total Available offers: <span className='text-xl text-red-500'>{listing.shopDetails?.HowMuchOfferPost || "N/A"}</span></p>
                                    </div>
                                </div>
                                <a href={`/View-More-Offers/Shop-profile/${listing.shopDetails._id}/${listing.shopDetails?.ShopName.replace(/\s+/g, '-') || "N/A"}`} className='text-lg bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white whitespace-nowrap py-3 px-10 rounded-full shadow-md transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400'>
                                    View More offers
                                </a>
                            </div>
                            <hr className='mt-5 mb-3' />
                            <h2 className="text-3xl font-semibold text-green-500 mb-4">Details</h2>
                            <p className="text-gray-700 mb-4">{listing.Details}</p>
                            <div className="bg-white rounded-lg mb-8">
                                <div className="text-gray-700">
                                    <h3 className="text-2xl font-semibold text-green-500 mb-5 mt-6">Address <i className="fa-solid fa-location-arrow"></i> </h3>
                                    <div className="mb-4">
                                        <p className="text-base">
                                            <span className="font-semibold">Nearby Landmark:</span> {listing.shopDetails?.ShopAddress.NearByLandMark || "N/A"}
                                        </p>
                                        <p className="text-base">
                                            <span className="font-semibold">Pin Code:</span> {listing.shopDetails?.ShopAddress.PinCode || "N/A"}
                                        </p>
                                        <p className="text-base">
                                            <span className="font-semibold">Address:</span> {listing.shopDetails?.ShopAddress.ShopAddressStreet || "N/A"}
                                        </p>
                                    </div>
                                    <p className="text-base">
                                        <span className="font-semibold">Contact Number:</span> {listing.shopDetails?.ContactNumber || "N/A"}
                                    </p>
                                    <p className="text-base">
                                        <span className="font-semibold">Email:</span> {listing.shopDetails?.Email || "N/A"}
                                    </p>
                                    <p className="text-base">
                                        <span className="font-semibold">Member type:</span> {listing.shopDetails?.ListingPlan || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Items Section */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                            <h2 className="text-3xl font-semibold mb-4 text-gray-800">Offer On These Items 😋😋</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {listing.Items.map((item, index) => (
                                    <div key={index} className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
                                        <img
                                            className="w-full h-48 object-cover object-center"
                                            src={item?.dishImages[0]?.ImageUrl || 'https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg'}
                                            onError={(e) => e.target.src = 'https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg'}
                                            alt={item.itemName}
                                        />
                                        <div className="px-6 py-4">
                                            <div className="font-bold text-xl mb-2">{item.itemName}</div>
                                            <p className="text-gray-700 text-base">
                                                Price: ₹{item.MrpPrice}
                                            </p>
                                            <p className="text-gray-700 text-base">
                                                Discount: {item.Discount}%
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Advertisement Section */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4">
                            <div className="w-full max-h-[60vh] lg:h-auto bg-gray-100 p-4 rounded-lg shadow-lg overflow-y-auto">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Advertisement</h3>
                                <p className="text-gray-600 mb-4">
                                    Place your ad content here. This section occupies a maximum of 60% of the screen height.
                                </p>
                                <button className="bg-blue-500 w-full text-white px-4 py-2 rounded-md hover:bg-blue-600">
                                    Contact Us
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Button */}
            <div className="flex justify-center">
                <a href={`tel:${listing.shopDetails?.ContactNumber}`} className='text-lg bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white py-3 px-6 rounded-full shadow-md transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400'>
                    <i className="fa-solid fa-phone mr-2"></i> Contact Us
                </a>
            </div>

            {/* Similar Listings */}
            <div className='my-10'>
                <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-center mb-5">Similar Listings</h2>
                <AllListings shopDetailsId={listing.shopDetails?._id} />
            </div>
        </div>
    );
};

export default SingleListing;
