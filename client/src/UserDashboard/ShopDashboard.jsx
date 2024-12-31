import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ShopImage from './store.png'
import CreateListing from './CreateListing'
import MyPost from './MyPost'
import { Navigate, useNavigate } from 'react-router-dom'
const ShopDashboard = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('ShopToken')
    const [shopDetails, setShopDetails] = useState()
    const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);
    const BackendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

    const fetchMyShopDetails = async () => {
        try {
            const response = await axios.get(`${BackendUrl}/My-Shop-Details`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            // console.log(response)
            const data = response.data.user
            // console.log("User",data)
            setShopDetails(data)

        } catch (error) {
            console.log("error hu mai",error)
        }
    }
    useEffect(() => {
        fetchMyShopDetails()
    }, [])
    const handleUpgradePackage = (id) => {
        navigate(`/upgrade-package/${id}`)
    }
    return (
        <div className='w-full py-3'>
            {token ? (
                <div className="bg-gray-100">
                    <div className="container mx-auto py-8">
                        <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
                            <div className="col-span-4 sm:col-span-3">
                                <div className="bg-white shadow rounded-lg p-6">
                                    <div className="flex flex-col items-center">
                                        <img src={ShopImage} className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0" />

                                        <h1 className="text-xl font-bold">{shopDetails ? shopDetails.ShopName || "N/A" : "N/A"}</h1>
                                        <p className="text-gray-700">{shopDetails ? shopDetails.ShopCategory || "N/A" : "N/A"}</p>
                                        <div className="mt-8 flex flex-wrap gap-4 justify-center">
                                            <a className="bg-gradient-to-r from-green-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
                                                <span className="font-bold">Package:</span> {shopDetails ? shopDetails.ListingPlan || "N/A" : "N/A"}
                                            </a>
                                            <a className="bg-gradient-to-r from-gray-300 to-gray-500 hover:from-gray-400 hover:to-gray-600 text-gray-800 py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition duration-300">
                                                <span className="font-bold">Owner:</span> {shopDetails ? shopDetails.UserName || "N/A" : "N/A"}
                                            </a>
                                        </div>

                                    </div>
                                    <hr className="my-6 border-t border-gray-300" />
                                    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
                                        <div className="flex flex-col items-start mb-4">
                                            <span className="text-gray-700 uppercase font-bold tracking-wider mb-2">Contact Information</span>
                                            <div className="mb-2">
                                                <span className="font-semibold">Contact Number:</span> {shopDetails ? shopDetails.ContactNumber || "N/A" : "N/A"}
                                            </div>
                                            <div className="mb-2">
                                                <span className="font-semibold">Email:</span> {shopDetails ? shopDetails.Email || "N/A" : "N/A"}
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-start mb-4">
                                            <span className="text-gray-700 uppercase font-bold tracking-wider mb-2">Shop Address</span>
                                            <div className="mb-2">
                                                <span className="font-semibold">Street:</span> {shopDetails && shopDetails.ShopAddress ? shopDetails.ShopAddress.ShopAddressStreet || "N/A" : "N/A"}
                                            </div>
                                            <div className="mb-2">
                                                <span className="font-semibold">Landmark:</span> {shopDetails && shopDetails.ShopAddress ? shopDetails.ShopAddress.NearByLandMark || "N/A" : "N/A"}
                                            </div>
                                            <div className="mb-2">
                                                <span className="font-semibold">Pin Code:</span> {shopDetails && shopDetails.ShopAddress ? shopDetails.ShopAddress.PinCode || "N/A" : "N/A"}
                                            </div>
                                            <div className="mb-2 m-auto">
                                                <button onClick={() => handleUpgradePackage(shopDetails._id)} className="text-sm  px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50">
                                                    UPGRADE PACKAGE
                                                </button>

                                            </div>
                                            <div className="mb-2 m-auto">
                                                <button
                                                    onClick={() => {
                                                        localStorage.clear();
                                                        window.location.href = "/Shop-login";
                                                    }}
                                                    className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 rounded-2xl px-6 transition duration-300"
                                                >
                                                    Logout
                                                </button>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className="col-span-4 overflow-hidden sm:col-span-9">
                                <div className="bg-white relative shadow rounded-lg p-6">
                                    <div className="offer-tag">
                                        <div className="tags-1">
                                            {shopDetails ? (
                                                `${shopDetails.HowMuchOfferPost || "0"} / ${shopDetails.ListingPlan === 'Silver' ? '5' : shopDetails.ListingPlan === 'Gold' ? '10' : '1'}`
                                            ) : (
                                                "N/A"
                                            )}
                                        </div>
                                    </div>





                                    <div className='flex mt-4 justify-center items-center'>

                                        <button className='shadow-md border-2 border-black' onClick={() => setIsCreateListingOpen(true)}>
                                            <span class="box">
                                                Click to Create Post <i class="fa-solid fa-plus"></i>
                                            </span>
                                        </button>
                                    </div>



                                    <h2 className="text-xl  text-center font-bold mt-6 mb-4">My Post</h2>
                                    <MyPost fetchMyShopDetails={fetchMyShopDetails} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>

                    {window.location.href = "/Shop-login"}
                </>
            )}

            <CreateListing isOpen={isCreateListingOpen} onClose={() => setIsCreateListingOpen(false)} />
        </div>
    )
}

export default ShopDashboard
