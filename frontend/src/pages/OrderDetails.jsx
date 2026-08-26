import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiMapPin, FiCreditCard, FiCalendar } from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme';
import LoadingSpinner from '../components/LoadingSpinner';
import Badge from '../components/Badge';
import OrderTrackingTimeline from '../components/OrderTrackingTimeline';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch order details from API
    // For now, showing mock order
    setOrder({
      _id: orderId,
      orderId: 'ORD-230615-4821',
      createdAt: new Date('2024-06-06'),
      orderStatus: 'shipped',
      paymentStatus: 'completed',
      products: [
        {
          _id: '1',
          name: 'Wireless Headphones Pro',
          price: 249.99,
          quantity: 1,
          image: 'https://via.placeholder.com/100'
        }
      ],
      orderSummary: {
        subtotal: 249.99,
        tax: 25,
        totalPrice: 274.99
      },
      shippingAddress: {
        fullName: 'John Doe',
        addressLine1: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'US'
      },
      trackingNumber: 'TRACK123456789',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    });
    setLoading(false);
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-xl text-gray-500">Order not found</p>
      </div>
    );
  }

  const statusColors = {
    pending: 'warning',
    processing: 'warning',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'danger'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center space-x-2 text-brand-500 hover:text-brand-600 font-medium mb-8 transition-colors"
      >
        <FiArrowLeft />
        <span>Back to Orders</span>
      </button>

      {/* Header */}
      <div className={`${isDarkMode ? 'bg-zinc-900/60 border-zinc-800 backdrop-blur-md' : 'bg-white border-zinc-200'} border rounded-2xl p-6 mb-6 shadow-sm`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className={`text-xs uppercase font-semibold tracking-wider ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Order Reference</p>
            <p className="text-2xl font-bold font-display">{order.orderId}</p>
          </div>
          <Badge variant={statusColors[order.orderStatus]}>{order.orderStatus.toUpperCase()}</Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <div>
            <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} mb-1`}>Order Date</p>
            <p className="font-semibold text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} mb-1`}>Total Amount</p>
            <p className="font-semibold text-sm text-brand-500">${order.orderSummary.totalPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} mb-1`}>Payment</p>
            <Badge variant="success">{order.paymentStatus.toUpperCase()}</Badge>
          </div>
          <div>
            <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} mb-1`}>Tracking</p>
            <p className="font-semibold text-sm text-brand-500 font-mono">{order.trackingNumber}</p>
          </div>
        </div>
      </div>

      {/* Visual Tracking Timeline */}
      <div className="mb-6">
        <OrderTrackingTimeline
          orderStatus={order.orderStatus}
          trackingNumber={order.trackingNumber}
          estimatedDelivery={new Date(order.estimatedDelivery).toLocaleDateString()}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Shipping Info */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
          <div className="flex items-center space-x-2 mb-4">
            <FiMapPin className="text-blue-600" />
            <h3 className="text-lg font-bold">Shipping Address</h3>
          </div>
          <div className="space-y-2 text-sm">
            <p className="font-semibold">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.addressLine1}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>

        {/* Estimated Delivery */}
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
          <div className="flex items-center space-x-2 mb-4">
            <FiCalendar className="text-green-600" />
            <h3 className="text-lg font-bold">Estimated Delivery</h3>
          </div>
          <p className="text-3xl font-bold text-green-600 mb-2">
            {new Date(order.estimatedDelivery).toLocaleDateString()}
          </p>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Your order is on the way and should arrive by this date
          </p>
        </div>
      </div>

      {/* Order Items */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6 mb-6`}>
        <div className="flex items-center space-x-2 mb-4">
          <FiPackage className="text-orange-600" />
          <h3 className="text-lg font-bold">Order Items</h3>
        </div>
        <div className="space-y-4">
          {order.products.map((item) => (
            <div key={item._id} className={`flex space-x-4 pb-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Quantity: {item.quantity}</p>
              </div>
              <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-6`}>
        <div className="flex items-center space-x-2 mb-4">
          <FiCreditCard className="text-purple-600" />
          <h3 className="text-lg font-bold">Order Summary</h3>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${order.orderSummary.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${order.orderSummary.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className={`flex justify-between text-lg font-bold pt-3 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} border-t`}>
            <span>Total</span>
            <span>${order.orderSummary.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
