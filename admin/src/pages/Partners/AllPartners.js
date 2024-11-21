import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AllPartners = () => {
    const [partners, setPartners] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [partnersPerPage] = useState(10); // Number of partners per page

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin-all-partner`);
            setPartners(response.data.data);
            console.log(response.data.data)
        } catch (error) {
            console.error('Error fetching partners:', error);
        }
    };
    const handleDelete = async (id) => {
        try {
            console.log("i am click",id)
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/delete-partner/${id}`);
            console.log(response.data)
            fetchPartners()
        } catch (error) {
            console.error('Error fetching partners:', error);
        }
    };
    // Logic to paginate partners
    const indexOfLastPartner = currentPage * partnersPerPage;
    const indexOfFirstPartner = indexOfLastPartner - partnersPerPage;
    const currentPartners = partners.slice(indexOfFirstPartner, indexOfLastPartner);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">All Partners</h1>
            <div className="mb-4">
                <Link
                    to={`${process.env.REACT_APP_FRONTEND_URL}/Register-Partner?query=send-by-admin&registerdate=${new Date().toISOString()}`}

                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block"
                >
                    Add Partner
                </Link>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-100 border-b border-gray-200">
                        <tr>
                            <th className="text-left py-2 px-4">Partner Name</th>
                            <th className="text-left py-2 px-4">Partner Email</th>
                            <th className="text-left py-2 px-4">Partner Contact Number</th>
                            <th className="text-left py-2 px-4">Listing Done</th>

                            <th className="text-left py-2 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPartners.reverse().map((partner) => (
                            <tr key={partner.partnerId}>
                                <td className="py-2 px-4">{partner.PartnerName}</td>
                                <td className="py-2 px-4">{partner.PartnerEmail}</td>
                                <td className="py-2 px-4">{partner.PartnerContactDetails}</td>
                                <td className="py-2 px-4">{partner.PartnerDoneListing}</td>


                                <td className="py-2 px-4">
                                    <Link
                                        to={`/partner-details?partnerId=${partner._id}`}
                                        className="text-blue-500 hover:underline mr-4"
                                    >
                                        View List Shops
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(partner._id)}
                                        className="text-red-500 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex justify-between items-center">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded ${currentPage === 1 ? 'cursor-not-allowed' : ''
                        }`}
                >
                    Previous
                </button>
                <div>
                    Page {currentPage} of {Math.ceil(partners.length / partnersPerPage)}
                </div>
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={indexOfLastPartner >= partners.length}
                    className={`bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded ${indexOfLastPartner >= partners.length ? 'cursor-not-allowed' : ''
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AllPartners;
