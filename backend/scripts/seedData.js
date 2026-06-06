require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

// Sample product data
const sampleProducts = [
  {
    name: 'Wireless Headphones Pro',
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality.',
    category: 'Electronics',
    brand: 'AudioTech',
    price: 299.99,
    discountPrice: 249.99,
    stock: 50,
    images: ['https://via.placeholder.com/300?text=Headphones', 'https://via.placeholder.com/300?text=Headphones+2'],
    rating: 4.5,
    reviewCount: 128,
    specifications: {
      color: 'Black',
      material: 'Aluminum & Plastic',
      warranty: '2 years'
    },
    featured: true,
    trending: true
  },
  {
    name: 'Smart Watch Elite',
    description: 'Advanced fitness tracking smartwatch with heart rate monitor, GPS, and 5-day battery life.',
    category: 'Electronics',
    brand: 'TechWear',
    price: 199.99,
    discountPrice: 159.99,
    stock: 75,
    images: ['https://via.placeholder.com/300?text=SmartWatch', 'https://via.placeholder.com/300?text=SmartWatch+2'],
    rating: 4.3,
    reviewCount: 95,
    specifications: {
      color: 'Silver',
      size: '42mm',
      warranty: '1 year'
    },
    featured: true,
    trending: true
  },
  {
    name: 'Premium Running Shoes',
    description: 'Lightweight running shoes with advanced cushioning technology and breathable mesh upper.',
    category: 'Fashion',
    brand: 'AthleticGear',
    price: 129.99,
    discountPrice: 99.99,
    stock: 100,
    images: ['https://via.placeholder.com/300?text=Shoes', 'https://via.placeholder.com/300?text=Shoes+2'],
    rating: 4.6,
    reviewCount: 240,
    specifications: {
      color: 'Black/White',
      size: 'Various',
      material: 'Mesh & Rubber'
    },
    featured: true,
    trending: false
  },
  {
    name: '4K Ultra HD Camera',
    description: '4K video recording camera with 20MP sensor, 3-axis stabilization, and professional features.',
    category: 'Electronics',
    brand: 'CineVision',
    price: 799.99,
    discountPrice: 699.99,
    stock: 30,
    images: ['https://via.placeholder.com/300?text=Camera', 'https://via.placeholder.com/300?text=Camera+2'],
    rating: 4.7,
    reviewCount: 185,
    specifications: {
      color: 'Black',
      resolution: '4K',
      warranty: '3 years'
    },
    featured: true,
    trending: true
  },
  {
    name: 'Ergonomic Desk Chair',
    description: 'Premium office chair with lumbar support, adjustable armrests, and breathable mesh back.',
    category: 'Home',
    brand: 'ComfortSeating',
    price: 349.99,
    discountPrice: 279.99,
    stock: 45,
    images: ['https://via.placeholder.com/300?text=Chair', 'https://via.placeholder.com/300?text=Chair+2'],
    rating: 4.4,
    reviewCount: 112,
    specifications: {
      color: 'Black',
      material: 'Mesh & Metal',
      adjustable: 'Yes'
    },
    featured: false,
    trending: true
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Double-walled insulated water bottle keeps drinks cold for 24 hours or hot for 12 hours.',
    category: 'Sports',
    brand: 'HydroFit',
    price: 49.99,
    discountPrice: 39.99,
    stock: 200,
    images: ['https://via.placeholder.com/300?text=Bottle', 'https://via.placeholder.com/300?text=Bottle+2'],
    rating: 4.5,
    reviewCount: 320,
    specifications: {
      color: 'Silver',
      capacity: '1L',
      material: 'Stainless Steel'
    },
    featured: false,
    trending: false
  },
  {
    name: 'Bluetooth Speaker Portable',
    description: 'Portable waterproof Bluetooth speaker with 12-hour battery, 360° sound, and rugged design.',
    category: 'Electronics',
    brand: 'SoundWave',
    price: 89.99,
    discountPrice: 69.99,
    stock: 150,
    images: ['https://via.placeholder.com/300?text=Speaker', 'https://via.placeholder.com/300?text=Speaker+2'],
    rating: 4.3,
    reviewCount: 205,
    specifications: {
      color: 'Blue',
      waterproof: 'IPX7',
      warranty: '1 year'
    },
    featured: true,
    trending: false
  },
  {
    name: 'Yoga Mat Professional',
    description: 'Non-slip yoga mat with carrying strap, eco-friendly materials, and extra cushioning.',
    category: 'Sports',
    brand: 'ZenFit',
    price: 59.99,
    discountPrice: 44.99,
    stock: 120,
    images: ['https://via.placeholder.com/300?text=YogaMat', 'https://via.placeholder.com/300?text=YogaMat+2'],
    rating: 4.6,
    reviewCount: 178,
    specifications: {
      color: 'Purple',
      thickness: '6mm',
      material: 'TPE'
    },
    featured: false,
    trending: true
  },
  {
    name: 'LED Desk Lamp Smart',
    description: 'Adjustable LED desk lamp with touch control, 3 brightness levels, and USB charging port.',
    category: 'Home',
    brand: 'BrightLite',
    price: 79.99,
    discountPrice: 59.99,
    stock: 80,
    images: ['https://via.placeholder.com/300?text=Lamp', 'https://via.placeholder.com/300?text=Lamp+2'],
    rating: 4.4,
    reviewCount: 89,
    specifications: {
      color: 'White',
      brightness: 'Adjustable',
      features: 'USB Charging'
    },
    featured: true,
    trending: false
  },
  {
    name: 'Wireless Gaming Mouse',
    description: 'High-precision gaming mouse with customizable DPI, 8000Hz polling rate, and ergonomic design.',
    category: 'Electronics',
    brand: 'GameTech',
    price: 69.99,
    discountPrice: 54.99,
    stock: 110,
    images: ['https://via.placeholder.com/300?text=Mouse', 'https://via.placeholder.com/300?text=Mouse+2'],
    rating: 4.5,
    reviewCount: 142,
    specifications: {
      color: 'Black/RGB',
      dpi: '16000',
      warranty: '2 years'
    },
    featured: false,
    trending: true
  },
  {
    name: 'Coffee Maker Premium',
    description: 'Programmable coffee maker with thermal carafe, brew strength control, and keep-warm function.',
    category: 'Home',
    brand: 'BrewMaster',
    price: 119.99,
    discountPrice: 89.99,
    stock: 60,
    images: ['https://via.placeholder.com/300?text=CoffeeMaker', 'https://via.placeholder.com/300?text=CoffeeMaker+2'],
    rating: 4.6,
    reviewCount: 167,
    specifications: {
      color: 'Black',
      capacity: '12 cups',
      warranty: '3 years'
    },
    featured: true,
    trending: false
  },
  {
    name: 'Travel Backpack Durable',
    description: 'Weather-resistant travel backpack with multiple compartments, laptop sleeve, and USB port.',
    category: 'Fashion',
    brand: 'TravelPro',
    price: 99.99,
    discountPrice: 79.99,
    stock: 85,
    images: ['https://via.placeholder.com/300?text=Backpack', 'https://via.placeholder.com/300?text=Backpack+2'],
    rating: 4.5,
    reviewCount: 210,
    specifications: {
      color: 'Dark Gray',
      capacity: '40L',
      material: 'Nylon'
    },
    featured: false,
    trending: true
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopsphere', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.error('Connection error:', error);
    process.exit(1);
  }
};

// Seed database
const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Product.deleteMany({});
    console.log('✓ Cleared existing products');

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`✓ Added ${products.length} products to database`);

    console.log('✓ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run seeding
seedDatabase();
