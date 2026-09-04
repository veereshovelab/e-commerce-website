const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { products, shippingAddress, billingAddress, orderSummary, paymentMethod, notes, orderNotes } = req.body;

    if (!products || !shippingAddress || !orderSummary) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    // Validate stock
    for (let item of products) {
      const product = await Product.findById(item.product);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${product.name}` 
        });
      }
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      products,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      orderSummary,
      paymentMethod,
      notes: notes || orderNotes || ''
    });

    // Reduce stock
    for (let item of products) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Add order to user
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { orders: order._id } }
    );

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('products.product')
      .sort('-createdAt');

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to view this order' 
      });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus, trackingNumber } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        orderStatus, 
        paymentStatus, 
        trackingNumber,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to cancel this order' 
      });
    }

    if (['shipped', 'delivered'].includes(order.orderStatus)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot cancel order that has been shipped' 
      });
    }

    // Restore stock
    for (let item of order.products) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    order.orderStatus = 'cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
