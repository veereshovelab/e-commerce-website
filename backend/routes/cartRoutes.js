const express = require('express');
const { protect } = require('../middleware/auth');
const { getCart, addToCart, removeFromCart, updateCart } = require('../controllers/cartController');

const router = express.Router();

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.delete('/:productId', protect, removeFromCart);
router.put('/:productId', protect, updateCart);

module.exports = router;
