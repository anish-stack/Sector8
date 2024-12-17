import React from 'react';
import { Award, Building, MapPin, Star, Users, Briefcase, Tag, Megaphone, } from 'lucide-react';
import { StatsSection } from './StatsSection';
import { ServiceCard } from './ServiceCard';
import { AboutHero } from './AboutHero';
const services = [
  {
    icon: Building,
    title: "Post Listing Services",
    description: "We provide a platform where businesses can list their products, services, or promotions to reach a wider audience. Whether you are launching a new product or sharing a limited-time offer, Naideal is the ideal space to showcase what your business has to offer",
    iconColor: "bg-blue-600",
  },
  {
    icon: Star,
    title: "Product and Business Promotion",
    description: "Our platform is designed to support your business promotion needs. Whether you're an established brand or a small startup, we offer tailored solutions to promote your products and services effectively. We help you get the word out, connect with the right audience, and grow your customer base",
    iconColor: "bg-yellow-500",
  },
  {
    icon: Users,
    title: "Offers and Deals",
    description: "At Naideal, we bring great deals and exclusive offers from various businesses together in one place. By partnering with us, businesses can provide discounts, offers, and promotions that entice potential customers to take action, increasing your sales and customer engagement.",
    iconColor: "bg-green-600",
  },
  {
    icon: MapPin,
    title: "Brand Building",
    description: "Every business deserves a strong, recognizable brand. We help you build and strengthen your brand identity through effective strategies, ensuring your business stands out in the crowded marketplace.",
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
        <section className=" py-12 px-4 lg:px-16">
          {/* Container */}
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
                Welcome to <span className="text-green-500">Naideal!</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                At Naideal, we are committed to helping businesses grow, expand their reach,
                and connect with the right audience through effective promotions, listings,
                and strategic brand-building efforts.
              </p>
            </div>

            {/* Founder */}
            <div className="text-center mb-8">
              <p className="text-md text-gray-700 italic">
                Founded by <span className="font-semibold">Rajeev Dhingra</span>, our platform
                serves as a bridge between businesses and their potential customers, allowing both
                to thrive in today’s competitive market.
              </p>
            </div>

            {/* Mission */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Our Mission</h2>
              <p className="text-md text-gray-600 leading-relaxed">
                Our mission is simple: to empower businesses with the tools and services they need to succeed.
                Through strategic post listings, exclusive offers, and compelling deals, Naideal offers a dynamic space
                for businesses to promote their products and services. We are passionate about helping brands gain visibility,
                build recognition, and foster long-lasting customer relationships.
              </p>
            </div>

          </div>
        </section>
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Do</h2>
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
                  <h3 className="text-xl font-semibold text-gray-900">Experience and Expertise</h3>
                  <p className="text-gray-600">With years of experience in the industry, Rajeev Dhingra and the Naideal team understand what works when it comes to digital marketing and promotions. We bring this expertise to every project, ensuring maximum impact.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">Tailored Solutions</h3>
                  <p className="text-gray-600">We believe that no two businesses are alike. That’s why we offer personalized services that cater to your specific needs. Whether you’re looking for a simple product listing or a full-scale promotional campaign, we are here to help.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">Commitment to Success</h3>
                  <p className="text-gray-600">Your success is our success. We are dedicated to helping your business grow through effective promotion and exposure. When you succeed, we succeed, and that’s what drives us to keep providing the best possible service.</p>
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
