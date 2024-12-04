import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Bell, Users, Package, Handshake, DollarSign, MapPin, Store, Coins, CheckCircle, XCircle
} from 'lucide-react';
import 'tailwindcss/tailwind.css';

const DashboardScreen = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin-Statistics`);
                setData(response.data.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };
        fetchData();
    }, []);

    if (!data) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
                <span className="ml-4 text-xl font-semibold">Loading...</span>
            </div>
        );
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
        totalCategoriesWeDeal,
    } = data;

    return (
        <div className="  mx-auto">
            {/* Notification Section */}
            <div className="flex justify-end mb-6">
                <div className="relative">
                    <a href="/approve-post" className="flex items-center space-x-2 cursor-pointer">
                        <Bell className="text-red-500 text-2xl" />
                        <span className="bg-red-500 rounded-full h-6 w-6 flex items-center justify-center text-white text-xs font-bold">
                            {totalUnapprovedPosts || 0}
                        </span>
                    </a>
                </div>
            </div>

            {/* Dashboard Header */}
            <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<Users className="text-blue-500" />} title="Total Users" value={totalUsers} />
                <StatCard icon={<Package className="text-yellow-500" />} title="Total Packages" value={packageLength} />
                <StatCard icon={<Handshake className="text-green-500" />} title="Total Partners" value={partnerLength} />
                <StatCard
                    icon={<DollarSign className="text-purple-500" />}
                    title="Total Payment (₹)"
                    value={totalPaymentAmountRupees.toFixed(2)}
                />
                <StatCard icon={<MapPin className="text-red-500" />} title="Total Cities" value={totalCityWeDeal} />
                <StatCard icon={<Store className="text-gray-900" />} title="Total Categories" value={totalCategoriesWeDeal} />
            </div>

            {/* Listings Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Listings Breakdown</h2>
                    <ListingBar label="Free Listings" value={totalFreeListing} total={totalFreeListing + totalGoldListing + totalSilverListing} color="blue-500" />
                    <ListingBar label="Gold Listings" value={totalGoldListing} total={totalFreeListing + totalGoldListing + totalSilverListing} color="yellow-500" />
                    <ListingBar label="Silver Listings" value={totalSilverListing} total={totalFreeListing + totalGoldListing + totalSilverListing} color="gray-500" />
                </div>

                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Posts Approval Status</h2>
                    <ListingBar label="Approved Posts" value={totalApprovedPosts} total={totalApprovedPosts + totalUnapprovedPosts} color="green-500" />
                    <ListingBar label="Unapproved Posts" value={totalUnapprovedPosts} total={totalApprovedPosts + totalUnapprovedPosts} color="red-500" />
                </div>
            </div>
        </div>
    );
};

// Reusable Stat Card Component
const StatCard = ({ icon, title, value }) => (
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
        <div className="text-3xl mb-4">{icon}</div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-2xl font-bold">{value || 0}</p>
    </div>
);

// Reusable Progress Bar Component
const ListingBar = ({ label, value, total, color }) => {
    const percentage = ((value / total) * 100).toFixed(2);
    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">{label}</span>
                <span className="font-medium">{value}</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-4">
                <div className={`bg-${color} h-4 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

export default DashboardScreen;
