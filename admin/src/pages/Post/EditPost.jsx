import React, { useState, useEffect, useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Plus, Trash2, Image, Save, Loader2,
  DollarSign, Percent, Package
} from 'lucide-react';

const EditPost = () => {
  const location = new URLSearchParams(window.location.search);
  const id = location.get('id');
  const shopId = location.get('shopId');

  const editor = useRef(null);
  const config = useMemo(() => ({
    readonly: false,
  }), []);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [listing, setListing] = useState({
    Title: '',
    Details: '',
    HtmlContent: '',
    Items: [],
    Pictures: []
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(
          `https://api.naideal.com/api/v1/admin-get-post?id=${shopId}`
        );
        setListing(response.data.data[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching listing:', error);
        toast.error('Failed to load listing data');
        setLoading(false);
      }
    };
    console.log(listing)

    fetchListing();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setListing(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHtmlContentChange = (content) => {
    setListing(prev => ({
      ...prev,
      HtmlContent: content
    }));
  };

  const handleItemChange = (index, field, value) => {
    setListing(prev => ({
      ...prev,
      Items: prev.Items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleAddItem = () => {
    setListing(prev => ({
      ...prev,
      Items: [...prev.Items, {
        itemName: '',
        MrpPrice: '',
        Discount: '',
        dishImages: []
      }]
    }));
  };

  const handleDeleteItem = (index) => {
    setListing(prev => ({
      ...prev,
      Items: prev.Items.filter((_, i) => i !== index)
    }));
  };

  const handleItemImageChange = async (index, files) => {
    const newItems = [...listing.Items];
    newItems[index] = {
      ...newItems[index],
      dishImages: Array.from(files)
    };
    setListing(prev => ({ ...prev, Items: newItems }));
  };

  const handlePicturesChange = (files) => {
    setListing(prev => ({
      ...prev,
      Pictures: Array.from(files)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('Title', listing.Title);
      formData.append('Details', listing.Details);
      //   formData.append('HtmlContent', listing.HtmlContent);
      formData.append('ItemsUpdated', JSON.stringify(listing.Items));
      listing.Items.forEach((item, index) => {


        if (item.dishImages) {
          Array.from(item.dishImages).forEach((file, imageIndex) => {
            formData.append(`dishImages[${imageIndex}]`, file);
          });
        }
      });

      if (listing.Pictures?.[0]) {
        formData.append('MainImage', listing.Pictures[0]);
      }

      await axios.put(
        `https://api.naideal.com/api/v1/admin-Shop-Edit-post-bolt?id=${shopId}&ListingId=${id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      toast.success('Listing updated successfully');
    } catch (error) {
      console.error('Error updating listing:', error);
      toast.error('Failed to update listing');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Listing</h1>
            <a
              href="/All-Post?All=true"
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            >
              Back
            </a>
          </div>


          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="Title"
                  value={listing.Title}
                  onChange={handleInputChange}
                  className="mt-1 block py-2 px-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Details</label>
                <textarea
                  name="Details"
                  value={listing.Details}
                  onChange={handleInputChange}
                  rows="4"
                  className="mt-1 block py-2 px-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Editor</label>

                <JoditEditor
                  ref={editor}
                  value={listing.HtmlContent}
                  config={config}
                  tabIndex={1}
                  onBlur={newContent => setListing(prev => ({ ...prev, HtmlContent: newContent }))}
                  onChange={(content) => setListing(prev => ({ ...prev, HtmlContent: content }))}
                />
              </div>
            </div>

            {/* Items Section */}
            <div className="space-y-6">
              {/* <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Items</h2>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Item
                </button>
              </div> */}

              <div className="space-y-6">
                {listing.Items.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6 relative">
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(index)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          <Package className="w-4 h-4 inline mr-2" />
                          Item Name
                        </label>
                        <input
                          type="text"
                          value={item.itemName}
                          onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                          className="mt-1 block py-2 px-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            {/* <DollarSign className="w-4 h-4 inline mr-2" /> */}
                            Price
                          </label>
                          <input
                            type="number"
                            value={item.MrpPrice}
                            onChange={(e) => handleItemChange(index, 'MrpPrice', e.target.value)}
                            className="mt-1 block py-2 px-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            <Percent className="w-4 h-4 inline mr-2" />
                            Discount
                          </label>
                          <input
                            type="number"
                            value={item.Discount}
                            onChange={(e) => handleItemChange(index, 'Discount', e.target.value)}
                            className="mt-1 block py-2 px-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700">
                        <Image className="w-4 h-4 inline mr-2" />
                        Item Images
                      </label>
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleItemImageChange(index, e.target.files)}
                        className="mt-1 block py-2 px-2 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        accept="image/*"
                      />

                      {item.dishImages?.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          <p>Old Image</p>
                          {item.dishImages.map((image, imgIndex) => (
                            <div key={imgIndex} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={image.ImageUrl || URL.createObjectURL(image)}
                                alt={`Item ${index} image ${imgIndex}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={saving}
                className={`inline-flex items-center px-6 py-3 rounded-lg text-white ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;