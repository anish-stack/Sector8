import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Users, Store, PartyPopper, DiamondPercent, Phone, Tag, MapPin, Image, CheckSquare, MessageSquare, CreditCard, Package, Settings, LogOut } from 'lucide-react';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/Partners', label: 'All Partners', icon: Users },
  { path: '/All-Shops', label: 'All Shops', icon: Store },
  { path: '/All-categories', label: 'Categories', icon: Tag },
  { path: '/All-City', label: 'City', icon: MapPin },
  { path: '/Home-Banner', label: 'Home Banner', icon: Image },
  { path: '/All-Post?All=true', label: 'Offers-Posted', icon: DiamondPercent },
  { path: '/All-Contacts', label: 'Contact', icon: Phone },
  { path: '/manage-offer-banners', label: 'Offer Banners', icon: Image },
  { path: '/manage-pop-festivals', label: 'Festival-Pops', icon: PartyPopper },

  { path: '/manage-admin_page', label: 'Admin_page', icon: Tag },

  { path: '/approve-post', label: 'Approve Post', icon: CheckSquare },
  { path: '/Marquees', label: 'Marquees', icon: MessageSquare },
  { path: '/All-Payments-Details', label: 'Payments', icon: CreditCard },
  { path: '/All-Packages', label: 'Packages', icon: Package },
  { path: '/Settings', label: 'Settings', icon: Settings },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('loginData');
    window.location.href = "/login";
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-800 text-white transition-transform duration-300 ease-in-out transform`}
      >
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">Nai Deal Admin</h1>
        </div>

        <nav className="mt-6 px-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${isActive
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
            <li>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-sm text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Header;