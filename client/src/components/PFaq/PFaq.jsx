import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BadgeHelp, Mail, Phone } from 'lucide-react';
import FAQItem from '../CFaq/FAQItem';
import { faqData } from './faqData';

function Pfaq() {
  const [openIndex, setOpenIndex] = useState(null);

  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-4"
          >
            <BadgeHelp className="h-16 w-16 text-indigo-600" />
          </motion.div>
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-sm text-gray-600">
            Welcome to the Naideal.com FAQ page! Here, you’ll find answers to some of the most common questions about our services. Whether you need help with posting a listing, promoting your offers, or understanding how our platform works, we’ve got you covered.
          </p>
          <hr />
          <p>If you don’t find the answer you’re looking for, feel free to contact us directly.</p>
        </div>

        <div className="bg-white rounded-xl shadow-xl">
          <div className="px-6 py-8">
            {faqData.map((faq, index) => (
              <FAQItem
                key={index}
                index={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => handleClick(index)}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center bg-indigo-50 rounded-lg p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Still Have Questions?
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            Our team is here to help you make the most of Naideal.com's services
          </p>
          <div className="flex justify-center space-x-8">
            <a
              href="mailto:care@yahoo.com"
              className="flex items-center text-indigo-600 hover:text-indigo-500"
            >
              <Mail className="h-5 w-5 mr-2" />
              care@yahoo.com
            </a>
            <span className="flex items-center text-indigo-600">
              <Phone className="h-5 w-5 mr-2" />
              099-5382-5382
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Pfaq;