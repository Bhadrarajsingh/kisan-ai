import { askKisanAI } from '../services/geminiService.js';
import { getForecastData, getClimateIndices, getLiveWeather } from '../services/demoDataService.js';
import { MANDI_PRICES_DATABASE, BUYERS_STORE, PRODUCTS_STORE } from '../services/marketplaceService.js';

export const handleAIChat = async (req, res, next) => {
  try {
    const { message, conversationHistory = [], locationId = 'raj-jai-chomu', crop = 'Soybean', userContext = {} } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message text is required'
      });
    }

    // Retrieve fresh meteorological context
    const forecast = getForecastData(locationId);
    const weather = getLiveWeather(locationId);
    const climate = getClimateIndices();

    // Retrieve relevant market info for selected crop
    const cropLower = (crop || '').toLowerCase();
    const marketBenchmark = MANDI_PRICES_DATABASE.find(m => 
      m.cropName.toLowerCase().includes(cropLower) || m.cropId.includes(cropLower)
    ) || MANDI_PRICES_DATABASE[0];

    const matchingBuyers = BUYERS_STORE.filter(b => 
      b.demandCrops.some(d => d.cropName.toLowerCase().includes(cropLower))
    );

    const enrichedContext = {
      location: forecast.locationName || 'Chomu Panchayat, Jaipur, Rajasthan',
      crop: crop || 'Soybean',
      onsetProbability: forecast.onsetProbability,
      drySpellProbability: forecast.drySpellProbability,
      heavyRainProbability: forecast.heavyRainProbability,
      confidence: forecast.confidence,
      recentRainfall: weather.recentRainfall7d,
      rainfallProbability: forecast.timeline?.[0]?.rainfallProb || 75,
      temperature: weather.temperature,
      humidity: weather.humidity,
      climateSignals: {
        enso: `${climate.enso.status} (${climate.enso.index})`,
        iod: `${climate.iod.status} (${climate.iod.index})`,
        mjo: `Phase ${climate.mjo.phase}, Amp ${climate.mjo.amplitude}`
      },
      marketplace: {
        cropMandiPrice: marketBenchmark ? `₹${(marketBenchmark.currentMandiPrice / 100).toFixed(2)}/kg` : '₹24.50/kg',
        mspBenchmark: marketBenchmark ? `₹${(marketBenchmark.mspPrice / 100).toFixed(2)}/kg` : '₹25.00/kg',
        mandiTrend: marketBenchmark?.trend || 'stable',
        nearbyBuyersCount: matchingBuyers.length > 0 ? matchingBuyers.length : BUYERS_STORE.length,
        topBuyerNames: matchingBuyers.slice(0, 3).map(b => `${b.businessName} (${b.location.block})`),
        totalListingsActive: PRODUCTS_STORE.length
      },
      ...userContext
    };

    const result = await askKisanAI({
      message: message.trim(),
      conversationHistory,
      context: enrichedContext
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
