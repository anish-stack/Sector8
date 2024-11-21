import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Shop.css';

const ShopProfile = () => {
    const { id } = useParams();
    const [shopDetails, setShopDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const BackendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BackendUrl}/get-Listing`);
                const data = response.data.data;
                const filteredShop = data?.find(item => item.shopDetails._id === id);
                if (filteredShop) {
                    setShopDetails(filteredShop);
                } else {
                    console.log(`Shop with ID ${id} not found.`);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return <div className='w-full min-h-screen flex items-center justify-center loading'>
            <svg viewBox="25 25 50 50">
                <circle r="20" cy="50" cx="50"></circle>
            </svg>
        </div>;
    }

    if (!shopDetails) {
        return <div className='w-full min-h-screen flex items-center justify-center'>
            <p>Shop details not found.</p>
        </div>;
    }

    const { listing, shopDetails: shopInfo } = shopDetails;

    return (
        <div className='w-full'>
      <div className='shop-profile bg-gradient-to-r from-green-200 via-pink-200 to-purple-200 py-16 relative'>
    <div className='relative'>
        <div className='absolute inset-0 flex items-center justify-center text-4xl lg:text-[12rem] font-extrabold text-gray-700 opacity-30 z-20'>
            {shopInfo.ShopName}
        </div>
        <div className='shop-details flex items-center justify-center flex-col h-full text-gray-800 relative z-30 py-10'>
            <h2 className='text-xl lg:text-4xl font-extrabold md:text-3xl bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text'>{shopInfo.ShopName || 'N/A'}</h2>
            <h3 className='text-md lg:text-2xl font-extrabold md:text-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text'>{shopInfo.ShopCategory || 'N/A'}</h3>
            <h3 className='text-md lg:text-xl font-extrabold md:text-lg bg-gradient-to-r from-black to-gray-900 text-transparent bg-clip-text'>{shopInfo.Email || 'N/A'}</h3>
        </div>
    </div>
</div>


  
            <div className="grid grid-cols-1 mt-6 sm:grid-cols-2 lg:grid-cols-4 gap-6 rounded-lg p-6 mb-8">
                {listing.Items.length > 0 && listing.Items.map((item, index) => (
                    <div key={index} className="relative bg-white border cursor-pointer rounded overflow-hidden shadow-lg">
                        <span className="absolute top-2 left-2 bg-green-500 text-white py-1 px-2 rounded-full text-sm font-semibold">
                            {item.Discount}% Off
                        </span>
                        <a href={`/Single-Listing/${listing._id}/${listing.Title.replace(/\s+/g, '-')}`}>
                            <img
                                className="w-full h-48 object-cover object-center"
                                src={listing.Pictures[0].ImageUrl}
                                alt={listing.Title}
                            />
                            <div className="px-6 py-4">
                                <div className="font-bold text-xl mb-2">{listing.Title}</div>
                                <p className="text-sm truncate text-gray-700 mb-2">
                                    {shopInfo ? (
                                        <>
                                            {shopInfo.ShopAddress.NearByLandMark || "N/A"}
                                            , <address>
                                                {shopInfo.ShopAddress.PinCode || "N/A"}
                                                , {shopInfo.ShopAddress.ShopAddressStreet || "N/A"}
                                            </address>
                                        </>
                                    ) : (
                                        "N/A"
                                    )}
                                </p>
                                <div className="flex items-center">
                                    <span className="text-gray-700">{item.itemName}</span>
                                </div>
                            </div>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ShopProfile;
