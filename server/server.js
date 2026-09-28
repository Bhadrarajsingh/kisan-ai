import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDB } from './config/db.js';

// Route imports
import weatherRoutes from './routes/weatherRoutes.js';
import forecastRoutes from './routes/forecastRoutes.js';
import advisoryRoutes from './routes/advisoryRoutes.js';
import climateRoutes from './routes/climateRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import marketplaceRoutes from './routes/marketplaceRoutes.js';
import { getRiskMap } from './controllers/forecastController.js';

// Middleware imports
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { generalLimiter, aiRateLimiter } from './middleware/rateLimiter.js';

dotenv.config();

// ── Startup API Key Diagnostics ──────────────────────────────────────────────
const geminiKey = process.env.GEMINI_API_KEY;
const weatherKey = process.env.WEATHER_API_KEY;
const demoMode = process.env.USE_DEMO_DATA === 'true';

const geminiOk = geminiKey && geminiKey !== 'your_gemini_api_key_here' && geminiKey.trim().length > 10;
const weatherOk = weatherKey && weatherKey !== 'your_weather_api_key_here' && weatherKey.trim().length > 10;

if (demoMode) {
  console.log('ℹ️  KisanAI running in Demo / Mock Data mode (USE_DEMO_DATA=true)');
} else {
  console.log('🟢 KisanAI running in LIVE mode (USE_DEMO_DATA=false)');
}
console.log(`🔑 Gemini API Key : ${geminiOk ? '✅ Configured (' + geminiKey.slice(0,8) + '...)' : '❌ MISSING or invalid'}`);
console.log(`🌦️  Weather API Key: ${weatherOk ? '✅ OpenWeatherMap configured (' + weatherKey.slice(0,8) + '...) → Primary source' : '⚠️  Not set → Using Open-Meteo free API as fallback'}`);
console.log('─────────────────────────────────────────────────────────────────────────────');
// ─────────────────────────────────────────────────────────────────────────────

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database connection
connectDB();

// Global Middleware
app.use(cors({
  origin: '*', // Allow frontend development requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(morgan('dev'));
app.use(generalLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    app: 'KisanAI Backend API',
    tagline: 'Hyperlocal Agricultural & Weather Intelligence for Smarter Farming',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Direct REST Endpoints matching exact specifications
app.use('/api/weather', weatherRoutes);
app.use('/api/forecast', forecastRoutes);
app.get('/api/risk-map', getRiskMap);
app.use('/api/climate-indices', climateRoutes);
app.use('/api', advisoryRoutes); // Provides /api/crops and /api/advisory/:locationId/:crop
app.use('/api/ai', aiRateLimiter, aiRoutes); // Provides /api/ai/chat
app.use('/api/alerts', alertRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api', marketplaceRoutes); // Mounts /api/buyers, /api/offers, /api/orders, /api/market
app.use('/api', adminRoutes); // Provides /api/admin/stats and /api/scenario

// 404 and Error Handler
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🌾 KisanAI Backend Server running on http://localhost:${PORT}`);
  console.log(`🤖 AI Provider: Google Gemini (@google/genai) + Hyperlocal Agro-Risk Engine`);
});

export default app;
