import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQItem = ({ question, answer, isOpen, onClick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="border-b border-gray-200 py-4"
    >
      <button
        className="flex justify-between items-center w-full text-left focus:outline-none group"
        onClick={onClick}
      >
        <span className="text-lg font-bold text-gray-900 group-hover:text-indigo-600">
          {question}
        </span>
        <span className="ml-6 flex-shrink-0">
          {isOpen ? (
            <ChevronUp className="h-6 w-6 text-indigo-500" />
          ) : (
            <ChevronDown className="h-6 w-6 text-gray-400 group-hover:text-indigo-500" />
          )}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pr-12">
            <p className="text-base text-gray-600 leading-relaxed">
                {answer.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FAQItem;