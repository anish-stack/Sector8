import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Award, Building, MapPin, Star, Users } from 'lucide-react';
import anm from './Animation - 1733596519295.gif'
import gnm from './gnm.gif'


import Categorey from '../../components/Category/Categorey';
import MCategorey from '../../components/Category/Mobile';
import AllListings from '../../components/Listings/AllListings';
import { Newsletter } from '../Hero/Newsletter';
import Hero from '../Hero/Hero';
import { ServiceCard } from '../About/ServiceCard';
import { StatsSection } from '../About/StatsSection';
import AllListing from '../Listings/AllListing';
import CustomerFaq from '../../components/CFaq/CustomerFaq';
import OfferBanner from '../../components/OfferBanners/OfferBanner';
import Free_Page from '../Free_Page/Free_Page';
const services = [
  {
    icon: Building,
    title: "Business Listing Services",
    description: "Create detailed business profiles with comprehensive information, photos, and customer reviews.",
    iconColor: "bg-blue-600",
  },
  {
    icon: Star,
    title: "Promotions and Deals",
    description: "Post exclusive offers and promotions to attract new customers and grow your business.",
    iconColor: "bg-yellow-500",
  },
  {
    icon: Users,
    title: "Event Management",
    description: "Participate in networking events, workshops, and promotional campaigns to expand your reach.",
    iconColor: "bg-green-600",
  },
  {
    icon: MapPin,
    title: "Premium Membership",
    description: "Get premium features including top placement in search results and targeted marketing campaigns.",
    iconColor: "bg-red-500",
  },
];
const Home = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [locationPopup, setLocationPopup] = useState(false);
  const [locationDetails, setLocationDetails] = useState(null);
  const [settings, setSettings] = useState({})

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('https://api.naideal.com/api/v1/get-setting');
        if (response.data.success) {
          setSettings(response.data.data);
          console.log(response.data.data)
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching settings:', error.message);
      }
    };
    fetchSettings();
  }, []);
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
      {settings?.isFestiveTopPopUpShow && (

        <div className=''>
          <img className='fixed hidden md:block z-50 w-32 left-0 top-12' src={settings?.AboveTopGif} alt="" />
          <img className='fixed  hidden md:block  z-50 w-32 right-0 top-12' src={settings?.AboveTopGif} alt="" />
        </div>
      )}

      <Hero />
      <div className='hidden lg:block'>
        <Categorey />
      </div>
      <div className='block lg:hidden'>
        <MCategorey />
      </div>
      <AllListing />
      {/* <AllListings /> */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Comprehensive solutions designed to help your business thrive in the digital age
        </p>
      </div>

      <div className="grid max-w-screen-xl mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
      <StatsSection />
      <OfferBanner />

      <Newsletter />
      <Free_Page />
      {settings?.isFestiveBottomPopUpShow && (

        <>
          <img className='fixed z-50 w-32 bottom-0' src={settings?.BottomGifLink} alt="" />
          <img className='fixed z-50 right-0 w-32 bottom-0' src={settings?.BottomGifLink} alt="" />
        </>
      )}


    </div>
  );
};

export default Home;
