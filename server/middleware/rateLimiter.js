import rateLimit from 'express-rate-limit';

// Standard rate limiter for general endpoints
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests created from this IP, please try again after 15 minutes'
  }
});

// Dedicated rate limiter for AI queries
export const aiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit to 30 AI queries per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'AI query limit reached. Please wait a moment before asking another question.'
  }
});
