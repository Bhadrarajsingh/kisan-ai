import { generateCropAdvisory, CROPS_DATABASE } from '../services/advisoryService.js';
import { getForecastData } from '../services/demoDataService.js';

export const getCrops = async (req, res, next) => {
  try {
    res.json({
      success: true,
      count: CROPS_DATABASE.length,
      data: CROPS_DATABASE
    });
  } catch (error) {
    next(error);
  }
};

export const getCropAdvisory = async (req, res, next) => {
  try {
    const { locationId, crop } = req.params;
    const forecast = getForecastData(locationId);
    const locationName = forecast.locationName;
    const advisory = generateCropAdvisory(forecast, crop, locationName);

    res.json({
      success: true,
      data: advisory
    });
  } catch (error) {
    next(error);
  }
};
