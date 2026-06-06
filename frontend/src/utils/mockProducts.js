// Fallback Mock Products Data & API simulation for Frontend-Only mode
export const mockProducts = [
  {
    _id: 'mock-1',
    name: 'Wireless Headphones Pro',
    description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality.',
    category: 'Electronics',
    brand: 'AudioTech',
    price: 299.99,
    discountPrice: 249.99,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop'
    ],
    rating: 4.5,
    reviewCount: 128,
    specifications: {
      color: 'Matte Black',
      material: 'Aluminum & Leather',
      warranty: '2 years'
    },
    featured: true,
    trending: true,
    reviews: [
      { userName: 'John Doe', rating: 5, comment: 'Incredible sound quality and noise cancellation is top notch.', createdAt: '2026-05-15' },
      { userName: 'Jane Smith', rating: 4, comment: 'Very comfortable for long listening sessions.', createdAt: '2026-05-20' }
    ]
  },
  {
    _id: 'mock-2',
    name: 'Smart Watch Elite',
    description: 'Advanced fitness tracking smartwatch with heart rate monitor, GPS, and 5-day battery life.',
    category: 'Electronics',
    brand: 'TechWear',
    price: 199.99,
    discountPrice: 159.99,
    stock: 75,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop'
    ],
    rating: 4.3,
    reviewCount: 95,
    specifications: {
      color: 'Silver/Black',
      size: '42mm',
      warranty: '1 year'
    },
    featured: true,
    trending: true,
    reviews: [
      { userName: 'Bob Vance', rating: 4, comment: 'Great for tracking workouts. Battery life is solid.', createdAt: '2026-04-10' }
    ]
  },
  {
    _id: 'mock-3',
    name: 'Premium Running Shoes',
    description: 'Lightweight running shoes with advanced cushioning technology and breathable mesh upper.',
    category: 'Fashion',
    brand: 'AthleticGear',
    price: 129.99,
    discountPrice: 99.99,
    stock: 100,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop'
    ],
    rating: 4.6,
    reviewCount: 240,
    specifications: {
      color: 'Infrared Red',
      size: '10 US',
      material: 'Mesh & Rubber'
    },
    featured: true,
    trending: false,
    reviews: []
  },
  {
    _id: 'mock-4',
    name: '4K Ultra HD Camera',
    description: '4K video recording camera with 20MP sensor, 3-axis stabilization, and professional features.',
    category: 'Electronics',
    brand: 'CineVision',
    price: 799.99,
    discountPrice: 699.99,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=600&auto=format&fit=crop'
    ],
    rating: 4.7,
    reviewCount: 185,
    specifications: {
      color: 'Black',
      resolution: '4K',
      warranty: '3 years'
    },
    featured: true,
    trending: true,
    reviews: []
  },
  {
    _id: 'mock-5',
    name: 'Ergonomic Desk Chair',
    description: 'Premium office chair with lumbar support, adjustable armrests, and breathable mesh back.',
    category: 'Home',
    brand: 'ComfortSeating',
    price: 349.99,
    discountPrice: 279.99,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?w=600&auto=format&fit=crop'
    ],
    rating: 4.4,
    reviewCount: 112,
    specifications: {
      color: 'Classic Black',
      material: 'Mesh & High-Grade Steel',
      adjustable: 'Yes'
    },
    featured: false,
    trending: true,
    reviews: []
  },
  {
    _id: 'mock-6',
    name: 'Stainless Steel Water Bottle',
    description: 'Double-walled insulated water bottle keeps drinks cold for 24 hours or hot for 12 hours.',
    category: 'Sports',
    brand: 'HydroFit',
    price: 49.99,
    discountPrice: 39.99,
    stock: 200,
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&auto=format&fit=crop'
    ],
    rating: 4.5,
    reviewCount: 320,
    specifications: {
      color: 'Brushed Steel',
      capacity: '1L',
      material: '304 Stainless Steel'
    },
    featured: false,
    trending: false,
    reviews: []
  },
  {
    _id: 'mock-7',
    name: 'Bluetooth Speaker Portable',
    description: 'Portable waterproof Bluetooth speaker with 12-hour battery, 360° sound, and rugged design.',
    category: 'Electronics',
    brand: 'SoundWave',
    price: 89.99,
    discountPrice: 69.99,
    stock: 150,
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop'
    ],
    rating: 4.3,
    reviewCount: 205,
    specifications: {
      color: 'Ocean Blue',
      waterproof: 'IPX7 certified',
      warranty: '1 year'
    },
    featured: true,
    trending: false,
    reviews: []
  },
  {
    _id: 'mock-8',
    name: 'Yoga Mat Professional',
    description: 'Non-slip yoga mat with carrying strap, eco-friendly materials, and extra cushioning.',
    category: 'Sports',
    brand: 'ZenFit',
    price: 59.99,
    discountPrice: 44.99,
    stock: 120,
    images: [
      'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop'
    ],
    rating: 4.6,
    reviewCount: 178,
    specifications: {
      color: 'Eco Purple',
      thickness: '6mm',
      material: 'Biodegradable TPE'
    },
    featured: false,
    trending: true,
    reviews: []
  },
  {
    _id: 'mock-9',
    name: 'LED Desk Lamp Smart',
    description: 'Adjustable LED desk lamp with touch control, 3 brightness levels, and USB charging port.',
    category: 'Home',
    brand: 'BrightLite',
    price: 79.99,
    discountPrice: 59.99,
    stock: 80,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?w=600&auto=format&fit=crop'
    ],
    rating: 4.4,
    reviewCount: 89,
    specifications: {
      color: 'Polar White',
      brightness: 'Adjustable LED',
      features: 'USB Charger Integrated'
    },
    featured: true,
    trending: false,
    reviews: []
  },
  {
    _id: 'mock-10',
    name: 'Wireless Gaming Mouse',
    description: 'High-precision gaming mouse with customizable DPI, 8000Hz polling rate, and ergonomic design.',
    category: 'Electronics',
    brand: 'GameTech',
    price: 69.99,
    discountPrice: 54.99,
    stock: 110,
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop'
    ],
    rating: 4.5,
    reviewCount: 142,
    specifications: {
      color: 'RGB Breathing Black',
      dpi: '16,000 max',
      warranty: '2 years'
    },
    featured: false,
    trending: true,
    reviews: []
  },
  {
    _id: 'mock-11',
    name: 'Coffee Maker Premium',
    description: 'Programmable coffee maker with thermal carafe, brew strength control, and keep-warm function.',
    category: 'Home',
    brand: 'BrewMaster',
    price: 119.99,
    discountPrice: 89.99,
    stock: 60,
    images: [
      'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop'
    ],
    rating: 4.6,
    reviewCount: 167,
    specifications: {
      color: 'Brushed Chrome',
      capacity: '12 standard cups',
      warranty: '3 years'
    },
    featured: true,
    trending: false,
    reviews: []
  },
  {
    _id: 'mock-12',
    name: 'Travel Backpack Durable',
    description: 'Weather-resistant travel backpack with multiple compartments, laptop sleeve, and USB port.',
    category: 'Fashion',
    brand: 'TravelPro',
    price: 99.99,
    discountPrice: 79.99,
    stock: 85,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&auto=format&fit=crop'
    ],
    rating: 4.5,
    reviewCount: 210,
    specifications: {
      color: 'Charcoal Dark Gray',
      capacity: '40L',
      material: 'Ballistic Nylon'
    },
    featured: false,
    trending: true,
    reviews: []
  },
  {
    _id: 'mock-13',
    name: 'Minimalist Mechanical Keyboard',
    description: 'Sleek 75% mechanical keyboard with tactile switches, high quality PBT keycaps, and white backlight.',
    category: 'Electronics',
    brand: 'TypeStudio',
    price: 149.99,
    discountPrice: 129.99,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop'
    ],
    rating: 4.8,
    reviewCount: 88,
    specifications: {
      switches: 'Brown Tactile',
      connectivity: 'USB-C wired',
      backlight: 'White LED'
    },
    featured: true,
    trending: true,
    reviews: [
      { userName: 'Typing Enthusiast', rating: 5, comment: 'Absolute dream to type on. Sounds amazing.', createdAt: '2026-05-22' }
    ]
  },
  {
    _id: 'mock-14',
    name: 'Ultra-thin Laptop Stand',
    description: 'Ergonomic aluminum laptop stand, foldable and adjustable, matches perfectly with sleek laptops.',
    category: 'Electronics',
    brand: 'DeskDecor',
    price: 39.99,
    discountPrice: 29.99,
    stock: 180,
    images: [
      'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop'
    ],
    rating: 4.5,
    reviewCount: 145,
    specifications: {
      material: 'Anodized Aluminum',
      weight: '250g',
      compatibility: 'Laptops up to 16 inches'
    },
    featured: false,
    trending: false,
    reviews: []
  },
  {
    _id: 'mock-15',
    name: 'Leather Designer Wallet',
    description: 'Handcrafted genuine leather wallet with RFID blocking, slim design, and premium stitching.',
    category: 'Fashion',
    brand: 'HideCraft',
    price: 79.99,
    discountPrice: 59.99,
    stock: 90,
    images: [
      'https://images.unsplash.com/photo-1627124765114-f71af5347e3a?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1588444650733-747522cd9643?w=600&auto=format&fit=crop'
    ],
    rating: 4.7,
    reviewCount: 76,
    specifications: {
      material: 'Full Grain Leather',
      slots: '8 card slots',
      dimensions: '11 x 8 x 1.5 cm'
    },
    featured: false,
    trending: true,
    reviews: []
  },
  {
    _id: 'mock-16',
    name: 'Minimalist Wall Clock',
    description: 'Silent movement wall clock with sleek, floating-style hands and wooden face finish.',
    category: 'Home',
    brand: 'Chronos',
    price: 64.99,
    discountPrice: 49.99,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1563861826100-9cb868fdba1c?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=600&auto=format&fit=crop'
    ],
    rating: 4.4,
    reviewCount: 52,
    specifications: {
      diameter: '30cm',
      battery: '1x AA battery',
      mechanism: 'Silent Quartz'
    },
    featured: false,
    trending: false,
    reviews: []
  },
  {
    _id: 'mock-17',
    name: 'Smart Home Hub Display',
    description: 'Intelligent touch display hub to voice-control and manage all compatible smart home appliances.',
    category: 'Electronics',
    brand: 'SyncHome',
    price: 249.99,
    discountPrice: 199.99,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop'
    ],
    rating: 4.6,
    reviewCount: 64,
    specifications: {
      display: '8-inch Touch HD',
      assistant: 'Built-in Voice AI',
      connectivity: 'Wi-Fi & Bluetooth'
    },
    featured: true,
    trending: true,
    reviews: []
  },
  {
    _id: 'mock-18',
    name: 'Resistance Bands Set',
    description: 'Set of 5 heavy-duty latex workout bands with distinct resistance weights, foam handles, and travel pouch.',
    category: 'Sports',
    brand: 'HydroFit',
    price: 29.99,
    discountPrice: 24.99,
    stock: 250,
    images: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=600&auto=format&fit=crop'
    ],
    rating: 4.7,
    reviewCount: 310,
    specifications: {
      material: 'Natural Latex',
      weights: '10lbs to 50lbs',
      includes: '5 bands, 2 handles, 2 ankle straps'
    },
    featured: false,
    trending: false,
    reviews: []
  }
];

