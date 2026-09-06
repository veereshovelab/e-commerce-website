const Product = require('../models/Product');

// Get all products with filters
exports.getAllProducts = async (req, res) => {
  try {
    const { search, category, brand, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

    let query = {};

    // Search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by brand
    if (brand) {
      query.brand = brand;
    }

    // Filter by price
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = minPrice;
      if (maxPrice) query.price.$lte = maxPrice;
    }

    // Total count for pagination
    const totalProducts = await Product.countDocuments(query);

    // Execute query
    let products = Product.find(query);

    // Sort
    if (sort) {
      const sortBy = sort === 'price_asc' ? 'price' : sort === 'price_desc' ? '-price' : sort === 'newest' ? '-createdAt' : sort === 'rating' ? '-rating' : 'name';
      products = products.sort(sortBy);
    } else {
      products = products.sort('-createdAt');
    }

    // Pagination
    products = products.skip((page - 1) * limit).limit(parseInt(limit));

    const data = await products;

    res.status(200).json({
      success: true,
      products: data,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(8);
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get trending products
exports.getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ trending: true }).limit(8);
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get product by slug
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get brands
exports.getBrands = async (req, res) => {
  try {
    const brands = await Product.distinct('brand');
    res.status(200).json({ success: true, brands });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get related products by category or brand
exports.getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      $or: [
        { category: product.category },
        { brand: product.brand }
      ]
    }).limit(6);

    res.status(200).json({ success: true, products: relatedProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
