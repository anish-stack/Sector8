import React, { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast'
export function ContactForm() {
  const [formData, setFormData] = useState({
    Name: '',
    PhoneNumber: '',
    Email: '',
    Subject: '',
    Message: ''
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await axios.post('https://api.naideal.com/api/v1/Other/Contact', formData)
      console.log(data.data)
      setStatus('success');
      toast.success(`We'll get back to you as soon as possible.`)
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.error)
      // setFormData({ name: '', email: '', subject: '', message: '' });
    }

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
              <button class="bg-green-500 mt-5 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
                <a href="/" class="no-underline">Go To Home</a>
              </button>

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
                    name="Name"
                    value={formData.Name}
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
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 
                             focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="PhoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="PhoneNumber"
                  name="PhoneNumber"
                  value={formData.PhoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 
                             focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="98586947895"
                />
              </div>
              <div>
                <label htmlFor="Subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="Subject"
                  name="Subject"
                  value={formData.Subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 
                           focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label htmlFor="Message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="Message"
                  name="Message"
                  value={formData.Message}
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