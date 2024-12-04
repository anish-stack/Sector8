import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/header/Header'
const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex ">
        <Header />
        <main className="flex-1   p-6 lg:p-8 ml-0 ">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;