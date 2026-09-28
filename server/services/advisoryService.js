/**
 * KisanAI Crop Advisory Engine
 * 
 * Rules-based agricultural decision engine tailored for Indian blocks/panchayats.
 * Transforms probabilistic monsoon outlooks into actionable, risk-calibrated farming guidance.
 */

export const CROPS_DATABASE = [
  {
    cropId: 'soybean',
    name: 'Soybean',
    hindiName: 'सोयाबीन',
    category: 'Kharif Oilseed',
    sowingRainRequirement: {
      minMm: 50,
      idealSoilMoisture: '70-80%',
      description: 'Requires at least 50-75mm cumulative rainfall and minimum 10-15 cm moist soil profile.'
    },
    drySpellTolerance: {
      maxDays: 7,
      criticalStage: 'Flowering and Pod formation'
    },
    heavyRainThreshold: {
      maxDailyMm: 65,
      drainageSensitivity: 'High (Susceptible to root rot and waterlogging)'
    },
    sowingWindow: 'June 15 - July 15',
    icon: '🌱'
  },
  {
    cropId: 'maize',
    name: 'Maize (Corn)',
    hindiName: 'मक्का',
    category: 'Kharif Cereal',
    sowingRainRequirement: {
      minMm: 45,
      idealSoilMoisture: '65-75%',
      description: 'Requires moderate initial showers (40-50mm) and well-drained loamy soil.'
    },
    drySpellTolerance: {
      maxDays: 10,
      criticalStage: 'Tasseling and Silking'
    },
    heavyRainThreshold: {
      maxDailyMm: 80,
      drainageSensitivity: 'Moderate to High'
    },
    sowingWindow: 'June 20 - July 20',
    icon: '🌽'
  },
  {
    cropId: 'bajra',
    name: 'Bajra (Pearl Millet)',
    hindiName: 'बाजरा',
    category: 'Arid/Semi-Arid Kharif',
    sowingRainRequirement: {
      minMm: 30,
      idealSoilMoisture: '50-60%',
      description: 'Highly drought-resilient; can be sown with 30-40mm initial shower.'
    },
    drySpellTolerance: {
      maxDays: 18,
      criticalStage: 'Panicle emergence'
    },
    heavyRainThreshold: {
      maxDailyMm: 90,
      drainageSensitivity: 'Low to Moderate'
    },
    sowingWindow: 'July 01 - July 25',
    icon: '🌾'
  },
  {
    cropId: 'rice',
    name: 'Paddy / Rice',
    hindiName: 'धान (चावल)',
    category: 'Kharif Water-Intensive',
    sowingRainRequirement: {
      minMm: 120,
      idealSoilMoisture: '100% (Standing water for nursery/transplanting)',
      description: 'Nursery sowing starts with early rains; transplanting requires continuous water assurance.'
    },
    drySpellTolerance: {
      maxDays: 4,
      criticalStage: 'Tillering and Panicle initiation'
    },
    heavyRainThreshold: {
      maxDailyMm: 150,
      drainageSensitivity: 'Low during vegetative stage, High near harvesting'
    },
    sowingWindow: 'June 10 - July 15',
    icon: '🍚'
  },
  {
    cropId: 'cotton',
    name: 'Cotton',
    hindiName: 'कपास',
    category: 'Cash Crop',
    sowingRainRequirement: {
      minMm: 60,
      idealSoilMoisture: '65-75%',
      description: 'Requires deep moisture (60-80mm) in deep black/alluvial soils.'
    },
    drySpellTolerance: {
      maxDays: 12,
      criticalStage: 'Boll development'
    },
    heavyRainThreshold: {
      maxDailyMm: 70,
      drainageSensitivity: 'High (Causes square drop and boll shedding)'
    },
    sowingWindow: 'May 20 - June 30',
    icon: '☁️'
  },
  {
    cropId: 'groundnut',
    name: 'Groundnut',
    hindiName: 'मूंगफली',
    category: 'Kharif Oilseed',
    sowingRainRequirement: {
      minMm: 50,
      idealSoilMoisture: '60-70%',
      description: 'Sow in well-aerated, sandy-loam soils after 50mm steady rain.'
    },
    drySpellTolerance: {
      maxDays: 9,
      criticalStage: 'Pegging and Pod filling'
    },
    heavyRainThreshold: {
      maxDailyMm: 60,
      drainageSensitivity: 'High (Susceptible to collar rot and yellowing)'
    },
    sowingWindow: 'June 15 - July 10',
    icon: '🥜'
  },
  {
    cropId: 'pulses',
    name: 'Pulses (Moong / Urad / Arhar)',
    hindiName: 'दलहन (मूंग / उड़द / अरहर)',
    category: 'Kharif Pulses',
    sowingRainRequirement: {
      minMm: 35,
      idealSoilMoisture: '60-70%',
      description: 'Requires 35-50mm rain; avoid waterlogged fields.'
    },
    drySpellTolerance: {
      maxDays: 14,
      criticalStage: 'Pod development'
    },
    heavyRainThreshold: {
      maxDailyMm: 55,
      drainageSensitivity: 'Very High (Stagnation causes yellow mosaic & wilt)'
    },
    sowingWindow: 'June 25 - July 20',
    icon: '🍲'
  }
];

