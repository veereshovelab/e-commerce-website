const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, brand, price, discountPrice, stock, images, specifications } = req.body;

    const hasInvalidNumericValue = [price, stock].some(
      (value) => value === undefined || value === null || value === '' || !Number.isFinite(Number(value)) || Number(value) < 0
    );

    if (
      !name?.trim() ||
      !description?.trim() ||
      !category?.trim() ||
      !brand?.trim() ||
      hasInvalidNumericValue
    ) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    const product = await Product.create({
      name,
      description,
      category,
      brand,
      price,
      discountPrice: discountPrice || 0,
      stock,
      images: images || ['https://via.placeholder.com/300'],
      thumbnail: images?.[0] || 'https://via.placeholder.com/300',
      specifications: specifications || {}
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('products.product')
      .sort('-createdAt');

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all users (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get analytics
exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const completedOrders = await Order.countDocuments({ paymentStatus: 'completed' });
    
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$orderSummary.totalPrice' } } }
    ]);

    const topProducts = await Order.aggregate([
      { $unwind: '$products' },
      { $group: { _id: '$products.product', quantity: { $sum: '$products.quantity' } } },
      { $sort: { quantity: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } }
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalProducts,
        totalOrders,
        completedOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        topProducts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get sales report
exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = { paymentStatus: 'completed' };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const salesData = await Order.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$orderSummary.totalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      salesData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
