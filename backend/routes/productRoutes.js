const express = require('express');
const {
  getAllProducts,
  getFeaturedProducts,
  getTrendingProducts,
  getProductById,
  getProductBySlug,
  getCategories,
  getBrands
} = require('../controllers/productController');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/trending', getTrendingProducts);
router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);

module.exports = router;
