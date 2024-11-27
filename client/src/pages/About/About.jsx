import React, { useEffect } from 'react';

const About = () => {
  useEffect(()=>{
    window.scrollTo({
        top:0,
        behavior:"smooth"
    })
},[])
  return (
    <div className="p-6 bg-gray-100 text-gray-800">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">About Us</h1>
        <p>
          Welcome to <strong>Naideal.com</strong>—India’s leading online platform dedicated to helping businesses grow, connect, and thrive in the digital world. 
          Our mission is simple: to provide businesses of all sizes with the tools and resources they need to expand their reach, enhance visibility, 
          and attract new customers through effective online listings and promotions.
        </p>
        <p className="mt-4">
          Founded by <strong>Mr. Rajeev Dhingra</strong>, Naideal.com empowers businesses across India by offering an intuitive and user-friendly platform where 
          entrepreneurs, small businesses, and large enterprises can easily list, promote, and market their products and services to a wide audience.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Story</h2>
        <p>
          At Naideal.com, we understand that visibility is key to success in today’s competitive business landscape. In an era where consumers are increasingly 
          turning to the internet to discover local services and products, we saw an opportunity to bridge the gap between businesses and their potential customers. 
          Our journey began with a vision to create a one-stop destination for businesses to showcase their offerings, find relevant deals, and create meaningful 
          connections within their local markets.
        </p>
        <p className="mt-4">
          Since our inception, we’ve grown rapidly and have become a trusted resource for businesses across India. What started as a humble platform has now evolved 
          into a comprehensive digital ecosystem that connects buyers and sellers from every corner of the country. Today, Naideal.com serves as the go-to online 
          listing directory for businesses of all kinds, providing services that cater to the unique needs of both small startups and established companies.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">What We Do</h2>
        <h3 className="text-lg font-medium text-gray-800 mb-2">1. Business Listing Services</h3>
        <p>
          Naideal.com offers an easy-to-use platform where businesses can create detailed profiles that include essential information such as:
        </p>
        <ul className="list-disc pl-6 mt-2">
          <li>Business Name</li>
          <li>Address & Contact Information</li>
          <li>Website & Social Media Links</li>
          <li>Product/Service Descriptions</li>
          <li>Business Hours</li>
          <li>Customer Reviews</li>
          <li>High-quality Images</li>
        </ul>
        <p className="mt-4">
          By listing your business with us, you gain exposure to a growing audience of consumers searching for products and services in your area. Our listing platform 
          is designed to be user-friendly, ensuring that you can create and manage your business profile with ease.
        </p>

        <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">2. Promotions and Deals</h3>
        <p>
          Businesses can post exclusive offers, sales, and promotions to attract new customers. Consumers can browse these offers by category, location, or business 
          type, ensuring maximum visibility and reach.
        </p>

        <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">3. Event Management & Business Promotion</h3>
        <p>
          We help businesses gain exposure through offline events, networking meetups, workshops, and promotional campaigns, enabling meaningful connections and growth opportunities.
        </p>

        <h3 className="text-lg font-medium text-gray-800 mt-4 mb-2">4. Premium Membership</h3>
        <p>
          For enhanced visibility, our premium membership offers top placement in search results, featured promotions, and targeted marketing campaigns to ensure businesses 
          reach the right audience at the right time.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h2>
        <p>
          Our mission is to provide businesses with an effective platform to promote themselves, reach new customers, and foster growth. We strive to offer unparalleled 
          support and innovative solutions, making digital marketing accessible and impactful for businesses of all sizes.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Why Choose Naideal.com?</h2>
        <ul className="list-disc pl-6">
          <li>Comprehensive Reach across India</li>
          <li>User-friendly interface for easy business management</li>
          <li>Affordable pricing options</li>
          <li>Dedicated customer support</li>
          <li>Targeted exposure to the right audience</li>
          <li>Focus on local and community connections</li>
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">How to Get Started</h2>
        <p>
          Getting started with Naideal.com is simple. Whether you're a new startup or an established business, the process of listing your business on our platform 
          is fast, easy, and straightforward:
        </p>
        <ol className="list-decimal pl-6 mt-2">
          <li>Create an Account: Sign up for a free account on Naideal.com.</li>
          <li>List Your Business: Fill in your business details, upload photos, and include information about your products or services.</li>
          <li>Enhance Your Listing: Opt for a premium membership to give your business a competitive edge and attract more customers.</li>
          <li>Promote Your Offers: Post your ongoing promotions and deals to drive traffic and sales.</li>
          <li>Engage in Events: Participate in our business events to meet new clients and partners.</li>
        </ol>
      </div>
    </div>
  );
};

export default About;
