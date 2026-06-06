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
    { title: 'Ordering & Operations', faqs: faqs.slice(0, 3) },
    { title: 'Shipping & Logistical Details', faqs: faqs.slice(3, 6) },
    { title: 'Account Security & Support', faqs: faqs.slice(6, 10) }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={`relative py-24 px-4 sm:px-6 lg:px-8 border-b ${
        isDarkMode ? 'bg-zinc-950 border-zinc-900' : 'bg-zinc-50 border-zinc-200'
      }`}>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-brand-500/10 blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-xs uppercase tracking-widest font-semibold text-brand-500">FAQ Directory</span>
          <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-zinc-900 dark:text-white mt-3 mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Find answers to operations, safety, configurations, and general queries.
          </p>
        </div>
      </section>

      {/* FAQ content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {categories.map((category, index) => (
          <div key={index} className="mb-16 last:mb-0">
            <h2 className="text-lg font-display font-bold text-zinc-800 dark:text-white mb-6 uppercase tracking-wider">
              {category.title}
            </h2>
            <Accordion items={category.faqs} />
          </div>
        ))}

        {/* Support CTA Callout */}
        <div className={`p-8 rounded-3xl border text-center shadow-premium mt-16 ${
          isDarkMode ? 'bg-zinc-900/40 border-zinc-850' : 'bg-white border-zinc-200'
        }`}>
          <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white mb-2">Still need help?</h3>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm mx-auto">
            If you could not find the answer to your questions, our support team is available 24/7.
          </p>
          <a
            href="/contact"
            className="inline-block bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-6 py-3 rounded-full shadow-glow-primary transition"
          >
            Contact Customer Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
