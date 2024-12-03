// Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils'; // Assuming you have the cn function in the same directory

const Sidebar = () => {
    const handleLogout = () => {
        localStorage.removeItem('newDealToken')
        window.location.reload()
    }
    return (
        <>

            <div className="flex h-screen">
                <aside className="w-72 bg-gray-800 text-white lg:w-64 md:w-48 sm:w-40">
                    <div className="p-4">
                        <h1 className="text-xl font-semibold">Nai Deal Admin</h1>
                    </div>
                    <nav className="mt-4">
                        <ul>
                            <li className="p-1 hover:bg-gray-700">
                                <NavLink to="/" className={({ isActive }) => cn("block px-4 py-2", isActive ? "bg-gray-700" : "")}>
                                    Dashboard
                                </NavLink>
                            </li>
                            <li className="p-1 hover:bg-gray-700">
                                <NavLink to="/Partners" className={({ isActive }) => cn("block px-4 py-2", isActive ? "bg-gray-700" : "")}>
                                    All Partner
                                </NavLink>
                            </li>
                            <li className="p-1 hover:bg-gray-700">
                                <NavLink to="/All-Shops" className={({ isActive }) => cn("block px-4 py-2", isActive ? "bg-gray-700" : "")}>
                                    All Shops
                                </NavLink>
                            </li>
                            <li className="p-1 hover:bg-gray-700">
                                <NavLink to="/All-categories" className={({ isActive }) => cn("block px-4 py-2", isActive ? "bg-gray-700" : "")}>
                                    Categories
                                </NavLink>
                            </li>
                            <li className="p-1 hover:bg-gray-700">
                                <NavLink to="/All-City" className={({ isActive }) => cn("block px-4 py-2", isActive ? "bg-gray-700" : "")}>
                                    City
                                </NavLink>
                            </li>
                            <li className="p-1 hover:bg-gray-700">
                                <NavLink to="/Home-Banner" className={({ isActive }) => cn("block px-4 py-2", isActive ? "bg-gray-700" : "")}>
                                    Home Banner
                                </NavLink>
                            </li>
                            <li className="p-1 hover:bg-gray-700">
                                <NavLink to="/approve-post" className={({ isActive }) => cn("block px-4 py-2", isActive ? "bg-gray-700" : "")}>
                                    Approve Post
                                </NavLink>
                            </li>
                            <li className="p-1 hover:bg-gray-700">
                                <NavLink to="/Marquees" className={({ isActive }) => cn("block px-4 py-2", isActive ? "bg-gray-700" : "")}>
                                Marquees
                                </NavLink>
                            </li>
                            <li className="p-1 hover:bg-gray-700">
                                <NavLink to="/All-Payments-Details" className={({ isActive }) => cn("block px-4 py-2", isActive ? "bg-gray-700" : "")}>
                                    Payments
                                </NavLink>
                            </li>
                            <li className="p-1 hover:bg-gray-700">
                                <NavLink to="/All-Packages" className={({ isActive }) => cn("block px-4 py-2", isActive ? "bg-gray-700" : "")}>
                                    Packages
                                </NavLink>
                            </li>
                            <li className="p-1 hover:bg-gray-700">
                                <NavLink to="/Settings" className={({ isActive }) => cn("block px-4 py-2", isActive ? "bg-gray-700" : "")}>
                                    Settings
                                </NavLink>
                            </li>
                            <li className="p-1 hover:bg-gray-700">
                                <NavLink onClick={handleLogout} className={({ isActive }) => cn("block px-4 py-2", isActive ? "bg-gray-700" : "")}>
                                    Logout
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </aside>

            </div>
        </>
    );
};

export default Sidebar;
