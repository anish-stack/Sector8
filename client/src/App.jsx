import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home/Home';

import Footer from './components/Footer/Footer';
import About from './pages/About/About';
import SingleListing from './components/Listings/SingleListing';
import AllListings from './components/Listings/AllListings';
import FreeListing from './pages/FreeListing/FreeListing';
import Advertise from './pages/Advertise/Advertise';
import Login from './pages/Auth/Login';
import PartnerRegister from './pages/Auth/PartnerRegister';
import { Toaster } from 'react-hot-toast';
import OtpPage from './pages/Auth/OtpPage';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ShopLogin from './pages/Auth/ShopLogin';
import PartnerDashboard from './pages/Partner/PartnerDashboard';
import ShopDashboard from './Shop/ShopDashboard';
import CreateListing from './UserDashboard/CreateListing';
import SearchProduct from './pages/Search/SearchProduct';
import ShopProfile from './pages/ShopProfiles/ShopProfile';
import UpgradePackage from './pages/Packages/UpgradePackage';
import ParentComponent from './pages/Packages/ParentComponent';
import EditPost from './Shop/editor/EditPost';
import Success from './components/Payment/Success';
import Failed from './components/Payment/Failed';
import PostByCategories from './components/Category/PostByCategories';
import ForgetPassword from './pages/Auth/ForgetPassword';
import PasswordChangeOtp from './pages/Auth/PasswordChangeOtp';
import ErrorPage from './pages/404/ErrorPage';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions/TermsAndConditions';
import ReturnAndRefundPolicy from './pages/ReturnAndRefundPolicy/ReturnAndRefundPolicy';
import { ContactForm } from './pages/Contact/Contact';
import { Header } from './pages/Hero/Header';
import Services from './pages/services/Services';
import UserRegister from './UserDashboard/UserRegister';
import AllListing from './pages/Listings/AllListing';
import SearchItem from './components/SearchItems/SearchItem';
import CustomerFaq from './components/CFaq/CustomerFaq';
import Pfaq from './components/PFaq/PFaq';
import Copywrite from './pages/ReturnAndRefundPolicy/Copywrite';
import Festival_Pop from './components/Festival_Pop/Festival_Pop';

const ScrollToTop = () => {
  const location = useLocation();
  const [pathName, setPathName] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setPathName(location.pathname);
  }, [location.pathname]);

  return null;
};

function App() {
  const [locationDetails, setLocationDetails] = useState(null);
  const [locationPopup, setLocationPopup] = useState(false);

  const checkLocationAccess = () => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const GOOGLE_KEY_SECRET = 'AIzaSyAwuwFlJ9FbjzZzWEPUqQPomJ8hlXdqwqo';
          const { latitude, longitude } = position.coords;

          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_KEY_SECRET}`
          );

          const results = response.data.results;
          console.log('Results From ', results);
          if (results && results.length > 0) {
            const addressComponents = results[0].address_components;
            const formattedAddress = results[0].formatted_address;

            const cityComponent = addressComponents.find(
              (component) => component.types.includes('locality')
            );

            const PinCodeComponent = addressComponents.find(
              (component) => component.types.includes('postal_code')
            );

            const stateComponent = addressComponents.find(
              (component) => component.types.includes('administrative_area_level_1')
            );
            const countryComponent = addressComponents.find(
              (component) => component.types.includes('country')
            );

            setLocationDetails({
              latitude,
              longitude,
              city: cityComponent ? cityComponent.long_name : 'N/A',
              state: stateComponent ? stateComponent.long_name : 'N/A',
              country: countryComponent ? countryComponent.long_name : 'N/A',
              formattedAddress,
              PinCode: PinCodeComponent ? PinCodeComponent.long_name : 'N/A',
            });
          } else {
            console.error('No results found for the provided coordinates.');
          }
        } catch (error) {
          console.error('Error retrieving location details:', error);
        }
      },
      (error) => {
        console.log('Location access denied:', error);
        setTimeout(() => {
          setLocationPopup(true);
        }, 3000);
      }
    );
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    checkLocationAccess();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Single-Listing/:id/:name" element={<SingleListing />} />
        <Route path="/listings" element={<AllListing />} />
        <Route path="/Free-Listing" element={<FreeListing />} />
        <Route path="/Advertise-With-us" element={<Advertise />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/return-refund" element={<ReturnAndRefundPolicy />} />
        <Route path="/services" element={<Services />} />
        <Route path="/Customer-faq" element={<CustomerFaq />} />
        <Route path="/partner-faq" element={<Pfaq />} />
        <Route path="/copyright" element={<Copywrite />} />

        {/* ---- Partner Routes ---- */}
        <Route path="/Partner-Login" element={<Login />} />
        <Route path="/Register-Partner" element={<PartnerRegister />} />
        <Route path="/Otp" element={<OtpPage />} />
        <Route path="/User-register-by-Partner/:PartnerId" locationDetails={locationDetails} element={<UserRegister />} />
        <Route path="/Shop-Login" element={<ShopLogin />} />
        <Route path="/Shop-Dashboard" element={<ShopDashboard />} />
        <Route path="/Shop-Dashboard/Create-Post" element={<CreateListing />} />
        <Route path="/Search" element={<SearchProduct />} />
        <Route path="/Partner-Dashboard" element={<PartnerDashboard />} />
        <Route path="/View-More-Offers/Shop-profile/:id/:ShopName" element={<ShopProfile />} />
        <Route path="/*" element={<ErrorPage />} />

        <Route path="/upgrade-package/:id" element={<ParentComponent />} />
        <Route path="/edit-post" element={<EditPost />} />
        <Route path="/Post-by-categories" element={<PostByCategories />} />
        <Route path="/Forget-Password" element={<ForgetPassword />} />
        <Route path="/VerifyOtp" element={<PasswordChangeOtp />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/paymentsuccess" element={<Success />} />
        <Route path="/payment-failed" element={<Failed />} />
        <Route path="/search-offer" element={<SearchItem />} />
      </Routes>

      {/* Conditionally render Festival_Pop based on pathName */}
      <Festival_Pop pathName={window.location.pathname} />

      <Footer />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
