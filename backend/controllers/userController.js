const User = require('../models/User');
const Product = require('../models/Product');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist orders');

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email, profileImage, newsletter } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, profileImage, newsletter, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add address
exports.addAddress = async (req, res) => {
  try {
    const { type, fullName, phoneNumber, addressLine1, addressLine2, city, state, zipCode, country, isDefault } = req.body;

    const newAddress = {
      _id: require('mongoose').Types.ObjectId(),
      type,
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      country,
      isDefault
    };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { addresses: newAddress } },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const updateData = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        $set: { 
          'addresses.$[elem]': { _id: require('mongoose').Types.ObjectId(addressId), ...updateData } 
        } 
      },
      { 
        new: true,
        arrayFilters: [{ 'elem._id': require('mongoose').Types.ObjectId(addressId) }]
      }
    );

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { addresses: { _id: require('mongoose').Types.ObjectId(addressId) } } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { wishlist: productId } },
      { new: true }
    ).populate('wishlist');

    res.status(200).json({
      success: true,
      message: 'Added to wishlist',
      wishlist: user.wishlist
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { wishlist: productId } },
      { new: true }
    ).populate('wishlist');

    res.status(200).json({
      success: true,
      message: 'Removed from wishlist',
      wishlist: user.wishlist
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');

    res.status(200).json({
      success: true,
      wishlist: user.wishlist
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
