import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useCart } from '../hooks/useCart';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { isDarkMode } = useTheme();

  const handleAddToCart = () => {
    addToCart(product, 1);
    toast.success('Added to cart!');
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

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300`}>
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100 h-48">
        <img
          src={product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        {discountPercent > 0 && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
            -{discountPercent}%
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <Link to={`/products/${product._id}`} className="font-semibold text-lg hover:text-blue-600 line-clamp-2">
          {product.name}
        </Link>

        {/* Brand */}
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
          {product.brand}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <span key={i}>{i < Math.round(product.rating) ? '★' : '☆'}</span>
            ))}
          </div>
          <span className={`text-xs ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            ({product.reviewCount || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline space-x-2 mb-4">
          {product.discountPrice ? (
            <>
              <span className="text-xl font-bold text-red-600">${product.discountPrice}</span>
              <span className={`text-sm line-through ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                ${product.price}
              </span>
            </>
          ) : (
            <span className="text-xl font-bold">${product.price}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center space-x-1"
          >
            <FiShoppingCart size={18} />
            <span>Add</span>
          </button>
          <button
            onClick={handleWishlist}
            className={`px-3 py-2 rounded border ${isInWishlist(product._id) ? 'border-red-600 bg-red-600 text-white' : `border-gray-300 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`} hover:opacity-80 transition`}
          >
            <FiHeart fill={isInWishlist(product._id) ? 'currentColor' : 'none'} size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
