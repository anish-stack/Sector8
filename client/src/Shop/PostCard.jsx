import React, { useState } from 'react';
import { Trash2, Edit } from 'lucide-react';
import ChangeImages from './ChangeImages';

const PostCard = ({ post, onDelete, onEdit }) => {
    const [changeImageModel, setChangeImageModel] = useState(false);
    const [selectedPictures, setSelectedPictures] = useState([]);

    // Handle the image change button click
    const handleChangeImages = () => {
        setSelectedPictures(post.Pictures);
        setChangeImageModel(true);
    };
    return (
        <>
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
                    <button onClick={handleChangeImages} className="absolute bottom-0 right-0 cursor-pointer">
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            Change Images
                        </span>
                    </button>
                </div>

                <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">{post.Title}</h2>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.Details}</p>
                    <p className="text-sm font-semibold text-gray-800 mb-2 line-clamp-1">
                        {post.tags.length > 0 ? (
                            post.tags.map((item, index) => (
                                <span
                                    key={index}
                                    className="inline-block bg-blue-500 text-white text-sm py-1 px-3 rounded-full mr-2 mb-2"
                                >
                                    {item}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-500">No Tags Available</span>
                        )}
                    </p>

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

            {changeImageModel && (
                <ChangeImages onClose={() => setChangeImageModel(false)} data={selectedPictures} />
            )}
        </>
    );
};

export default PostCard;