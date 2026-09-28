import { fetchWeatherForLocation } from '../services/weatherService.js';

export const getWeather = async (req, res, next) => {
  try {
    const locationId = req.query.locationId || 'raj-jai-chomu';
    const data = await fetchWeatherForLocation(locationId);
    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};
