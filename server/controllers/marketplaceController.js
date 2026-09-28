import {
  BUYERS_STORE,
  OFFERS_STORE,
  ORDERS_STORE,
  MANDI_PRICES_DATABASE,
  get30DayPriceTrends,
  PRODUCTS_STORE
} from '../services/marketplaceService.js';

// Get Buyers with optional distance or crop filter
export const getBuyers = async (req, res, next) => {
  try {
    const { crop, district, maxDistance } = req.query;
    let buyers = [...BUYERS_STORE];

    if (crop) {
      buyers = buyers.filter(b => 
        b.demandCrops.some(c => c.cropName.toLowerCase().includes(crop.toLowerCase()))
      );
    }

    if (district) {
      buyers = buyers.filter(b => 
        b.location.district.toLowerCase() === district.toLowerCase()
      );
    }

    if (maxDistance) {
      buyers = buyers.filter(b => (b.location.distanceKm || 10) <= Number(maxDistance));
    }

    res.json({
      success: true,
      count: buyers.length,
      data: buyers
    });
  } catch (error) {
    next(error);
  }
};

// Get Offers & Negotiations
export const getOffers = async (req, res, next) => {
  try {
    const { farmerId, buyerId, productId, status } = req.query;
    let offers = [...OFFERS_STORE];

    if (farmerId) {
      offers = offers.filter(o => o.farmerId === farmerId);
    }
    if (buyerId) {
      offers = offers.filter(o => o.buyerId === buyerId);
    }
    if (productId) {
      offers = offers.filter(o => o.productId === productId);
    }
    if (status) {
      offers = offers.filter(o => o.status === status);
    }

    res.json({
      success: true,
      count: offers.length,
      data: offers
    });
  } catch (error) {
    next(error);
  }
};

// Create new purchase request / offer
export const createOffer = async (req, res, next) => {
  try {
    const {
      productId,
      productName,
      farmerId = 'usr-kisan-101',
      farmerName = 'Ramesh Patel',
      buyerId = 'byr-101',
      buyerName = 'ABC Grain Traders & Agro Exports',
      buyerPhone = '9829012345',
      quantity,
      unit = 'kg',
      offeredPrice,
      deliveryType = 'Buyer Pickup',
      message
    } = req.body;

    if (!productId || !quantity || !offeredPrice) {
      return res.status(400).json({
        success: false,
        message: 'Product, quantity and offered price are required'
      });
    }

    const totalAmount = Number(quantity) * Number(offeredPrice);

    const newOffer = {
      id: `ofr-${Date.now()}`,
      productId,
      productName: productName || 'Agricultural Produce',
      farmerId,
      farmerName,
      buyerId,
      buyerName,
      buyerPhone,
      quantity: Number(quantity),
      unit,
      offeredPrice: Number(offeredPrice),
      totalAmount,
      deliveryType,
      status: 'pending',
      message: message || `Purchase request for ${quantity} ${unit} at ₹${offeredPrice}/${unit}`,
      history: [
        {
          sender: 'buyer',
          price: Number(offeredPrice),
          message: message || 'Initial purchase request submitted.',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString()
    };

    OFFERS_STORE.unshift(newOffer);

    res.status(201).json({
      success: true,
      message: 'Offer submitted successfully to the farmer',
      data: newOffer
    });
  } catch (error) {
    next(error);
  }
};

// Respond to offer (Farmer can Accept, Counter, or Reject)
export const respondToOffer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, counterPrice, message } = req.body; // action: 'accept', 'counter', 'reject'

    const offerIndex = OFFERS_STORE.findIndex(o => o.id === id);
    if (offerIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    const offer = OFFERS_STORE[offerIndex];

    if (action === 'accept') {
      offer.status = 'accepted';
      offer.history.push({
        sender: 'farmer',
        price: offer.counterPrice || offer.offeredPrice,
        message: message || 'Offer accepted by farmer. Order created.',
        timestamp: new Date().toISOString()
      });

      // Automatically generate confirmed Order
      const newOrder = {
        id: `ord-${Date.now()}`,
        orderNumber: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
        productId: offer.productId,
        productName: offer.productName,
        farmerId: offer.farmerId,
        farmerName: offer.farmerName,
        buyerId: offer.buyerId,
        buyerName: offer.buyerName,
        buyerPhone: offer.buyerPhone,
        quantity: offer.quantity,
        unit: offer.unit,
        agreedPrice: offer.counterPrice || offer.offeredPrice,
        totalAmount: offer.quantity * (offer.counterPrice || offer.offeredPrice),
        status: 'confirmed',
        deliveryType: offer.deliveryType || 'Buyer Pickup',
        pickupLocation: {
          address: 'Kisan Farm Gate Yard',
          village: 'Morija',
          block: 'Chomu',
          district: 'Jaipur',
          state: 'Rajasthan'
        },
        pickupDate: 'Expected in 48-72 hours (Slot: 10:00 AM - 2:00 PM)',
        trackingNotes: [
          { status: 'confirmed', note: 'Offer accepted. Official KisanAI Kisan Order generated.', timestamp: new Date().toISOString() }
        ],
        createdAt: new Date().toISOString()
      };

      ORDERS_STORE.unshift(newOrder);

      return res.json({
        success: true,
        message: 'Offer accepted! Order has been created successfully.',
        data: { offer, order: newOrder }
      });
    } else if (action === 'counter') {
      if (!counterPrice) {
        return res.status(400).json({ success: false, message: 'Counter price is required' });
      }
      offer.status = 'countered';
      offer.counterPrice = Number(counterPrice);
      offer.history.push({
        sender: 'farmer',
        price: Number(counterPrice),
        message: message || `Farmer suggested counter-price of ₹${counterPrice}/${offer.unit}`,
        timestamp: new Date().toISOString()
      });

      return res.json({
        success: true,
        message: 'Counter offer sent to buyer',
        data: { offer }
      });
    } else if (action === 'reject') {
      offer.status = 'rejected';
      offer.history.push({
        sender: 'farmer',
        price: offer.offeredPrice,
        message: message || 'Offer declined by farmer.',
        timestamp: new Date().toISOString()
      });

      return res.json({
        success: true,
        message: 'Offer rejected',
        data: { offer }
      });
    }

    res.status(400).json({ success: false, message: 'Invalid action' });
  } catch (error) {
    next(error);
  }
};

