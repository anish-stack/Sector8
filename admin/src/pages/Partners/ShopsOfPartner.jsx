import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShopsOfPartner = () => {
    const [partnerDetails, setPartnerDetails] = useState(null);
    const [filteredShops, setFilteredShops] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [shopsPerPage] = useState(5); // Number of shops to display per page

    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null); // To store payment details

    const partnerId = new URLSearchParams(window.location.search).get('partnerId');

    useEffect(() => {
        const fetchPartnerDetails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin-by-partner-user/${partnerId}`);
                setPartnerDetails(response.data);
                setFilteredShops(response.data.shops); // Initialize filtered shops with all shops
            } catch (error) {
                console.error('Error fetching partner details:', error);
            }
        };

        if (partnerId) {
            fetchPartnerDetails();
        }
    }, [partnerId]);

    useEffect(() => {
        // Function to filter shops based on search term
        const filterShops = () => {
            if (!searchTerm) {
                setFilteredShops(partnerDetails?.shops);
            } else {
                const filtered = partnerDetails?.shops.filter(shop =>
                    shop.ShopName.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setFilteredShops(filtered);
            }
        };

        filterShops();
    }, [searchTerm, partnerDetails]);

    // Pagination
    const indexOfLastShop = currentPage * shopsPerPage;
    const indexOfFirstShop = indexOfLastShop - shopsPerPage;
    const currentShops = filteredShops?.slice(indexOfFirstShop, indexOfLastShop);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    // Function to fetch payment details when Order ID is clicked
    const shopPaymentInfo = async (id) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin-payments/${id}`);
            setModalData(res.data.orderDetails); // Set payment details to display in modal
            setShowModal(true); // Show the modal
        } catch (error) {
            console.log(error);
        }
    };

    // Modal close handler
    const closeModal = () => {
        setShowModal(false);
        setModalData(null); // Clear modal data
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-4">Partner Details</h2>

            {/* Search input */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by Shop Name"
                    className="border border-gray-300 rounded-md p-2 w-full"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table to display shops */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Order Id</th>
                            <th className="border border-gray-300 px-4 py-2">Shop Name</th>
                            <th className="border border-gray-300 px-4 py-2">Shop Category</th>
                            <th className="border border-gray-300 px-4 py-2">Listing Plan</th>
                            <th className="border border-gray-300 px-4 py-2">Address</th>
                            <th className="border border-gray-300 px-4 py-2">Contact Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentShops && currentShops.length > 0 ? (
                            currentShops.map(shop => (
                                <tr key={shop._id}>
                                    <td
                                        className="border border-gray-300 cursor-pointer px-4 py-2"
                                        onClick={() => shopPaymentInfo(shop.OrderId)}
                                    >
                                        {shop.OrderId || 'Free Listing'}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">{shop.ShopName}</td>
                                    <td className="border border-gray-300 px-4 py-2">{shop.ShopCategory}</td>
                                    <td className="border border-gray-300 px-4 py-2">{shop.ListingPlan}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {shop.ShopAddress.ShopNo}, {shop.ShopAddress.ShopAddressStreet}, {shop.ShopAddress.PinCode}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">{shop.ContactNumber}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="border border-gray-300 px-4 py-2 text-center" colSpan="5">
                                    No shops found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <nav className="block">
                    <ul className="flex pl-0 rounded list-none flex-wrap">
                        {filteredShops && filteredShops.length > shopsPerPage && (
                            <React.Fragment>
                                <li>
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-gray-800 mr-1 hover:bg-gray-200"
                                    >
                                        Previous
                                    </button>
                                </li>
                                {Array.from({ length: Math.ceil(filteredShops.length / shopsPerPage) }, (_, index) => (
                                    <li key={index}>
                                        <button
                                            onClick={() => paginate(index + 1)}
                                            className={`relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-gray-800 mr-1 hover:bg-gray-200 ${currentPage === index + 1 ? 'bg-gray-300' : ''
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                                <li>
                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === Math.ceil(filteredShops.length / shopsPerPage)}
                                        className="relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-gray-800 mr-1 hover:bg-gray-200"
                                    >
                                        Next
                                    </button>
                                </li>
                            </React.Fragment>
                        )}
                    </ul>
                </nav>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-4 rounded-lg w-1/2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">Payment Details</h2>
                            <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="border border-gray-300 p-4">
                            <p className="mb-2">
                                <span className="font-semibold">Order ID:</span> {modalData?.id}
                            </p>
                            <p className="mb-2">
                                <span className="font-semibold">Amount:</span> {modalData?.amount / 100} {modalData?.currency}
                            </p>
                            <p className="mb-2">
                                <span className="font-semibold">Status:</span> {modalData?.status}
                            </p>
                            <p className="mb-2">
                                <span className="font-semibold">Receipt:</span> {modalData?.receipt}
                            </p>
                            {/* Add other payment details as needed */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShopsOfPartner;
