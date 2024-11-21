import React from 'react';
import advsImage from './ads.jpg';

const Advertise = () => {
  return (
    <>
      <section className="max-w-screen-xl mx-auto p-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mt-8 mb-6">Advertise With Us</h1>

        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start mb-8">
          <div className="lg:w-3/5 lg:pr-8 mb-8 lg:mb-0">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Advertise With Us?</h2>
            <p className="text-gray-600 mb-4">
              Partner with us to reach a larger audience and promote your brand. Our advertising options are flexible and designed to meet your needs. By advertising with us, you can leverage our platform to increase your visibility and drive more engagement with your target audience.
            </p>
            <p className="text-gray-600 mb-4">
              We offer a variety of advertising solutions, including banner ads, sponsored content, and custom campaigns. Our team will work with you to create an effective strategy that aligns with your marketing goals.
            </p>
            <p className="text-gray-600 mb-4">
              Fill out the form on the right to get in touch with our advertising team. We look forward to collaborating with you!
            </p>
          </div>

          <div className="lg:w-2/5 lg:pl-8 w-full">
            <img src={advsImage} alt="Advertise With Us" className="rounded-md shadow-md" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start">

          <div className="lg:w-3/5 lg:pr-8 mb-8 lg:mb-0">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Advertising Options</h3>
            <p className="text-gray-600 mb-4">
              <strong>Banner Ads:</strong> Place visually appealing banner ads on our website to capture the attention of our visitors.
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Sponsored Content:</strong> Collaborate with us to create engaging sponsored content that highlights your products or services.
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Custom Campaigns:</strong> Work with our team to develop custom advertising campaigns tailored to your specific needs and objectives.
            </p>
            <p className="text-gray-600 mb-4">
              Our goal is to provide you with effective advertising solutions that deliver measurable results. Contact us today to learn more about our advertising options and how we can help you achieve your marketing goals.
            </p>
          </div>

          <div className="lg:w-2/5 lg:pl-8 w-full  bg-white p-6 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get In Touch</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Your Name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Your Email"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Message</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Your Message"
                  rows="4"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Advertise;
