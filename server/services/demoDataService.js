import { calculateProbabilisticRisks } from './predictionService.js';
import { generateCropAdvisory, CROPS_DATABASE } from './advisoryService.js';

// Global state for active demo scenario
let activeScenario = 'normal_monsoon';

export const LOCATIONS_DATABASE = [
  {
    locationId: 'raj-jai-chomu',
    state: 'Rajasthan',
    district: 'Jaipur',
    block: 'Chomu',
    panchayat: 'Morija',
    latitude: 27.1726,
    longitude: 75.7233,
    soilType: 'Sandy Loam / Alluvial',
    agroClimaticZone: 'Semi-Arid Eastern Plain (Zone III-A)',
    elevation: 393,
    historicalRainfallAvgMm: 550,
  },
  {
    locationId: 'raj-jai-phagi',
    state: 'Rajasthan',
    district: 'Jaipur',
    block: 'Phagi',
    panchayat: 'Nimera',
    latitude: 26.5782,
    longitude: 75.5684,
    soilType: 'Loamy Sand',
    agroClimaticZone: 'Semi-Arid Eastern Plain (Zone III-A)',
    elevation: 362,
    historicalRainfallAvgMm: 520,
  },
  {
    locationId: 'raj-jai-amber',
    state: 'Rajasthan',
    district: 'Jaipur',
    block: 'Amber',
    panchayat: 'Kukas',
    latitude: 27.0583,
    longitude: 75.8942,
    soilType: 'Sandy Loam',
    agroClimaticZone: 'Semi-Arid Eastern Plain (Zone III-A)',
    elevation: 430,
    historicalRainfallAvgMm: 580,
  },
  {
    locationId: 'mp-ind-sanwer',
    state: 'Madhya Pradesh',
    district: 'Indore',
    block: 'Sanwer',
    panchayat: 'Kshipra',
    latitude: 22.9774,
    longitude: 75.8247,
    soilType: 'Medium to Deep Black Cotton Soil',
    agroClimaticZone: 'Malwa Plateau (Zone VII)',
    elevation: 540,
    historicalRainfallAvgMm: 960,
  },
  {
    locationId: 'mp-ujj-badnagar',
    state: 'Madhya Pradesh',
    district: 'Ujjain',
    block: 'Badnagar',
    panchayat: 'Runija',
    latitude: 23.0645,
    longitude: 75.3812,
    soilType: 'Deep Black Vertisols',
    agroClimaticZone: 'Malwa Plateau (Zone VII)',
    elevation: 495,
    historicalRainfallAvgMm: 910,
  },
  {
    locationId: 'mah-amr-achlapur',
    state: 'Maharashtra',
    district: 'Amravati',
    block: 'Achalpur',
    panchayat: 'Paratwada',
    latitude: 21.2589,
    longitude: 77.5126,
    soilType: 'Black Cotton Heavy Soil',
    agroClimaticZone: 'Vidarbha Semi-Arid (Zone VII)',
    elevation: 369,
    historicalRainfallAvgMm: 840,
  },
  {
    locationId: 'pun-lud-jagraon',
    state: 'Punjab',
    district: 'Ludhiana',
    block: 'Jagraon',
    panchayat: 'Sidhwan Bet',
    latitude: 30.7853,
    longitude: 75.4789,
    soilType: 'Alluvial Loam',
    agroClimaticZone: 'Central Plain Zone of Punjab',
    elevation: 234,
    historicalRainfallAvgMm: 680,
  }
];

export const getClimateIndices = () => {
  if (activeScenario === 'delayed_onset' || activeScenario === 'false_onset_dry_spell') {
    return {
      enso: {
        status: 'El Niño Modoki / Neutral-Warm',
        index: +0.6,
        description: 'Warm anomalies in central Pacific suppressing convective updrafts over peninsular and western India.'
      },
      iod: {
        status: 'Negative to Neutral',
        index: -0.35,
        description: 'Negative phase reducing cross-equatorial monsoon low-level jet momentum.'
      },
      mjo: {
        phase: 1,
        amplitude: 1.4,
        status: 'Suppressed Phase over Indian Ocean (Enhanced over Western Hemisphere)'
      },
      updatedAt: new Date().toISOString()
    };
  } else if (activeScenario === 'heavy_rainfall') {
    return {
      enso: {
        status: 'La Niña',
        index: -0.8,
        description: 'Strong cool equatorial Pacific water enhancing Indo-Pacific Walker circulation.'
      },
      iod: {
        status: 'Strong Positive',
        index: +0.95,
        description: 'Positive IOD fueling severe moisture incursions and cyclonic shear zones.'
      },
      mjo: {
        phase: 4,
        amplitude: 2.1,
        status: 'Active Convective Surge over Central Arabian Sea and Central India'
      },
      updatedAt: new Date().toISOString()
    };
  } else {
    // Normal / Revival
    return {
      enso: {
        status: 'Neutral (ENSO-Neutral)',
        index: -0.3,
        description: 'Oceanic Niño Index is within the neutral range (-0.5°C to +0.5°C).'
      },
      iod: {
        status: 'Positive',
        index: +0.48,
        description: 'Positive Indian Ocean Dipole promoting steady easterly wave propagation.'
      },
      mjo: {
        phase: 4,
        amplitude: 1.25,
        status: 'Favorable Eastward Pulse entering Bay of Bengal & Arabian Sea basin'
      },
      updatedAt: new Date().toISOString()
    };
  }
};

