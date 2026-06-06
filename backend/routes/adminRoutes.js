const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  getAllUsers,
  getAnalytics,
  getSalesReport
} = require('../controllers/adminController');

const router = express.Router();

// Protect all admin routes
router.use(protect, authorize('admin'));

// Product management
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Order management
router.get('/orders', getAllOrders);

// User management
router.get('/users', getAllUsers);

// Analytics
router.get('/analytics', getAnalytics);
router.get('/reports/sales', getSalesReport);

module.exports = router;
