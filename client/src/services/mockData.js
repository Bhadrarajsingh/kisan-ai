export const MOCK_LOCATIONS = [
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

export const MOCK_CROPS = [
  {
    cropId: 'soybean',
    name: 'Soybean',
    hindiName: 'सोयाबीन',
    category: 'Kharif Oilseed',
    sowingRainRequirement: { minMm: 50, idealSoilMoisture: '70-80%', description: 'Requires at least 50-75mm cumulative rainfall and moist soil profile.' },
    drySpellTolerance: { maxDays: 7, criticalStage: 'Flowering & Pod formation' },
    heavyRainThreshold: { maxDailyMm: 65, drainageSensitivity: 'High (Susceptible to root rot)' },
    sowingWindow: 'June 15 - July 15',
    icon: '🌱'
  },
  {
    cropId: 'maize',
    name: 'Maize (Corn)',
    hindiName: 'मक्का',
    category: 'Kharif Cereal',
    sowingRainRequirement: { minMm: 45, idealSoilMoisture: '65-75%', description: 'Requires moderate initial showers (40-50mm) and well-drained loamy soil.' },
    drySpellTolerance: { maxDays: 10, criticalStage: 'Tasseling & Silking' },
    heavyRainThreshold: { maxDailyMm: 80, drainageSensitivity: 'Moderate to High' },
    sowingWindow: 'June 20 - July 20',
    icon: '🌽'
  },
  {
    cropId: 'bajra',
    name: 'Bajra (Pearl Millet)',
    hindiName: 'बाजरा',
    category: 'Arid/Semi-Arid Kharif',
    sowingRainRequirement: { minMm: 30, idealSoilMoisture: '50-60%', description: 'Highly drought-resilient; can be sown with 30-40mm initial shower.' },
    drySpellTolerance: { maxDays: 18, criticalStage: 'Panicle emergence' },
    heavyRainThreshold: { maxDailyMm: 90, drainageSensitivity: 'Low to Moderate' },
    sowingWindow: 'July 01 - July 25',
    icon: '🌾'
  },
  {
    cropId: 'rice',
    name: 'Paddy / Rice',
    hindiName: 'धान (चावल)',
    category: 'Kharif Water-Intensive',
    sowingRainRequirement: { minMm: 120, idealSoilMoisture: '100% (Standing water)', description: 'Nursery begins with early rains; transplanting requires standing water.' },
    drySpellTolerance: { maxDays: 4, criticalStage: 'Tillering & Panicle initiation' },
    heavyRainThreshold: { maxDailyMm: 150, drainageSensitivity: 'Low during vegetative' },
    sowingWindow: 'June 10 - July 15',
    icon: '🍚'
  },
  {
    cropId: 'cotton',
    name: 'Cotton',
    hindiName: 'कपास',
    category: 'Cash Crop',
    sowingRainRequirement: { minMm: 60, idealSoilMoisture: '65-75%', description: 'Requires deep moisture (60-80mm) in deep black/alluvial soils.' },
    drySpellTolerance: { maxDays: 12, criticalStage: 'Boll development' },
    heavyRainThreshold: { maxDailyMm: 70, drainageSensitivity: 'High (Square and boll shedding)' },
    sowingWindow: 'May 20 - June 30',
    icon: '☁️'
  },
  {
    cropId: 'groundnut',
    name: 'Groundnut',
    hindiName: 'मूंगफली',
    category: 'Kharif Oilseed',
    sowingRainRequirement: { minMm: 50, idealSoilMoisture: '60-70%', description: 'Sow in well-aerated, sandy-loam soils after 50mm steady rain.' },
    drySpellTolerance: { maxDays: 9, criticalStage: 'Pegging & Pod filling' },
    heavyRainThreshold: { maxDailyMm: 60, drainageSensitivity: 'High (Collar rot)' },
    sowingWindow: 'June 15 - July 10',
    icon: '🥜'
  },
  {
    cropId: 'pulses',
    name: 'Pulses (Moong / Urad)',
    hindiName: 'दलहन (मूंग / उड़द)',
    category: 'Kharif Pulses',
    sowingRainRequirement: { minMm: 35, idealSoilMoisture: '60-70%', description: 'Requires 35-50mm rain; avoid waterlogged fields.' },
    drySpellTolerance: { maxDays: 14, criticalStage: 'Pod development' },
    heavyRainThreshold: { maxDailyMm: 55, drainageSensitivity: 'Very High' },
    sowingWindow: 'June 25 - July 20',
    icon: '🍲'
  }
];

export const MOCK_CLIMATE = {
  enso: {
    status: 'Neutral (ENSO-Neutral)',
    index: -0.4,
    description: 'ENSO represents large-scale ocean-atmosphere conditions in the tropical Pacific that can influence global and Indian climate patterns.'
  },
  iod: {
    status: 'Positive',
    index: +0.5,
    description: 'Positive Indian Ocean Dipole with warmer western waters, favoring monsoon convective circulation across central and northwest India.'
  },
  mjo: {
    phase: 4,
    amplitude: 1.2,
    status: 'Active eastward convective pulse propagating over the Bay of Bengal & Arabian Sea.'
  },
  updatedAt: new Date().toISOString()
};

export const MOCK_WEATHER = {
  locationId: 'raj-jai-chomu',
  locationName: 'Morija Panchayat, Chomu Block, Jaipur, Rajasthan',
  state: 'Rajasthan',
  district: 'Jaipur',
  block: 'Chomu',
  panchayat: 'Morija',
  temperature: 29.5,
  tempMin: 24.2,
  tempMax: 34.0,
  humidity: 74,
  rainfall24h: 14.2,
  recentRainfall7d: 52.0,
  windSpeed: 16.2,
  windDirection: 'WSW',
  pressure: 1004.8,
  soilMoisture: 62,
  evapotranspiration: 4.8,
  condition: 'Scattered Thunderclouds',
  date: new Date().toISOString()
};

export const MOCK_FORECAST = {
  locationId: 'raj-jai-chomu',
  locationName: 'Morija Panchayat, Chomu, Jaipur',
  state: 'Rajasthan',
  district: 'Jaipur',
  block: 'Chomu',
  panchayat: 'Morija',
  horizon: '14d',
  onsetProbability: 78,
  drySpellProbability: 24,
  heavyRainProbability: 38,
  confidence: 72,
  confidenceLevel: 'Medium',
  expectedRainfallMm: 114,
  soilMoistureStatus: 'Adequate for Tillage',
  timeline: Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      dayIndex: i + 1,
      day: d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
      date: d.toISOString().split('T')[0],
      rainfallProb: Math.round(65 + Math.sin(i * 0.7) * 20),
      expectedRainfallMm: Math.round((10 + Math.sin(i * 0.6) * 8) * 10) / 10,
      tempMax: 33 + Math.round(Math.sin(i) * 2),
      tempMin: 24 + Math.round(Math.cos(i) * 1.5),
      humidity: Math.round(72 + Math.sin(i * 0.5) * 12),
      drySpellRisk: Math.round(22 - Math.sin(i * 0.4) * 8),
      heavyRainRisk: Math.round(35 + Math.sin(i * 0.7) * 15),
      condition: i % 3 === 0 ? 'Heavy Showers' : 'Passing Clouds'
    };
  })
};