export const getLiveWeather = (locationId = 'raj-jai-chomu') => {
  const loc = LOCATIONS_DATABASE.find(l => l.locationId === locationId) || LOCATIONS_DATABASE[0];
  
  let temp = 30.5;
  let humidity = 74;
  let rainfall24h = 14.5;
  let recent7d = 52.0;
  let condition = 'Scattered Thunderclouds';

  if (activeScenario === 'delayed_onset') {
    temp = 36.8;
    humidity = 48;
    rainfall24h = 0.0;
    recent7d = 6.5;
    condition = 'Sunny / High Evaporative Demand';
  } else if (activeScenario === 'false_onset_dry_spell') {
    temp = 34.2;
    humidity = 54;
    rainfall24h = 1.2;
    recent7d = 18.0;
    condition = 'Dry Spell / Patchy High Cirrus';
  } else if (activeScenario === 'heavy_rainfall') {
    temp = 26.4;
    humidity = 92;
    rainfall24h = 68.5;
    recent7d = 142.0;
    condition = 'Intense Monsoon Downpour';
  }

  return {
    locationId: loc.locationId,
    locationName: `${loc.panchayat}, ${loc.block}, ${loc.district}, ${loc.state}`,
    state: loc.state,
    district: loc.district,
    block: loc.block,
    panchayat: loc.panchayat,
    coordinates: { lat: loc.latitude, lon: loc.longitude },
    date: new Date().toISOString(),
    temperature: temp,
    tempMin: Math.round((temp - 5.5) * 10) / 10,
    tempMax: Math.round((temp + 4.2) * 10) / 10,
    humidity,
    rainfall24h,
    recentRainfall7d: recent7d,
    windSpeed: 16.5,
    windDirection: 'WSW (Monsoonal Flow)',
    pressure: 1004.2,
    soilMoisture: activeScenario === 'heavy_rainfall' ? 94 : activeScenario === 'delayed_onset' ? 28 : 62,
    evapotranspiration: 4.8,
    condition,
    isMock: true
  };
};

