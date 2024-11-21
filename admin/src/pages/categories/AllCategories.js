import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
const AllCategories = () => {
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [categoriesPerPage] = useState(18)
    const [openCreateModal, setOpenCreateModal] = useState(false)
    const [openEditModal, setOpenEditModal] = useState(false)
    const [createData, setCreateData] = useState({
        CategoriesName: '',
        file: null
    })
    const [updateData, setUpdateData] = useState({
        id: '',
        CategoriesName: '',
        file: null
    })

    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin-get-categories`)
            const data = response.data.data
            setData(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // Get current categories for pagination
    const indexOfLastCategory = currentPage * categoriesPerPage
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage
    const currentCategories = data.slice(indexOfFirstCategory, indexOfLastCategory)

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    const handleEdit = async (category) => {
        setUpdateData({
            id: category._id,
            CategoriesName: category.CategoriesName,
            file: null
        })
        setOpenEditModal(true)
    }

    const handleCreate = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('CategoriesName', createData.CategoriesName)
        if (createData.file) {
            formData.append('image', createData.file)
        }

        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin-create-categories`, formData)
            fetchData()
            setOpenCreateModal(false)
            toast.success('Category Created Successful')
        } catch (error) {
            console.log(error)
            toast.error('Error in Category Created ')
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('CategoriesName', updateData.CategoriesName)
        if (updateData.file) {
            formData.append('image', updateData.file)
        }

        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/admin-update-categories/${updateData.id}`, formData)
            fetchData()
            setOpenEditModal(false)
            toast.success('Category Updated Successful')
        } catch (error) {
            console.log(error)
        }
    }

    // Handle delete
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/admin-delete-categories/${id}`)
            toast.success('Category Deleted Successful')
            fetchData() // Refresh data after delete
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="p-4">
            <div className='head-div flex items-center justify-between'>
                <div className='heading-text text-center'>
                    <h2 className="text-2xl font-bold mb-4">All Categories</h2>
                </div>
                <div className='heading-btn'>
                    <button
                        className='py-2 px-3 bg-red-500 hover:bg-red-700 text-white font-bold rounded-3xl'
                        onClick={() => setOpenCreateModal(true)}
                    >
                        Add Categories +
                    </button>
                </div>
            </div>
            <hr className='border-1 border-black m-2' />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {currentCategories.map((category) => (
                    <div key={category._id} className="flex flex-col items-center justify-center space-y-2 border-2 w-36 h-36 shadow-sm rounded-full bg-white hover:shadow-md transition-shadow duration-300">
                        <img
                            src={category.CategoriesImage ? category.CategoriesImage.imageUrl : 'https://static.thenounproject.com/png/504708-200.png'}
                            alt={category.CategoriesName}
                            onError={(e) => e.target.src = 'https://static.thenounproject.com/png/504708-200.png'}
                            className="h-14 w-14 object-contain transition-transform duration-300 hover:scale-110 mx-auto"
                        />
                        <h3 className="text-sm font-semibold text-gray-800 mt-2 text-center">{category.CategoriesName}</h3>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleEdit(category)}
                                className="bg-blue-500 text-white px-2 py-1 rounded-lg text-xs hover:bg-blue-700 transition-colors duration-300"
                            >
                                <i class="fa-regular fa-pen-to-square"></i>
                            </button>
                            <button
                                onClick={() => handleDelete(category._id)}
                                className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs hover:bg-red-700 transition-colors duration-300"
                            >
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex justify-center space-x-2">
                {Array.from({ length: Math.ceil(data.length / categoriesPerPage) }, (_, index) => (
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
            {openCreateModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-bold mb-4">Add Category</h3>
                        <form onSubmit={handleCreate}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Category Name</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg"
                                    value={createData.CategoriesName}
                                    onChange={(e) => setCreateData({ ...createData, CategoriesName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Category Image</label>
                                <input
                                    type="file"
                                    className="w-full p-2 border rounded-lg"
                                    onChange={(e) => setCreateData({ ...createData, file: e.target.files[0] })}
                                />
                            </div>
                            <div className="flex justify-between">
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Create</button>
                                <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700" onClick={() => setOpenCreateModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {openEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-bold mb-4">Edit Category</h3>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Category Name</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg"
                                    value={updateData.CategoriesName}
                                    onChange={(e) => setUpdateData({ ...updateData, CategoriesName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Category Image</label>
                                <input
                                    type="file"
                                    className="w-full p-2 border rounded-lg"
                                    onChange={(e) => setUpdateData({ ...updateData, file: e.target.files[0] })}
                                />
                            </div>
                            <div className="flex justify-between">
                                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Update</button>
                                <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700" onClick={() => setOpenEditModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AllCategories
