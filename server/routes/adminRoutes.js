import express from 'express';
import { getAdminStats, changeScenario } from '../controllers/adminController.js';

const router = express.Router();

// GET /api/admin/stats
router.get('/stats', getAdminStats);

// POST /api/scenario or /api/admin/scenario
router.post('/scenario', changeScenario);

export default router;
