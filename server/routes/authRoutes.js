import express from 'express';
import { register, login, getMe, updateProfile, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ── Public Routes (no auth needed) ──────────────────────────
// POST /api/auth/register  — create new user
router.post('/register', register);

// POST /api/auth/login  — login with email + password
router.post('/login', login);

// ── Protected Routes (valid JWT required) ───────────────────
// GET /api/auth/me  — get current user profile
router.get('/me', protect, getMe);

// PUT /api/auth/profile  — update profile fields
router.put('/profile', protect, updateProfile);

// PUT /api/auth/change-password  — change password
router.put('/change-password', protect, changePassword);

export default router;