// Get Orders
export const getOrders = async (req, res, next) => {
  try {
    const { farmerId, buyerId, status } = req.query;
    let orders = [...ORDERS_STORE];

    if (farmerId) {
      orders = orders.filter(o => o.farmerId === farmerId);
    }
    if (buyerId) {
      orders = orders.filter(o => o.buyerId === buyerId);
    }
    if (status) {
      orders = orders.filter(o => o.status === status);
    }

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// Update Order Status (confirmed -> processing -> ready_for_pickup -> in_transit -> completed)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const orderIndex = ORDERS_STORE.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = ORDERS_STORE[orderIndex];
    order.status = status;
    order.trackingNotes.push({
      status,
      note: note || `Order updated to ${status}`,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// Get Market Mandi Prices & MSP Benchmarks
export const getMarketPrices = async (req, res, next) => {
  try {
    res.json({
      success: true,
      count: MANDI_PRICES_DATABASE.length,
      data: MANDI_PRICES_DATABASE
    });
  } catch (error) {
    next(error);
  }
};

// Get 30-Day Market Price Trends
export const getMarketTrends = async (req, res, next) => {
  try {
    const { cropId = 'bajra' } = req.query;
    const trends = get30DayPriceTrends(cropId);
    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    next(error);
  }
};

// Overall Marketplace Overview & Stats for Admin / Dashboard
export const getMarketplaceStats = async (req, res, next) => {
  try {
    const totalListings = PRODUCTS_STORE.length;
    const activeListings = PRODUCTS_STORE.filter(p => p.status === 'active').length;
    const totalQuantityKg = PRODUCTS_STORE.reduce((sum, p) => sum + (p.quantity || 0), 0);
    const totalBuyers = BUYERS_STORE.length;
    const pendingOffers = OFFERS_STORE.filter(o => o.status === 'pending' || o.status === 'countered').length;
    const completedOrders = ORDERS_STORE.filter(o => o.status === 'completed').length;
    const activeOrders = ORDERS_STORE.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length;
    const totalOrderValue = ORDERS_STORE.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    res.json({
      success: true,
      data: {
        totalListings,
        activeListings,
        totalQuantityKg,
        totalBuyers,
        pendingOffers,
        activeOrders,
        completedOrders,
        totalOrderValue,
        topTradingCrops: ['Bajra', 'Soybean', 'Wheat', 'Groundnut', 'Cotton']
      }
    });
  } catch (error) {
    next(error);
  }
};
