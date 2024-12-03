import React from "react";
import { Award, Building, MapPin, Star, Users } from "lucide-react";

import { ServiceCard } from "../About/ServiceCard";
import { StatsSection } from "../About/StatsSection";
import { ContactForm } from "../Contact/Contact";
const servicesData = [
  {
    icon: Building,
    title: "Business Listing Services",
    description:
      "Create detailed business profiles with comprehensive information, photos, and customer reviews.",
    iconColor: "bg-blue-600",
  },
  {
    icon: Star,
    title: "Promotions and Deals",
    description:
      "Post exclusive offers and promotions to attract new customers and grow your business.",
    iconColor: "bg-yellow-500",
  },
  {
    icon: Users,
    title: "Event Management",
    description:
      "Participate in networking events, workshops, and promotional campaigns to expand your reach.",
    iconColor: "bg-green-600",
  },
  {
    icon: MapPin,
    title: "Premium Membership",
    description:
      "Get premium features including top placement in search results and targeted marketing campaigns.",
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
          {servicesData.map((service, index) => (
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
