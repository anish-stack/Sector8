import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import offer from './offer.png';

const PostByCategories = () => {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5); // Number of posts per page
    const query = new URLSearchParams(window.location.search);
    const BackendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

    const categoryName = query.get('Name');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await axios.get(`${BackendUrl}/Post-by-categories/${categoryName}`);
                setPosts(data);
                console.log(data); // Assuming the API returns an array of posts
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, [BackendUrl, categoryName]); // Include BackendUrl and categoryName as dependencies

    // Pagination logic
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Placeholder image URL
    const placeholderImageUrl = offer;

    return (
        <div>
            <div className="relative h-48 shadow-sm bg-auto bg-no-repeat bg-center mb-8" style={{ backgroundImage: `url(${placeholderImageUrl})` }}>
                <div className="absolute z-20 top-[75%] left-1/2 transform -translate-x-1/2 text-black text-base md:text-3xl font-bold text-center w-full">
                    Posts For Category: {categoryName}
                </div>
            </div>

            {/* Display posts */}
            <div className="max-w-screen-xl py-2 mx-auto px-4">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {currentPosts.length > 0 ? (
                        currentPosts.map((post) => (
                            <div key={post._id} className="p-4 rounded-lg glass bg-white">
                                <div className="relative overflow-hidden aspect-w-1 aspect-h-1 rounded-lg">
                                    <img
                                        src={post.Items[0]?.dishImages[0]?.ImageUrl || placeholderImageUrl}
                                        alt="Item Image"
                                        className="object-cover w-full md:h-64 h-full rounded-lg"
                                    />
                                    <div className="absolute top-2 left-2 bg-gradient-to-br from-green-400 to-green-500 text-white py-1 px-5 rounded-full text-left text-sm font-semibold">
                                        <i class="fa-solid fa-circle-check"></i>  Verified
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-lg truncate font-semibold mb-2 text-gray-800">{post.Title}</h3>
                                    <p className="mb-4 text-gray-600 line-clamp-2">{post.Details}</p>
                                    <div className="flex w-full items-center justify-center">
                                        <Link
                                            to={`/Single-Listing/${post._id}/${post.Title.replace(/\s+/g, '-')}`}
                                            className="bg-gradient-to-br text-center w-full from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600"
                                        >
                                            View
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600">No offers found in this category.</p>
                    )}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-8">
                    {Array.from({ length: Math.ceil(posts.length / postsPerPage) }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={`mx-2 px-4 py-2 rounded-lg ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PostByCategories;
