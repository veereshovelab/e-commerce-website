import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
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
        setFeaturedProducts(featured.data.products);
        setTrendingProducts(trending.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className={`${isDarkMode ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-blue-600 to-blue-800'} text-white py-20`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to ShopSphere</h1>
              <p className="text-lg mb-6 text-blue-100">Discover premium products from top brands at unbeatable prices. Shop with confidence.</p>
              <Link to="/products" className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition">
                <span>Shop Now</span>
                <FiArrowRight size={20} />
              </Link>
            </div>
            <div className="text-center">
              <img src="https://via.placeholder.com/400?text=Featured+Products" alt="Hero" className="rounded-lg shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['Electronics', 'Fashion', 'Home', 'Sports', 'Books'].map((category) => (
              <Link
                key={category}
                to={`/products?category=${category}`}
                className={`p-6 rounded-lg text-center hover:shadow-lg transition ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                <div className="text-3xl mb-2">📦</div>
                <p className="font-semibold">{category}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} py-12`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1">
              <span>View All</span>
              <FiArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(4).fill(0).map((_, i) => <Skeleton key={i} />)
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Trending Now</h2>
            <Link to="/products" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1">
              <span>View All</span>
              <FiArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(4).fill(0).map((_, i) => <Skeleton key={i} />)
            ) : (
              trendingProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="mb-6 text-blue-100">Get exclusive deals and updates delivered to your inbox</p>
          <form className="flex max-w-md mx-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded text-gray-900 focus:outline-none"
            />
            <button type="submit" className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded font-semibold transition">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
