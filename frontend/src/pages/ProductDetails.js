import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiChevronRight } from 'react-icons/fi';
import apiClient from '../utils/api';
import { useCart } from '../hooks/useCart';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'react-toastify';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { isDarkMode } = useTheme();

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

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-center">Loading...</div>;
  }

  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-center">Product not found</div>;
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

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 mb-8 text-sm">
        <button onClick={() => navigate('/')} className="text-blue-600 hover:underline">Home</button>
        <FiChevronRight />
        <button onClick={() => navigate('/products')} className="text-blue-600 hover:underline">Products</button>
        <FiChevronRight />
        <span>{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg overflow-hidden mb-4`}>
            <img
              src={product.images[selectedImage] || product.thumbnail}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="flex space-x-2">
            {product.images?.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-16 h-16 rounded overflow-hidden border-2 ${selectedImage === index ? 'border-blue-600' : 'border-gray-300'}`}
              >
                <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>{product.brand}</p>

          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 text-xl">
              {[...Array(5)].map((_, i) => (
                <span key={i}>{i < Math.round(product.rating) ? '★' : '☆'}</span>
              ))}
            </div>
            <span className={`ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {product.rating}/5 ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline space-x-2 mb-6">
            {product.discountPrice ? (
              <>
                <span className="text-3xl font-bold text-red-600">${product.discountPrice}</span>
                <span className={`text-xl line-through ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  ${product.price}
                </span>
                <span className="text-red-600 font-bold">-{discountPercent}%</span>
              </>
            ) : (
              <span className="text-3xl font-bold">${product.price}</span>
            )}
          </div>

          {/* Stock Status */}
          <p className={`mb-6 font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </p>

          {/* Description */}
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-6`}>{product.description}</p>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className={`mb-6 p-4 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h3 className="font-bold mb-3">Specifications</h3>
              <ul className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  value && (
                    <li key={key} className="flex justify-between">
                      <span className="capitalize">{key}:</span>
                      <span className="font-semibold">{value}</span>
                    </li>
                  )
                ))}
              </ul>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="font-semibold">Quantity:</label>
              <div className="flex items-center border rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className={`w-12 text-center border-0 focus:outline-none ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold transition flex items-center justify-center space-x-2"
              >
                <FiShoppingCart size={20} />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleWishlist}
                className={`px-6 py-3 rounded-lg border font-bold transition ${isInWishlist(product._id) ? 'border-red-600 bg-red-600 text-white' : `border-gray-300 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}`}
              >
                <FiHeart fill={isInWishlist(product._id) ? 'currentColor' : 'none'} size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