export const MOCK_ALERTS = [
  {
    id: 'alt-01',
    locationId: 'raj-jai-chomu',
    locationName: 'Chomu Block, Jaipur',
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
    createdAt: new Date().toISOString()
  },
  {
    id: 'alt-02',
    locationId: 'raj-jai-chomu',
    locationName: 'Chomu Panchayat',
    type: 'dry_spell',
    severity: 'high',
    title: '⚠️ Dry Spell Risk Increased (24-30% Horizon Alert)',
    titleHindi: '⚠️ वर्षा विराम / शुष्क दौर चेतावनी',
    message: 'Localized dry spells possible in late July. Keep supplemental irrigation planned.',
    messageHindi: 'जुलाई अंत में वर्षा विराम की संभावना। पूरक सिंचाई की तैयारी रखें।',
    timeframe: 'Next 7–10 days',
    metricValue: 'Dry Spell Prob: 24%',
    actionRequired: 'Prepare drip/sprinkler backup and mulch beds.',
    actionRequiredHindi: 'ड्रिप/फव्वारा सिंचाई तैयार रखें और मल्चिंग करें।',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

export const MOCK_PRODUCTS = [
  {
    id: 'prod-bajra-101',
    farmerId: 'usr-kisan-101',
    farmerName: 'Ramesh Patel (रमेश पटेल)',
    farmerPhone: '9876543210',
    name: 'Desi Pearl Millet (बाजरा - Bajra)',
    hindiName: 'देसी बाजरा',
    category: 'Grains',
    variety: 'Hybrid Pioneer 86M84',
    quantity: 500,
    unit: 'kg',
    expectedPrice: 24.50,
    minOrderQuantity: 100,
    negotiable: true,
    qualityGrade: 'Grade A (Premium)',
    moisturePercent: 11.2,
    organicStatus: 'Naturally Grown (No Chemicals)',
    harvestDate: '2026-09-18',
    location: {
      state: 'Rajasthan',
      district: 'Jaipur',
      block: 'Chomu',
      village: 'Morija Panchayat',
      distanceKm: 4.2
    },
    images: [
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80'
    ],
    status: 'active',
    aiVerification: {
      isVerified: true,
      confidence: 96,
      detectedCategory: 'Grains / Millets',
      qualityIndicator: 'Clean, plump grains with <1.5% foreign matter and optimal 11.2% moisture',
      suggestedDescription: 'Freshly harvested dry kharif Bajra, sun-dried to optimal storage moisture. Superior grain lustre.',
      disclaimer: 'AI visual indicator only; does not replace laboratory certified analysis.'
    },
    createdAt: new Date('2026-09-20').toISOString()
  },
  {
    id: 'prod-soybean-102',
    farmerId: 'usr-kisan-102',
    farmerName: 'Devendra Choudhary (देवेंद्र चौधरी)',
    farmerPhone: '9826054321',
    name: 'Yellow Soybean (पीली सोयाबीन)',
    hindiName: 'पीली सोयाबीन',
    category: 'Oilseeds',
    variety: 'JS 9560 Certified Seed',
    quantity: 1200,
    unit: 'kg',
    expectedPrice: 44.00,
    minOrderQuantity: 200,
    negotiable: true,
    qualityGrade: 'Grade A (Premium)',
    moisturePercent: 9.8,
    organicStatus: 'Conventional',
    harvestDate: '2026-09-15',
    location: {
      state: 'Madhya Pradesh',
      district: 'Indore',
      block: 'Sanwer',
      village: 'Kshipra Mandi Road',
      distanceKm: 12.5
    },
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'
    ],
    status: 'active',
    aiVerification: {
      isVerified: true,
      confidence: 94,
      detectedCategory: 'Oilseeds / Soybean',
      qualityIndicator: 'Uniform yellow seed coat, zero pest damage, moisture below 10%',
      suggestedDescription: 'High oil-content JS-9560 kharif soybean, screened and cleaned.',
      disclaimer: 'AI visual indicator only; does not replace laboratory certified analysis.'
    },
    createdAt: new Date('2026-09-21').toISOString()
  },
  {
    id: 'prod-wheat-103',
    farmerId: 'usr-kisan-103',
    farmerName: 'Gurpreet Singh (ਗੁਰਪ੍ਰੀਤ ਸਿੰਘ)',
    farmerPhone: '9814012345',
    name: 'Sharbati Golden Wheat (शरबती गेहूं)',
    hindiName: 'शरबती गेहूं',
    category: 'Grains',
    variety: 'HD-2967 High Protein',
    quantity: 2500,
    unit: 'kg',
    expectedPrice: 28.00,
    minOrderQuantity: 500,
    negotiable: false,
    qualityGrade: 'Grade A (Premium)',
    moisturePercent: 10.5,
    organicStatus: 'Naturally Grown (No Chemicals)',
    harvestDate: '2026-09-10',
    location: {
      state: 'Punjab',
      district: 'Ludhiana',
      block: 'Jagraon',
      village: 'Agwar Lopo',
      distanceKm: 18.0
    },
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'
    ],
    status: 'active',
    aiVerification: {
      isVerified: true,
      confidence: 98,
      detectedCategory: 'Grains / Wheat',
      qualityIndicator: 'Heavy lustrous grains, zero chalky grain defect detected',
      suggestedDescription: 'Premium Sharbati wheat, sorted and mechanically destoned.',
      disclaimer: 'AI visual indicator only; does not replace laboratory certified analysis.'
    },
    createdAt: new Date('2026-09-22').toISOString()
  },
  {
    id: 'prod-cotton-104',
    farmerId: 'usr-kisan-104',
    farmerName: 'Anil Deshmukh (अनिल देशमुख)',
    farmerPhone: '9422098765',
    name: 'Medium Staple Raw Cotton (कपास - Kapas)',
    hindiName: 'कपास (कॉटन)',
    category: 'Other',
    variety: 'Bt Cotton Bollgard II',
    quantity: 1500,
    unit: 'kg',
    expectedPrice: 68.50,
    minOrderQuantity: 300,
    negotiable: true,
    qualityGrade: 'Grade B (Standard)',
    moisturePercent: 8.0,
    organicStatus: 'Conventional',
    harvestDate: '2026-09-19',
    location: {
      state: 'Maharashtra',
      district: 'Amravati',
      block: 'Achalpur',
      village: 'Paratwada Ginning Area',
      distanceKm: 22.0
    },
    images: [
      'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=600&q=80'
    ],
    status: 'active',
    aiVerification: {
      isVerified: true,
      confidence: 92,
      detectedCategory: 'Commercial Crops / Fiber',
      qualityIndicator: 'White fluffy lint, staple length estimated 28-30mm',
      suggestedDescription: 'First-pick clean seed cotton free of yellow staining and debris.',
      disclaimer: 'AI visual indicator only; does not replace laboratory certified analysis.'
    },
    createdAt: new Date('2026-09-23').toISOString()
  },
  {
    id: 'prod-groundnut-105',
    farmerId: 'usr-kisan-101',
    farmerName: 'Ramesh Patel (रमेश पटेल)',
    farmerPhone: '9876543210',
    name: 'Organic Bold Groundnut (मूंगफली - Peanuts)',
    hindiName: 'देसी मूंगफली',
    category: 'Oilseeds',
    variety: 'TG 37A Semi-Spreading',
    quantity: 600,
    unit: 'kg',
    expectedPrice: 65.00,
    minOrderQuantity: 50,
    negotiable: true,
    qualityGrade: 'Grade A (Premium)',
    moisturePercent: 7.5,
    organicStatus: 'Certified Organic',
    harvestDate: '2026-09-21',
    location: {
      state: 'Rajasthan',
      district: 'Jaipur',
      block: 'Amber',
      village: 'Kukas Farm',
      distanceKm: 8.5
    },
    images: [
      'https://images.unsplash.com/photo-1567894340315-735d7c361db0?auto=format&fit=crop&w=600&q=80'
    ],
    status: 'active',
    aiVerification: {
      isVerified: true,
      confidence: 95,
      detectedCategory: 'Oilseeds / Legumes',
      qualityIndicator: 'Well-filled double-seeded pods with intact shells and low soil residue',
      suggestedDescription: 'Chemical-free organically cultivated bold groundnuts with high kernel weight.',
      disclaimer: 'AI visual indicator only; does not replace laboratory certified analysis.'
    },
    createdAt: new Date('2026-09-24').toISOString()
  },
  {
    id: 'prod-pulses-106',
    farmerId: 'usr-kisan-105',
    farmerName: 'Kailash Meena (कैलाश मीणा)',
    farmerPhone: '9783011223',
    name: 'Kharif Green Gram (हरा मूंग - Moong Dal)',
    hindiName: 'हरा मूंग',
    category: 'Pulses',
    variety: 'IPM 205-7 (Virat)',
    quantity: 400,
    unit: 'kg',
    expectedPrice: 82.00,
    minOrderQuantity: 50,
    negotiable: true,
    qualityGrade: 'Grade A (Premium)',
    moisturePercent: 10.0,
    organicStatus: 'Naturally Grown (No Chemicals)',
    harvestDate: '2026-09-22',
    location: {
      state: 'Rajasthan',
      district: 'Jaipur',
      block: 'Phagi',
      village: 'Nimera Mandi',
      distanceKm: 15.0
    },
    images: [
      'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80'
    ],
    status: 'active',
    aiVerification: {
      isVerified: true,
      confidence: 97,
      detectedCategory: 'Pulses / Legumes',
      qualityIndicator: 'Uniform bright green coloration, zero bruchid weevil infestation',
      suggestedDescription: 'Quick-cooking high-protein green moong, cleaned and graded.',
      disclaimer: 'AI visual indicator only; does not replace laboratory certified analysis.'
    },
    createdAt: new Date('2026-09-24').toISOString()
  }
];

