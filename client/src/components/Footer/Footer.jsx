import React from 'react';
import QuickLinks from './QuickLinks';
import SocialLinks from './SocialLinks';
import ContactInfo from './ContactInfo';
import { Compass } from 'lucide-react';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios'
const Footer = () => {
  const [settings, setSettings] = useState({})
  const token = localStorage.getItem('ShopToken');
  const token2 = localStorage.getItem('B2bToken');
  // console.log("token",token)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('https://api.naideal.com/api/v1/get-setting');
        if (response.data.success) {
          setSettings(response.data.data);
          // console.log(response.data.data)
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
    <footer className="bg-gray-900 mt-[100px]">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <a href="/" className="flex items-center space-x-2">
                <img src={settings?.footerLogo || "https://placehold.co/60x40"} alt="Logo" className="h-10" />
              </a>

            </div>
            <p className="text-gray-300">
              {settings?.BioFooter}
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <QuickLinks />
          </div>

          {/* Contact Information */}
          <div>
            <ContactInfo data={settings} />
          </div>
        </div>
      </div>
      <div className='container mb-2 '>
        <SocialLinks data={settings?.links} />

      </div>
      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <p className="text-gray-400  text-center text-sm">
              © {new Date().getFullYear()} Inde Global. All Rights Reserved.
            </p>
            <p className="text-gray-400 text-sm flex items-center gap-1">
              Designed with <span className="text-red-500">❤️</span> by{' '}
              <a
                href="https://digital4now.in/"
                className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
              >
                Digital4Now
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
