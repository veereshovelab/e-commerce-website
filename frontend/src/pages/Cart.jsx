import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../hooks/useCart';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, clearCart, getCartTotal, getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-8`}>Add some products to get started!</p>
        <Link to="/products" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8">
        <FiArrowLeft />
        <span>Back</span>
      </button>

      <h1 className="text-3xl font-bold mb-8">Shopping Cart ({getCartItemsCount()} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4 flex space-x-4`}
            >
              {/* Image */}
              <img
                src={item.thumbnail || item.images?.[0]}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />

              {/* Details */}
              <div className="flex-1">
                <Link to={`/products/${item._id}`} className="font-semibold hover:text-blue-600">
                  {item.name}
                </Link>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.brand}</p>
                <p className="font-bold text-lg mt-2">
                  ${(item.discountPrice || item.price).toFixed(2)}
                </p>
              </div>

              {/* Quantity */}
              <div className="flex items-center border rounded">
                <button
                  onClick={() => updateCartQuantity(item._id, Math.max(1, item.quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateCartQuantity(item._id, Math.max(1, parseInt(e.target.value) || 1))}
                  className={`w-12 text-center border-0 focus:outline-none ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                />
                <button
                  onClick={() => updateCartQuantity(item._id, item.quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  +
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-right">
                <p className="font-bold text-lg">
                  ${((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => {
                    removeFromCart(item._id);
                    toast.info('Item removed from cart');
                  }}
                  className="text-red-600 hover:text-red-700 mt-2"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-lg p-6 h-fit`}>
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          <div className="space-y-3 border-b pb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between text-lg font-bold mt-4 mb-6">
            <span>Total</span>
            <span>${(getCartTotal() + getCartTotal() * 0.1).toFixed(2)}</span>
          </div>

          <Link
            to="/checkout"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-center block mb-3 transition"
          >
            Proceed to Checkout
          </Link>

          <button
            onClick={() => {
              clearCart();
              toast.info('Cart cleared');
            }}
            className={`w-full border ${isDarkMode ? 'border-gray-700' : 'border-gray-300'} py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition`}
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
