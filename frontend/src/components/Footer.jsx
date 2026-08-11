import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'react-toastify';

const Footer = () => {
  const { isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success('Thank you for subscribing!');
      setEmail('');
    }
  };

  return (
    <footer className={`border-t transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-zinc-950 text-zinc-400 border-zinc-900' 
        : 'bg-zinc-50 text-zinc-500 border-zinc-200'
    } mt-24`}>
      {/* Newsletter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 border-b border-zinc-200/60 dark:border-zinc-900">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <h3 className="font-display font-bold text-xl md:text-2xl text-zinc-800 dark:text-white mb-2 tracking-tight">
              Keep up with the latest trends
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Subscribe to our newsletter for exclusive offers, new product alerts, and seasonal sales.
            </p>
          </div>
          <div>
            <form onSubmit={handleSubscribe} className="relative flex items-center">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-4 pr-12 py-3 rounded-xl text-sm outline-none border focus:ring-1 focus:ring-brand-500 transition-all ${
                  isDarkMode 
                    ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500' 
                    : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400'
                }`}
              />
              <button
                type="submit"
                className="absolute right-2 p-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg shadow-glow-primary transition"
                title="Subscribe"
              >
                <FiSend size={15} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Logo and Intro */}
          <div className="lg:col-span-1">
            <span className="text-xl font-bold font-display tracking-tight bg-gradient-to-r from-brand-500 to-indigo-500 bg-clip-text text-transparent mb-4 block">
              ShopSphere
            </span>
            <p className="text-xs leading-relaxed text-zinc-400 dark:text-zinc-500 mb-6">
              A premium, curated online marketplace delivering exceptional craftsmanship and unparalleled service globally.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-3.5">
              {[
                { icon: FiFacebook, link: '#', title: 'Facebook' },
                { icon: FiTwitter, link: '#', title: 'Twitter' },
                { icon: FiInstagram, link: '#', title: 'Instagram' },
                { icon: FiLinkedin, link: '#', title: 'LinkedIn' }
              ].map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.link}
                    title={social.title}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-2 rounded-full border text-zinc-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors ${
                      isDarkMode ? 'border-zinc-850 bg-zinc-900/40' : 'border-zinc-200 bg-white'
                    }`}
                  >
                    <IconComponent size={15} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Links: Shopping */}
          <div>
            <h4 className="font-display font-semibold text-xs tracking-widest text-zinc-800 dark:text-white uppercase mb-5">
              Shopping
            </h4>
            <ul className="space-y-3.5 text-sm">
              {['All Products', 'Wishlist', 'New Arrivals', 'Featured Items'].map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item === 'All Products' ? '/products' : item === 'Wishlist' ? '/wishlist' : '/products'}
                    className="nav-link-hover text-zinc-500 hover:text-brand-500 dark:text-zinc-400 dark:hover:text-brand-400 text-xs font-medium transition"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links: Company */}
          <div>
            <h4 className="font-display font-semibold text-xs tracking-widest text-zinc-800 dark:text-white uppercase mb-5">
              Company
            </h4>
            <ul className="space-y-3.5 text-sm">
              {[
                { label: 'About Us', path: '/about' },
                { label: 'FAQs', path: '/faq' },
                { label: 'Careers', path: '#' },
                { label: 'Press Kit', path: '#' }
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.path}
                    className="nav-link-hover text-zinc-500 hover:text-brand-500 dark:text-zinc-400 dark:hover:text-brand-400 text-xs font-medium transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links: Support */}
          <div>
            <h4 className="font-display font-semibold text-xs tracking-widest text-zinc-800 dark:text-white uppercase mb-5">
              Support
            </h4>
            <ul className="space-y-3.5 text-sm">
              {[
                { label: 'Contact Us', path: '/contact' },
                { label: 'Shipping Policy', path: '#' },
                { label: 'Refunds & Returns', path: '#' },
                { label: 'Security & Terms', path: '#' }
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.path}
                    className="nav-link-hover text-zinc-500 hover:text-brand-500 dark:text-zinc-400 dark:hover:text-brand-400 text-xs font-medium transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-display font-semibold text-xs tracking-widest text-zinc-800 dark:text-white uppercase mb-5">
              Get in Touch
            </h4>
            <div className="space-y-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <div className="flex items-start space-x-2.5">
                <FiMail className="text-brand-500 flex-shrink-0 mt-0.5" size={14} />
                <div>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">Email</p>
                  <a href="mailto:support@shopsphere.com" className="hover:text-brand-500 dark:hover:text-brand-400 transition">
                    support@shopsphere.com
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-2.5">
                <FiPhone className="text-brand-500 flex-shrink-0 mt-0.5" size={14} />
                <div>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">Support Line</p>
                  <a href="tel:+15551234567" className="hover:text-brand-500 dark:hover:text-brand-400 transition">
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-2.5">
                <FiMapPin className="text-brand-500 flex-shrink-0 mt-0.5" size={14} />
                <div>
                  <p className="font-semibold text-zinc-800 dark:text-zinc-200">Headquarters</p>
                  <p className="text-zinc-400 dark:text-zinc-500 mt-0.5">123 Commerce St, New York, NY 10001</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-200/60 dark:border-zinc-900 mt-16 mb-8" />

        {/* Bottom Credits */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
          <p>&copy; {currentYear} ShopSphere Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-zinc-850 dark:hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-850 dark:hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-zinc-850 dark:hover:text-white transition">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
