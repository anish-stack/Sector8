import React, { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('success');
    setFormData({ name: '', email: '', subject: '', message: '' });
    // Handle form submission logic here
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5" />
      
      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-purple-100 rounded-full mb-6">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get in Touch
            </h2>
            
            <p className="text-gray-600 max-w-2xl mx-auto">
              Have questions about our travel packages or need custom arrangements? 
              We're here to help make your dream vacation a reality.
            </p>
          </div>

          {status === 'success' ? (
            <div className="bg-green-50 text-green-700 px-6 py-4 rounded-lg text-center">
              <p className="font-medium">Thank you for your message!</p>
              <p className="text-sm mt-1">We'll get back to you as soon as possible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 
                             focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 
                             focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 
                           focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 
                           focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Tell us more about your travel plans..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 
                           text-white rounded-lg font-medium inline-flex items-center 
                           justify-center hover:opacity-90 transition-opacity"
                >
                  Send Message
                  <Send className="w-4 h-4 ml-2" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}