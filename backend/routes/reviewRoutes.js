const express = require('express');
const { protect } = require('../middleware/auth');
const {
  addReview,
  getProductReviews,
  deleteReview,
  updateReview
} = require('../controllers/reviewController');

const router = express.Router();

router.post('/', protect, addReview);
router.get('/:productId', getProductReviews);
router.put('/:productId/:reviewId', protect, updateReview);
router.delete('/:productId/:reviewId', protect, deleteReview);

module.exports = router;
