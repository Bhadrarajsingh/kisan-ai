import express from 'express';
import { getClimateData } from '../controllers/climateController.js';

const router = express.Router();

// GET /api/climate-indices
router.get('/', getClimateData);

export default router;
