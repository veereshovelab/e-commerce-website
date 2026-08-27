import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiMapPin, FiCreditCard, FiCalendar, FiPrinter, FiDownload, FiCheckCircle } from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme';
import LoadingSpinner from '../components/LoadingSpinner';
import Badge from '../components/Badge';
import OrderTrackingTimeline from '../components/OrderTrackingTimeline';
import { toast } from 'react-toastify';

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
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80'
        },
        {
          _id: '2',
          name: 'Ergonomic Mechanical Keyboard',
          price: 129.50,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&q=80'
        }
      ],
      orderSummary: {
        subtotal: 379.49,
        tax: 37.95,
        totalPrice: 417.44
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

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleDownloadReceipt = () => {
    if (!order) return;
    const content = `
=====================================================
                 SHOPSPHERE INC.
               TAX INVOICE & RECEIPT
=====================================================
Order Reference : ${order.orderId}
Order Date      : ${new Date(order.createdAt).toLocaleDateString()}
Payment Status  : ${order.paymentStatus.toUpperCase()}
Tracking Number : ${order.trackingNumber}

-----------------------------------------------------
SHIPPING ADDRESS
-----------------------------------------------------
Name   : ${order.shippingAddress.fullName}
Address: ${order.shippingAddress.addressLine1}
City   : ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}
Country: ${order.shippingAddress.country}

-----------------------------------------------------
ITEMS PURCHASED
-----------------------------------------------------
${order.products.map(p => `${p.name.padEnd(32)} x${p.quantity}   $${(p.price * p.quantity).toFixed(2)}`).join('\n')}

-----------------------------------------------------
PAYMENT BREAKDOWN
-----------------------------------------------------
Subtotal        : $${order.orderSummary.subtotal.toFixed(2)}
Tax (10%)       : $${order.orderSummary.tax.toFixed(2)}
Shipping        : FREE
TOTAL PAID      : $${order.orderSummary.totalPrice.toFixed(2)}
-----------------------------------------------------
Thank you for shopping with ShopSphere!
Support: support@shopsphere.com | www.shopsphere.com
=====================================================
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt_${order.orderId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Order receipt downloaded!');
  };

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
    <div className="max-w-4xl mx-auto px-4 py-8 printable-receipt">
      <style>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          nav, header, footer, .no-print {
            display: none !important;
          }
          .printable-receipt {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `}</style>

      {/* Navigation & Action Bar */}
      <div className="flex items-center justify-between mb-8 no-print">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center space-x-2 text-brand-500 hover:text-brand-600 font-medium transition-colors"
        >
          <FiArrowLeft />
          <span>Back to Orders</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadReceipt}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold border transition ${
              isDarkMode
                ? 'border-zinc-700 hover:bg-zinc-800 text-zinc-200'
                : 'border-zinc-300 hover:bg-zinc-100 text-zinc-700'
            }`}
            title="Download Invoice TXT"
          >
            <FiDownload size={14} />
            <span>Download Invoice</span>
          </button>
          <button
            onClick={handlePrintReceipt}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-glow-primary transition"
            title="Print Receipt"
          >
            <FiPrinter size={14} />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Order Header Card */}
      <div className={`${isDarkMode ? 'bg-zinc-900/60 border-zinc-800 backdrop-blur-md' : 'bg-white border-zinc-200'} border rounded-2xl p-6 mb-6 shadow-sm`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className={`text-xs uppercase font-semibold tracking-wider ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Order Reference</p>
            <p className="text-2xl font-bold font-display">{order.orderId}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={statusColors[order.orderStatus]}>{order.orderStatus.toUpperCase()}</Badge>
          </div>
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
            <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} mb-1`}>Tracking Number</p>
            <p className="font-semibold text-sm text-brand-500 font-mono">{order.trackingNumber}</p>
          </div>
        </div>
      </div>

      {/* Visual Tracking Timeline */}
      <div className="mb-6 no-print">
        <OrderTrackingTimeline
          orderStatus={order.orderStatus}
          trackingNumber={order.trackingNumber}
          estimatedDelivery={new Date(order.estimatedDelivery).toLocaleDateString()}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Shipping Info */}
        <div className={`${isDarkMode ? 'bg-zinc-850 border-zinc-800' : 'bg-white border-zinc-200'} border rounded-2xl p-6 shadow-sm`}>
          <div className="flex items-center space-x-2 mb-4">
            <FiMapPin className="text-brand-500" size={18} />
            <h3 className="text-lg font-bold font-display">Shipping Address</h3>
          </div>
          <div className="space-y-1.5 text-sm">
            <p className="font-bold">{order.shippingAddress.fullName}</p>
            <p className="text-zinc-600 dark:text-zinc-400">{order.shippingAddress.addressLine1}</p>
            <p className="text-zinc-600 dark:text-zinc-400">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
            <p className="text-zinc-600 dark:text-zinc-400">{order.shippingAddress.country}</p>
          </div>
        </div>

        {/* Estimated Delivery */}
        <div className={`${isDarkMode ? 'bg-zinc-850 border-zinc-800' : 'bg-white border-zinc-200'} border rounded-2xl p-6 shadow-sm`}>
          <div className="flex items-center space-x-2 mb-4">
            <FiCalendar className="text-emerald-500" size={18} />
            <h3 className="text-lg font-bold font-display">Estimated Delivery</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-500 mb-2 font-display">
            {new Date(order.estimatedDelivery).toLocaleDateString()}
          </p>
          <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Your shipment is on track and will arrive on or before this date.
          </p>
        </div>
      </div>

      {/* Order Items */}
      <div className={`${isDarkMode ? 'bg-zinc-850 border-zinc-800' : 'bg-white border-zinc-200'} border rounded-2xl p-6 mb-6 shadow-sm`}>
        <div className="flex items-center space-x-2 mb-4">
          <FiPackage className="text-indigo-500" size={18} />
          <h3 className="text-lg font-bold font-display">Order Items ({order.products.length})</h3>
        </div>
        <div className="space-y-4">
          {order.products.map((item) => (
            <div key={item._id} className={`flex items-center space-x-4 pb-4 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'} border-b last:border-b-0 last:pb-0`}>
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl border dark:border-zinc-700" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{item.name}</p>
                <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} mt-0.5`}>Quantity: {item.quantity}</p>
              </div>
              <p className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary Breakdown */}
      <div className={`${isDarkMode ? 'bg-zinc-850 border-zinc-800' : 'bg-white border-zinc-200'} border rounded-2xl p-6 shadow-sm`}>
        <div className="flex items-center space-x-2 mb-4">
          <FiCreditCard className="text-purple-500" size={18} />
          <h3 className="text-lg font-bold font-display">Order Summary</h3>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500 dark:text-zinc-400">Subtotal</span>
            <span className="font-medium">${order.orderSummary.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500 dark:text-zinc-400">Tax (10%)</span>
            <span className="font-medium">${order.orderSummary.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500 dark:text-zinc-400">Shipping Fee</span>
            <span className="text-emerald-500 font-semibold">Free Express</span>
          </div>
          <div className={`flex justify-between text-lg font-bold pt-3 ${isDarkMode ? 'border-zinc-700' : 'border-zinc-200'} border-t`}>
            <span>Total Paid</span>
            <span className="text-brand-500">${order.orderSummary.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

