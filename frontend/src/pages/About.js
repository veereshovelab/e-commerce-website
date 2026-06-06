import React from 'react';
import { FiAward, FiUsers, FiGlobe, FiHeart } from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme';
import Carousel from '../components/Carousel';

const About = () => {
  const { isDarkMode } = useTheme();

  const stats = [
    { icon: FiUsers, label: 'Active Users', value: '50K+' },
    { icon: FiAward, label: 'Products', value: '10K+' },
    { icon: FiGlobe, label: 'Countries', value: '25+' },
    { icon: FiHeart, label: 'Happy Customers', value: '100K+' }
  ];

  const team = [
    { name: 'Sarah Johnson', role: 'CEO & Co-founder', image: '👩‍💼' },
    { name: 'Mike Chen', role: 'CTO', image: '👨‍💻' },
    { name: 'Emma Davis', role: 'Head of Design', image: '👩‍🎨' },
    { name: 'John Wilson', role: 'Head of Sales', image: '👨‍💼' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className={`${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-600 to-blue-700'} text-white py-16`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About ShopSphere</h1>
          <p className="text-xl opacity-90">Your trusted destination for premium products and exceptional shopping experience</p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <Icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Story */}
      <section className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} py-16`}>
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Our Story</h2>
          <div className="space-y-6 text-lg leading-relaxed">
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

      {/* Values */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Customer First', desc: 'We put our customers at the heart of everything we do' },
            { title: 'Quality', desc: 'We never compromise on product quality and standards' },
            { title: 'Innovation', desc: 'We continuously improve our platform and services' },
            { title: 'Integrity', desc: 'Honest, transparent, and ethical in all dealings' },
            { title: 'Community', desc: 'Building a community of trust and mutual respect' },
            { title: 'Sustainability', desc: 'Committed to environmentally responsible practices' }
          ].map((value, index) => (
            <div
              key={index}
              className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 text-center`}
            >
              <h3 className="text-xl font-bold mb-2">{value.title}</h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} py-16`}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
