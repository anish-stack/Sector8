import React, { useEffect } from 'react';

const packages = [
  {
    name: 'Free',
    price: '₹0',
    listings: '1 Listing',
    features: ['Basic Support', 'Limited Access'],
  },
  {
    name: 'Silver',
    price: '₹999/year',
    listings: '5 Listings',
    features: ['Priority Support', 'Extended Access', 'Customizable Listings'],
  },
  {
    name: 'Gold',
    price: '₹1999/year',
    listings: '10 Listings',
    features: ['24/7 Support', 'Full Access', 'Premium Customizations', 'Featured Listings'],
  },
];

const UpgradePackage = ({ selectedPlan }) => {
    useEffect(()=>{
        window.scrollTo({
            top:0,
            behavior:'smooth'
        })
    },[])

  return (
    <>
        <div className="min-h-screen bg-gray-100 py-12 flex flex-col justify-center sm:py-16">
        <div className="relative py-3 max-w-3xl sm:max-w-2xl sm:mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
            <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-xl mx-auto">
                <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Upgrade Your Package</h1>
                <div className="divide-y divide-gray-200">
                {packages.map((pkg) => (
                    <div key={pkg.name} className={`py-6 px-2  ${selectedPlan === pkg.name ? 'bg-green-100 border-2 border-green-500 rounded' : ''}`}>
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-700">{pkg.name} Plan</h2>
                        <p className="text-xl font-bold text-gray-900">{pkg.price}</p>
                    </div>
                    <p className="text-gray-600">{pkg.listings}</p>
                    <ul className="mt-4 text-sm text-gray-600">
                        {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                            <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            {feature}
                        </li>
                        ))}
                    </ul>
                    <button className={`mt-4 w-full px-4 py-2 ${selectedPlan === pkg.name ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-700'} text-white font-bold rounded-lg transition duration-200`} disabled={selectedPlan === pkg.name}>
                        {selectedPlan === pkg.name ? 'Current Plan' : `Choose ${pkg.name}`}
                    </button>
                    </div>
                ))}
                </div>
            </div>
            </div>
        </div>
        </div>
    </>
  );
};

export default UpgradePackage;
