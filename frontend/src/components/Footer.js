import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme';

const Footer = () => {
  const { isDarkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${isDarkMode ? 'bg-gray-900 text-gray-100 border-gray-800' : 'bg-gray-900 text-gray-100'} border-t mt-20`}>
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ShopSphere
            </h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Premium shopping experience for products you love, delivered with excellence.
            </p>
            <div className="flex space-x-4">
              <a href="#" title="Facebook" className="text-gray-400 hover:text-blue-400 transition">
                <FiFacebook size={20} />
              </a>
              <a href="#" title="Twitter" className="text-gray-400 hover:text-blue-400 transition">
                <FiTwitter size={20} />
              </a>
              <a href="#" title="Instagram" className="text-gray-400 hover:text-pink-400 transition">
                <FiInstagram size={20} />
              </a>
              <a href="#" title="LinkedIn" className="text-gray-400 hover:text-blue-400 transition">
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Shopping */}
          <div>
            <h4 className="font-bold mb-6 text-white text-lg">Shopping</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-gray-400 hover:text-white transition">
                  Wishlist
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Best Sellers
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-6 text-white text-lg">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition">
                  FAQs
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-6 text-white text-lg">Support</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-6 text-white text-lg">Contact</h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <FiMail className="text-blue-400 flex-shrink-0 mt-1" size={16} />
                <div>
                  <p className="font-semibold">Email</p>
                  <a href="mailto:support@shopsphere.com" className="text-gray-400 hover:text-white transition">
                    support@shopsphere.com
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FiPhone className="text-blue-400 flex-shrink-0 mt-1" size={16} />
                <div>
                  <p className="font-semibold">Phone</p>
                  <a href="tel:+15551234567" className="text-gray-400 hover:text-white transition">
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FiMapPin className="text-blue-400 flex-shrink-0 mt-1" size={16} />
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-gray-400">123 Commerce St<br />New York, NY 10001</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className={`border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-700'} mb-8`}></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} ShopSphere. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              Cookie Policy
            </a>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-800'} border rounded-lg p-6 mt-8 text-center`}>
          <h3 className="font-bold text-lg mb-2">Subscribe to Our Newsletter</h3>
          <p className="text-gray-400 text-sm mb-4">Get updates on new products and exclusive offers</p>
          <form className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-l-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg transition font-medium"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
