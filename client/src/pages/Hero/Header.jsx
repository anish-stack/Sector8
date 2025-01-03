import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import axios from 'axios'
import anm from './Animation - 1733596519295.gif'
import { useEffect } from 'react';
export function Header() {
  const [settings,setSettings] = useState({})


    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const ShopToken = localStorage.getItem('ShopToken');
    const PartnerToken = localStorage.getItem('B2bToken');

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
  
 


    return (
        <header className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-2">
              <img src={settings?.logo || "https://placehold.co/60x40"} alt="Logo" className=" h-8 md:h-10" />
            </a>
  
            <nav className=" md:flex items-center space-x-8">
              {/* <a href="#" className="text-gray-700 hover:text-blue-400 font-medium transition-colors">
                Home
              </a>
              <a href="/Advertise-With-us" className="text-gray-700 hover:text-blue-400 font-medium transition-colors">
                Advertise
              </a>
              <a href="/Free-Listing" className="text-gray-700 hover:text-blue-400 font-medium transition-colors">
                Free Listing
              </a>
              */}
               <a href={`tel:${settings?.contactNumber ||'919953825382' }`} className="text-gray-700 hover:text-blue-600 font-bold transition-colors">
              <span className="mr-2 "><i className="fa-solid fa-phone mr-3"></i>Call</span> {settings?.contactNumber || "919953825382"}
              </a>
              <div className="flex items-center space-x-4">
                {ShopToken && (
                  <a
                    href="/Shop-Dashboard"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
             Dashboard
                  </a>
                )}
                {PartnerToken && (
                  <a
                    href="/Partner-Dashboard"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Partner Dashboard
                  </a>
                )}
                {!ShopToken && !PartnerToken && (
                  <a
                    href="/Shop-login"
                    className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-blue-200"
                  >
                    Login
                  </a>
                )}
              </div>
            </nav>
  
       
          </div>
      
        </div>
      </header>
    );
}
