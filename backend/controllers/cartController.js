const User = require('../models/User');

// Get user cart
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    const cartItems = (user.cart || []).filter(item => item.product).map(item => ({
      _id: item.product._id,
      name: item.product.name,
      description: item.product.description,
      category: item.product.category,
      brand: item.product.brand,
      price: item.product.price,
      discountPrice: item.product.discountPrice,
      stock: item.product.stock,
      images: item.product.images,
      thumbnail: item.product.thumbnail || item.product.images?.[0],
      quantity: item.quantity
    }));

    res.status(200).json({ success: true, cart: cartItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const user = await User.findById(req.user._id);

    const existingIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (existingIndex > -1) {
      user.cart[existingIndex].quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('cart.product');

    const cartItems = (updatedUser.cart || []).filter(item => item.product).map(item => ({
      _id: item.product._id,
      name: item.product.name,
      description: item.product.description,
      category: item.product.category,
      brand: item.product.brand,
      price: item.product.price,
      discountPrice: item.product.discountPrice,
      stock: item.product.stock,
      images: item.product.images,
      thumbnail: item.product.thumbnail || item.product.images?.[0],
      quantity: item.quantity
    }));

    res.status(200).json({ 
      success: true, 
      message: 'Item added to cart',
      cart: cartItems,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { cart: { product: productId } } },
      { new: true }
    ).populate('cart.product');

    const cartItems = (user.cart || []).filter(item => item.product).map(item => ({
      _id: item.product._id,
      name: item.product.name,
      description: item.product.description,
      category: item.product.category,
      brand: item.product.brand,
      price: item.product.price,
      discountPrice: item.product.discountPrice,
      stock: item.product.stock,
      images: item.product.images,
      thumbnail: item.product.thumbnail || item.product.images?.[0],
      quantity: item.quantity
    }));

    res.status(200).json({ 
      success: true, 
      message: 'Item removed from cart',
      cart: cartItems
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update cart item quantity
exports.updateCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const user = await User.findById(req.user._id);
    const existingIndex = user.cart.findIndex(
      item => item.product.toString() === productId
    );

    if (existingIndex > -1) {
      if (quantity <= 0) {
        user.cart.splice(existingIndex, 1);
      } else {
        user.cart[existingIndex].quantity = quantity;
      }
      await user.save();
    }

    const updatedUser = await User.findById(req.user._id).populate('cart.product');

    const cartItems = (updatedUser.cart || []).filter(item => item.product).map(item => ({
      _id: item.product._id,
      name: item.product.name,
      description: item.product.description,
      category: item.product.category,
      brand: item.product.brand,
      price: item.product.price,
      discountPrice: item.product.discountPrice,
      stock: item.product.stock,
      images: item.product.images,
      thumbnail: item.product.thumbnail || item.product.images?.[0],
      quantity: item.quantity
    }));

    res.status(200).json({ 
      success: true, 
      message: 'Cart updated',
      cart: cartItems
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      { $set: { cart: [] } }
    );

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      cart: []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
