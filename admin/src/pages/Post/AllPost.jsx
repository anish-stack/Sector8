import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash, Edit2, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useSearchParams } from 'react-router-dom'
const AllPost = () => {
    const search = new URLSearchParams(window.location.search)
    const id = search.get('id');
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [showDetails, setShowDetails] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            let res
            try {

              if(id){
                res = await axios.get(
                    `http://localhost:7485/api/v1/admin-get-post?id=${id || ''}`
                );
              }else{
                res = await axios.get(
                    `http://localhost:7485/api/v1/admin-get-post?All=true`
                );
              }
                if (res.data.success) {
                    setPosts(res.data.data);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:7485/api/v1/delete-listing/${selectedPostId}`);
            setPosts(posts.filter((post) => post._id !== selectedPostId));
            setShowModal(false);
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    // Pagination
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(posts.length / postsPerPage);

    const ImageStack = ({ images }) => (
        <div className="flex -space-x-3">
            {images.slice(0, 4).map((image, index) => (
                <div
                    key={image._id}
                    className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden"
                    style={{ zIndex: images.length - index }}
                >
                    <img
                        src={image.ImageUrl}
                        alt={`Post ${index + 1}`}
                        className="w-full h-full object-cover"
                    />
                    {index === 3 && images.length > 4 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xs">
                            +{images.length - 4}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

    const DeleteModal = () => (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-[90%]">
                <h2 className="text-lg font-bold text-center mb-4">Confirm Deletion</h2>
                <p className="text-center text-gray-600 mb-6">
                    Are you sure you want to delete this post?
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );

    const DetailsModal = ({ post }) => (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{post.Title}</h2>
                    <button
                        onClick={() => setShowDetails(null)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <Eye className="w-6 h-6" />
                    </button>
                </div>
                <p className="text-gray-600 mb-4">{post.Details}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {post.Pictures.map((pic) => (
                        <img
                            key={pic._id}
                            src={pic.ImageUrl}
                            alt="Post"
                            className="w-full h-32 object-cover rounded-lg"
                        />
                    ))}
                </div>
                <div className="mt-4">
                    <h3 className="font-semibold mb-2">Items:</h3>
                    {post.Items.map((item) => (
                        <div key={item._id} className="bg-gray-50 p-3 rounded-md mb-2">
                            <p><span className="font-medium">Name:</span> {item.itemName}</p>
                            <p><span className="font-medium">Price:</span> ₹{item.MrpPrice}</p>
                            <p><span className="font-medium">Discount:</span> {item.Discount}%</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <div className="overflow-x-auto">
            <div className="min-w-full min-h-[80vh] bg-white rounded-lg ">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Images</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {currentPosts.map((post) => (
                            <tr key={post._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm w-32 truncate  font-medium text-gray-900">{post.Title}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <ImageStack images={post.Pictures} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{post.Items.length} items</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setShowDetails(post)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedPostId(post._id);
                                                setShowModal(true);
                                            }}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => window.location.href = `/edit-post?id=${post._id}&shopId=${post?.ShopId}`}
                                            className="text-green-600 hover:text-green-800"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 mt-4 rounded-lg">
                <div className="flex justify-between items-center w-full">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {showModal && <DeleteModal />}
            {showDetails && <DetailsModal post={showDetails} />}
        </div>
    );
};

export default AllPost;