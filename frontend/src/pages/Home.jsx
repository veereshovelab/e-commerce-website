import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheckCircle, FiShield, FiTrendingUp, FiTruck } from 'react-icons/fi';
import { motion } from 'framer-motion';
import apiClient from '../utils/api';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/Skeleton';
import { useTheme } from '../hooks/useTheme';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [featured, trending] = await Promise.all([
          apiClient.get('/products/featured'),
          apiClient.get('/products/trending')
        ]);
        setFeaturedProducts(featured.data.products || []);
        setTrendingProducts(trending.data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  const stats = [
    { icon: FiTruck, title: 'Free Global Shipping', desc: 'On orders over $150' },
    { icon: FiCheckCircle, title: 'Authenticity Guaranteed', desc: '100% genuine products' },
    { icon: FiShield, title: 'Secure Transactions', desc: 'End-to-end encrypted checkouts' },
    { icon: FiTrendingUp, title: '24/7 Dedicated Support', desc: 'Help at any point of order' }
  ];

  const categories = [
    { name: 'Electronics', icon: '💻', count: '1.2k+ products', bgGradient: 'from-blue-500/10 to-indigo-500/10' },
    { name: 'Fashion', icon: '👕', count: '4.8k+ products', bgGradient: 'from-pink-500/10 to-rose-500/10' },
    { name: 'Home', icon: '🏡', count: '850+ products', bgGradient: 'from-amber-500/10 to-orange-500/10' },
    { name: 'Sports', icon: '⚽', count: '620+ products', bgGradient: 'from-emerald-500/10 to-teal-500/10' },
    { name: 'Books', icon: '📚', count: '2.1k+ products', bgGradient: 'from-violet-500/10 to-purple-500/10' }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className={`relative min-h-[90vh] flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8 border-b ${
        isDarkMode 
          ? 'bg-zinc-950 border-zinc-900' 
          : 'bg-zinc-50 border-zinc-200'
      }`}>
        {/* Glow Spheres (Ambient Background Effects) */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-brand-500/15 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-indigo-500/15 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 border ${
                isDarkMode 
                  ? 'bg-zinc-900 border-zinc-800 text-brand-400' 
                  : 'bg-white border-zinc-200 text-brand-600'
              }`}>
                <span>🚀 Introducing ShopSphere 2.0</span>
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6 leading-[1.08] text-zinc-950 dark:text-white">
                Next-Gen <span className="text-gradient">E-Commerce</span> Experience.
              </h1>
              <p className="text-base sm:text-lg mb-10 leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-lg">
                Discover a curated universe of premium products from elite brands. Immerse yourself in Stripe-like speed and Apple-grade precision.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center space-x-2 bg-brand-500 hover:bg-brand-600 text-white px-7 py-3.5 rounded-full font-medium shadow-glow-primary hover:shadow-lg hover:shadow-brand-500/25 transition duration-300"
                >
                  <span>Explore Catalog</span>
                  <FiArrowRight size={16} />
                </Link>
                <Link
                  to="/about"
                  className={`inline-flex items-center justify-center border px-7 py-3.5 rounded-full font-medium transition duration-300 ${
                    isDarkMode 
                      ? 'border-zinc-850 hover:bg-zinc-900 hover:text-white' 
                      : 'border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                >
                  <span>Learn Our Philosophy</span>
                </Link>
              </div>
            </motion.div>

            {/* Right Graphics */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex items-center justify-center"
            >
              {/* Vercel/Linear style grid overlay card */}
              <div className={`relative p-6 sm:p-8 rounded-3xl w-full max-w-[460px] border shadow-premium backdrop-blur-md ${
                isDarkMode 
                  ? 'bg-zinc-900/60 border-zinc-800' 
                  : 'bg-white/60 border-zinc-150'
              }`}>
                <div className="absolute top-4 right-4 flex space-x-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop"
                  alt="Modern Storefront Analytics mockup"
                  className="rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-850 w-full mb-6 filter dark:brightness-90"
                />
                <div>
                  <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Elite Standard</p>
                  <p className="font-display font-bold text-lg text-zinc-800 dark:text-white">ShopSphere Premium Hub</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                    Instantly load listings, compare dimensions, and finalize checkouts in milliseconds. Designed to perform beautifully on all mobile and desktop devices.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust & Features Statistics */}
      <section className={`py-12 border-b ${isDarkMode ? 'bg-zinc-950/40 border-zinc-900' : 'bg-white border-zinc-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl border flex-shrink-0 ${
                    isDarkMode ? 'bg-zinc-900 border-zinc-850 text-brand-400' : 'bg-zinc-50 border-zinc-200 text-brand-600'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-zinc-900 dark:text-white">{stat.title}</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{stat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest font-semibold text-brand-500">Departments</span>
            <h2 className="text-3xl font-display font-bold tracking-tight text-zinc-900 dark:text-white mt-2 mb-4">
              Shop by Category
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Browse our meticulously engineered categories and find exactly what fits your lifestyle.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.name}
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <Link
                  to={`/products?category=${cat.name}`}
                  className={`block p-8 rounded-2xl border text-center transition-all duration-300 shadow-premium hover:shadow-premium-hover ${
                    isDarkMode 
                      ? 'bg-zinc-900/40 border-zinc-850 hover:border-zinc-700' 
                      : 'bg-white border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.bgGradient} flex items-center justify-center text-2xl mx-auto mb-4`}>
                    {cat.icon}
                  </div>
                  <p className="font-display font-semibold text-sm text-zinc-800 dark:text-white">{cat.name}</p>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 uppercase tracking-wider">{cat.count}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className={`py-20 border-t border-b ${isDarkMode ? 'bg-zinc-900/20 border-zinc-900' : 'bg-zinc-50 border-zinc-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-brand-500">Handpicked Selection</span>
              <h2 className="text-3xl font-display font-bold tracking-tight text-zinc-900 dark:text-white mt-2">
                Featured Products
              </h2>
            </div>
            <Link to="/products" className="text-xs font-semibold text-brand-500 hover:text-brand-600 flex items-center space-x-1.5 transition">
              <span>View All Products</span>
              <FiArrowRight size={14} />
            </Link>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {loading ? (
              Array(4).fill(0).map((_, i) => <Skeleton key={i} />)
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <motion.div variants={itemVariants} key={product._id}>
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-zinc-400">No products found</div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Interactive Promotional Banner */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`relative overflow-hidden rounded-3xl p-8 md:p-12 lg:p-16 border shadow-premium ${
            isDarkMode 
              ? 'bg-zinc-950 border-zinc-900 text-white' 
              : 'bg-zinc-900 border-zinc-800 text-white'
          }`}>
            {/* Ambient visual overlay */}
            <div className="absolute right-0 bottom-0 top-0 w-1/2 bg-gradient-to-l from-brand-500/20 to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-xl">
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-400">Limited-Time Exclusive</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mt-3 mb-4 leading-tight">
                Enhance Your Style.<br />Get 20% Off Everything.
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mb-8 leading-relaxed">
                Applies automatically to select checkout amounts. Browse premium products from high-end electronics to active outdoor gear.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/products"
                  className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-full text-xs font-semibold shadow-glow-primary hover:shadow-lg transition"
                >
                  Shop the Sale
                </Link>
                <div className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
                  Use Code: <span className="text-white bg-zinc-800 dark:bg-zinc-900 border border-zinc-700 px-2 py-1 rounded">SPHERE20</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Now Section */}
      <section className={`py-20 border-t ${isDarkMode ? 'bg-zinc-900/20 border-zinc-900' : 'bg-zinc-50 border-zinc-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest font-semibold text-brand-500">High Demand</span>
              <h2 className="text-3xl font-display font-bold tracking-tight text-zinc-900 dark:text-white mt-2">
                Trending Now
              </h2>
            </div>
            <Link to="/products" className="text-xs font-semibold text-brand-500 hover:text-brand-600 flex items-center space-x-1.5 transition">
              <span>View All Products</span>
              <FiArrowRight size={14} />
            </Link>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {loading ? (
              Array(4).fill(0).map((_, i) => <Skeleton key={i} />)
            ) : trendingProducts.length > 0 ? (
              trendingProducts.map((product) => (
                <motion.div variants={itemVariants} key={product._id}>
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-zinc-400">No products found</div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Premium Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest font-semibold text-brand-500">Reviews</span>
            <h2 className="text-3xl font-display font-bold tracking-tight text-zinc-900 dark:text-white mt-2 mb-4">
              What Customers Say
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Hear from developers, designers, and creators who choose ShopSphere for their setup.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "The delivery speeds are absolutely insane. I ordered a laptop on Monday and it was here by Tuesday. High quality packaging and stellar support.",
                author: "Sarah Jenkins",
                role: "Product Designer, Linear"
              },
              {
                text: "ShopSphere's interface is cleaner than any platform I've used. No junk, just authentic products and Stripe-level smooth checkout.",
                author: "Alex Rivers",
                role: "Core Engineer, Vercel"
              },
              {
                text: "Customer service is top-notch. Had a small sizing issue and they corrected it within an hour. I am a lifelong customer.",
                author: "Marcus Chen",
                role: "Creative Director, Stripe"
              }
            ].map((test, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl border shadow-premium flex flex-col justify-between ${
                  isDarkMode ? 'bg-zinc-900/60 border-zinc-850' : 'bg-white border-zinc-200'
                }`}
              >
                <div>
                  <div className="flex text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => <span key={i} className="text-sm">★</span>)}
                  </div>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    "{test.text}"
                  </p>
                </div>
                <div className="mt-6 border-t dark:border-zinc-800 border-zinc-100 pt-4 flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-brand-500/10 flex items-center justify-center font-bold text-xs text-brand-500">
                    {test.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-zinc-900 dark:text-white">{test.author}</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