export const getMockCategories = () => {
  return [...new Set(mockProducts.map(p => p.category))];
};

export const getMockBrands = () => {
  return [...new Set(mockProducts.map(p => p.brand))];
};

export const getMockProducts = (params = {}) => {
  let list = [...mockProducts];

  // Search filter
  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }

  // Category filter
  if (params.category) {
    list = list.filter(p => p.category.toLowerCase() === params.category.toLowerCase());
  }

  // Brand filter
  if (params.brand) {
    list = list.filter(p => p.brand.toLowerCase() === params.brand.toLowerCase());
  }

  // Price filter
  if (params.minPrice) {
    const min = parseFloat(params.minPrice);
    list = list.filter(p => (p.discountPrice || p.price) >= min);
  }
  if (params.maxPrice) {
    const max = parseFloat(params.maxPrice);
    list = list.filter(p => (p.discountPrice || p.price) <= max);
  }

  // Sorting
  if (params.sort) {
    switch (params.sort) {
      case 'newest':
        // Mock sorted descending by ID
        list.reverse();
        break;
      case 'price_asc':
        list.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price_desc':
        list.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
  }

  return {
    products: list,
    page: 1,
    pages: 1,
    total: list.length
  };
};

export const getMockFeatured = () => {
  return { products: mockProducts.filter(p => p.featured) };
};

export const getMockTrending = () => {
  return { products: mockProducts.filter(p => p.trending) };
};

export const getMockProductById = (id) => {
  const product = mockProducts.find(p => p._id === id);
  return { product };
};
