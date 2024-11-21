import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast'

const AllCity = () => {
    const [cities, setCities] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [citiesPerPage] = useState(16);
    const [createData, setCreateData] = useState({ cityName: '' });
    const [updateData, setUpdateData] = useState({ cityName: '' });
    const [openCreateModel, setOpenCreateModel] = useState(false);
    const [openEditModel, setOpenEditModel] = useState(false);
    const [selectedCityId, setSelectedCityId] = useState(null);

    const fetchCities = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin-get-city`);
            console.log(response)
            setCities(response.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCities();
    }, []);

    const handleCreate = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin-create-city`, createData);
            setCreateData({ cityName: '' });
            fetchCities();
            setOpenCreateModel(false);
            toast.success('City Created Successful')

        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = async (id) => {
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin-update-city/${id}`, updateData);
            setUpdateData({ cityName: '' });
            fetchCities();
            setOpenEditModel(false);
            toast.success('City Edit Successful')

        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/admin-delete-city/${id}`);
            fetchCities();
            toast.success('City Deleted Successful')

        } catch (error) {
            console.log(error);
        }
    };

    // Pagination logic
    const indexOfLastCity = currentPage * citiesPerPage;
    const indexOfFirstCity = indexOfLastCity - citiesPerPage;
    const currentCities = cities.slice(indexOfFirstCity, indexOfLastCity);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="p-4">
            <div className='head-div flex items-center justify-between'>
                <div className='heading-text text-center'>
                    <h2 className="text-2xl font-bold mb-4">All Cities</h2>
                </div>
                <div className='heading-btn'>
                    <button onClick={() => setOpenCreateModel(true)} className='py-2 px-3 bg-red-500 hover:bg-red-700 text-white font-bold rounded-3xl'>Add City +</button>
                </div>
            </div>
            <hr className='border-1  border-black m-2' />
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {currentCities.map((city) => (
                    <div key={city._id} className="p-2 border-2 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow duration-300">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">{city.cityName}</h3>
                        <div className="flex justify-center space-x-2">
                            <button
                                onClick={() => { setUpdateData({ cityName: city.cityName }); setSelectedCityId(city._id); setOpenEditModel(true); }}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-xs hover:bg-blue-700 transition-colors duration-300"
                            >
                                <i class="fa-regular fa-pen-to-square"></i>
                            </button>
                            <button
                                onClick={() => handleDelete(city._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg text-xs hover:bg-red-700 transition-colors duration-300"
                            >
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex justify-center space-x-2">
                {Array.from({ length: Math.ceil(cities.length / citiesPerPage) }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`px-4 py-2 rounded-lg ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            {/* Create Modal */}
            {openCreateModel && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Create City</h2>
                        <input
                            type="text"
                            placeholder="City Name"
                            value={createData.cityName}
                            onChange={(e) => setCreateData({ cityName: e.target.value })}
                            className="border p-2 mb-4 w-full"
                        />
                        <button onClick={handleCreate} className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2">Create</button>
                        <button onClick={() => setOpenCreateModel(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Cancel</button>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {openEditModel && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Edit City</h2>
                        <input
                            type="text"
                            placeholder="City Name"
                            value={updateData.cityName}
                            onChange={(e) => setUpdateData({ cityName: e.target.value })}
                            className="border p-2 mb-4 w-full"
                        />
                        <button onClick={() => handleEdit(selectedCityId)} className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2">Update</button>
                        <button onClick={() => setOpenEditModel(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllCity;
