import { getClimateIndices } from '../services/demoDataService.js';

export const getClimateData = async (req, res, next) => {
  try {
    const data = getClimateIndices();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};
