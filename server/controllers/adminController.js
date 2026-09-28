import { setDemoScenario, getActiveScenario, LOCATIONS_DATABASE, getAlertsData } from '../services/demoDataService.js';
import { CROPS_DATABASE } from '../services/advisoryService.js';
import { getDBStatus } from '../config/db.js';

export const getAdminStats = async (req, res, next) => {
  try {
    const alerts = getAlertsData();
    const dbStatus = getDBStatus();
    const geminiConfigured = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here');

    res.json({
      success: true,
      data: {
        monitoredLocationsCount: LOCATIONS_DATABASE.length,
        activeAlertsCount: alerts.length,
        supportedCropsCount: CROPS_DATABASE.length,
        forecastsGenerated24h: 1248,
        activeScenario: getActiveScenario(),
        systemHealth: {
          server: 'Operational (200 OK)',
          uptime: Math.round(process.uptime()),
          nodeVersion: process.version,
          dbStatus: dbStatus.connected ? 'Connected (MongoDB)' : 'Active (In-Memory Mock Store)',
          geminiStatus: geminiConfigured ? 'Ready (API Key Present)' : 'Autonomous Mock/Fallback Mode (Demo Ready)',
          weatherAPI: 'Integrated (Open-Meteo / Fallback Cache)'
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const changeScenario = async (req, res, next) => {
  try {
    const { scenario } = req.body;
    const validScenarios = ['normal_monsoon', 'delayed_onset', 'false_onset_dry_spell', 'heavy_rainfall', 'monsoon_revival'];

    if (!validScenarios.includes(scenario)) {
      return res.status(400).json({
        success: false,
        message: `Invalid scenario. Choose from: ${validScenarios.join(', ')}`
      });
    }

    const result = setDemoScenario(scenario);
    res.json({
      success: true,
      message: `Hackathon scenario changed to ${scenario}`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
