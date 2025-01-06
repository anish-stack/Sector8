import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import axios from 'axios';

const AddressForm = ({ addressData, handleAddressChange, handleGeoCode, fetchCurrentLocation, onSubmit, onClose }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAutocomplete = async (value) => {
    setLoading(true);
    handleAddressChange({
      target: {
        name: 'NearByLandMark',
        value
      }
    });

    try {
      const { data } = await axios.get('https://api.naideal.com/autocomplete', {
        params: { input: value }
      });
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    handleAddressChange({
      target: {
        name: 'NearByLandMark',
        value: suggestion.description
      }
    });
    handleGeoCode(suggestion.description);
    setSuggestions([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Update Shop Address</h2>
          <button className="text-gray-500 hover:text-gray-800" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop No
              </label>
              <input
                type="text"
                name="ShopNo"
                value={addressData.ShopAddress.ShopNo}
                onChange={handleAddressChange}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="City"
                value={addressData.ShopAddress.City}
                onChange={handleAddressChange}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <input
              type="text"
              name="ShopAddressStreet"
              value={addressData.ShopAddress.ShopAddressStreet}
              onChange={handleAddressChange}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pin Code
            </label>
            <input
              type="text"
              name="PinCode"
              value={addressData.ShopAddress.PinCode}
              onChange={handleAddressChange}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nearby Landmark
            </label>
            <div className="relative">
              <input
                type="text"
                name="NearByLandMark"
                value={addressData.ShopAddress.NearByLandMark}
                onChange={(e) => handleAutocomplete(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
              {loading && (
                <div className="absolute right-3 top-2">
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              )}
              {suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.place_id}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    >
                      {suggestion.description}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={fetchCurrentLocation}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Use Current Location
            </button>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Update Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;