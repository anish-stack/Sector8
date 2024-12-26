import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import DashboardScreen from './pages/dashboard/DashboardScree';
import AllShop from './pages/Shop/AllShop';
import UnApprovedPost from './pages/Post/UnApprovedPost';
import AllPartners from './pages/Partners/AllPartners';
import ShopsOfPartner from './pages/Partners/ShopsOfPartner';
import Payments from './pages/dashboard/Payments';
import AllPackages from './pages/Packages/AllPackages';
import CreatePackage from './pages/Packages/CraetePackages';
import AllCategories from './pages/categories/AllCategories';
import AllCity from './pages/City/AllCity';
import CreateBanner from './pages/Banner/CreateBanner';
import AllBanner from './pages/Banner/AllBanner';
import Settings from './pages/Settings/Settings';
import MarqueeActions from './pages/MarqueeActions/MarqueeActions';
import Layout from './Home/Home';
import AllPost from './pages/Post/AllPost';
import EditPost from './pages/Post/EditPost';
import CryptoJS from 'crypto-js';
import ProtectedRoute from './ProtectedRoute';
import AllContact from './pages/Contact/AllContact';
import AllBanners from './pages/OfferBanner/AllBanner';
import FestivalPop from './pages/FestivalPop/Festival.pop';

import AdminPage from './pages/Free_Space/Free_Space';

import { Toaster } from 'react-hot-toast';

const App = () => {
  // Retrieve and decrypt the session data
  const encryptedData = sessionStorage.getItem('loginData');
  
  let isLoggedIn = false;

  if (encryptedData) {
    try {
      const decryptedData = CryptoJS.AES.decrypt(encryptedData, 'secret-key').toString(CryptoJS.enc.Utf8);
      const loginData = JSON.parse(decryptedData);
      isLoggedIn = loginData.login || false; // If login is true, set isLoggedIn to true
    } catch (error) {
      console.error('Decryption failed', error);
    }
  }

  if (!isLoggedIn) {
    return <Login/>
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} /> {/* Login route */}
        
        <Route path="/" element={<Layout />}>
          <Route index element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>} />
          <Route path="/Create-Banner" element={<ProtectedRoute><CreateBanner /></ProtectedRoute>} />
          <Route path="/Home-Banner" element={<ProtectedRoute><AllBanner /></ProtectedRoute>} />
          <Route path="/Settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/Marquees" element={<ProtectedRoute><MarqueeActions /></ProtectedRoute>} />
          <Route path="/All-shops" element={<ProtectedRoute><AllShop /></ProtectedRoute>} />
          <Route path="/approve-post" element={<ProtectedRoute><UnApprovedPost /></ProtectedRoute>} />
          <Route path="/Partners" element={<ProtectedRoute><AllPartners /></ProtectedRoute>} />
          <Route path="/partner-details" element={<ProtectedRoute><ShopsOfPartner /></ProtectedRoute>} />
          <Route path="/All-Payments-Details" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
          <Route path="/All-Packages" element={<ProtectedRoute><AllPackages /></ProtectedRoute>} />
          <Route path="/create-package" element={<ProtectedRoute><CreatePackage /></ProtectedRoute>} />
          <Route path="/All-categories" element={<ProtectedRoute><AllCategories /></ProtectedRoute>} />
          <Route path="/All-City" element={<ProtectedRoute><AllCity /></ProtectedRoute>} />
          <Route path="/All-Post" element={<ProtectedRoute><AllPost /></ProtectedRoute>} />
          <Route path="/edit-post" element={<ProtectedRoute><EditPost /></ProtectedRoute>} />
          <Route path="/All-Contacts" element={<ProtectedRoute><AllContact /></ProtectedRoute>} />

          <Route path="/manage-offer-banners" element={<ProtectedRoute><AllBanners /></ProtectedRoute>} />
          <Route path="/manage-pop-festivals" element={<ProtectedRoute><FestivalPop /></ProtectedRoute>} />
          <Route path="/manage-admin_page" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />


          
        </Route>

        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
        <Toaster/>
    </Router>
  );
};

export default App;
