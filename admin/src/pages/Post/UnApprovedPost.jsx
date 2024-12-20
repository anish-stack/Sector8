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
                setUnApprovedPosts(res.data.unApprovedPosts || []);
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

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleApprove = async (postId) => {
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/admin-approve-post/${postId}`);
            toast.success('Post approved successfully!');
            setUnApprovedPosts(unApprovedPosts.filter((post) => post._id !== postId));
        } catch (error) {
            console.error('Error approving post:', error);
        }
    };

    const handleDelete = async (postId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/delete-listing/${postId}`);
            toast.success('Post deleted successfully!');
            setUnApprovedPosts(unApprovedPosts.filter((post) => post._id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const formatDateTime = (createdAt) => {
        const date = new Date(createdAt);
        return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    const openModal = (post) => {
        setModalPost(post);
    };

    const closeModal = () => {
        setModalPost(null);
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-4">Unapproved Posts</h1>
            {currentPosts.length === 0 ? (
                <p>No posts for approval</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2">Title</th>
                                <th className="border border-gray-300 px-4 py-2">Details</th>
                                <th className="border border-gray-300 px-4 py-2">Date</th>
                                <th className="border border-gray-300 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPosts.map((post) => (
                                <tr key={post._id}>
                                    <td className="border border-gray-300  px-4 py-2">{post.Title}</td>
                                    <td className="border border-gray-300  px-4 py-2">{post.Details.slice(0, 20)}...</td>
                                    <td className="border border-gray-300 px-4 py-2">{formatDateTime(post.createdAt)}</td>
                                    <td className="border flex  px-4 py-2">
                                        <button
                                            onClick={() => openModal(post)}
                                            className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
                                        >
                                            View
                                        </button>
                                        {/* <button
                                            onClick={() => handleApprove(post._id)}
                                            className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2"
                                        >
                                            Approve
                                        </button> */}
                                        <button
                                            onClick={() => handleDelete(post._id)}
                                            className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

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
            {modalPost && (
                <div className="fixed z-[999] inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg h-[500px]  p-4 overflow-auto w-3/4">
                        <h2 className="text-lg font-bold mb-4">{modalPost.Title}</h2>
                        <p className="mb-4">{modalPost.Details}</p>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {modalPost.Pictures.map((pic, index) => (
                                <img
                                    key={index}
                                    src={pic.ImageUrl}
                                    alt={`Post Image ${index + 1}`}
                                    className="w-full h-32 object-cover rounded"
                                />
                            ))}
                        </div>
                        <ul>
                            {modalPost.Items.map((item) => (
                                <li key={item._id} className="mb-2">
                                    <strong>{item.itemName}</strong> - MRP: {item.MrpPrice}, Discount: {item.Discount}%
                                </li>
                            ))}
                        </ul>
                        <h1 className="text-2xl font-bold mb-4 text-gray-800">HTML Content</h1>
                        <div
                            className="modal-content text-sm text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: modalPost?.HtmlContent }}
                        />




                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => handleApprove(modalPost._id)}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mr-2"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => handleDelete(modalPost._id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                            >
                                Delete
                            </button>
                            <button
                                onClick={closeModal}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded ml-2"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UnApprovedPost;