export const getForecastData = (locationId = 'raj-jai-chomu', horizon = '14d') => {
  const loc = LOCATIONS_DATABASE.find(l => l.locationId === locationId) || LOCATIONS_DATABASE[0];
  const climate = getClimateIndices();
  const weather = getLiveWeather(locationId);

  const risks = calculateProbabilisticRisks({
    recentRainfall7d: weather.recentRainfall7d,
    currentRainfall24h: weather.rainfall24h,
    humidity: weather.humidity,
    dryDaysCount: activeScenario === 'delayed_onset' ? 6 : activeScenario === 'false_onset_dry_spell' ? 5 : 1,
    temperature: weather.temperature,
    historicalAnomaly: activeScenario === 'heavy_rainfall' ? 45 : activeScenario === 'delayed_onset' ? -35 : 8,
    enso: climate.enso,
    iod: climate.iod,
    mjo: climate.mjo,
    scenarioOverride: activeScenario
  });

  // Generate 7-30 days timeline array
  const totalDays = horizon === '30d' ? 30 : horizon === '21d' ? 21 : horizon === '14d' ? 14 : 7;
  const timeline = [];
  const today = new Date();

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i + 1);
    const dayStr = d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
    
    // Scenario-based daily probabilities
    let rainProb = 65;
    let rainMm = 12;
    let dryRisk = 25;
    let heavyRisk = 30;

    if (activeScenario === 'delayed_onset') {
      rainProb = Math.max(8, 25 - i * 0.5 + Math.sin(i) * 6);
      rainMm = rainProb > 20 ? 3.5 : 0.0;
      dryRisk = Math.min(85, 60 + i * 1.5);
      heavyRisk = 5;
    } else if (activeScenario === 'false_onset_dry_spell') {
      if (i < 3) {
        rainProb = 50 - i * 10;
        rainMm = 6.0;
        dryRisk = 45;
      } else {
        rainProb = Math.max(10, 20 - (i - 3) * 2);
        rainMm = 0.5;
        dryRisk = Math.min(90, 65 + (i - 3) * 2.5);
      }
      heavyRisk = 10;
    } else if (activeScenario === 'heavy_rainfall') {
      rainProb = Math.min(96, 85 + Math.sin(i * 0.8) * 10);
      rainMm = 35 + Math.sin(i) * 25;
      dryRisk = 8;
      heavyRisk = Math.min(95, 75 + Math.cos(i) * 15);
    } else {
      // Normal / Revival
      rainProb = Math.min(90, 70 + Math.sin(i * 0.6) * 18);
      rainMm = 14 + Math.sin(i * 0.5) * 8;
      dryRisk = Math.max(12, 28 - Math.sin(i * 0.4) * 10);
      heavyRisk = Math.max(15, 35 + Math.sin(i * 0.7) * 15);
    }

    timeline.push({
      dayIndex: i + 1,
      day: dayStr,
      date: d.toISOString().split('T')[0],
      rainfallProb: Math.round(rainProb),
      expectedRainfallMm: Math.max(0, Math.round(rainMm * 10) / 10),
      tempMax: Math.round(weather.tempMax + Math.sin(i) * 2),
      tempMin: Math.round(weather.tempMin + Math.cos(i) * 1.5),
      humidity: Math.min(98, Math.max(35, Math.round(weather.humidity + Math.sin(i * 0.5) * 8))),
      drySpellRisk: Math.round(dryRisk),
      heavyRainRisk: Math.round(heavyRisk),
      condition: rainMm > 30 ? 'Heavy Rain' : rainMm > 5 ? 'Monsoon Showers' : rainProb > 40 ? 'Passing Clouds' : 'Partly Sunny'
    });
  }

  return {
    locationId: loc.locationId,
    locationName: `${loc.panchayat}, ${loc.block}, ${loc.district}`,
    state: loc.state,
    district: loc.district,
    block: loc.block,
    panchayat: loc.panchayat,
    coordinates: { lat: loc.latitude, lon: loc.longitude },
    forecastDate: new Date().toISOString(),
    horizon,
    ...risks,
    expectedRainfallMm: Math.round(timeline.reduce((acc, curr) => acc + curr.expectedRainfallMm, 0)),
    timeline,
    soilMoistureStatus: activeScenario === 'heavy_rainfall' ? 'Saturated / Waterlogged' : activeScenario === 'delayed_onset' ? 'Deficit / Dry Soil' : 'Adequate for Tillage',
    scenarioActive: activeScenario,
    disclaimer: 'KisanAI probabilistic estimates are model outputs designed for agricultural planning. Uncertainty exists.'
  };
};

export const getRiskMapData = (metric = 'onset') => {
  return LOCATIONS_DATABASE.map(loc => {
    const forecast = getForecastData(loc.locationId);
    let value = forecast.onsetProbability;
    let category = 'Moderate';
    let color = '#EAB308'; // yellow

    if (metric === 'dry_spell') {
      value = forecast.drySpellProbability;
    } else if (metric === 'heavy_rain') {
      value = forecast.heavyRainProbability;
    } else if (metric === 'anomaly') {
      value = activeScenario === 'heavy_rainfall' ? 45 : activeScenario === 'delayed_onset' ? -35 : 12;
    }

    if (value >= 70) {
      category = 'Very High';
      color = metric === 'onset' ? '#16A34A' : '#DC2626'; // Green for high onset, red for high risk
    } else if (value >= 50) {
      category = 'High';
      color = metric === 'onset' ? '#22C55E' : '#F97316'; // orange
    } else if (value >= 30) {
      category = 'Moderate';
      color = '#EAB308'; // yellow
    } else {
      category = 'Low';
      color = metric === 'onset' ? '#9CA3AF' : '#10B981'; // green for low risk
    }

    return {
      locationId: loc.locationId,
      name: `${loc.panchayat} (${loc.block})`,
      panchayat: loc.panchayat,
      block: loc.block,
      district: loc.district,
      state: loc.state,
      coordinates: [loc.latitude, loc.longitude],
      metric,
      value,
      category,
      color,
      onsetProbability: forecast.onsetProbability,
      drySpellProbability: forecast.drySpellProbability,
      heavyRainProbability: forecast.heavyRainProbability,
      confidence: forecast.confidence,
      confidenceLevel: forecast.confidenceLevel,
      elevation: loc.elevation,
      soilType: loc.soilType,
      historicalRainfallAvgMm: loc.historicalRainfallAvgMm
    };
  });
};

