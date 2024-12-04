import React from 'react';
import { Navigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const ProtectedRoute = ({ children }) => {
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

  // If not logged in, redirect to the login page
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the protected route's children
  return children;
};

export default ProtectedRoute;
