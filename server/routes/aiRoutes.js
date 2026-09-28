import express from 'express';
import { handleAIChat, handleCropDiagnosis } from '../controllers/aiController.js';

const router = express.Router();

// POST /api/ai/chat
router.post('/chat', handleAIChat);

// POST /api/ai/diagnose-crop
router.post('/diagnose-crop', handleCropDiagnosis);

export default router;
