import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Categorey from '../../components/Category/Categorey';
import MCategorey from '../../components/Category/Mobile';
import AllListings from '../../components/Listings/AllListings';

const Home = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [locationPopup, setLocationPopup] = useState(false);
  const [locationDetails, setLocationDetails] = useState(null);

  const checkLocationAccess = () => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const GOOGLE_KEY_SECRET = "AIzaSyAwuwFlJ9FbjzZzWEPUqQPomJ8hlXdqwqo";
          const { latitude, longitude } = position.coords;

          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_KEY_SECRET}`
          );

          const results = response.data.results;
          if (results && results.length > 0) {
            const addressComponents = results[0].address_components;
            const formattedAddress = results[0].formatted_address;

            const cityComponent = addressComponents.find(component =>
              component.types.includes('locality')
            );
            const stateComponent = addressComponents.find(component =>
              component.types.includes('administrative_area_level_1')
            );
            const countryComponent = addressComponents.find(component =>
              component.types.includes('country')
            );

            setLocationDetails({
              latitude,
              longitude,
              city: cityComponent ? cityComponent.long_name : 'N/A',
              state: stateComponent ? stateComponent.long_name : 'N/A',
              country: countryComponent ? countryComponent.long_name : 'N/A',
              formattedAddress,
            });
          } else {
            console.error("No results found for the provided coordinates.");
          }
        } catch (error) {
          console.error("Error retrieving location details:", error);
        }
      },
      (error) => {
        console.log("Location access denied:", error);
        setTimeout(() => {
          setLocationPopup(true);
        }, 3000);
      }
    );
  };

  useEffect(() => {
    checkLocationAccess();
  }, []);

  return (
    <div>

      <div className='hidden lg:block'>
        <Categorey />
      </div>
      <div className='block lg:hidden'>
        <MCategorey />
      </div>
      <AllListings />
    </div>
  );
};

export default Home;
