import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Save, Trash2, ImageIcon } from 'lucide-react';
import { fetchPost, updatePost } from './api';
import imagesEdit from './edit.png'
import { validateForm } from './validateForm';
import JoditEditor from 'jodit-react';

const EditPost = () => {
  const query = new URLSearchParams(window.location.search);
  const id = query.get('id');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Title: '',
    Details: '',
    tags: [],
    HtmlContent: '',
    Items: []
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const editor = useRef(null);
  const config = useMemo(() => ({
    readonly: false,
  }), []);
  useEffect(() => {
    const loadPost = async () => {
      try {
        const post = await fetchPost(id);
        console.log(post.Items)
        if (post) {
          setFormData({
            Title: post.Title,
            Details: post.Details,
            HtmlContent: post.HtmlContent,
            tags: post.tags || [],
            Items: post.Items || []
          });
          setImages(post.Pictures || []);
        } else {
          setError('Post not found');
        }
      } catch (err) {
        console.log(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) loadPost();
  }, [id]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tags') {
      const tags = value.split(',').map(tag => tag.trim());
      setFormData({ ...formData, tags: tags });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = formData.Items.map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    );
    setFormData(prev => ({ ...prev, Items: updatedItems }));
    setFormErrors(prev => ({ ...prev, [`item${index}`]: '' }));
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      Items: [...prev.Items, { itemName: '', Discount: '', MrpPrice: '', dishImages: [] }]
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      Items: prev.Items.filter((_, i) => i !== index)
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    const formDataToSubmit = new FormData();

    // Append basic fields
    formDataToSubmit.append('Title', formData.Title);
    formDataToSubmit.append('Details', formData.Details);

    // Append items and their images
    formData.Items.forEach((item, index) => {
      formDataToSubmit.append(`Items[${index}].itemName`, item.itemName);
      formDataToSubmit.append(`Items[${index}].Discount`, item.Discount);
      formDataToSubmit.append(`Items[${index}].MrpPrice`, item.MrpPrice);

      if (item.public_id) {
        formDataToSubmit.append(`Items[${index}].public_id`, item.public_id);
      }

      item.dishImages.forEach((dishImage) => {
        if (dishImage.file) {
          formDataToSubmit.append('dishImage', dishImage.file);
        }
      });
    });

    // Check if tags exist and append them
    if (formData.tags && formData.tags.length > 0) {
      formDataToSubmit.append('tags', formData.tags.join(', '));
    }

    // Check if HtmlContent exists and append it
    if (formData.HtmlContent) {
      formDataToSubmit.append('HtmlContent', formData.HtmlContent);
    }

    try {
      const data = await updatePost(id, formDataToSubmit);
      // console.log(data); // Optional, remove if no longer needed
      navigate('/Shop-Dashboard');
    } catch (err) {
      // Handle error
      console.error(err.message);
      // setError(err.message); // If you have an error state
    } finally {
      setSubmitting(false);
    }
  };



  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Error: {error}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-screen mx-auto">
        <div className="bg-white rounded-xl  p-6">
          <div className="border-b text-center pb-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Your Post</h2>
            <p className="text-gray-600 mt-2 text-sm">Update your post information and media</p>
          </div>
          <div className='max-w-7xl mx-auto grid grid-cols-2'>
            <div className='w-full'>
              <img src={imagesEdit} className='object-cover  ' alt="" />
            </div>
            <div className='w-full'>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Section */}
                <div className="space-y-2">
                  <label className="block">
                    <span className="text-lg font-semibold text-gray-800">Post Title</span>
                    <input
                      type="text"
                      name="Title"
                      value={formData.Title}
                      onChange={handleInputChange}
                      className={`mt-1 w-full px-3 py-2 border rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.Title ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter post title"
                    />
                    {formErrors.Title && (
                      <p className="mt-1 text-red-500 text-sm">{formErrors.Title}</p>
                    )}
                  </label>

                  <label className="block">
                    <span className="text-lg font-semibold text-gray-800">Post Details</span>
                  </label>
                  <textarea
                    name="Details"
                    value={formData.Details}
                    onChange={handleInputChange}
                    rows={3}
                    className={`mt-1 w-full px-3 py-2 border rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.Details ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter post details"
                  />
                  {formErrors.Details && (
                    <p className="mt-1 text-red-500 text-sm">{formErrors.Details}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags <small>Write After , eg: #first,#second</small> </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}

                    placeholder="Enter tags separated by commas"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <JoditEditor
                  ref={editor}
                  value={formData.HtmlContent}
                  config={config}
                  tabIndex={1}
                  onBlur={newContent => setFormData(prev => ({ ...prev, HtmlContent: newContent }))}
                  onChange={(content) => setFormData(prev => ({ ...prev, HtmlContent: content }))}
                />
                {/* Items Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-800">Product Items</h3>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-sm hover:bg-blue-100"
                    >
                      <Plus className="w-4 h-4" />
                      Add Item
                    </button>
                  </div>

                  <p className="note">Image is not changeable</p>
                  {formData.Items.map((item, index) => (
                    item.dishImages &&
                    item.dishImages.map((image, imgIndex) => (
                      <img
                        key={`${index}-${imgIndex}`} 
                        src={image.ImageUrl || "https://via.placeholder.com/64"} 
                        className="object-cover w-32 h-32 rounded-sm"
                        alt={`Dish ${index}-${imgIndex}`}
                      />
                    ))
                  ))}
                  {formData.Items.map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-sm shadow-sm border border-gray-200 mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Item {index + 1}</h3>
                        <button
                          onClick={() => handleRemoveItem(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                          title="Remove Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Item Name */}
                        <div>
                          <label className="block">
                            <span className="text-sm font-semibold text-gray-800">Item Name</span>
                            <input
                              type="text"
                              name="itemName"
                              value={item.itemName}
                              onChange={(e) => handleItemChange(index, e)}
                              className={`mt-1 w-full px-3 py-2 border rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors[`item${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                              placeholder="Enter item name"
                            />
                          </label>
                        </div>

                        {/* Item Price */}
                        <div>
                          <label className="block">
                            <span className="text-sm font-semibold text-gray-800">Item Price</span>
                            <input
                              type="number"
                              name="MrpPrice"
                              value={item.MrpPrice}
                              onChange={(e) => handleItemChange(index, e)}
                              className={`mt-1 w-full px-3 py-2 border rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors[`item${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                              placeholder="Enter item price"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="mt-4">
                        {/* Discount Section */}
                        <label className="block">
                          <span className="text-sm font-semibold text-gray-800">Discount</span>
                          <input
                            type="number"
                            name="Discount"
                            value={item.Discount}
                            onChange={(e) => handleItemChange(index, e)}
                            className={`mt-1 w-full px-3 py-2 border rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors[`item${index}`] ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Enter discount"
                          />
                        </label>
                      </div>

                    </div>
                  ))}
                </div>

                {/* Submit Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {submitting ? 'Submitting...' : 'Save Post'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default EditPost;