export const getAlertsData = () => {
  const alerts = [];

  if (activeScenario === 'delayed_onset' || activeScenario === 'false_onset_dry_spell') {
    alerts.push({
      id: 'alt-01',
      locationId: 'raj-jai-chomu',
      locationName: 'Chomu Block, Jaipur',
      type: 'dry_spell',
      severity: 'high',
      title: '⚠️ Dry Spell Risk Increased (68%)',
      titleHindi: '⚠️ वर्षा विराम / सूखा जोखिम वृद्धि (68%)',
      message: 'Persistent dry winds and suppressed MJO phase indicate an extended 7-10 day dry spell across Chomu and surrounding panchayats.',
      messageHindi: 'पश्चिमी शुष्क हवाओं के प्रभाव से चोमू एवं आसपास की पंचायतों में आगामी 7-10 दिन वर्षा विराम रहने की संभावना है।',
      timeframe: 'Next 7–10 days',
      metricValue: 'Dry Spell Prob: 68%',
      actionRequired: 'Delay rainfed sowing; conserve soil moisture through mulching and prepare micro-irrigation.',
      actionRequiredHindi: 'असिंचित बुवाई रोकें, मल्चिंग द्वारा नमी बचाएं और ड्रिप सिंचाई की तैयारी रखें।',
      createdAt: new Date().toISOString()
    });
  }

  if (activeScenario === 'heavy_rainfall') {
    alerts.push({
      id: 'alt-02',
      locationId: 'mp-ind-sanwer',
      locationName: 'Sanwer Block, Indore',
      type: 'heavy_rain',
      severity: 'critical',
      title: '🌧️ Heavy Rainfall & Waterlogging Alert (82%)',
      titleHindi: '🌧️ भारी वर्षा एवं जलभराव चेतावनी (82%)',
      message: 'Deep depression crossing central India is likely to bring 60-90mm precipitation in 24-48 hours. Elevated flood risk for low-lying agricultural fields.',
      messageHindi: 'सक्रिय मानसूनी तंत्र के कारण 24-48 घंटों में 60-90 मिमी भारी वर्षा की संभावना। निचले खेतों में जलभराव का जोखिम।',
      timeframe: 'Next 24–48 hours',
      metricValue: 'Heavy Rain Prob: 82%',
      actionRequired: 'Clear field drainage furrows immediately; suspend all pesticide and fertilizer applications.',
      actionRequiredHindi: 'तुरंत खेत की निकासी नालियां खोलें, कीटनाशक और यूरिया छिड़काव स्थगित करें।',
      createdAt: new Date().toISOString()
    });
  }

  alerts.push(
    {
      id: 'alt-03',
      locationId: 'raj-jai-chomu',
      locationName: 'Morija Panchayat, Chomu',
      type: 'monsoon_onset',
      severity: 'moderate',
      title: '🌱 Sustained Monsoon Onset Update',
      titleHindi: '🌱 मानसून सक्रियता अपडेट',
      message: 'Cumulative moisture indices indicate positive monsoon surges favorable for kharif land preparation.',
      messageHindi: 'संचयी नमी सूचकांक खरीफ खेत तैयारी और बीजोपचार के लिए सकारात्मक संकेत दे रहे हैं।',
      timeframe: 'Current Week',
      metricValue: 'Onset Prob: 78%',
      actionRequired: 'Ensure certified seed purchase and test soil moisture profile before deep sowing.',
      actionRequiredHindi: 'प्रमाणित बीज का प्रबंध करें और बुवाई से पहले 10 सेमी तक नमी जांचें।',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 'alt-04',
      locationId: 'mah-amr-achlapur',
      locationName: 'Achalpur Block, Amravati',
      type: 'advisory_update',
      severity: 'low',
      title: '📋 Cotton & Soybean Pest Advisory',
      titleHindi: '📋 कपास एवं सोयाबीन कीट सलाह',
      message: 'High humidity (>80%) following initial rains may trigger early sucking pest activity. Monitor yellow sticky traps.',
      messageHindi: 'शुरुआती बारिश के बाद अधिक नमी कीटों के प्रकोप को बढ़ा सकती है। फेरोमोन व स्टिकी ट्रैप से निगरानी रखें।',
      timeframe: 'Next 5 days',
      metricValue: 'Humidity: 84%',
      actionRequired: 'Install 5 yellow sticky traps per acre for integrated pest monitoring.',
      actionRequiredHindi: 'प्रति एकड़ 5 पीले चिपचिपे ट्रैप लगाकर निगरानी करें।',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
    }
  );

  return alerts;
};

export const setDemoScenario = (scenario) => {
  activeScenario = scenario;
  console.log(`🎛️ Demo Scenario changed to: ${scenario}`);
  return {
    success: true,
    activeScenario,
    message: `Scenario updated to ${scenario}`
  };
};

export const getActiveScenario = () => activeScenario;
