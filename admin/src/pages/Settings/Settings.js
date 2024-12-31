import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Settings = () => {
  const [settings, setSettings] = useState({
    logo: '',
    favicon: '',
    Metatitle: '',
    MetaDescript: '',
    contactNumber: '',
    adminId: '',
    isFestiveTopPopUpShow: false,
    isFestiveBottomPopUpShow: false,
    AboveTopGif: '',
    BottomGifLink: '',
    GstNo: '',
    officeAddress: '',
    links: [{ appName: '', appLink: '' }],
    FooterEmail: '',
    footerLogo: '',
    BioFooter: '',
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('http://localhost:7485/api/v1/get-setting');
        if (response.data.success) {
          setSettings(response.data.data);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching settings:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  // Handle links change
  const handleLinkChange = (index, field, value) => {
    const updatedLinks = [...settings.links];
    updatedLinks[index][field] = value;
    setSettings((prevSettings) => ({
      ...prevSettings,
      links: updatedLinks,
    }));
  };

  // Add a new link
  const addLink = () => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      links: [...prevSettings.links, { appName: '', appLink: '' }],
    }));
  };

  // Remove a link
  const removeLink = (index) => {
    const updatedLinks = settings.links.filter((_, i) => i !== index);
    setSettings((prevSettings) => ({
      ...prevSettings,
      links: updatedLinks,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const response = await axios.post('http://localhost:7485/api/v1/UpdateSetting', settings);
      if (response.data.success) {
        alert('Settings updated successfully!');
      } else {
        alert('Failed to update settings: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('An error occurred while updating settings.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="p-6 bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium text-gray-700">Logo URL</label>
          <input
            type="text"
            name="logo"
            value={settings.logo}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Footer Logo URL</label>
          <input
            type="text"
            name="footerLogo"
            value={settings.footerLogo}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Contact Number</label>
          <input
            type="text"
            name="contactNumber"
            value={settings.contactNumber}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Admin ID</label>
          <input
            type="text"
            name="adminId"
            value={settings.adminId}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Office Address</label>
          <input
            type="text"
            name="officeAddress"
            value={settings.officeAddress}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Footer Email</label>
          <input
            type="email"
            name="FooterEmail"
            value={settings.FooterEmail}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Footer Bio</label>
          <textarea
            rows={4}
            name="BioFooter"
            value={settings.BioFooter}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Header Animation Show</label>
          <select onChange={handleChange} name="isFestiveTopPopUpShow" value={settings.isFestiveTopPopUpShow} className="w-full p-2 border border-gray-300 rounded">
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
        <div>
          <label className="block font-medium text-gray-700">Bootom Animation Show</label>
          <select onChange={handleChange} name="isFestiveBottomPopUpShow" value={settings.isFestiveBottomPopUpShow} className="w-full p-2 border border-gray-300 rounded">
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
        <div>
          <label className="block font-medium text-gray-700">Bottom Gif Link</label>
          <textarea
            rows={4}
            name="BottomGifLink"
            value={settings.BottomGifLink}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Top Gif Link</label>
          <textarea
            rows={4}
            name="AboveTopGif"
            value={settings.AboveTopGif}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Footer Bio</label>
          <textarea
            rows={4}
            name="BioFooter"
            value={settings.BioFooter}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700">Links</label>
          {settings.links.map((link, index) => (
            <div key={index} className="flex space-x-4 mb-2">
              <input
                type="text"
                placeholder="App Name"
                value={link.appName}
                onChange={(e) => handleLinkChange(index, 'appName', e.target.value)}
                className="w-1/2 p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="App Link"
                value={link.appLink}
                onChange={(e) => handleLinkChange(index, 'appLink', e.target.value)}
                className="w-1/2 p-2 border border-gray-300 rounded"
              />
              <button
                type="button"
                onClick={() => removeLink(index)}
                className="p-2 text-white bg-red-500 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addLink}
            className="p-2 text-white bg-blue-500 rounded"
          >
            Add Link
          </button>
        </div>
        <button
          type="submit"
          className={`w-full p-2 text-white rounded ${updating ? 'bg-gray-500' : 'bg-green-500'}`}
          disabled={updating}
        >
          {updating ? 'Updating...' : 'Update Settings'}
        </button>
      </form>
    </div>
  );
};

export default Settings;
