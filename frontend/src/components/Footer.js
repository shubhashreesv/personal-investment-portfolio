import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-500 text-sm">
            © 2024 InvestAnalyzer. All rights reserved.
          </div>
          <div className="flex gap-8">
            <Link to="/about" className="footer-link">
              About
            </Link>
            <Link to="/faq" className="footer-link">
              FAQ
            </Link>
            <Link to="/help" className="footer-link">
              Help
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;