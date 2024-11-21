import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const UnApprovedPost = () => {
    const [unApprovedPosts, setUnApprovedPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 4; // Display 4 posts per page
    const [modalPost, setModalPost] = useState(null); // State for modal post

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-Listing-un`);

                // Logging the original data
                console.log('Original data:', res.data.unApprovedPosts                );
                    const data = res.data.unApprovedPosts
                    setUnApprovedPosts(data)
      
             
            } catch (error) {
                console.error('Error fetching unapproved posts:', error);
            }
        };
    
        fetchPosts();
    }, []);
    
    // Pagination logic
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = unApprovedPosts.slice(indexOfFirstPost, indexOfLastPost);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    // Handle approval
    const handleApprove = async (postId) => {
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/admin-approve-post/${postId}`);
            toast.success('Post Approved Successful')
            setUnApprovedPosts(unApprovedPosts.filter(post => post._id !== postId));
        } catch (error) {
            console.error('Error approving post:', error);
        }
    };

    // Handle deletion
    const handleDelete = async (postId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/delete-listing/${postId}`);
            setUnApprovedPosts(unApprovedPosts.filter(post => post._id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    // Format date and time
    const formatDateTime = (createdAt) => {
        const date = new Date(createdAt);
        const options = { hour: 'numeric', minute: 'numeric' };
        return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], options);
    };

    // Open modal with post details
    const openModal = (post) => {
        setModalPost(post);
    };

    // Close modal
    const closeModal = () => {
        setModalPost(null);
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold mb-4">Unapproved Posts</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {currentPosts.length === 0 ? (
                    <p>No Post For Approval</p>
                ) : (
                    currentPosts.map(post => (
                        <div key={post._id} className="border border-gray-300 p-4">
                            <h2 className="text-lg font-bold mb-2">{post.Title}</h2>
                            <p className="text-gray-600 mb-2">{post.Details}</p>
                            <div className="flex flex-wrap mb-2">
                                {/* Display only the first picture */}
                                <img
                                    src={post.Pictures.length > 0 ? post.Pictures[0].ImageUrl : ''}
                                    alt="Post Image"
                                    className="w-24 h-24 object-cover mr-2 mb-2 cursor-pointer"
                                />
                            </div>
                            <ul className="mb-2">
                                {post.Items.map(item => (
                                    <li key={item._id}>
                                        <strong>{item.itemName}</strong> - MRP: {item.MrpPrice}, Discount: {item.Discount}%
                                    </li>
                                ))}
                            </ul>
                            <p className={`text-sm font-semibold ${post.isApprovedByAdmin ? 'text-green-600' : 'text-red-600'}`}>
                                {post.isApprovedByAdmin ? 'Approved' : 'Not Approved'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {formatDateTime(post.createdAt)}
                            </p>
                            <div className="mt-2 grid grid-cols-2 gap-2">
                         
                                <button onClick={() => handleApprove(post._id)} className="text-sm bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded mr-2">
                                    Approve
                                </button>
                                <button onClick={() => handleDelete(post._id)} className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {/* Pagination */}
            <div className="flex justify-center mt-4">
                {Array.from({ length: Math.ceil(unApprovedPosts.length / postsPerPage) }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => paginate(i + 1)}
                        className={`px-3 py-1 mx-1 border ${i + 1 === currentPage ? 'bg-indigo-600 text-white' : 'bg-white text-black'}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {/* Modal */}
       
        </div>
    );
};

export default UnApprovedPost;
