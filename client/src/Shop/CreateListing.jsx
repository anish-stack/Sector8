import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { X, Plus, Loader } from 'lucide-react';
import ImageUpload from './forms/ImageUpload';
import ItemForm from './forms/ItemForm';

import JoditEditor from 'jodit-react';
const CreateListing = ({ isOpen, onClose }) => {
  const [btnLoading, setBtnLoading] = useState(false);
  const [formData, setFormData] = useState({
    Title: '',
    Details: '',
    tags: "",
    Items: [{ itemName: '', Discount: '', dishImages: [], MrpPrice: '' }],
    Pictures: [],
    HtmlContent: ''
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const editor = useRef(null);
  const config = useMemo(() => ({
    readonly: false,
  }), []);


  useEffect(() => {
    const isFormIncomplete = !formData.Title || !formData.Details ||
      formData.Items.some(item => !item.itemName || !item.Discount);
    const isImageLimitExceeded = formData.Pictures.length > 5;
    setIsSubmitDisabled(isFormIncomplete || isImageLimitExceeded);
  }, [formData]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tags') {
      const tags = value.split(',').map(tag => tag.trim());
      setFormData({ ...formData, tags: tags });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleItemChange = (index, e) => {
    const { name, value, files } = e.target;
    const items = [...formData.Items];
    if (name === 'dishImages') {
      items[index][name] = files ? Array.from(files) : [];
    } else {
      items[index][name] = value;
    }
    setFormData(prev => ({ ...prev, Items: items }));
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (formData.Pictures.length + files.length > 5) {
      toast.error('You can only upload a maximum of 5 images.');
      return;
    }
    setFormData(prev => ({ ...prev, Pictures: [...prev.Pictures, ...files] }));
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const handleImageRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      Pictures: prev.Pictures.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData.HtmlContent)
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'Items') {
          formData.Items.forEach((item, index) => {
            data.append(`Items[${index}].itemName`, item.itemName);
            data.append(`Items[${index}].Discount`, item.Discount);
            data.append(`Items[${index}].MrpPrice`, item.MrpPrice);
            item.dishImages.forEach((file, fileIndex) => {
              data.append(`Items[${index}].dishImages[${fileIndex}]`, file);
            });
          });
        } else if (key === 'Pictures') {
          formData.Pictures.forEach(file => {
            data.append('images', file);
          });
        } else if (key === 'HtmlContent') {
          console.log('Appending HtmlContent:', formData[key]); // Debugging log
          data.append(key, formData[key]); // Ensure it's included as plain text
        } else if (key === 'tags') {
          // Convert tags to a comma-separated string if your backend needs it that way
          data.append('tags', formData.tags.join(', '));
        } else {
          data.append(key, formData[key]);
        }
      });


      setBtnLoading(true);
      const token = localStorage.getItem('ShopToken');
      const BackendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

      const response = await axios.post(`${BackendUrl}/Create-Post`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(response.data.msg);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || 'An error occurred');
    } finally {
      setBtnLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto z-50">
      {/* <Toaster position="top-right" /> */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl m-4 max-h-[90vh] overflow-y-auto">
        {btnLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}

        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center z-10">
          <h1 className="text-2xl font-bold text-gray-800">Create New Post</h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="Title"
                value={formData.Title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter post title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Details <span className="text-red-500">*</span>
              </label>
              <textarea
                name="Details"
                value={formData.Details}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Enter post details"
                required
              />
            </div>
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rich Content
              </label>

              <JoditEditor
                ref={editor}
                value={formData.HtmlContent}
                config={config}
                tabIndex={1}
                onBlur={newContent => setFormData(prev => ({ ...prev, HtmlContent: newContent }))}
                onChange={(content) => setFormData(prev => ({ ...prev, HtmlContent: content }))}
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Post Images <span className="text-red-500">*</span>
              </label>
              <ImageUpload
                images={formData.Pictures}
                previews={imagePreviews}
                onImageChange={handleImageChange}
                onImageRemove={handleImageRemove}
                maxImages={5}
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Items <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex items-center gap-2 text-blue-500 hover:text-blue-400"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>

              {formData.Items.map((item, index) => (
                <ItemForm
                  key={index}
                  item={item}
                  index={index}
                  onChange={handleItemChange}
                  onRemove={handleRemoveItem}
                  canRemove={index > 0}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitDisabled || btnLoading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${isSubmitDisabled || btnLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
              }`}
          >
            {btnLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="w-5 h-5 animate-spin" />
                Creating Post...
              </span>
            ) : (
              'Post Offer'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;