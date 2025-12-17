import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, PieChart, Bell, Download } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-primary-500 mb-4">
          Track Your Investments Smarter
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          Monitor your portfolio performance, analyze investments, and make informed decisions with our powerful investment tracking platform.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
  {[
    {
      icon: <TrendingUp className="h-12 w-12 text-primary-500 mb-4" />,
      title: 'Portfolio Tracking',
      description:
        'Track your investments in real-time with automatic updates and performance metrics.',
    },
    {
      icon: <PieChart className="h-12 w-12 text-primary-500 mb-4" />,
      title: 'Investment Analysis',
      description:
        'Get detailed insights into your portfolio’s diversification and performance.',
    },
    {
      icon: <Bell className="h-12 w-12 text-primary-500 mb-4" />,
      title: 'Smart Alerts',
      description:
        'Receive notifications when your investments hit specific thresholds.',
    },
  ].map((feature, index) => (
    <div
      key={index}
      className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
    >
      {feature.icon}
      <h3 className="text-xl font-semibold text-text-primary mb-2">
        {feature.title}
      </h3>
      <p className="text-text-secondary">{feature.description}</p>
    </div>
  ))}
</div>



      <div className="text-center">
        <Link
          to="/auth"
          className="inline-block bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Home;