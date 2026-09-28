import { getAlertsData } from '../services/demoDataService.js';

let inMemoryAlerts = null;

export const getAlerts = async (req, res, next) => {
  try {
    if (!inMemoryAlerts) {
      inMemoryAlerts = getAlertsData();
    }
    res.json({
      success: true,
      count: inMemoryAlerts.length,
      data: inMemoryAlerts
    });
  } catch (error) {
    next(error);
  }
};

export const createAlert = async (req, res, next) => {
  try {
    const { title, message, severity, locationId, locationName, type, timeframe, metricValue } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required' });
    }

    const newAlert = {
      id: `alt-${Date.now()}`,
      locationId: locationId || 'raj-jai-chomu',
      locationName: locationName || 'Chomu Block, Jaipur',
      type: type || 'advisory_update',
      severity: severity || 'moderate',
      title,
      titleHindi: req.body.titleHindi || title,
      message,
      messageHindi: req.body.messageHindi || message,
      timeframe: timeframe || 'Immediate',
      metricValue: metricValue || 'Custom Alert',
      actionRequired: req.body.actionRequired || 'Follow local agricultural guidelines.',
      actionRequiredHindi: req.body.actionRequiredHindi || 'स्थानीय कृषि निर्देशों का पालन करें।',
      createdAt: new Date().toISOString()
    };

    if (!inMemoryAlerts) {
      inMemoryAlerts = getAlertsData();
    }
    inMemoryAlerts.unshift(newAlert);

    res.status(201).json({
      success: true,
      data: newAlert
    });
  } catch (error) {
    next(error);
  }
};
