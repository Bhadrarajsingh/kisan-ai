import express from 'express';
import { getForecast, getForecastByLocationId, getRiskMap } from '../controllers/forecastController.js';

const router = express.Router();

// GET /api/forecast
router.get('/', getForecast);

// GET /api/forecast/:locationId
router.get('/:locationId', getForecastByLocationId);

export default router;
