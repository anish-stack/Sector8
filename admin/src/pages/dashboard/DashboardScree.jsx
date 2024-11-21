import React, { useEffect, useState } from 'react';
import axios from 'axios';

import 'tailwindcss/tailwind.css';

const DashboardScreen = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin-Statistics`);
                setData(response.data.data);
                console.log(response.data.data)
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchData();
    }, []);
    const loadingClasses = "flex justify-center items-center h-screen";
    if (!data) {
        return <div className={loadingClasses}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
        <span className="ml-4 text-xl font-semibold">Loading...</span>
      </div>;
    }

    const {
        packageLength,
        partnerLength,
        totalUsers,
        totalFreeListing,
        totalGoldListing,
        totalSilverListing,
        totalPaymentAmountRupees,
        totalApprovedPosts,
        totalUnapprovedPosts,
        totalCityWeDeal,
        totalCategoriesWeDeal
    } = data;

    const chartColors = ['#36A2EB', '#FFCE56', '#FF6384', '#4CAF50', '#F44336'];

    return (
        <div className="container mx-auto p-1">
            <div className="flex justify-end mb-4">
                <div className="relative">
                    <a href="/approve-post" className="flex cursor-pointer items-center">
                        <i className="fa-solid fa-bell text-red-500 text-2xl mr-1"></i>
                        <span className="bg-red-500 rounded-full h-6 w-6 flex items-center justify-center text-white text-xs font-bold">
                            {totalUnapprovedPosts || "0"}
                        </span>
                    </a>
                </div>
            </div>
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <i className="fa-solid fa-user text-blue-500 text-3xl mb-4 "></i>
                    <h2 className="text-xl font-semibold">Total Users</h2>
                    <p className="text-2xl">{totalUsers || "0"}</p>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <i className="fa-solid fa-cart-shopping text-yellow-500 text-3xl mb-4"></i>
                    <h2 className="text-xl font-semibold">Total Packages</h2>
                    <p className="text-2xl">{packageLength || "0"}</p>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <i className="fa-solid fa-box-open text-green-500 text-3xl mb-4"></i>
                    <h2 className="text-xl font-semibold">Total Partners</h2>
                    <p className="text-2xl">{partnerLength || "0"}</p>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <i className="fa-solid fa-sack-dollar text-purple-500 text-3xl mb-4"></i>
                    <h2 className="text-xl font-semibold">Total Payment (₹)</h2>
                    <p className="text-2xl">{totalPaymentAmountRupees.toFixed(2) || "0"}</p>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <i className=" fa-solid fa-city text-red-500 text-3xl mb-4"></i>
                    <h2 className="text-xl whitespace-nowrap font-semibold">Total City  :-  {totalCityWeDeal || "0"}  </h2>
                    <p className="text-2xl"></p>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <i className="fa-solid fa-store text-gray-900 text-3xl mb-4"></i>
                    <h2 className="text-xl whitespace-nowrap font-semibold">Total Categories :-  {totalCategoriesWeDeal || "0"} </h2>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm mx-auto">
    <div className="flex items-center mb-4">
        <i className="fa-solid fa-list-ol text-gray-900 text-3xl"></i>
        <h2 className="text-xl font-semibold ml-4">Total Listings</h2>
    </div>
    <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
            <span className="font-medium">Gold</span>
            <span className="flex items-center">
                <i className="fa-solid fa-coins text-yellow-500 mr-2"></i> {totalGoldListing || "0"}
            </span>
        </div>
        <div className="flex items-center justify-between">
            <span className="font-medium">Silver</span>
            <span className="flex items-center">
                <i className="fa-solid fa-coins text-gray-500 mr-2"></i> {totalSilverListing || "0"}
            </span>
        </div>
        <div className="flex items-center justify-between">
            <span className="font-medium">Free</span>
            <span className="flex items-center">
                <i className="fa-solid fa-coins text-green-500 mr-2"></i> {totalFreeListing || "0"}
            </span>
        </div>
    </div>
</div>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Listings Breakdown</h2>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex-1 relative">
                            <p className="text-lg text-gray-600">Free Listings</p>
                            <div className="bg-gray-300 h-4 w-full rounded-lg">
                                <div
                                    className="bg-blue-500 h-4 rounded-lg"
                                    style={{ width: `${(totalFreeListing / (totalFreeListing + totalGoldListing + totalSilverListing)) * 100}%` }}
                                ></div>
                                <div className="absolute top-0 right-0 -mr-4 mt-1 bg-blue-500 text-white px-2 py-1 rounded-md hidden group-hover:block">
                                    {totalFreeListing}
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 ml-4 relative">
                            <p className="text-lg text-gray-600">Gold Listings</p>
                            <div className="bg-gray-300 h-4 w-full rounded-lg">
                                <div
                                    className="bg-yellow-500 h-4 rounded-lg"
                                    style={{ width: `${(totalGoldListing / (totalFreeListing + totalGoldListing + totalSilverListing)) * 100}%` }}
                                ></div>
                                <div className="absolute top-0 right-0 -mr-4 mt-1 bg-yellow-500 text-white px-2 py-1 rounded-md hidden group-hover:block">
                                    {totalGoldListing}
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 ml-4 relative">
                            <p className="text-lg text-gray-600">Silver Listings</p>
                            <div className="bg-gray-300 h-4 w-full rounded-lg">
                                <div
                                    className="bg-red-500 h-4 rounded-lg"
                                    style={{ width: `${(totalSilverListing / (totalFreeListing + totalGoldListing + totalSilverListing)) * 100}%` }}
                                ></div>
                                <div className="absolute top-0 right-0 -mr-4 mt-1 bg-red-500 text-white px-2 py-1 rounded-md hidden group-hover:block">
                                    {totalSilverListing}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Posts Approval Status</h2>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex-1 relative">
                            <p className="text-lg text-gray-600">Approved Posts</p>
                            <div className="bg-gray-300 h-4 w-full rounded-lg">
                                <div
                                    className="bg-green-500 h-4 rounded-lg"
                                    style={{ width: `${(totalApprovedPosts / (totalApprovedPosts + totalUnapprovedPosts)) * 100}%` }}
                                ></div>
                                <div className="absolute top-0 right-0 -mr-4 mt-1 bg-green-500 text-white px-2 py-1 rounded-md hidden group-hover:block">
                                    {totalApprovedPosts}
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 ml-4 relative">
                            <p className="text-lg text-gray-600">Unapproved Posts</p>
                            <div className="bg-gray-300 h-4 w-full rounded-lg">
                                <div
                                    className="bg-red-500 h-4 rounded-lg"
                                    style={{ width: `${(totalUnapprovedPosts / (totalApprovedPosts + totalUnapprovedPosts)) * 100}%` }}
                                ></div>
                                <div className="absolute top-0 right-0 -mr-4 mt-1 bg-red-500 text-white px-2 py-1 rounded-md hidden group-hover:block">
                                    {totalUnapprovedPosts}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardScreen;
