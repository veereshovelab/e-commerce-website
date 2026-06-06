const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getUserProfile,
  updateUserProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  addToWishlist,
  removeFromWishlist,
  getWishlist
} = require('../controllers/userController');

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

router.post('/addresses', protect, addAddress);
router.put('/addresses/:addressId', protect, updateAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);

router.post('/wishlist/add', protect, addToWishlist);
router.post('/wishlist/remove', protect, removeFromWishlist);
router.get('/wishlist', protect, getWishlist);

module.exports = router;
