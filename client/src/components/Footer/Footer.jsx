import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 mt-[100px] text-gray-300 py-8">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Column 1: Logo and About */}
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-white mb-2">Naideal</h2>
                        <p className="text-sm">
                            Naideal is a multi-vendor e-commerce platform connecting buyers and sellers. Offering diverse products, secure payments, and real-time tracking, we ensure a seamless shopping experience. Our mission is to empower businesses and deliver convenience and reliability, making online shopping accessible to everyone.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="mb-4">
                        <h3 className="text-lg font-bold mb-2">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="hover:text-gray-400 transition-colors duration-200">Home</Link></li>
                            <li><Link to="/Partner-Login" className="hover:text-gray-400 transition-colors duration-200">Partner Login</Link></li>
                            <li><Link to="/Partner-Login" className="hover:text-gray-400 transition-colors duration-200">Become A Partner</Link></li>
                            <li><Link to="/about" className="hover:text-gray-400 transition-colors duration-200">About Us</Link></li>
                            <li><Link to="/services" className="hover:text-gray-400 transition-colors duration-200">Services</Link></li>
                            <li><Link to="/contact" className="hover:text-gray-400 transition-colors duration-200">Contact Us</Link></li>
                            <li><Link to="/privacy-policy" className="hover:text-gray-400 transition-colors duration-200">Privacy Policy</Link></li>
                            <li><Link to="/terms-and-conditions" className="hover:text-gray-400 transition-colors duration-200">Terms and Conditions</Link></li>
                            <li><Link to="/return-refund" className="hover:text-gray-400 transition-colors duration-200">Return & Refund</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Social Media Links */}
                    <div className="mb-4">
                        <h3 className="text-lg font-bold mb-2">Follow Us</h3>
                        <ul className="flex space-x-4">
                            <li><a href="#" className="text-white hover:text-gray-400 transition-colors duration-200"><i className="fab fa-facebook-f"></i></a></li>
                            <li><a href="#" className="text-white hover:text-gray-400 transition-colors duration-200"><i className="fab fa-twitter"></i></a></li>
                            <li><a href="#" className="text-white hover:text-gray-400 transition-colors duration-200"><i className="fab fa-instagram"></i></a></li>
                            <li><a href="#" className="text-white hover:text-gray-400 transition-colors duration-200"><i className="fab fa-linkedin-in"></i></a></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact Information */}
                    <div className="mb-4">
                        <h3 className="text-lg font-bold mb-2">Contact</h3>
                        <p className="text-sm">D-14/106, 2nd Floor, Sector-8, <br /> Rohini, Delhi-110085</p>
                        <p className="text-sm">
                            Phone: <a href="tel:+919953825382" className="text-blue-500 hover:underline">+91 99-5382-5382</a>
                        </p>
                        <p className="text-sm">
                            Email: <a href="mailto:care@naideal.com" className="text-blue-500 hover:underline">care@naideal.com</a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="bg-gray-800 py-4">
                <div className="max-w-screen-xl mx-auto px-4 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Naideal. All Rights Reserved.</p>
                    <p>Designed with <span role="img" aria-label="heart">❤️</span> by Digi India Solution</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
