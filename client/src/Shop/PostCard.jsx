import React from 'react';
import { Trash2, Edit } from 'lucide-react';

const PostCard = ({ post, onDelete, onEdit }) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
            <div className="relative">
                <img
                    src={post.Pictures[0]?.ImageUrl || `https://source.unsplash.com/800x600/?store,retail&random=${post._id}`}
                    alt={post.Title}
                    className="w-full h-48 object-cover"
                />
                <div className="absolute top-0 right-0 m-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {new Date(post.createdAt).toLocaleDateString()}
                </div>
            </div>

            <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">{post.Title}</h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.Details}</p>
                <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${post?.isApprovedByAdmin
                            ? 'bg-green-100 text-green-600 border border-green-500'
                            : 'bg-yellow-100 text-yellow-600 border border-yellow-500'
                        }`}
                >
                    {post?.isApprovedByAdmin ? 'Approved' : 'Approval Pending'}
                </span>

                <div className="space-y-2 mb-4">
                    {post.Items.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                        >
                            <span className="text-gray-700 font-medium">{item.itemName}</span>
                            <span className="text-blue-600 font-semibold">{item.Discount}% OFF</span>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(post._id)}
                        className="flex-1 flex items-center justify-center gap-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                        <Edit className="w-4 h-4" />
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(post._id)}
                        className="flex-1 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostCard;