import express from 'express';
import {
  getBuyers,
  getOffers,
  createOffer,
  respondToOffer,
  getOrders,
  updateOrderStatus,
  getMarketPrices,
  getMarketTrends,
  getMarketplaceStats
} from '../controllers/marketplaceController.js';

const router = express.Router();

// Buyers
router.get('/buyers', getBuyers);
router.get('/buyers/nearby', getBuyers);

// Offers & Negotiation
router.route('/offers')
  .get(getOffers)
  .post(createOffer);

router.put('/offers/:id/respond', respondToOffer);

// Orders & Logistics
router.route('/orders')
  .get(getOrders);

router.put('/orders/:id/status', updateOrderStatus);

// Market Mandi Intelligence & Trends
router.get('/market/prices', getMarketPrices);
router.get('/market/trends', getMarketTrends);
router.get('/market/stats', getMarketplaceStats);

export default router;
