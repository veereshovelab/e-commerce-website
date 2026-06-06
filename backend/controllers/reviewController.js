const Product = require('../models/Product');

// Add review
exports.addReview = async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;
    const userId = req.user._id;

    if (!rating || !title || !comment) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const review = {
      user: userId,
      userName: req.user.name,
      rating: parseInt(rating),
      title,
      comment,
      verified: true
    };

    product.reviews.push(review);

    // Calculate average rating
    const totalRating = product.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    product.rating = (totalRating / product.reviews.length).toFixed(1);
    product.reviewCount = product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get product reviews
exports.getProductReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews,
      rating: product.rating,
      reviewCount: product.reviewCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const review = product.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Check if user owns this review or is admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this review' 
      });
    }

    review.deleteOne();

    // Recalculate rating
    if (product.reviews.length > 0) {
      const totalRating = product.reviews.reduce((sum, rev) => sum + rev.rating, 0);
      product.rating = (totalRating / product.reviews.length).toFixed(1);
      product.reviewCount = product.reviews.length;
    } else {
      product.rating = 0;
      product.reviewCount = 0;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const { rating, title, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const review = product.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this review' 
      });
    }

    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.comment = comment || review.comment;

    // Recalculate rating
    const totalRating = product.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    product.rating = (totalRating / product.reviews.length).toFixed(1);

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
