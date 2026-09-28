import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'kisanai-super-secret-jwt-key-2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate a signed JWT token for a user
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Format user object for response (strip sensitive fields)
 */
const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  language: user.language,
  farmSizeAcres: user.farmSizeAcres,
  primaryCrop: user.primaryCrop,
  kisanId: user.kisanId,
  location: user.location,
  createdAt: user.createdAt,
});

// ============================================================
// POST /api/auth/register
// ============================================================
export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone = '',
      role = 'farmer',
      language = 'hi',
      farmSizeAcres = 4,
      primaryCrop = 'Soybean',
      location = {},
    } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists. Please login instead.',
      });
    }

    // Create user (password will be hashed by pre-save hook)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      role,
      language,
      farmSizeAcres: Number(farmSizeAcres) || 4,
      primaryCrop,
      location: {
        state: location.state || 'India',
        district: location.district || 'District',
        block: location.block || location.district || 'Block',
        panchayat: location.panchayat || 'Gram Panchayat',
      },
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to KisanAI.',
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    // Mongoose duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `An account with this ${field} already exists.`,
      });
    }
    // Mongoose validation error
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    next(error);
  }
};

// ============================================================
// POST /api/auth/login
// ============================================================
export const login = async (req, res, next) => {
  try {
    const { identifier, email, password } = req.body;

    // Accept 'identifier' (old) or 'email' (new) field
    const loginEmail = email || identifier;

    if (!loginEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    // Find user by email and explicitly select password (it's excluded by default)
    const user = await User.findOne({
      email: loginEmail.toLowerCase(),
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Compare password with stored hash
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// GET /api/auth/me  (Protected route)
// ============================================================
export const getMe = async (req, res, next) => {
  try {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.json({ success: true, user: formatUserResponse(user) });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// PUT /api/auth/profile  (Protected route)
// ============================================================
export const updateProfile = async (req, res, next) => {
  try {
    const allowedUpdates = ['name', 'phone', 'language', 'farmSizeAcres', 'primaryCrop', 'location'];
    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({ success: true, message: 'Profile updated.', user: formatUserResponse(user) });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// PUT /api/auth/change-password  (Protected route)
// ============================================================
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    user.password = newPassword; // pre-save hook will hash it
    await user.save();

    return res.json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    next(error);
  }
};
