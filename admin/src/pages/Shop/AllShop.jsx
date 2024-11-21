import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Modal from './Model'; // Assuming Modal component is in the same directory

const AllShop = () => {
    const [shops, setShops] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState({ name: '', package: 'All' });
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState({});
    const shopsPerPage = 7;

    // Fetch all shops
    const fetchShops = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/all-shops`);
            setShops(res.data.reverse());
        } catch (error) {
            console.error('Error fetching shops:', error);
        }
    };

    useEffect(() => {
        fetchShops();
    }, []);

    // Handle opening modal for editing
    const handleEdit = async (id) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/all-shops`);
            const filterData = res.data.find((item)=>item._id === id)
            setEditData(filterData); // Assuming backend sends shop details
            setModalOpen(true);
        } catch (error) {
            console.error('Error fetching shop details:', error);
        }
    };

    // Handle updating shop details
    const handleUpdate = async () => {
        try {
            const { _id, ...updates } = editData;
            const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/admin-update-shop/${_id}`, updates);
            toast.success('Shop details updated successfully');
            setModalOpen(false);
            fetchShops(); // Refresh shops list after update
        } catch (error) {
            console.error('Error updating shop details:', error);
        }
    };

    // Handle deleting a shop
    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/delete-shop/${id}`);
            toast.success('Shop deleted successfully');
            fetchShops(); // Refresh shops list after deletion
        } catch (error) {
            console.error('Error deleting shop:', error);
        }
    };

    // Handle opening shop profile in a new tab
    const handleView = (id, Name) => {
        const url = `${process.env.REACT_APP_FRONTEND_URL}/View-More-Offers/Shop-profile/${id}/${Name}`;
        window.open(url, '_blank'); // Opens the URL in a new tab
    };

    // Handle filtering shops
    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    // Apply filters and pagination
    const filteredShops = shops.filter((shop) => {
        return (
            (filter.name === '' || shop.ShopName.toLowerCase().includes(filter.name.toLowerCase())) &&
            (filter.package === 'All' || shop.ListingPlan === filter.package)
        );
    });

    const indexOfLastShop = currentPage * shopsPerPage;
    const indexOfFirstShop = indexOfLastShop - shopsPerPage;
    const currentShops = filteredShops.slice(indexOfFirstShop, indexOfLastShop);

    // Pagination function
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='border-2 p-4'>
            <h1 className="text-xl font-bold mb-4">All Shops</h1>

            {/* Filter and search input */}
            <div className="mb-4 flex justify-between">
                <input
                    type="text"
                    name="name"
                    value={filter.name}
                    onChange={handleFilterChange}
                    placeholder="Filter by shop name"
                    className="border w-2/3 px-2 py-1 mr-4"
                />
                <select
                    name="package"
                    value={filter.package}
                    onChange={handleFilterChange}
                    className="border w-1/3 px-2 py-1"
                >
                    <option value="All">All Packages</option>
                    <option value="Free">Free</option>
                    <option value="Gold">Gold</option>
                    <option value="Silver">Silver</option>
                </select>
            </div>

            {/* Table to display shops */}
            <table className="w-full border-collapse border border-gray-400 text-sm overflow-x-auto block">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Shop Name</th>
                        <th className="border border-gray-300 px-4 py-2">Location</th>
                        <th className="border border-gray-300 px-4 py-2">Contact</th>
                        <th className="border border-gray-300 px-4 py-2">Email</th>
                        <th className="border border-gray-300 px-4 py-2">Package</th>
                        <th className="border border-gray-300 px-4 py-2">Post</th>
                        <th className="border border-gray-300 px-4 py-2">PartnerId</th>
                        <th className="border border-gray-300 px-4 py-2">ShopCategory</th>
                        <th className="border border-gray-300 px-4 py-2">UserName</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentShops.reverse().map((shop) => (
                        <tr key={shop._id}>
                            <td className="border border-gray-300 px-4 py-2 whitespace-nowrap">{shop.ShopName}</td>
                            <td className="border border-gray-300 px-4 truncate whitespace-nowrap py-2">{shop.ShopAddress.ShopAddressStreet}</td>
                            <td className="border border-gray-300 px-4 py-2">{shop.ContactNumber}</td>
                            <td className="border border-gray-300 px-4 py-2">{shop.Email}</td>
                            <td className="border border-gray-300 px-4 py-2">{shop.ListingPlan}</td>
                            <td className="border border-gray-300 px-4 py-2">{shop.HowMuchOfferPost || 0}</td>
                            <td className="border border-gray-300 px-4 py-2">{shop.PartnerId}</td>
                            <td className="border border-gray-300 px-4 py-2">{shop.ShopCategory}</td>
                            <td className="border border-gray-300 px-4 py-2">{shop.UserName}</td>

                            {/* Actions buttons */}
                            <td className="whitespace-nowrap px-4 py-2 flex gap-1 justify-around">
                                <button onClick={() => handleView(shop._id, shop.ShopName)} className="bg-blue-500 whitespace-nowrap text-white px-2 py-1 rounded">View</button>
                                <button onClick={() => handleEdit(shop._id)} className="bg-yellow-500 whitespace-nowrap text-white px-2 py-1 rounded">Edit</button>
                                <button onClick={() => handleDelete(shop._id)} className="bg-red-500 whitespace-nowrap text-white px-2 py-1 rounded">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                {Array.from({ length: Math.ceil(filteredShops.length / shopsPerPage) }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => paginate(i + 1)}
                        className={`px-3 py-1 mx-1 border ${i + 1 === currentPage ? 'bg-indigo-600 text-white' : 'bg-white text-black'}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {/* Modal for editing shop details */}
            {modalOpen && (
                <Modal
                    onClose={() => setModalOpen(false)}
                    editData={editData}
                    setEditData={setEditData}
                    handleUpdate={handleUpdate}
                />
            )}
        </div>
    );
};

export default AllShop;
