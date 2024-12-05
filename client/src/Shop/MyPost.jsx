import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import PostCard from './PostCard';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';

const MyPost = ({ fetchMyShopDetails }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('ShopToken');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const BackendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  const fetchMyPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BackendUrl}/My-Shop-Post`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    //   console.log(response.data.data)
      if(response.data.data.length === 0){
        setPosts([])
      }else{
        setPosts(response.data.data);

      }
    } catch (error) {
      if(error?.response?.status === 404){
        setPosts([])
      }else{

        setError('Failed to fetch posts. Please try again later.');
        console.error('Error fetching posts:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPost();
  }, []);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await axios.delete(`${BackendUrl}/delete-listing/${id}`);
        await fetchMyPost();
        await fetchMyShopDetails();
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Your post has been deleted.',
          icon: 'success'
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to delete the post. Please try again.',
        icon: 'error'
      });
      console.error('Delete error:', error);
    }
  };

  const handleEdit = (postId) => {
    navigate(`/edit-post?id=${postId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchMyPost}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div className="space-y-6">
      {posts.length === 0 ? (
     <div className="flex flex-col items-center justify-center h-full py-8 bg-gray-50">
     <img 
       src="https://i.ibb.co/cDb0b2R/social-media.png" 
       alt="No posts" 
       className="w-32 h-32 mb-4 object-contain"
     />
     <p className="text-gray-600 text-lg font-medium">
       No posts found. Create your first post!
     </p>
   </div>
   
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg ${
                    currentPage === i + 1
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyPost;