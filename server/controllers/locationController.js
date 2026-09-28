import { LOCATIONS_DATABASE } from '../services/demoDataService.js';

export const getLocations = async (req, res, next) => {
  try {
    const { state, district } = req.query;
    let filtered = LOCATIONS_DATABASE;

    if (state) {
      filtered = filtered.filter(l => l.state.toLowerCase() === state.toLowerCase());
    }
    if (district) {
      filtered = filtered.filter(l => l.district.toLowerCase() === district.toLowerCase());
    }

    res.json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    next(error);
  }
};
