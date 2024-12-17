import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [paymentsPerPage] = useState(5); // Number of payments to display per page

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin-all-payments`);
                setPayments(response.data.payments);
            } catch (error) {
                console.error('Error fetching payments:', error);
            }
        };

        fetchPayments();
    }, []);

    // Pagination logic
    const indexOfLastPayment = currentPage * paymentsPerPage;
    const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
    const currentPayments = payments.slice(indexOfFirstPayment, indexOfLastPayment);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-4">Payments</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Order ID</th>
                            <th className="border border-gray-300 px-4 py-2">Payment ID</th>
                            <th className="border border-gray-300 px-4 py-2">Amount (INR)</th>
                            <th className="border border-gray-300 px-4 py-2">Status</th>
                            <th className="border border-gray-300 px-4 py-2">Receipt</th>
                            <th className="border border-gray-300 px-4 py-2">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPayments.reverse().map((payment) => {
                            // Check if orderDetails is defined and has the required properties
                            const orderDetails = payment.orderDetails || {};

                            return (
                                <tr key={payment._id}>
                                    <td className="border border-gray-300 px-4 py-2">{orderDetails.id || 'N/A'}</td>
                                    <td className="border border-gray-300 px-4 py-2">{payment.razorpay_payment_id}</td>
                                    <td className="border border-gray-300 px-4 py-2">{orderDetails.amount / 100 || 'N/A'}</td>
                                    <td className="border border-gray-300 px-4 py-2">{orderDetails.status || 'N/A'}</td>
                                    <td className="border border-gray-300 px-4 py-2">{orderDetails.receipt || 'N/A'}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {orderDetails.created_at
                                            ? new Date(orderDetails.created_at * 1000).toLocaleString()
                                            : 'N/A'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <nav className="block">
                    <ul className="flex pl-0 rounded list-none flex-wrap">
                        {payments.length > paymentsPerPage && (
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
                                {Array.from({ length: Math.ceil(payments.length / paymentsPerPage) }, (_, index) => (
                                    <li key={index}>
                                        <button
                                            onClick={() => paginate(index + 1)}
                                            className={`relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-gray-800 mr-1 hover:bg-gray-200 ${currentPage === index + 1 ? 'bg-gray-300' : ''}`}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                                <li>
                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === Math.ceil(payments.length / paymentsPerPage)}
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
        </div>
    );
};

export default Payments;
