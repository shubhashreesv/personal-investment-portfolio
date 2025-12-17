import React from 'react';
import { BookOpen, MessageCircle, Mail } from 'lucide-react';

const Help = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-semibold text-gray-900 mb-4">Help Center</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We're here to assist you! Explore our resources and get help when you need it.
        </p>
      </div>

      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
        {/* Documentation Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex gap-6 items-center mb-6">
            <BookOpen size={28} className="text-primary-500" />
            <h3 className="text-2xl font-semibold text-gray-800">Documentation</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Explore our comprehensive documentation to learn about all features and how to use them effectively.
          </p>
          <a
            href="#"
            className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition duration-300"
          >
            View Documentation
          </a>
        </div>

        {/* Live Chat Support Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex gap-6 items-center mb-6">
            <MessageCircle size={28} className="text-primary-500" />
            <h3 className="text-2xl font-semibold text-gray-800">Live Chat Support</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Get instant help from our support team during business hours.
          </p>
          <button className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition duration-300">
            Start Chat
          </button>
        </div>

        {/* Email Support Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex gap-6 items-center mb-6">
            <Mail size={28} className="text-primary-500" />
            <h3 className="text-2xl font-semibold text-gray-800">Email Support</h3>
          </div>
          <p className="text-gray-600 mb-6">
            Send us an email and we'll get back to you within 24 hours.
          </p>
          <a
            href="mailto:support@investanalyzer.com"
            className="inline-block bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition duration-300"
          >
            Email Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default Help;
