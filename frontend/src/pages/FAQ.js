import React from 'react';
import { useTheme } from '../hooks/useTheme';
import Accordion from '../components/Accordion';

const FAQ = () => {
  const { isDarkMode } = useTheme();

  const faqs = [
    {
      title: 'How do I place an order?',
      content: 'Browse our products, add items to your cart, and proceed to checkout. Fill in your shipping address and choose a payment method to complete your purchase.'
    },
    {
      title: 'What payment methods do you accept?',
      content: 'We accept all major credit cards, debit cards, UPI, net banking, and digital wallets. All transactions are secure and encrypted.'
    },
    {
      title: 'What is your return policy?',
      content: 'We offer a 30-day money-back guarantee on all products. If you\'re not satisfied, simply initiate a return from your dashboard.'
    },
    {
      title: 'How long does shipping take?',
      content: 'Standard shipping takes 5-7 business days. Express shipping (2-3 days) is available for selected areas. Shipping is free on orders over $50.'
    },
    {
      title: 'Can I cancel my order?',
      content: 'Yes, you can cancel your order within 24 hours of placing it. After that, the order will be processed and cannot be cancelled.'
    },
    {
      title: 'How do I track my order?',
      content: 'You can track your order in real-time from your dashboard. We\'ll also send you email updates at each stage of delivery.'
    },
    {
      title: 'Is my personal information secure?',
      content: 'Yes, we use industry-standard SSL encryption to protect your personal and payment information. Your data is never shared with third parties.'
    },
    {
      title: 'Do you offer international shipping?',
      content: 'Currently, we ship to 25+ countries. International shipping rates vary by location. Check our shipping page for more details.'
    },
    {
      title: 'Can I change my order after placing it?',
      content: 'If your order hasn\'t been dispatched yet, you can make changes from your dashboard. Contact support if you need assistance.'
    },
    {
      title: 'How do I contact customer support?',
      content: 'You can reach our support team via email (support@shopsphere.com), phone, or live chat. We\'re available 24/7 to help.'
    }
  ];

  const categories = [
    { title: 'Ordering', faqs: faqs.slice(0, 3) },
    { title: 'Shipping & Delivery', faqs: faqs.slice(3, 6) },
    { title: 'Account & Security', faqs: faqs.slice(6, 10) }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className={`${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-blue-600 to-blue-700'} text-white py-16`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl opacity-90">Find answers to common questions about shopping with ShopSphere</p>
        </div>
      </section>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        {categories.map((category, index) => (
          <div key={index} className="mb-16">
            <h2 className="text-2xl font-bold mb-8">{category.title}</h2>
            <Accordion items={category.faqs} />
          </div>
        ))}

        {/* Help Section */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'} border rounded-lg p-8 mt-12 text-center`}>
          <h3 className="text-2xl font-bold mb-4">Didn't find your answer?</h3>
          <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Our support team is here to help you 24/7
          </p>
          <a
            href="/contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
