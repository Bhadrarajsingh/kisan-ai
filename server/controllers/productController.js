import Product from '../models/Product.js';
import { 
  PRODUCTS_STORE, 
  performAIProductVerification 
} from '../services/marketplaceService.js';

// Get all products with query filtering
export const getProducts = async (req, res, next) => {
  try {
    const { 
      category, 
      search, 
      district, 
      state, 
      minPrice, 
      maxPrice, 
      status, 
      farmerId 
    } = req.query;

    let products = [...PRODUCTS_STORE];

    if (category && category !== 'All') {
      products = products.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(q) ||
        (p.hindiName && p.hindiName.includes(q)) ||
        p.variety.toLowerCase().includes(q) ||
        p.location.village?.toLowerCase().includes(q) ||
        p.location.block?.toLowerCase().includes(q)
      );
    }

    if (district) {
      products = products.filter(p => p.location.district?.toLowerCase() === district.toLowerCase());
    }

    if (state) {
      products = products.filter(p => p.location.state?.toLowerCase() === state.toLowerCase());
    }

    if (farmerId) {
      products = products.filter(p => p.farmerId === farmerId);
    }

    if (minPrice) {
      products = products.filter(p => p.expectedPrice >= Number(minPrice));
    }

    if (maxPrice) {
      products = products.filter(p => p.expectedPrice <= Number(maxPrice));
    }

    if (status) {
      products = products.filter(p => p.status === status);
    }

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// Get single product
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = PRODUCTS_STORE.find(p => p.id === id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product listing not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// Create product listing with AI Verification
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      hindiName,
      category = 'Grains',
      variety = 'Desi / Local',
      quantity,
      unit = 'kg',
      expectedPrice,
      minOrderQuantity = 50,
      negotiable = true,
      qualityGrade = 'Grade A (Premium)',
      moisturePercent = 11.0,
      organicStatus = 'Naturally Grown (No Chemicals)',
      harvestDate,
      location = {},
      images = [],
      farmerId = 'usr-kisan-101',
      farmerName = 'Ramesh Patel',
      farmerPhone = '9876543210'
    } = req.body;

    if (!name || !quantity || !expectedPrice) {
      return res.status(400).json({
        success: false,
        message: 'Please provide product name, quantity, and expected price'
      });
    }

    // Run AI verification automatically
    const aiVerification = performAIProductVerification({
      name,
      category,
      quantity,
      unit,
      expectedPrice
    });

    const newProduct = {
      id: `prod-${Date.now()}`,
      farmerId,
      farmerName,
      farmerPhone,
      name,
      hindiName: hindiName || name,
      category,
      variety,
      quantity: Number(quantity),
      unit,
      expectedPrice: Number(expectedPrice),
      minOrderQuantity: Number(minOrderQuantity),
      negotiable: Boolean(negotiable),
      qualityGrade,
      moisturePercent: Number(moisturePercent),
      organicStatus,
      harvestDate: harvestDate || new Date().toISOString().split('T')[0],
      location: {
        state: location.state || 'Rajasthan',
        district: location.district || 'Jaipur',
        block: location.block || 'Chomu',
        village: location.village || 'Morija',
        distanceKm: location.distanceKm || 5.0
      },
      images: images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80'
      ],
      status: 'active',
      aiVerification,
      createdAt: new Date().toISOString()
    };

    // Prepend to in-memory store
    PRODUCTS_STORE.unshift(newProduct);

    // Also persist to MongoDB if connected
    try {
      if (process.env.USE_DEMO_DATA !== 'true') {
        await Product.create(newProduct);
      }
    } catch (err) {
      console.warn('MongoDB sync skipped:', err.message);
    }

    res.status(201).json({
      success: true,
      message: 'Produce listed successfully on KisanAI Marketplace',
      data: newProduct
    });
  } catch (error) {
    next(error);
  }
};

// Update product
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const index = PRODUCTS_STORE.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    PRODUCTS_STORE[index] = {
      ...PRODUCTS_STORE[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: PRODUCTS_STORE[index]
    });
  } catch (error) {
    next(error);
  }
};

// Delete or unlist product
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const index = PRODUCTS_STORE.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const removed = PRODUCTS_STORE.splice(index, 1)[0];

    res.json({
      success: true,
      message: 'Product listing removed',
      data: removed
    });
  } catch (error) {
    next(error);
  }
};

// Standalone AI Verification endpoint for real-time form feedback
export const verifyProductAI = async (req, res, next) => {
  try {
    const verification = performAIProductVerification(req.body);
    res.json({
      success: true,
      data: verification
    });
  } catch (error) {
    next(error);
  }
};
