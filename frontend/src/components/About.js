import React from 'react';
import { TrendingUp, Shield, Clock } from 'lucide-react';

const About = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold text-primary-500 mb-4 animate-slide-down">
          About InvestAnalyzer
        </h2>
        <p className="text-neutral-600">
          Your trusted companion for smart investment tracking and analysis.
        </p>
      </div>

      <div className="grid gap-8 animate-scale-up">
        {[
          {
            icon: <TrendingUp size={24} className="text-primary-500" />,
            title: 'Our Mission',
            description:
              'We aim to empower investors with powerful tools and insights to make informed investment decisions and achieve their financial goals.',
          },
          {
            icon: <Shield size={24} className="text-primary-500" />,
            title: 'Security First',
            description:
              'Your data security is our top priority. We use industry-standard encryption and security measures to protect your information.',
          },
          {
            icon: <Clock size={24} className="text-primary-500" />,
            title: 'Real-time Updates',
            description:
              'Stay informed with real-time market data and portfolio updates, helping you make timely investment decisions.',
          },
        ].map((item, index) => (
          <div key={index} className="flex gap-4 items-start">
            {item.icon}
            <div>
              <h3 className="text-xl font-semibold text-primary-500 mb-2">
                {item.title}
              </h3>
              <p className="text-neutral-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-secondary-50 p-6 rounded-lg shadow-lg animate-fade-in">
        <h3 className="text-xl font-semibold text-primary-500 mb-4">
          Contact Us
        </h3>
        <p className="text-neutral-600 mb-4">
          Have questions or feedback? We'd love to hear from you.
        </p>
        <a
          href="mailto:support@investanalyzer.com"
          className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-transform transform hover:scale-105"
        >
          Get in Touch
        </a>
      </div>
    </div>
  );
};

export default About;