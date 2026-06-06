import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingCart, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../hooks/useCart';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart } = useCart();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>
          Add products to your wishlist to save them for later
        </p>
        <Link
          to="/products"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success('Added to cart!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8"
      >
        <FiArrowLeft />
        <span>Back</span>
      </button>

      <h1 className="text-3xl font-bold mb-8">My Wishlist ({wishlist.length} items)</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div
            key={product._id}
            className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg overflow-hidden hover:shadow-lg transition-shadow`}
          >
            {/* Image */}
            <div className="relative overflow-hidden bg-gray-100 h-48">
              <img
                src={product.thumbnail || product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-110 transition-transform"
              />
            </div>

            {/* Content */}
            <div className="p-4">
              <Link
                to={`/products/${product._id}`}
                className="font-semibold hover:text-blue-600 line-clamp-2"
              >
                {product.name}
              </Link>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                {product.brand}
              </p>

              <div className="flex items-baseline space-x-2 mb-4">
                {product.discountPrice ? (
                  <>
                    <span className="text-lg font-bold text-red-600">${product.discountPrice}</span>
                    <span className={`text-sm line-through ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      ${product.price}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold">${product.price}</span>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded flex items-center justify-center space-x-1 transition"
                >
                  <FiShoppingCart size={16} />
                  <span>Add</span>
                </button>
                <button
                  onClick={() => {
                    removeFromWishlist(product._id);
                    toast.info('Removed from wishlist');
                  }}
                  className="px-3 py-2 border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
