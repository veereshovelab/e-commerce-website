import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiChevronRight, FiPlus, FiMinus, FiStar, FiSliders, FiTruck, FiShield, FiRotateCcw, FiShare2, FiClock } from 'react-icons/fi';
import apiClient from '../utils/api';
import { useCart } from '../hooks/useCart';
import { useTheme } from '../hooks/useTheme';
import { useCompare } from '../hooks/useCompare';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description'); // description | specs | reviews
  const [loading, setLoading] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 25, seconds: 40 });
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const { isDarkMode } = useTheme();

  // Countdown timer for express dispatch guarantee
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 5, minutes: 45, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiClient.get(`/products/${id}`);
        setProduct(response.data.product);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  // Track recently viewed products in localStorage
  useEffect(() => {
    if (product) {
      try {
        const stored = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        const filtered = stored.filter(item => item._id !== product._id);
        const updated = [product, ...filtered].slice(0, 6);
        localStorage.setItem('recentlyViewed', JSON.stringify(updated));
        window.dispatchEvent(new Event('recentlyViewedUpdated'));
        setRecentlyViewed(updated.filter(item => item._id !== product._id));
      } catch (err) {
        console.error('Failed to update recently viewed:', err);
      }
    }
  }, [product]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on ShopSphere!`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or share unsupported
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 flex justify-center items-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-brand-500/30 border-t-brand-500 animate-spin" />
          <p className="text-sm text-zinc-500 font-medium">Loading premium product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center text-zinc-500">
        Product not found
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Added ${quantity} item(s) to cart!`);
    setQuantity(1);
  };

  const handleWishlist = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast.info('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist!');
    }
  };

  const handleCompare = () => {
    if (isInCompare(product._id)) {
      removeFromCompare(product._id);
      toast.info('Removed from comparison list');
    } else {
      const res = addToCompare(product);
      if (res.success) {
        toast.success('Added to comparison list!');
      } else if (res.reason === 'limit_reached') {
        toast.warning('Maximum 4 products can be compared at once.');
      }
    }
  };

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb path */}
      <nav className="flex items-center space-x-2.5 mb-10 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
        <button onClick={() => navigate('/')} className="hover:text-brand-500 transition">Home</button>
        <FiChevronRight size={10} />
        <button onClick={() => navigate('/products')} className="hover:text-brand-500 transition">Products</button>
        <FiChevronRight size={10} />
        <span className="truncate max-w-[200px] text-zinc-800 dark:text-zinc-300">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Side: Dynamic Gallery Viewer */}
        <div className="lg:col-span-6 space-y-4">
          <div className={`relative aspect-[4/3] rounded-3xl overflow-hidden border ${
            isDarkMode ? 'bg-zinc-950 border-zinc-850' : 'bg-zinc-50 border-zinc-200'
          } flex items-center justify-center`}>
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImage}
                src={product.images?.[selectedImage] || product.thumbnail || 'https://via.placeholder.com/600'}
                alt={product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover select-none"
              />
            </AnimatePresence>

            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-brand-500 text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full shadow-glow-primary uppercase">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails grid */}
          {product.images && product.images.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === idx 
                      ? 'border-brand-500 shadow-glow-primary scale-95' 
                      : 'border-zinc-200 dark:border-zinc-800 hover:scale-95'
                  }`}
                >
                  <img src={image} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details & Configurator */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div>
            <span className={`text-[10px] uppercase font-bold tracking-widest ${isDarkMode ? 'text-brand-400' : 'text-brand-600'}`}>
              {product.category || 'Premium Collection'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-zinc-900 dark:text-white mt-1 mb-2 tracking-tight">
              {product.name}
            </h1>
            <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-6">
              Brand: {product.brand || 'Elite'}
            </p>

            {/* Ratings Summary */}
            <div className="flex items-center space-x-2.5 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} fill={i < Math.round(product.rating) ? 'currentColor' : 'none'} size={14} />
                ))}
              </div>
              <span className={`text-xs font-semibold ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {product.rating}/5.0 ({product.reviewCount || 0} customer reviews)
              </span>
            </div>

            {/* Price Segment */}
            <div className="flex items-baseline space-x-3 mb-6">
              {product.discountPrice ? (
                <>
                  <span className="text-3xl font-bold text-brand-500">${product.discountPrice}</span>
                  <span className={`text-lg line-through ${isDarkMode ? 'text-zinc-700' : 'text-zinc-400'}`}>
                    ${product.price}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-zinc-900 dark:text-white">${product.price}</span>
              )}
            </div>

            {/* Stock Availability indicator */}
            <div className="flex items-center space-x-2 mb-8 text-xs font-semibold uppercase tracking-wider">
              <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span className={product.stock > 0 ? 'text-emerald-500' : 'text-red-500'}>
                {product.stock > 0 ? `Available (${product.stock} items left)` : 'Currently Out of Stock'}
              </span>
            </div>

            {/* Interactive Tabs Menu */}
            <div className="border-b border-zinc-200 dark:border-zinc-800 mb-6">
              <div className="flex space-x-6 text-xs uppercase tracking-wider font-semibold">
                {['description', 'specifications', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 border-b-2 transition-all relative ${
                      activeTab === tab 
                        ? 'border-brand-500 text-brand-500 dark:text-brand-400' 
                        : 'border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-[120px] text-sm leading-relaxed text-zinc-650 dark:text-zinc-350 mb-8">
              {activeTab === 'description' && (
                <p>{product.description || 'Elevate your performance and comfort levels with this state-of-the-art item. Designed for premium styling, daily durability, and ease of use.'}</p>
              )}

              {activeTab === 'specifications' && (
                <div>
                  {product.specifications && Object.keys(product.specifications).length > 0 ? (
                    <div className={`rounded-xl border p-4 ${isDarkMode ? 'bg-darkCard/40 border-white/5 shadow-glass-dark backdrop-blur-md' : 'bg-zinc-50 border-zinc-200'}`}>
                      <ul className="space-y-2.5 font-medium">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          value && (
                            <li key={key} className="flex justify-between text-xs">
                              <span className="capitalize text-zinc-400 dark:text-zinc-400">{key}:</span>
                              <span className="text-zinc-800 dark:text-white">{value}</span>
                            </li>
                          )
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="text-zinc-400">No specifications listed for this product.</p>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((rev, idx) => (
                      <div key={idx} className="border-b border-zinc-200 dark:border-white/5 pb-3 last:border-b-0">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-semibold text-xs text-zinc-800 dark:text-white">{rev.userName || 'Verified Buyer'}</h4>
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex text-yellow-400 text-xs mb-1.5">
                          {[...Array(5)].map((_, i) => <span key={i}>{i < rev.rating ? '★' : '☆'}</span>)}
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-300">{rev.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-zinc-400">No customer reviews yet. Be the first to write one!</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action configurations */}
          <div className="space-y-5 pt-6 border-t border-zinc-200 dark:border-white/5">
            {product.stock > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Qty:</span>
                <div className={`flex items-center border rounded-xl overflow-hidden ${
                  isDarkMode ? 'border-white/5 bg-darkDeep/40' : 'border-zinc-200 bg-zinc-50'
                }`}>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-30"
                  >
                    <FiMinus size={14} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-10 text-center border-none bg-transparent outline-none text-xs font-semibold"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-brand-500 hover:bg-brand-600 dark:btn-glow-primary disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold shadow-glow-primary hover:shadow-lg transition duration-300 flex items-center justify-center space-x-2 text-sm"
              >
                <FiShoppingCart size={18} />
                <span>Add to Shopping Cart</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCompare}
                className={`p-3.5 rounded-xl border text-sm transition flex items-center justify-center ${
                  isInCompare(product._id)
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 font-bold'
                    : 'border-zinc-300 dark:border-white/10 dark:btn-glass-secondary'
                }`}
                title={isInCompare(product._id) ? 'Remove from compare' : 'Compare product'}
              >
                <FiSliders size={18} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleWishlist}
                className={`p-3.5 rounded-xl border text-sm transition flex items-center justify-center ${
                  isInWishlist(product._id) 
                    ? 'border-red-500 bg-red-500/10 text-red-500' 
                    : 'border-zinc-300 dark:border-white/10 dark:btn-glass-secondary'
                }`}
                title={isInWishlist(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <FiHeart fill={isInWishlist(product._id) ? 'currentColor' : 'none'} size={18} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="p-3.5 rounded-xl border border-zinc-300 dark:border-white/10 dark:btn-glass-secondary text-zinc-600 dark:text-zinc-300 hover:text-brand-500 transition flex items-center justify-center"
                title="Share product link"
              >
                <FiShare2 size={18} />
              </motion.button>
            </div>

            {/* Delivery Perks & Express Dispatch Urgency Box */}
            <div className={`rounded-2xl border p-4 space-y-3 ${isDarkMode ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-50/80 border-zinc-200'}`}>
              <div className="flex items-center space-x-2 text-xs font-semibold text-amber-500 dark:text-amber-400">
                <FiClock className="animate-pulse" size={16} />
                <span>
                  Order within <strong className="font-mono text-sm">{String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s</strong> for Express Dispatch!
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800 text-[11px]">
                <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white/50 dark:bg-zinc-850/50">
                  <FiTruck size={16} className="text-brand-500 mb-1" />
                  <span className="font-semibold">Free Express Shipping</span>
                  <span className="text-[9px] text-zinc-400">Orders over $50</span>
                </div>
                <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white/50 dark:bg-zinc-850/50">
                  <FiRotateCcw size={16} className="text-emerald-500 mb-1" />
                  <span className="font-semibold">30-Day Returns</span>
                  <span className="text-[9px] text-zinc-400">Hassle free policy</span>
                </div>
                <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white/50 dark:bg-zinc-850/50">
                  <FiShield size={16} className="text-indigo-500 mb-1" />
                  <span className="font-semibold">2-Year Warranty</span>
                  <span className="text-[9px] text-zinc-400">Full coverage</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Viewed Products Section */}
      {recentlyViewed.length > 0 && (
        <div className="mt-16 pt-10 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs uppercase font-semibold text-brand-500 tracking-wider">Browsing History</span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-zinc-900 dark:text-white mt-0.5">Recently Viewed Products</h2>
            </div>
            <Link to="/products" className="text-xs font-semibold text-brand-500 hover:underline">
              View All Products &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recentlyViewed.map(item => (
              <Link
                key={item._id}
                to={`/products/${item._id}`}
                className={`p-3 rounded-2xl border transition group hover:-translate-y-1 ${
                  isDarkMode ? 'bg-zinc-900/40 border-zinc-800 hover:border-brand-500/50' : 'bg-white border-zinc-200 hover:border-brand-500/50 shadow-sm'
                }`}
              >
                <div className="aspect-square rounded-xl overflow-hidden mb-2.5 bg-zinc-100 dark:bg-zinc-950">
                  <img
                    src={item.thumbnail || item.images?.[0]}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <p className="text-[10px] text-zinc-400 uppercase font-semibold">{item.brand || 'ShopSphere'}</p>
                <h4 className="text-xs font-semibold truncate text-zinc-800 dark:text-zinc-200 group-hover:text-brand-500 transition">
                  {item.name}
                </h4>
                <p className="text-xs font-bold text-brand-500 mt-1">
                  ${item.discountPrice || item.price}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
