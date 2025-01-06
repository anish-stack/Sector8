import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const useAddress = (shopDetails, coords) => {
  const [addressData, setAddressData] = useState({
    ShopAddress: {
      City: '',
      PinCode: '',
      ShopAddressStreet: '',
      ShopLatitude: '',
      ShopLongitude: '',
      ShopNo: '',
      NearByLandMark: ''
    },
    LandMarkCoordinates: null
  });

  useEffect(() => {
    if (shopDetails?.ShopAddress) {
      setAddressData({
        ShopAddress: {
          City: shopDetails.ShopAddress.City || '',
          PinCode: shopDetails.ShopAddress.PinCode || '',
          ShopAddressStreet: shopDetails.ShopAddress.ShopAddressStreet || '',
          ShopLatitude: shopDetails.ShopAddress.Location?.coordinates[1] || '',
          ShopLongitude: shopDetails.ShopAddress.Location?.coordinates[0] || '',
          ShopNo: shopDetails.ShopAddress.ShopNo || '',
          NearByLandMark: shopDetails.ShopAddress.NearByLandMark || ''
        },
        LandMarkCoordinates: shopDetails.LandMarkCoordinates || null
      });
    }
  }, [shopDetails]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData(prev => ({
      ...prev,
      ShopAddress: {
        ...prev.ShopAddress,
        [name]: value
      }
    }));
  };

  const handleGeoCode = async (landmark) => {
    if (!landmark) {
      toast.error('Please enter landmark to proceed');
      return;
    }
    try {
      const response = await axios.get(`https://api.naideal.com/geocode?address=${landmark}`);
      const locationData = response.data;
      setAddressData(prev => ({
        ...prev,
        LandMarkCoordinates: {
          type: 'Point',
          coordinates: [locationData?.longitude, locationData?.latitude]
        }
      }));
      toast.success('Landmark location fetched successfully');
    } catch (error) {
      toast.error('Error fetching landmark location');
    }
  };

  const fetchCurrentLocation = async () => {
    if (!coords) {
      toast.error('Unable to get current location');
      return;
    }

    try {
      const response = await axios.post(`https://api.naideal.com/Fetch-Current-Location`, {
        lat: coords.latitude,
        lng: coords.longitude
      });

      const locationData = response.data.data;
      setAddressData(prev => ({
        ...prev,
        ShopAddress: {
          ...prev.ShopAddress,
          City: locationData.address?.city || '',
          PinCode: locationData.address?.postalCode || '',
          ShopAddressStreet: locationData.address?.completeAddress || '',
          ShopLatitude: locationData.address?.lat || '',
          ShopLongitude: locationData.address?.lng || ''
        }
      }));
      toast.success('Current location fetched successfully');
    } catch (error) {
      toast.error('Error fetching current location');
    }
  };

  return {
    addressData,
    handleAddressChange,
    handleGeoCode,
    fetchCurrentLocation
  };
};

export default useAddress;