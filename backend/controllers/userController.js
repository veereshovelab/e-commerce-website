const mongoose = require('mongoose');
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
    const { name, email, phone, savedAddress, profileImage, newsletter } = req.body;

    const updateFields = { updatedAt: Date.now() };
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (phone !== undefined) updateFields.phone = phone;
    if (savedAddress !== undefined) updateFields.savedAddress = savedAddress;
    if (profileImage !== undefined) updateFields.profileImage = profileImage;
    if (newsletter !== undefined) updateFields.newsletter = newsletter;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

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
      _id: new mongoose.Types.ObjectId(),
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

    if (!mongoose.isValidObjectId(addressId)) {
      return res.status(400).json({ success: false, message: 'Invalid address ID' });
    }

    const addressObjectId = new mongoose.Types.ObjectId(addressId);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        $set: { 
          'addresses.$[elem]': { ...updateData, _id: addressObjectId }
        } 
      },
      { 
        new: true,
        arrayFilters: [{ 'elem._id': addressObjectId }]
      }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const addressExists = user.addresses.some((address) => address._id.equals(addressObjectId));
    if (!addressExists) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

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

    if (!mongoose.isValidObjectId(addressId)) {
      return res.status(400).json({ success: false, message: 'Invalid address ID' });
    }

    const addressObjectId = new mongoose.Types.ObjectId(addressId);

    const user = await User.findOneAndUpdate(
      { _id: req.user._id, 'addresses._id': addressObjectId },
      { $pull: { addresses: { _id: addressObjectId } } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

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
