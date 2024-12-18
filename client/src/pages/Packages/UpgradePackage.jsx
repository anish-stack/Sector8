import React, { useEffect, useState } from 'react';
import { Check, Crown, Sparkles, Star } from 'lucide-react';

const packages = [
  {
    name: 'Free',
    icon: Star,
    price: '₹0',
    period: 'forever',
    listings: 1,
    color: 'from-gray-500 to-gray-600',
    features: [
      'Basic Support',
      'Limited Access',
      'Standard Listing Display',
      'Basic Analytics',
      'Community Support'
    ],
  },
  {
    name: 'Silver',
    icon: Sparkles,
    price: '₹999',
    period: 'per year',
    listings: 5,
    color: 'from-blue-500 to-blue-600',
    popular: true,
    features: [
      'Priority Support',
      'Extended Access',
      'Customizable Listings',
      'Advanced Analytics',
      'Email Support',
      'Featured in Search',
      'Custom Branding'
    ],
  },
  {
    name: 'Gold',
    icon: Crown,
    price: '₹1999',
    period: 'per year',
    listings: 10,
    color: 'from-yellow-500 to-yellow-600',
    features: [
      '24/7 Support',
      'Full Access',
      'Premium Customizations',
      'Featured Listings',
      'Priority Placement',
      'Dedicated Account Manager',
      'Marketing Tools',
      'Performance Insights',
      'API Access'
    ],
  },
];

const UpgradePackage = ({ selectedPlan }) => {
  // console.log(selectedPlan)
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  
    setTimeout(() => setAnimateCards(true), 100);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock more features and grow your business with our premium packages
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {packages.map((pkg, index) => {
            const Icon = pkg.icon;
            const isSelected = selectedPlan === pkg.name;

            return (
              <div
                key={pkg.name}
                className={`relative transform transition-all duration-500 ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div
                  className={`h-full rounded-2xl bg-white shadow-xl overflow-hidden border-2 ${isSelected ? 'border-blue-500 scale-105' : 'border-transparent hover:scale-105'
                    } transition-all duration-300`}
                >
                  {pkg.popular && (
                    <div className="absolute top-0 right-0 mt-4 mr-4">
                      <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                        Popular
                      </span>
                    </div>
                  )}

                  {/* Package Header */}
                  <div className={`p-8 bg-gradient-to-r ${pkg.color} text-white`}>
                    <div className="flex items-center gap-3 mb-4">
                      <Icon className="w-8 h-8" />
                      <h3 className="text-2xl font-bold">{pkg.name}</h3>
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">{pkg.price}</span>
                      <span className="ml-2 text-base opacity-80">/{pkg.period}</span>
                    </div>
                    <p className="mt-4 text-lg opacity-90">Up to {pkg.listings} listings</p>
                  </div>

                  {/* Features List */}
                  <div className="p-8">
                    <ul className="space-y-4">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      disabled={isSelected}
                      className={`w-full mt-8 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${isSelected
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : `bg-gradient-to-r ${pkg.color} text-white hover:shadow-lg`
                        }`}
                    >
                      {isSelected ? 'Current Plan' : `Choose ${pkg.name}`}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Information */}
        <div className="mt-16 text-center text-gray-600">
          <p className="max-w-2xl mx-auto">
            All plans include basic features like listing management, basic analytics,
            and customer support. Upgrade to unlock premium features and grow your business faster.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradePackage;