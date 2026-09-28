import { getForecastData, getRiskMapData } from '../services/demoDataService.js';

export const getForecast = async (req, res, next) => {
  try {
    const locationId = req.query.locationId || 'raj-jai-chomu';
    const horizon = req.query.horizon || '14d';
    const data = getForecastData(locationId, horizon);
    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

export const getForecastByLocationId = async (req, res, next) => {
  try {
    const { locationId } = req.params;
    const horizon = req.query.horizon || '14d';
    const data = getForecastData(locationId, horizon);
    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

export const getRiskMap = async (req, res, next) => {
  try {
    const metric = req.query.metric || 'onset';
    const data = getRiskMapData(metric);
    res.json({
      success: true,
      metric,
      data
    });
  } catch (error) {
    next(error);
  }
};
