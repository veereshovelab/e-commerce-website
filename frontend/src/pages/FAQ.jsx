import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LuSearch, LuX, LuHelpCircle } from 'react-icons/lu';
import { useTheme } from '../hooks/useTheme';
import Accordion from '../components/Accordion';

const FAQ = () => {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

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

  const categories = useMemo(() => [
    { title: 'Ordering & Operations', faqs: faqs.slice(0, 3) },
    { title: 'Shipping & Logistical Details', faqs: faqs.slice(3, 6) },
    { title: 'Account Security & Support', faqs: faqs.slice(6, 10) }
  ], []);

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return categories;

    return categories
      .map(category => {
        const matchingFaqs = category.faqs.filter(
          faq =>
            faq.title.toLowerCase().includes(query) ||
            faq.content.toLowerCase().includes(query)
        );
        return { ...category, faqs: matchingFaqs };
      })
      .filter(category => category.faqs.length > 0);
  }, [searchQuery, categories]);

  const totalMatches = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.faqs.length, 0);
  }, [filteredCategories]);

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
            Find quick answers to operations, shipping, accounts, and order management.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mt-8">
            <div className="relative flex items-center">
              <LuSearch className="absolute left-4 text-zinc-400 pointer-events-none" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g. shipping, return, payment)..."
                className={`w-full pl-11 pr-10 py-3.5 rounded-2xl text-sm outline-none border transition-all shadow-sm ${
                  isDarkMode
                    ? 'bg-zinc-900/80 border-zinc-800 text-white placeholder-zinc-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500'
                    : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition"
                  aria-label="Clear search query"
                >
                  <LuX size={16} />
                </button>
              )}
            </div>
            {searchQuery.trim() && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 text-center">
                Found {totalMatches} {totalMatches === 1 ? 'result' : 'results'} for "{searchQuery}"
              </p>
            )}
          </div>
        </div>
      </section>

      {/* FAQ content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {filteredCategories.length === 0 ? (
          <div className={`p-10 rounded-3xl border text-center my-6 ${
            isDarkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200'
          }`}>
            <div className="w-12 h-12 rounded-full bg-brand-500/10 text-brand-500 mx-auto flex items-center justify-center mb-3">
              <LuHelpCircle size={24} />
            </div>
            <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white mb-2">No matching questions</h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm mx-auto">
              We couldn't find any questions matching "{searchQuery}". Try a different search term or get in touch with our team.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="inline-block bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-glow-primary transition"
            >
              Clear Search Filter
            </button>
          </div>
        ) : (
          filteredCategories.map((category, index) => (
            <div key={category.title || index} className="mb-14 last:mb-0">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm sm:text-base font-display font-bold text-zinc-800 dark:text-white uppercase tracking-wider">
                  {category.title}
                </h2>
                <span className="text-xs font-medium text-zinc-400">
                  {category.faqs.length} {category.faqs.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <Accordion items={category.faqs} />
            </div>
          ))
        )}

        {/* Support CTA Callout */}
        <div className={`p-8 rounded-3xl border text-center shadow-premium mt-16 ${
          isDarkMode ? 'bg-zinc-900/40 border-zinc-850' : 'bg-white border-zinc-200'
        }`}>
          <h3 className="font-display font-bold text-xl text-zinc-900 dark:text-white mb-2">Still need help?</h3>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm mx-auto">
            If you could not find the answer to your questions, our support team is available 24/7.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-6 py-3 rounded-full shadow-glow-primary transition"
          >
            Contact Customer Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
