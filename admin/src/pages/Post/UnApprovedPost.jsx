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
            setModalPost(null);
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
        console.log(post)
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
                        <div className="p-6 bg-white relative rounded-lg shadow-md">
                            <button
                                onClick={closeModal}
                                className="bg-gray-500 absolute top-0 right-0 hover:bg-gray-600 text-white px-5 py-2 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-gray-400"
                            >
                                Close
                            </button>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                                {modalPost.Title}
                            </h2>
                            <p className="text-gray-600 mb-6">{modalPost.Details}</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {modalPost.Pictures.map((pic, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={pic.ImageUrl}
                                            alt={`Post Image ${index + 1}`}
                                            className="w-full h-40 object-cover rounded-lg border border-gray-200 group-hover:opacity-90 transition-opacity"
                                        />
                                        <div className="absolute inset-0 bg-gray-900 bg-opacity-0 group-hover:bg-opacity-40 rounded-lg transition-all flex items-center justify-center">
                                            <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                Image {index + 1}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <ul className="space-y-4">
                            {modalPost.Items.map((item) => (
                                <li
                                    key={item._id}
                                    className="flex items-center p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <img
                                        src={item?.dishImages[0]?.ImageUrl}
                                        alt={item.itemName}
                                        className="w-16 h-16 object-cover rounded-lg mr-4"
                                    />
                                    <div className="flex flex-col">
                                        <strong className="text-lg font-semibold text-gray-800">{item.itemName}</strong>
                                        <span className="text-sm text-gray-600">
                                            MRP: <span className="text-gray-800 font-medium">₹{item.MrpPrice}</span>, Discount:
                                            <span className="text-red-500 font-medium"> {item.Discount}%</span>
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="p-6 bg-white rounded-lg shadow-lg">
                            <h1 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-3">
                                HTML Content
                            </h1>
                            <div
                                className="modal-content text-base text-gray-700 leading-relaxed bg-gray-100 p-4 rounded-lg border border-gray-200"
                                dangerouslySetInnerHTML={{ __html: modalPost?.HtmlContent }}
                            />

                            <div className="flex justify-end mt-6 space-x-3">
                                <button
                                    onClick={() => handleApprove(modalPost._id)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-400"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleDelete(modalPost._id)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-400"
                                >
                                    Delete
                                </button>

                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default UnApprovedPost;
