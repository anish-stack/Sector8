import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Send, Target, BarChart, Users, FileText, Settings } from 'lucide-react';
import { ContactForm } from '../Contact/Contact';
import advsImage from './ads.jpg';

const Advertise = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const advertisingOptions = [
    {
      icon: <Layout className="w-8 h-8 text-blue-600" />,
      title: "Banner Ads",
      description: "Place visually appealing banner ads on our website to capture the attention of our visitors."
    },
    {
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      title: "Sponsored Content",
      description: "Collaborate with us to create engaging sponsored content that highlights your products or services."
    },
    {
      icon: <Settings className="w-8 h-8 text-blue-600" />,
      title: "Custom Campaigns",
      description: "Work with our team to develop custom advertising campaigns tailored to your specific needs and objectives."
    }
  ];

  const features = [
    {
      icon: <Target className="w-8 h-8 text-blue-500" />,
      title: "Targeted Reach",
      description: "Connect with your ideal audience through precise targeting options."
    },
    {
      icon: <BarChart className="w-8 h-8 text-blue-500" />,
      title: "Analytics",
      description: "Get detailed insights and performance metrics for your campaigns."
    },
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: "Wide Audience",
      description: "Access to a diverse and engaged user base across multiple sectors."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">


      {/* Advertising Options Section */}
      <motion.section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="text-center"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Amplify Your <span className="text-blue-600">Brand</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Transform your business with our powerful advertising solutions. Reach the right audience at the right time.
          </p>
        </motion.div>

        {/* Advertising Options Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mt-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {advertisingOptions.map((option, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="mb-4">{option.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
              <p className="text-gray-600">{option.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <motion.section 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Our Advertising Options</h2>
        <div className="space-y-8">
          {advertisingOptions.map((option, index) => (
            <motion.div
              key={index}
              className="flex items-start space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="flex-shrink-0 mt-1">{option.icon}</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{option.title}</h3>
                <p className="text-gray-600 mt-2">{option.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      </motion.section>

      {/* Contact Form Section */}
      <motion.section
        className="mx-auto px-4 sm:px-6 lg:px-8 py-16"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <ContactForm />
      </motion.section>
    </div>
  );
};

export default Advertise;
