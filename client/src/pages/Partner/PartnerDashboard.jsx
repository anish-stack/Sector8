import axios from 'axios';
import React, { useState, useEffect } from 'react';

const PartnerDashboard = () => {
    const [partners, setPartners] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [partnersPerPage] = useState(9);
    const [showModal, setShowModal] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [filters, setFilters] = useState({ date: '', package: '', shopName: '' });

    const token = localStorage.getItem('B2bToken');
    const BackendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

    useEffect(() => {
        const handleFetchPartner = async () => {
            try {
                const res = await axios.get(`${BackendUrl}/list-of-shop-user`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPartners(res.data.shops);
                console.log(res.data.shops);

            } catch (error) {
                console.log("Error fetching the partner:", error);
            }
        };

        handleFetchPartner();
    }, [token]);

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const filteredPartners = partners.filter(partner => {
        const dateMatch = filters.date ? partner.createdAt.includes(filters.date) : true;
        const packageMatch = filters.package ? partner.ListingPlan.toLowerCase() === filters.package.toLowerCase() : true;
        const shopNameMatch = filters.shopName ? partner.ShopName.toLowerCase().includes(filters.shopName.toLowerCase()) : true;
        return dateMatch && packageMatch && shopNameMatch;
    });

    const indexOfLastPartner = currentPage * partnersPerPage;
    const indexOfFirstPartner = indexOfLastPartner - partnersPerPage;
    const currentPartners = filteredPartners.slice(indexOfFirstPartner, indexOfLastPartner);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const openModal = (partner) => {
        setSelectedPartner(partner);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedPartner(null);
    };

    return (
        <div className="max-w-screen-xl mx-auto p-4">

            {token ? (
                <>

                    <h1 className="text-4xl font-bold text-center text-gray-800 mt-8 mb-6">
                        Partner Dashboard /
                        <span className="text-sm">
                            <button
                                onClick={() => {
                                    localStorage.clear();
                                    window.location.href = "/";
                                }}
                                className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 rounded-2xl px-6 transition duration-300"
                            >
                                Logout
                            </button>
                        </span>
                    </h1>



                    <form className="mb-8 p-6 bg-white rounded-lg shadow-md">
                        <div className="grid md:grid-cols-3 grid-cols-1 gap-3 -mx-4 mb-6">
                            <div className="w-full  rounded-xl py-2  border-2  px-4 mb-6">
                                <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 mb-2">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    id="dateFilter"
                                    name="date"
                                    value={filters.date}
                                    onChange={handleFilterChange}
                                    className="block w-full outline-none  border-2 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
                                />
                            </div>
                            <div className="w-full rounded-xl py-2  border-2 px-4 mb-6">
                                <label htmlFor="packageFilter" className="block text-sm font-medium text-gray-700 mb-2">
                                    Package
                                </label>
                                <select
                                    id="packageFilter"
                                    name="package"
                                    value={filters.package}
                                    onChange={handleFilterChange}
                                    className="block w-full outline-none  border-2 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
                                >
                                    <option value="">Select Package</option>
                                    <option value="free">Free</option>
                                    <option value="silver">Silver</option>
                                    <option value="gold">Gold</option>
                                </select>
                            </div>
                            <div className="w-full  rounded-xl py-2  border-2 px-4 mb-6">
                                <label htmlFor="shopNameFilter" className="block text-sm font-medium text-gray-700 mb-2">
                                    Shop Name
                                </label>
                                <input
                                    type="text"
                                    id="shopNameFilter"
                                    name="shopName"
                                    value={filters.shopName}
                                    onChange={handleFilterChange}
                                    className="block w-full border-2 outline-none border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-3 py-2"
                                />
                            </div>
                        </div>
                    </form>


                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                        {currentPartners.reverse().map(partner => (
                            <div key={partner._id} className="bg-white relative rounded-lg shadow-lg p-6 transform transition-transform hover:scale-105">
                                <h2 className="text-xl font-semibold text-gray-800">{partner.ShopName}</h2>
                                <p className="text-gray-600 mt-2">{partner.ShopCategory}</p>
                                <p className="text-gray-600">{partner.Email}</p>
                                <p className="text-gray-600">Contact: {partner.ContactNumber}</p>
                                <p className="text-gray-600">
                                    Date: {new Date(partner.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>


                                <button
                                    className={`mt-4 py-2 px-4 rounded-md text-white transition-colors ${partner.ListingPlan === 'Gold' ? 'bg-yellow-500 hover:bg-yellow-600' :
                                        partner.ListingPlan === 'Silver' ? 'bg-green-400 hover:bg-green-500' :
                                            'bg-slate-800 hover:bg-slate-600'
                                        }`}
                                    onClick={() => openModal(partner)}
                                >
                                    View Details
                                </button>
                                <div className="tag absolute top-2 right-2">
                                    <span
                                        className={`py-1 px-3 rounded-full text-sm font-medium text-white ${partner.ListingPlan === 'Gold' ? 'bg-yellow-500' :
                                            partner.ListingPlan === 'Silver' ? 'bg-green-400' :
                                                'bg-slate-800'
                                            }`}
                                    >
                                        {partner.ListingPlan}
                                    </span>
                                </div>
                            </div>

                        ))}
                    </div>

                    <div className="mt-6 flex justify-center">
                        {Array.from({ length: Math.ceil(filteredPartners.length / partnersPerPage) }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => paginate(i + 1)}
                                className={`mx-1 px-3 py-2 rounded-md ${currentPage === i + 1 ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    {showModal && selectedPartner && (
                        <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-75 flex items-center justify-center p-4">
                            <div
                                className={`bg-white p-8 rounded-lg max-w-2xl w-full relative border-4 ${selectedPartner.ListingPlan === 'Gold' ? 'border-yellow-500' :
                                    selectedPartner.ListingPlan === 'Silver' ? 'border-green-400' :
                                        'border-orange-500'
                                    }`}
                            >
                                <h2 className="text-3xl font-semibold mb-4 text-gray-800">{selectedPartner.ShopName}</h2>
                                <p className="text-gray-600 mb-2"><strong>Category:</strong> {selectedPartner.ShopCategory}</p>
                                <p className="text-gray-600 mb-2"><strong>Email:</strong> {selectedPartner.Email}</p>
                                <p className="text-gray-600 mb-2"><strong>Contact:</strong> {selectedPartner.ContactNumber}</p>
                                <p className="text-gray-600 mb-2">
                                    <strong>Address:</strong> {`${selectedPartner.ShopAddress.ShopNo}, ${selectedPartner.ShopAddress.ShopAddressStreet}, ${selectedPartner.ShopAddress.NearByLandMark}, ${selectedPartner.ShopAddress.PinCode}`}
                                </p>
                                <p className="text-gray-600 mb-2"><strong>Coordinates:</strong> {`${selectedPartner.ShopAddress.ShopLongitude}, ${selectedPartner.ShopAddress.ShopLatitude}`}</p>
                                <button
                                    className={`mt-6 py-2 px-4 rounded-md text-white transition-colors ${selectedPartner.ListingPlan === 'Gold' ? 'bg-yellow-500 hover:bg-yellow-600' :
                                        selectedPartner.ListingPlan === 'Silver' ? 'bg-green-400 hover:bg-green-500' :
                                            'bg-slate-900 hover:bg-slate-600'
                                        }`}
                                    onClick={closeModal}
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                    )}
                </>

            ) : (
                <>
                    {window.location.href = "/Partner-Login"}
                </>

            )}

        </div>
    );
}

export default PartnerDashboard;
