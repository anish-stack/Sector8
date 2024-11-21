import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 mt-[100px] text-gray-300 py-8">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Column 1: Logo and About */}
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-white mb-2">Nai Deal</h2>
                        <p className="text-sm">A brief description of the company.</p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="mb-4">
                        <h3 className="text-lg font-bold mb-2">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="/" className="hover:text-gray-400 transition-colors duration-200">Home</a></li>
                            <li><a href="/Partner-Login" className="hover:text-gray-400 transition-colors duration-200">Partner Login</a></li>
                            <li><a href="/Partner-Login" className="hover:text-gray-400 transition-colors duration-200">Become A Partner</a></li>

                            <li><a href="/about" className="hover:text-gray-400 transition-colors duration-200">About Us</a></li>
                            <li><a href="/services" className="hover:text-gray-400 transition-colors duration-200">Services</a></li>
                            <li><a href="/contact" className="hover:text-gray-400 transition-colors duration-200">Contact Us</a></li>
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
                        <p className="text-sm">123 Street Name, City</p>
                        <p className="text-sm">Phone: +91 XXXXXXXXXX</p>
                        <p className="text-sm">Email: info@example.com</p>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="bg-gray-800 py-4">
                <div className="max-w-screen-xl mx-auto px-4 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Company Name. All Rights Reserved.</p>
                    <p>Designed with <span role="img" aria-label="heart">❤️</span> by Digi India Solution</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
