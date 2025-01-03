import React from 'react'; 
import { Link } from 'react-router-dom'; 

const links = [
  {
    title: 'Company',
    items: [
      { label: 'About Us', path: '/about' },
      { label: 'Contact Us', path: '/contact' },
      { label: 'Our Services', path: '/services' },
      { label: 'Advertise With Us', path: '/Advertise-With-us' },
      { label: 'Customer-faq', path: '/Customer-faq' },
      // { label: 'Our Plans', path: '/upgrade-package/plans' },
    ]
  },
  {
    title: 'For Partners',
    items: [
      { label: 'Partner Login', path: '/partner-login', requiresNoAuth: true },
      { label: 'Become A Partner', path: '/Register-Partner', requiresNoAuth: true },
      { label: 'Partner Support', path: '/contact' },
      { label: 'Partner-faq', path: '/partner-faq' },
    ]
  },
  {
    title: 'Legal',
    items: [
      { label: 'Privacy Policy', path: '/privacy-policy' },
      { label: 'Terms & Conditions', path: '/terms-and-conditions' },
      { label: 'Return & Refund', path: '/return-refund' },
      { label: 'Brand Trademark & Copyright Disclaimer', path: '/copyright' },
    ]
  }
];

const QuickLinks = () => {
  const token = localStorage.getItem('ShopToken');
  const token2 = localStorage.getItem('B2bToken');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {links.map((category) => (
        <div key={category.title} className="space-y-4">
          <h3 className="text-lg font-bold text-white">{category.title}</h3>
          <ul className="space-y-2">
            {category.items
              .filter(link => !((token || token2) && link.requiresNoAuth))
              .map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default QuickLinks;
