const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    image: String,
    price: Number,
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }],
  shippingAddress: {
    fullName: String,
    phoneNumber: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  billingAddress: {
    fullName: String,
    phoneNumber: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  orderSummary: {
    subtotal: {
      type: Number,
      required: true
    },
    shippingCost: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    couponCode: String,
    totalPrice: {
      type: Number,
      required: true
    }
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet'],
    default: 'card'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'returned', 'cancelled'],
    default: 'pending'
  },
  trackingNumber: String,
  estimatedDelivery: Date,
  deliveredAt: Date,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate Order ID
orderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderId = `ORD-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