export const MOCK_BUYERS = [
  {
    id: 'byr-101',
    businessName: 'ABC Grain Traders & Agro Exports',
    contactPerson: 'Suresh Agarwal',
    buyerType: 'Trader / Exporter',
    phone: '9829012345',
    email: 'contact@abcgraintraders.com',
    rating: 4.9,
    verified: true,
    location: {
      state: 'Rajasthan',
      district: 'Jaipur',
      block: 'Chomu Mandi Yard',
      distanceKm: 3.5
    },
    paymentTerms: 'Immediate RTGS / UPI on Quality Check',
    logistics: 'Buyer Arranges Pickup (Self-Transport)',
    demandCrops: [
      { cropName: 'Bajra', requiredQuantity: 2000, unit: 'kg', priceRange: '₹22 - ₹25 / kg' },
      { cropName: 'Wheat', requiredQuantity: 5000, unit: 'kg', priceRange: '₹26 - ₹29 / kg' },
      { cropName: 'Groundnut', requiredQuantity: 1500, unit: 'kg', priceRange: '₹62 - ₹67 / kg' }
    ]
  },
  {
    id: 'byr-102',
    businessName: 'Malwa Agro Oil & Food Processors Ltd.',
    contactPerson: 'Vikram Joshi',
    buyerType: 'Food Processor',
    phone: '9826098765',
    email: 'procurement@malwaagro.in',
    rating: 4.8,
    verified: true,
    location: {
      state: 'Madhya Pradesh',
      district: 'Indore',
      block: 'Sanwer Industrial Area',
      distanceKm: 14.2
    },
    paymentTerms: 'Direct Bank Transfer within 24 Hours',
    logistics: 'Weighbridge & Direct Gate Unloading',
    demandCrops: [
      { cropName: 'Soybean', requiredQuantity: 10000, unit: 'kg', priceRange: '₹43 - ₹46 / kg' },
      { cropName: 'Maize', requiredQuantity: 8000, unit: 'kg', priceRange: '₹21 - ₹24 / kg' }
    ]
  },
  {
    id: 'byr-103',
    businessName: 'Kisan APMC Wholesaler Guild',
    contactPerson: 'Mahendra Yadav',
    buyerType: 'Wholesaler',
    phone: '9414077889',
    email: 'kisanmandi@jaipurapmc.org',
    rating: 4.7,
    verified: true,
    location: {
      state: 'Rajasthan',
      district: 'Jaipur',
      block: 'Amber / Kukas Gate',
      distanceKm: 9.1
    },
    demandCrops: [
      { cropName: 'Moong Dal', requiredQuantity: 3000, unit: 'kg', priceRange: '₹80 - ₹85 / kg' },
      { cropName: 'Bajra', requiredQuantity: 4000, unit: 'kg', priceRange: '₹23 - ₹25 / kg' }
    ]
  },
  {
    id: 'byr-104',
    businessName: 'Punjab Royal Flour Mills',
    contactPerson: 'Harpreet Singh',
    buyerType: 'Wholesaler / Processor',
    phone: '9815044332',
    email: 'harpreet@royalflour.com',
    rating: 4.9,
    verified: true,
    location: {
      state: 'Punjab',
      district: 'Ludhiana',
      block: 'Jagraon GT Road',
      distanceKm: 19.5
    },
    demandCrops: [
      { cropName: 'Wheat', requiredQuantity: 15000, unit: 'kg', priceRange: '₹27 - ₹30 / kg' },
      { cropName: 'Maize', requiredQuantity: 6000, unit: 'kg', priceRange: '₹22 - ₹25 / kg' }
    ]
  },
  {
    id: 'byr-105',
    businessName: 'Vidarbha Ginning & Cotton Press',
    contactPerson: 'Ganesh Raut',
    buyerType: 'Agro-Exporter / Mill',
    phone: '9423019283',
    email: 'vidarbhacotton@procure.in',
    rating: 4.6,
    verified: true,
    location: {
      state: 'Maharashtra',
      district: 'Amravati',
      block: 'Achalpur Cotton Market',
      distanceKm: 24.0
    },
    demandCrops: [
      { cropName: 'Cotton', requiredQuantity: 12000, unit: 'kg', priceRange: '₹66 - ₹70 / kg' },
      { cropName: 'Soybean', requiredQuantity: 5000, unit: 'kg', priceRange: '₹42 - ₹45 / kg' }
    ]
  }
];

