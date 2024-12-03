import React, { useState } from 'react';
import { Send, Mail } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('subscribed');
    setEmail('');
    // Handle newsletter subscription logic here
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10" />
      
      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block p-3 bg-purple-100 rounded-full mb-6">
            <Mail className="w-6 h-6 text-purple-600" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Exclusive  Deals & Offer Near You
          </h2>
          
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and receive special offers, travel tips, and insider recommendations straight to your inbox.
          </p>

          {status === 'subscribed' ? (
            <div className="bg-green-50 text-green-700 px-6 py-4 rounded-lg inline-flex items-center">
              <span className="mr-2">✓</span> Thanks for subscribing!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-6 py-4 rounded-full border border-gray-300 
                         focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 
                         text-white rounded-full font-medium inline-flex items-center 
                         justify-center hover:opacity-90 transition-opacity"
              >
                Subscribe
                <Send className="w-4 h-4 ml-2" />
              </button>
            </form>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Weekly Updates
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Exclusive Offers
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              No Spam
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}