import express from 'express';
import { getCrops, getCropAdvisory } from '../controllers/advisoryController.js';

const router = express.Router();

// GET /api/crops
router.get('/crops', getCrops);

// GET /api/advisory/:locationId/:crop
router.get('/advisory/:locationId/:crop', getCropAdvisory);

export default router;
