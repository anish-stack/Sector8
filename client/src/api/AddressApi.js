import axios from 'axios';

export const updateShopAddress = async (shopId, addressData, coords, token) => {
  const response = await axios.put(
    `https://api.naideal.com/api/v1/update-shop-address/${shopId}`,
    {
      ShopAddress: {
        ...addressData.ShopAddress,
        ShopLatitude: coords?.latitude || addressData.ShopAddress.ShopLatitude,
        ShopLongitude: coords?.longitude || addressData.ShopAddress.ShopLongitude
      },
      LandMarkCoordinates: addressData.LandMarkCoordinates
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export const fetchShopDetails = async (shopId) => {
  const response = await axios.get(`https://api.naideal.com/api/v1/get-single-user/${shopId}`);
  return response.data;
};