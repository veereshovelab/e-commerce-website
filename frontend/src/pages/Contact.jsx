import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend, FiClock } from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'react-toastify';

const Contact = () => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      toast.success('Message sent successfully! We\'ll be in touch soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: FiMail, label: 'Email', value: 'support@shopsphere.com' },
    { icon: FiPhone, label: 'Phone', value: '+1 (555) 123-4567' },
    { icon: FiMapPin, label: 'Address', value: '123 Commerce St, New York, NY 10001' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={`relative py-24 px-4 sm:px-6 lg:px-8 border-b ${
        isDarkMode ? 'bg-zinc-950 border-zinc-900' : 'bg-zinc-50 border-zinc-200'
      }`}>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-brand-500/10 blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-xs uppercase tracking-widest font-semibold text-brand-500">Get in Touch</span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-zinc-900 dark:text-white mt-3 mb-6">
            Contact Us
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Have questions about dimensions, orders, or custom specs? We are here to help.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Info Details */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-zinc-900 dark:text-white mb-4">How Can We Help?</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
                Our support agents work directly with engineering, logistics, and quality assurance to resolve questions with maximum speed and context.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl border flex-shrink-0 ${
                      isDarkMode ? 'bg-zinc-900 border-zinc-850 text-brand-400' : 'bg-zinc-50 border-zinc-200 text-brand-600'
                    }`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{info.label}</h4>
                      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-250 mt-1">{info.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Response Notice */}
            <div className={`p-5 rounded-2xl border flex items-center space-x-3.5 ${
              isDarkMode ? 'bg-zinc-900/40 border-zinc-850 text-brand-400' : 'bg-brand-50/50 border-brand-100/50 text-brand-600'
            }`}>
              <FiClock className="flex-shrink-0" size={18} />
              <p className="text-xs font-semibold uppercase tracking-wider">
                Our average response time is under 4 hours.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className={`p-8 rounded-3xl border shadow-premium ${
            isDarkMode ? 'bg-zinc-900/40 border-zinc-850' : 'bg-white border-zinc-200'
          }`}>
            <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white mb-6">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Sarah Jenkins"
                  className={`w-full px-4 py-2.5 text-sm rounded-xl outline-none border focus:ring-1 focus:ring-brand-500 ${
                    isDarkMode 
                      ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-650 focus:border-zinc-700' 
                      : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-zinc-300'
                  }`}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="sarah@example.com"
                  className={`w-full px-4 py-2.5 text-sm rounded-xl outline-none border focus:ring-1 focus:ring-brand-500 ${
                    isDarkMode 
                      ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-650 focus:border-zinc-700' 
                      : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-zinc-300'
                  }`}
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Need order update"
                  className={`w-full px-4 py-2.5 text-sm rounded-xl outline-none border focus:ring-1 focus:ring-brand-500 ${
                    isDarkMode 
                      ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-650 focus:border-zinc-700' 
                      : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-zinc-300'
                  }`}
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please describe how we can assist..."
                  className={`w-full px-4 py-2.5 text-sm rounded-xl outline-none border focus:ring-1 focus:ring-brand-500 resize-none ${
                    isDarkMode 
                      ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-650 focus:border-zinc-700' 
                      : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-zinc-300'
                  }`}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold shadow-glow-primary hover:shadow-lg transition flex items-center justify-center space-x-2 text-sm"
              >
                <FiSend size={15} />
                <span>{loading ? 'Sending Request...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