export const MOCK_OFFERS = [
  {
    id: 'ofr-801',
    productId: 'prod-bajra-101',
    productName: 'Desi Pearl Millet (बाजरा - Bajra)',
    farmerId: 'usr-kisan-101',
    farmerName: 'Ramesh Patel',
    buyerId: 'byr-101',
    buyerName: 'ABC Grain Traders & Agro Exports',
    buyerPhone: '9829012345',
    quantity: 300,
    unit: 'kg',
    offeredPrice: 23.50,
    counterPrice: 24.00,
    totalAmount: 7050,
    deliveryType: 'Buyer Pickup',
    status: 'countered',
    message: 'We are willing to procure 300 kg at ₹23.50/kg for instant same-day pickup.',
    history: [
      { sender: 'buyer', price: 23.00, message: 'Initial purchase inquiry at ₹23/kg', timestamp: new Date(Date.now() - 86400000).toISOString() },
      { sender: 'farmer', price: 24.00, message: 'Grade A premium produce, sun dried. Counter offered ₹24/kg', timestamp: new Date(Date.now() - 43200000).toISOString() },
      { sender: 'buyer', price: 23.50, message: 'Revised offer ₹23.50/kg with immediate cash on pickup.', timestamp: new Date(Date.now() - 14400000).toISOString() }
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'ofr-802',
    productId: 'prod-groundnut-105',
    productName: 'Organic Bold Groundnut (मूंगफली - Peanuts)',
    farmerId: 'usr-kisan-101',
    farmerName: 'Ramesh Patel',
    buyerId: 'byr-103',
    buyerName: 'Kisan APMC Wholesaler Guild',
    buyerPhone: '9414077889',
    quantity: 400,
    unit: 'kg',
    offeredPrice: 64.00,
    totalAmount: 25600,
    deliveryType: 'Buyer Pickup',
    status: 'pending',
    message: 'We have retail packaging requirement for organic certified groundnuts. Can pick up tomorrow.',
    history: [
      { sender: 'buyer', price: 64.00, message: 'Offer submitted for 400 kg @ ₹64/kg', timestamp: new Date().toISOString() }
    ],
    createdAt: new Date().toISOString()
  }
];

export const MOCK_ORDERS = [
  {
    id: 'ord-1001',
    orderNumber: 'ORD-72940',
    productId: 'prod-soybean-102',
    productName: 'Yellow Soybean (पीली सोयाबीन)',
    farmerId: 'usr-kisan-101',
    farmerName: 'Ramesh Patel',
    buyerId: 'byr-102',
    buyerName: 'Malwa Agro Oil & Food Processors Ltd.',
    buyerPhone: '9826098765',
    quantity: 500,
    unit: 'kg',
    agreedPrice: 44.00,
    totalAmount: 22000,
    status: 'ready_for_pickup',
    deliveryType: 'Buyer Pickup',
    pickupLocation: {
      address: 'Kisan Kendra, Chomu Mandi Road',
      village: 'Morija',
      block: 'Chomu',
      district: 'Jaipur',
      state: 'Rajasthan'
    },
    pickupDate: '2026-09-27 (Slot: 10:00 AM - 1:00 PM)',
    trackingNotes: [
      { status: 'confirmed', note: 'Purchase request accepted and sale agreement generated.', timestamp: new Date(Date.now() - 172800000).toISOString() },
      { status: 'processing', note: 'Farmer bagged and weighed produce into standard 50kg jute sacks.', timestamp: new Date(Date.now() - 86400000).toISOString() },
      { status: 'ready_for_pickup', note: 'Lot verified, moisture tested at 10.2%. Ready for buyer dispatch vehicle.', timestamp: new Date().toISOString() }
    ],
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

export const MOCK_MANDI_PRICES = [
  {
    cropId: 'bajra',
    cropName: 'Bajra (Pearl Millet)',
    hindiName: 'बाजरा',
    mspPrice: 2500,
    currentMandiPrice: 2420,
    lastWeekPrice: 2360,
    priceChangePct: +2.54,
    trend: 'upward',
    marketArrivalsTons: 145,
    topBuyerCount: 8,
    demandLevel: 'High',
    benchmarkMandi: 'Chomu APMC Mandi, Jaipur',
    recommendation: 'Market price is within 3% of MSP. Favorable time for bulk spot selling.'
  },
  {
    cropId: 'soybean',
    cropName: 'Soybean (Yellow)',
    hindiName: 'सोयाबीन',
    mspPrice: 4892,
    currentMandiPrice: 4480,
    lastWeekPrice: 4420,
    priceChangePct: +1.35,
    trend: 'stable',
    marketArrivalsTons: 380,
    topBuyerCount: 12,
    demandLevel: 'Very High',
    benchmarkMandi: 'Sanwer APMC, Indore',
    recommendation: 'Crusher oil demand is rising. Negotiate above ₹44.50/kg for clean Grade A stock.'
  },
  {
    cropId: 'wheat',
    cropName: 'Wheat (Sharbati)',
    hindiName: 'गेहूं',
    mspPrice: 2275,
    currentMandiPrice: 2780,
    lastWeekPrice: 2740,
    priceChangePct: +1.46,
    trend: 'upward',
    marketArrivalsTons: 520,
    topBuyerCount: 15,
    demandLevel: 'High',
    benchmarkMandi: 'Khanna / Ludhiana Mandi',
    recommendation: 'Flour mill demand remains strong. Sharbati premium commands ₹28/kg spot.'
  },
  {
    cropId: 'cotton',
    cropName: 'Raw Cotton (Kapas)',
    hindiName: 'कपास',
    mspPrice: 7121,
    currentMandiPrice: 6850,
    lastWeekPrice: 6920,
    priceChangePct: -1.01,
    trend: 'slight_dip',
    marketArrivalsTons: 210,
    topBuyerCount: 6,
    demandLevel: 'Moderate',
    benchmarkMandi: 'Amravati APMC Cotton Yard',
    recommendation: 'Temporary export lull. If moisture is below 8%, hold for 7 days before unloading.'
  },
  {
    cropId: 'groundnut',
    cropName: 'Groundnut (In Shell)',
    hindiName: 'मूंगफली',
    mspPrice: 6783,
    currentMandiPrice: 6540,
    lastWeekPrice: 6410,
    priceChangePct: +2.02,
    trend: 'upward',
    marketArrivalsTons: 115,
    topBuyerCount: 9,
    demandLevel: 'High',
    benchmarkMandi: 'Bikaner / Jaipur Terminal Market',
    recommendation: 'Export confectionary bold grade in active demand. Certified organic commands ₹70+.'
  },
  {
    cropId: 'pulses',
    cropName: 'Green Gram (Moong)',
    hindiName: 'हरा मूंग',
    mspPrice: 8558,
    currentMandiPrice: 8250,
    lastWeekPrice: 8100,
    priceChangePct: +1.85,
    trend: 'upward',
    marketArrivalsTons: 95,
    topBuyerCount: 11,
    demandLevel: 'Very High',
    benchmarkMandi: 'Phagi / Merta City APMC',
    recommendation: 'Low market arrivals this week. Sellers have strong bargaining leverage.'
  }
];

export const generateMockPriceTrends = (cropId = 'bajra') => {
  const crop = MOCK_MANDI_PRICES.find(c => c.cropId === cropId) || MOCK_MANDI_PRICES[0];
  const basePrice = crop.currentMandiPrice / 100;
  const points = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayStr = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    const noise = Math.sin(i * 0.4) * 0.6 + (Math.random() * 0.4 - 0.2);
    const trendEffect = (30 - i) * 0.04;
    const price = +(basePrice - 1.2 + trendEffect + noise).toFixed(2);
    const mspKg = +(crop.mspPrice / 100).toFixed(2);
    const volumeTons = Math.floor(100 + Math.sin(i * 0.5) * 40 + Math.random() * 20);

    points.push({
      date: dayStr,
      marketPrice: price,
      mspBenchmark: mspKg,
      volumeTons
    });
  }

  return {
    cropId: crop.cropId,
    cropName: crop.cropName,
    hindiName: crop.hindiName,
    currentPriceKg: +(crop.currentMandiPrice / 100).toFixed(2),
    mspKg: +(crop.mspPrice / 100).toFixed(2),
    unit: '₹ / kg',
    trend: crop.trend,
    recommendation: crop.recommendation,
    points
  };
};

