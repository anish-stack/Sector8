import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyPost = ({fetchMyShopDetails}) => {
    const token = localStorage.getItem('ShopToken');
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(3);

    useEffect(() => {
        fetchMyPost();
    }, []);

    const BackendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

    const fetchMyPost = async () => {
        try {
            const response = await axios.get(`${BackendUrl}/My-Shop-Post`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPosts(response.data.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    // Pagination
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    // Delete Post 
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.delete(`${BackendUrl}/delete-listing/${id}`);
                    console.log(res.data);
                    // toast.success("Test Deleted");
                    fetchMyPost();

                    Swal.fire({
                        title: "Deleted!",
                        text: "Your Post has been deleted.",
                        icon: "success"
                    });
                    fetchMyShopDetails()
                } catch (error) {
                    console.error(error);
                    // toast.error(error.response.data.message);
                }
            }
        });
    }

    const EditPost = async (postDetails)=>{
        try {
            
        } catch (error) {
            
        }
    }
    return (
        <div className="container mx-auto px-4 py-8">
            {/* <h1 className="text-3xl font-semibold mb-4">My Posts</h1> */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {currentPosts.map((post) => (
                    <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        {/* Displaying Title */}
                        <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
                                {post.Pictures.slice(0, 1).map((image, index) => (
                                    <div key={index} className="relative w-full h-48">
                                        <img src={image.ImageUrl} alt={`Image ${index}`} className="w-full h-full  object-cover rounded-md" />
                                    </div>
                                ))}
                            </div>
                            <h2 className="text-xl font-semibold mb-2">{post.Title}</h2>
                            <p className="text-gray-700 truncate mb-4">{post.Details}</p>
                            
                            {/* Displaying Images */}
                         

                            {/* Displaying Items */}
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-2">Items</h3>
                                <ul className="list-disc list-inside">
                                    {post.Items.map((item, index) => (
                                        <li key={index}>
                                            <span className="font-semibold">{item.itemName}:</span> {item.Discount}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex space-x-4 justify-between">
                                <button onClick={() => { handleDelete(post._id) }} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">Delete</button>
                                <Link to={`/edit-post?id=${post._id}`} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Update</Link>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
            {/* Pagination */}
            <div className="mt-8">
                <ul className="flex justify-center">
                    {Array.from({ length: Math.ceil(posts.length / postsPerPage) }, (_, i) => (
                        <li key={i}>
                            <button
                                onClick={() => paginate(i + 1)}
                                className={`px-4 py-2 mx-1 rounded-md ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            >
                                {i + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MyPost;
