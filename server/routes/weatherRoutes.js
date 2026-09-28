import express from 'express';
import { getWeather } from '../controllers/weatherController.js';

const router = express.Router();

// GET /api/weather
router.get('/', getWeather);

export default router;