export const generateCropAdvisory = (forecast, cropId = 'soybean', locationName = 'Chomu Panchayat') => {
  const crop = CROPS_DATABASE.find(c => c.cropId.toLowerCase() === cropId.toLowerCase()) || CROPS_DATABASE[0];
  const { onsetProbability = 78, drySpellProbability = 24, heavyRainProbability = 38, confidence = 72 } = forecast;

  let riskLevel = 'Moderate';
  let status = 'Favorable for Sowing';
  let statusHindi = 'बुवाई के लिए अनुकूल';
  let messageEnglish = '';
  let messageHindi = '';
  let actionItemsEnglish = [];
  let actionItemsHindi = [];

  // RULE 1: Extreme Heavy Rainfall Risk (> 70%)
  if (heavyRainProbability >= 70) {
    riskLevel = 'High';
    status = 'Ensure Field Drainage';
    statusHindi = 'खेत में जल निकासी सुनिश्चित करें';
    messageEnglish = `High heavy rainfall probability (${heavyRainProbability}%) predicted for ${crop.name} in ${locationName}. Soil saturation and standing water could damage germination and cause root rot.`;
    messageHindi = `${locationName} में ${crop.hindiName} के लिए भारी वर्षा की संभावना (${heavyRainProbability}%) अधिक है। खेत में जलभराव से बीज खराब होने और जड़ सड़न का खतरा है।`;
    actionItemsEnglish = [
      'Clear drainage furrows across the field before rain onset.',
      'Postpone chemical spraying, fertilizer top-dressing, and weeding.',
      'If already sown, ensure water does not stagnate for more than 24 hours.',
      'Adopt broad-bed furrow (BBF) or ridge-and-furrow planting method.'
    ];
    actionItemsHindi = [
      'बारिश शुरू होने से पहले खेत में जल निकासी की नालियां साफ करें।',
      'कीटनाशक छिड़काव और यूरिया/खाद डालने का काम फिलहाल टालें।',
      'यदि बुवाई हो चुकी है, तो खेत में 24 घंटे से अधिक पानी न ठहरने दें।',
      'मेड़ और नाली (Ridge and Furrow) विधि से बुवाई को प्राथमिकता दें।'
    ];
  }
  // RULE 2: High Dry Spell Risk (> 60%) or Weak Onset (< 50%)
  else if (drySpellProbability >= 60 || onsetProbability < 50) {
    riskLevel = 'Elevated';
    status = 'Prepare Irrigation & Wait';
    statusHindi = 'सिंचाई की व्यवस्था रखें एवं प्रतीक्षा करें';
    messageEnglish = `Dry-spell probability is elevated at ${drySpellProbability}% with modest onset probability (${onsetProbability}%). Sowing ${crop.name} now without guaranteed irrigation carries high seed mortality risk.`;
    messageHindi = `${crop.hindiName} के लिए सूखे/खंडित वर्षा की संभावना (${drySpellProbability}%) अधिक है। बिना सुनिश्चित सिंचाई के बुवाई करने पर बीज सूखने और नुकसान का जोखिम है।`;
    actionItemsEnglish = [
      'Delay non-irrigated sowing until a sustained rainfall system develops.',
      'Ensure borewell/drip irrigation backup before placing seed.',
      'Treat seeds with hydrogel / bio-stimulants to enhance moisture retention.',
      'Maintain surface mulch to prevent soil moisture loss.'
    ];
    actionItemsHindi = [
      'बिना सिंचाई वाले खेतों में लगातार बारिश का तंत्र बनने तक बुवाई रोकें।',
      'बुवाई से पहले ड्रिप या फव्वारा सिंचाई की पूर्व तैयारी रखें।',
      'नमी बनाए रखने के लिए बीजोपचार अवश्य करें।',
      'मिट्टी की नमी बचाने के लिए पलवार (Mulching) का प्रयोग करें।'
    ];
  }
  // RULE 3: Optimal Favorable Conditions (Onset > 70% and Dry Spell < 30%)
  else if (onsetProbability >= 70 && drySpellProbability <= 30) {
    riskLevel = 'Low';
    status = 'Favorable for Sowing';
    statusHindi = 'बुवाई के लिए उत्तम समय';
    messageEnglish = `Rainfall conditions appear favorable for ${crop.name} in ${locationName} (Onset Probability: ${onsetProbability}%, Dry Spell: ${drySpellProbability}%). Minimum soil moisture depth recommended is ${crop.sowingRainRequirement.minMm}mm.`;
    messageHindi = `${locationName} में ${crop.hindiName} की बुवाई के लिए मौसम अनुकूल है (मानसून सक्रियता: ${onsetProbability}%, सूखा जोखिम: ${drySpellProbability}%)। कम से कम ${crop.sowingRainRequirement.minMm} मिमी वर्षा के बाद बुवाई करें।`;
    actionItemsEnglish = [
      `Check that soil is moist up to 10-15 cm depth (${crop.sowingRainRequirement.idealSoilMoisture}).`,
      'Use certified disease-free seed and conduct recommended fungicide treatment (Trichoderma / Carbendazim).',
      'Sow at recommended seed rate and row-to-row spacing.',
      'Keep weather watch for any localized cloudburst warnings.'
    ];
    actionItemsHindi = [
      `सुनिश्चित करें कि खेत में 10-15 सेमी गहराई तक पर्याप्त नमी हो।`,
      'प्रमाणित बीजों का उपयोग करें और कवकनाशी (ट्राइकोडर्मा/कार्बेंडाजिम) से बीजोपचार करें।',
      'उचित दूरी और बीज दर के साथ कतार में बुवाई करें।',
      'स्थानीय मौसम बदलावों पर नजर बनाए रखें।'
    ];
  }
  // RULE 4: Moderate / Transitional Conditions
  else {
    riskLevel = 'Moderate';
    status = 'Monitor Soil Moisture';
    statusHindi = 'मिट्टी की नमी जांचें';
    messageEnglish = `Transitional monsoon conditions (Onset: ${onsetProbability}%, Dry Spell: ${drySpellProbability}%). Sowing ${crop.name} is feasible if localized soil profile has received >= ${crop.sowingRainRequirement.minMm}mm cumulative moisture.`;
    messageHindi = `मौसम मध्यम अनुकूल है (मानसून सक्रियता: ${onsetProbability}%, सूखा जोखिम: ${drySpellProbability}%)। खेत में कम से कम ${crop.sowingRainRequirement.minMm} मिमी वर्षा होने पर ही बुवाई करें।`;
    actionItemsEnglish = [
      'Check local precipitation gauge or soil moisture sensor before field operations.',
      'Plan intercropping with short-duration pulses or drought-tolerant varieties.',
      'Keep light irrigation scheduled if rain pause exceeds 5-7 days.'
    ];
    actionItemsHindi = [
      'बुवाई से पहले अपने खेत की नमी अवश्य जांचें।',
      'मिश्रित/अंतर्वर्ती फसल (Intercropping) का विकल्प अपनाएं।',
      'यदि 5-7 दिन बारिश न हो तो हल्की सिंचाई की योजना रखें।'
    ];
  }

  return {
    cropId: crop.cropId,
    cropName: crop.name,
    cropHindiName: crop.hindiName,
    cropCategory: crop.category,
    cropIcon: crop.icon,
    riskLevel,
    status,
    statusHindi,
    messageEnglish,
    messageHindi,
    actionItemsEnglish,
    actionItemsHindi,
    cropParameters: {
      sowingRainRequirement: crop.sowingRainRequirement,
      drySpellTolerance: crop.drySpellTolerance,
      heavyRainThreshold: crop.heavyRainThreshold,
      sowingWindow: crop.sowingWindow,
    },
    forecastSnapshot: {
      onsetProbability,
      drySpellProbability,
      heavyRainProbability,
      confidence,
    },
    disclaimer: 'KisanAI advisories are model-based probabilistic estimates for agricultural planning. Always cross-reference with local Krishi Vigyan Kendra (KVK) and real-time field moisture conditions.',
    generatedAt: new Date().toISOString()
  };
};
