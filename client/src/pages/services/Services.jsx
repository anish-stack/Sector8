import React from "react";
import { Award, Building, MapPin, Star, Users } from "lucide-react";

import { ServiceCard } from "../About/ServiceCard";
import { StatsSection } from "../About/StatsSection";
import { ContactForm } from "../Contact/Contact";
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
const Services = () => {
  return (
    <div className="bg-white py-24">
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive solutions designed to help your business thrive in the
            digital age
          </p>
        </div>

        <div className="grid max-w-7xl mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </section>

      <StatsSection />
      <ContactForm/>
    </div>
  );
};

export default Services;
