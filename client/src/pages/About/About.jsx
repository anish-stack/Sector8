import React from 'react';
import { Award, Building, MapPin, Star, Users } from 'lucide-react';
import { StatsSection } from './StatsSection';
import { ServiceCard } from './ServiceCard';
import { AboutHero } from './AboutHero';

const services = [
  {
    icon: Building,
    title: "Business Listing Services",
    description: "Create detailed business profiles with comprehensive information, photos, and customer reviews.",
    iconColor: "bg-blue-600",
  },
  {
    icon: Star,
    title: "Promotions and Deals",
    description: "Post exclusive offers and promotions to attract new customers and grow your business.",
    iconColor: "bg-yellow-500",
  },
  {
    icon: Users,
    title: "Event Management",
    description: "Participate in networking events, workshops, and promotional campaigns to expand your reach.",
    iconColor: "bg-green-600",
  },
  {
    icon: MapPin,
    title: "Premium Membership",
    description: "Get premium features including top placement in search results and targeted marketing campaigns.",
    iconColor: "bg-red-500",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add padding to compensate for the fixed header */}
      <main className="container mx-auto px-4 py-8 pt-20"> 
        {/* pt-20 adjusts the top spacing for a fixed header (adjust based on header height) */}
        <AboutHero />
        
        {/* Services Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions designed to help your business thrive in the digital age
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </section>

        <StatsSection />

        {/* Why Choose Us Section */}
        <section className="mb-16">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-900">Why Choose Us</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=2070" 
                  alt="Team meeting" 
                  className="rounded-lg shadow-md"
                />
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">Comprehensive Reach</h3>
                  <p className="text-gray-600">Connect with businesses and customers across India through our extensive network.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">User-Friendly Platform</h3>
                  <p className="text-gray-600">Easy-to-use interface for managing your business profile and promotions.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">Dedicated Support</h3>
                  <p className="text-gray-600">Our team is always ready to help you succeed with personalized assistance.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">Affordable Solutions</h3>
                  <p className="text-gray-600">Flexible pricing options to suit businesses of all sizes and budgets.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
