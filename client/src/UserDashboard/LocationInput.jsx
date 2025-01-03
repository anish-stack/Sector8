import React, { useState } from 'react';
import axios from 'axios';

const LocationInput = ({ formData, setFormData, isGeolocationAvailable, isGeolocationEnabled,GeoCode }) => {
  const [suggestions, setSuggestions] = useState([]); // State to hold autocomplete suggestions
  const [loading, setLoading] = useState(false); // State to handle loading spinner

  // Function to handle autocomplete API call
  const handleAutocomplete = async (value) => {
    console.log(value)
    setLoading(true);
    setFormData({
      ...formData,
      ShopAddress: { ...formData.ShopAddress, NearByLandMark: value },
    });


    try {
      const { data } = await axios.get('https://api.naideal.com/autocomplete', {
        params: { input: value },
      });
      setSuggestions(data); // Update suggestions
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to select a suggestion
  const handleSelectSuggestion = (suggestion) => {
    console.log(suggestion)
    setFormData({
      ...formData,
      ShopAddress: { ...formData.ShopAddress, NearByLandMark: suggestion.description },
    });
    GeoCode(suggestion.description)
    setSuggestions([]); // Clear suggestions after selection
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Shop Location</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Shop No</label>
          <input
            type="text"
            required
            value={formData.ShopAddress.ShopNo}
            onChange={(e) =>
              setFormData({
                ...formData,
                ShopAddress: { ...formData.ShopAddress, ShopNo: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            value={formData.ShopAddress.City}
            onChange={(e) =>
              setFormData({
                ...formData,
                ShopAddress: { ...formData.ShopAddress, City: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Pin Code</label>
          <input
            type="text"
            required
            value={formData.ShopAddress.PinCode}
            onChange={(e) =>
              setFormData({
                ...formData,
                ShopAddress: { ...formData.ShopAddress, PinCode: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Landmark</label>
          <input
            type="text"
            required
            value={formData.ShopAddress.NearByLandMark}
            onChange={(e) => handleAutocomplete(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {/* Autocomplete Suggestions */}
          {loading && <p className="text-sm text-gray-500 mt-1">Loading...</p>}
          {suggestions.length > 0 && (
            <ul className="bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
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

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Street Address</label>
          <input
            type="text"
            value={formData.ShopAddress.ShopAddressStreet}
            onChange={(e) =>
              setFormData({
                ...formData,
                ShopAddress: { ...formData.ShopAddress, ShopAddressStreet: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {!isGeolocationAvailable && (
        <p className="text-sm text-red-600">Your browser doesn't support geolocation.</p>
      )}

      {!isGeolocationEnabled && isGeolocationAvailable && (
        <p className="text-sm text-yellow-600">Please enable location services to auto-fill your address.</p>
      )}
    </div>
  );
};

export default LocationInput;
