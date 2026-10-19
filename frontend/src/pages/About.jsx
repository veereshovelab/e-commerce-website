import React from 'react';
import { Link } from 'react-router-dom';
import {
  LuAward,
  LuUsers,
  LuGlobe,
  LuHeart,
  LuShoppingBag,
  LuArrowRight,
  LuHeadphones,
  LuShieldCheck,
  LuZap,
  LuSparkles,
  LuLeaf
} from 'react-icons/lu';
import { useTheme } from '../hooks/useTheme';

const About = () => {
  const { isDarkMode } = useTheme();

  const stats = [
    { icon: LuUsers, label: 'Active Users', value: '50K+' },
    { icon: LuAward, label: 'Products', value: '10K+' },
    { icon: LuGlobe, label: 'Countries Served', value: '25+' },
    { icon: LuHeart, label: 'Happy Customers', value: '100K+' }
  ];

  const values = [
    {
      icon: LuHeart,
      title: 'Customer First',
      desc: 'We put our customers at the heart of everything we do.'
    },
    {
      icon: LuAward,
      title: 'Premium Quality',
      desc: 'We never compromise on product authenticity and specifications.'
    },
    {
      icon: LuZap,
      title: 'Constant Innovation',
      desc: 'We continuously improve our platform to offer the fastest tools.'
    },
    {
      icon: LuShieldCheck,
      title: 'Absolute Integrity',
      desc: 'Honest, transparent, and ethical in all supply networks.'
    },
    {
      icon: LuSparkles,
      title: 'Ecosystem Trust',
      desc: 'Building long-term trust and mutual respect with creators.'
    },
    {
      icon: LuLeaf,
      title: 'Sustainability',
      desc: 'Committed to environmentally friendly shipping standards.'
    }
  ];

  const team = [
    { name: 'Sarah Johnson', role: 'CEO & Co-founder', initials: 'SJ', bg: 'from-blue-500/10 to-indigo-500/10' },
    { name: 'Mike Chen', role: 'CTO', initials: 'MC', bg: 'from-emerald-500/10 to-teal-500/10' },
    { name: 'Emma Davis', role: 'Head of Design', initials: 'ED', bg: 'from-pink-500/10 to-rose-500/10' },
    { name: 'John Wilson', role: 'Head of Sales', initials: 'JW', bg: 'from-violet-500/10 to-purple-500/10' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={`relative py-24 px-4 sm:px-6 lg:px-8 border-b ${
        isDarkMode ? 'bg-zinc-950 border-zinc-900' : 'bg-zinc-50 border-zinc-200'
      }`}>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-brand-500/10 blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-xs uppercase tracking-widest font-semibold text-brand-500">Our Identity</span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-zinc-900 dark:text-white mt-3 mb-6">
            About ShopSphere
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
            Your trusted destination for premium products, crafted with precision and delivered with peerless speed and service.
          </p>
        </div>
      </section>

      {/* Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`p-6 rounded-2xl border text-center shadow-premium transition-all duration-300 hover:-translate-y-1 ${
                  isDarkMode ? 'bg-zinc-900/40 border-zinc-850' : 'bg-white border-zinc-200'
                }`}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 text-brand-500 bg-brand-500/10">
                  <Icon size={20} />
                </div>
                <p className="text-3xl font-display font-bold text-zinc-900 dark:text-white">{stat.value}</p>
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Story Segment */}
      <section className={`py-20 border-t border-b ${isDarkMode ? 'bg-zinc-900/20 border-zinc-900' : 'bg-zinc-50 border-zinc-200'}`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs uppercase tracking-widest font-semibold text-brand-500">Timeline</span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900 dark:text-white mt-2 mb-8">Our Story</h2>
          <div className="space-y-6 text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            <p>
              Founded in 2020, ShopSphere began with a simple mission: to revolutionize online shopping by providing
              customers with an exceptional experience, premium products, and outstanding customer service.
            </p>
            <p>
              We started small, but with a clear vision and dedicated team, we've grown to become a trusted e-commerce
              platform serving thousands of customers worldwide. Today, we pride ourselves on our curated selection of
              products, competitive prices, and commitment to customer satisfaction.
            </p>
            <p>
              Every product in our catalog is carefully selected to ensure quality and value. We work directly with
              manufacturers and suppliers to bring you authentic, premium products at fair prices.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest font-semibold text-brand-500">Principles</span>
          <h2 className="text-3xl font-display font-bold tracking-tight text-zinc-900 dark:text-white mt-2 mb-4">
            Our Core Values
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            These foundational values guide our product selection, customer care, and operations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((val, index) => {
            const Icon = val.icon;
            return (
              <div
                key={index}
                className={`p-6 rounded-2xl border shadow-premium transition-all duration-300 hover:-translate-y-1 ${
                  isDarkMode
                    ? 'bg-zinc-900/40 border-zinc-850 hover:border-zinc-700'
                    : 'bg-white border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-brand-500 bg-brand-500/10">
                  <Icon size={20} />
                </div>
                <h3 className="font-display font-bold text-base text-zinc-800 dark:text-white mb-2">{val.title}</h3>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Team */}
      <section className={`py-20 border-t ${isDarkMode ? 'bg-zinc-900/20 border-zinc-900' : 'bg-zinc-50 border-zinc-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest font-semibold text-brand-500">Leadership</span>
            <h2 className="text-3xl font-display font-bold tracking-tight text-zinc-900 dark:text-white mt-2 mb-4">
              Our Team
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              The builders, designers, and innovators steering the ShopSphere vision.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl border text-center shadow-premium transition-all duration-300 hover:-translate-y-1 ${
                  isDarkMode ? 'bg-zinc-900/60 border-zinc-850' : 'bg-white border-zinc-200'
                }`}
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${member.bg} flex items-center justify-center font-bold font-display text-lg text-brand-500 mx-auto mb-4`}>
                  {member.initials}
                </div>
                <h3 className="font-display font-bold text-sm text-zinc-800 dark:text-white">{member.name}</h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 uppercase tracking-wider">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className={`py-20 border-t ${
        isDarkMode ? 'bg-zinc-950 border-zinc-900' : 'bg-zinc-50 border-zinc-200'
      }`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`relative overflow-hidden rounded-3xl p-8 sm:p-12 border text-center ${
            isDarkMode
              ? 'bg-gradient-to-b from-zinc-900/90 to-zinc-900/40 border-zinc-800'
              : 'bg-gradient-to-b from-white to-zinc-50 border-zinc-200 shadow-premium'
          }`}>
            <div className="absolute top-0 right-1/4 w-64 h-64 rounded-full bg-brand-500/10 blur-[80px] pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="text-xs uppercase tracking-widest font-semibold text-brand-500">Get Started</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-zinc-900 dark:text-white mt-2 mb-4">
                Ready to Experience ShopSphere?
              </h2>
              <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
                Discover our handpicked catalog of premium electronics, fashion, and lifestyle essentials with fast shipping and 24/7 dedicated support.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/products"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-glow-primary transition"
                >
                  <LuShoppingBag size={18} />
                  <span>Explore Catalog</span>
                  <LuArrowRight size={16} />
                </Link>
                <Link
                  to="/contact"
                  className={`w-full sm:w-auto inline-flex items-center justify-center space-x-2 font-semibold text-sm px-6 py-3.5 rounded-xl border transition ${
                    isDarkMode
                      ? 'border-zinc-700 bg-zinc-850 hover:bg-zinc-800 text-zinc-200'
                      : 'border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-800'
                  }`}
                >
                  <LuHeadphones size={18} />
                  <span>Contact Support</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
