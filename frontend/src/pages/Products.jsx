import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiSearch } from 'react-icons/fi';
import apiClient from '../utils/api';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/Skeleton';
import { useTheme } from '../hooks/useTheme';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || ''
  });
  const { isDarkMode } = useTheme();

  // Sync search query parameter from URL
  useEffect(() => {
    const searchVal = searchParams.get('search') || '';
    const categoryVal = searchParams.get('category') || '';
    setFilters(prev => ({
      ...prev,
      search: searchVal,
      category: categoryVal
    }));
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = Object.keys(filters).reduce((acc, key) => {
          if (filters[key]) acc[key] = filters[key];
          return acc;
        }, {});

        const response = await apiClient.get('/products', { params });
        setProducts(response.data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchFilters = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          apiClient.get('/products/categories'),
          apiClient.get('/products/brands')
        ]);
        setCategories(catRes.data.categories || []);
        setBrands(brandRes.data.brands || []);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };

    fetchData();
    fetchFilters();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const updated = { ...prev, [key]: value };
      // Update URL search params accordingly
      const newParams = {};
      Object.keys(updated).forEach(k => {
        if (updated[k]) newParams[k] = updated[k];
      });
      setSearchParams(newParams);
      return updated;
    });
  };

  const clearFilters = () => {
    const cleared = {
      search: '',
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      sort: ''
    };
    setFilters(cleared);
    setSearchParams({});
  };

  // Motion configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  const sidebarVariants = {
    open: { x: 0, opacity: 1, transition: { type: 'tween', duration: 0.3 } },
    closed: { x: '-100%', opacity: 0, transition: { type: 'tween', duration: 0.3 } }
  };

  const filterSidebarContent = (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display font-bold text-lg text-zinc-900 dark:text-white">Filters</h2>
        {(filters.search || filters.category || filters.brand || filters.minPrice || filters.maxPrice || filters.sort) && (
          <button
            onClick={clearFilters}
            className="text-xs text-brand-500 hover:text-brand-600 font-semibold"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Search Filter */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
          Search
        </label>
        <div className="relative">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search keywords..."
            className={`w-full pl-3 pr-10 py-2 text-sm rounded-xl outline-none border focus:ring-1 focus:ring-brand-500 ${
              isDarkMode 
                ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-600 focus:border-zinc-700' 
                : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-zinc-300'
            }`}
          />
          <FiSearch className="absolute right-3.5 top-3 text-zinc-400" size={14} />
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className={`w-full px-3 py-2 text-sm rounded-xl outline-none border focus:ring-1 focus:ring-brand-500 ${
            isDarkMode 
              ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700' 
              : 'bg-white border-zinc-200 text-zinc-900 focus:border-zinc-300'
          }`}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Brand Filter */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
          Brand
        </label>
        <select
          value={filters.brand}
          onChange={(e) => handleFilterChange('brand', e.target.value)}
          className={`w-full px-3 py-2 text-sm rounded-xl outline-none border focus:ring-1 focus:ring-brand-500 ${
            isDarkMode 
              ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700' 
              : 'bg-white border-zinc-200 text-zinc-900 focus:border-zinc-300'
          }`}
        >
          <option value="">All Brands</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
          Price Range
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className={`w-full px-3 py-2 text-sm rounded-xl outline-none border focus:ring-1 focus:ring-brand-500 ${
              isDarkMode 
                ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-600 focus:border-zinc-700' 
                : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-zinc-300'
            }`}
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className={`w-full px-3 py-2 text-sm rounded-xl outline-none border focus:ring-1 focus:ring-brand-500 ${
              isDarkMode 
                ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-600 focus:border-zinc-700' 
                : 'bg-white border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-zinc-300'
            }`}
          />
        </div>
      </div>

      {/* Sort Filter */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
          Sort By
        </label>
        <select
          value={filters.sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className={`w-full px-3 py-2 text-sm rounded-xl outline-none border focus:ring-1 focus:ring-brand-500 ${
            isDarkMode 
              ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700' 
              : 'bg-white border-zinc-200 text-zinc-900 focus:border-zinc-300'
          }`}
        >
          <option value="">Relevant</option>
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-brand-500">Curated Collection</span>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-zinc-900 dark:text-white mt-1">
            Browse Products
          </h1>
        </div>

        {/* Filters Toggle Button for Mobile */}
        <div className="flex items-center space-x-3 md:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition ${
              isDarkMode 
                ? 'border-zinc-850 bg-zinc-900 text-white hover:bg-zinc-800' 
                : 'border-zinc-200 bg-white text-zinc-850 hover:bg-zinc-50'
            }`}
          >
            <FiFilter size={16} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Desktop Filters Panel */}
        <aside className={`hidden lg:block lg:col-span-1 p-6 rounded-2xl border sticky top-24 h-fit max-h-[85vh] overflow-y-auto shadow-premium ${
          isDarkMode ? 'bg-zinc-900/40 border-zinc-850' : 'bg-white border-zinc-200'
        }`}>
          {filterSidebarContent}
        </aside>

        {/* Mobile Flyout Filters Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
              />

              {/* Sidebar Content */}
              <motion.aside
                initial="closed"
                animate="open"
                exit="closed"
                variants={sidebarVariants}
                className={`fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] p-6 z-50 overflow-y-auto lg:hidden shadow-2xl border-r ${
                  isDarkMode ? 'bg-zinc-900 border-zinc-850 text-white' : 'bg-white border-zinc-200 text-zinc-950'
                }`}
              >
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className={`absolute top-4 right-4 p-2 rounded-full ${
                    isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                  }`}
                >
                  <FiX size={18} />
                </button>
                <div className="pt-6">
                  {filterSidebarContent}
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Products Results List */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => <Skeleton key={i} />)}
            </div>
          ) : products.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            >
              {products.map((product) => (
                <motion.div variants={itemVariants} key={product._id}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center py-20 rounded-2xl border ${
                isDarkMode ? 'border-zinc-850 bg-zinc-900/10' : 'border-zinc-250/50 bg-zinc-50/50'
              }`}
            >
              <p className="text-lg font-medium text-zinc-400">No products found matching filters</p>
              <button
                onClick={clearFilters}
                className="mt-4 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-glow-primary"
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
