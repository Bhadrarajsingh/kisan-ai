// In-memory data store for Marketplace Demo & Full CRUD operations
// Seamlessly operates in both MongoDB mode and In-Memory Demo mode

export let PRODUCTS_STORE = [
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

export let BUYERS_STORE = [
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

export let OFFERS_STORE = [
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

export let ORDERS_STORE = [
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

// Mandi Price Intelligence Database & 30-Day Trends
export const MANDI_PRICES_DATABASE = [
  {
    cropId: 'bajra',
    cropName: 'Bajra (Pearl Millet)',
    hindiName: 'बाजरा',
    mspPrice: 2500, // per quintal (₹25/kg)
    currentMandiPrice: 2420, // ₹24.20/kg
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
    mspPrice: 4892, // ₹48.92/kg
    currentMandiPrice: 4480, // ₹44.80/kg
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
    mspPrice: 2275, // ₹22.75/kg
    currentMandiPrice: 2780, // ₹27.80/kg (Premium Sharbati trades well above MSP)
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
    mspPrice: 7121, // ₹71.21/kg
    currentMandiPrice: 6850, // ₹68.50/kg
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
    mspPrice: 6783, // ₹67.83/kg
    currentMandiPrice: 6540, // ₹65.40/kg
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
    mspPrice: 8558, // ₹85.58/kg
    currentMandiPrice: 8250, // ₹82.50/kg
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

// Helper to generate 30-day realistic price trend data for Recharts
export const get30DayPriceTrends = (cropId = 'bajra') => {
  const crop = MANDI_PRICES_DATABASE.find(c => c.cropId === cropId) || MANDI_PRICES_DATABASE[0];
  const basePrice = crop.currentMandiPrice / 100; // convert to ₹/kg
  const trendData = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayStr = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    
    // Smooth random walk with subtle upward trend
    const noise = Math.sin(i * 0.4) * 0.6 + (Math.random() * 0.4 - 0.2);
    const trendEffect = (30 - i) * 0.04;
    const price = +(basePrice - 1.2 + trendEffect + noise).toFixed(2);
    const mspKg = +(crop.mspPrice / 100).toFixed(2);
    const volumeTons = Math.floor(100 + Math.sin(i * 0.5) * 40 + Math.random() * 20);

    trendData.push({
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
    points: trendData
  };
};

// AI Product Verification Engine
export const performAIProductVerification = ({ name, category, quantity, unit, expectedPrice, imageDescription }) => {
  const cleanName = (name || '').toLowerCase();
  
  let detectedCategory = 'Grains';
  let confidence = 94;
  let qualityIndicator = 'Good grain density, clean harvest, low visual foreign matter (<2%)';
  let suggestedDescription = `Freshly harvested ${name || 'produce'} of superior quality. Well-dried to ensure safe storage and transport.`;

  if (cleanName.includes('bajra') || cleanName.includes('millet')) {
    detectedCategory = 'Grains / Millets';
    confidence = 96;
    qualityIndicator = 'Plump, uniform pearl millet grains with optimal 11% moisture and high lustre';
    suggestedDescription = 'Cleanly threshed kharif Bajra with minimal chaff. Ideal for flour milling or cattle feed formulation.';
  } else if (cleanName.includes('soybean') || cleanName.includes('soya')) {
    detectedCategory = 'Oilseeds';
    confidence = 95;
    qualityIndicator = 'Well-ripened yellow soybean with intact seed coat and negligible splits (<3%)';
    suggestedDescription = 'High-protein certified yellow soybean suitable for solvent extraction or tofu processing.';
  } else if (cleanName.includes('wheat') || cleanName.includes('gehu')) {
    detectedCategory = 'Grains';
    confidence = 97;
    qualityIndicator = 'Heavy bold grain kernels, amber translucency, zero insect damage observed';
    suggestedDescription = 'Mechanically cleaned Sharbati golden wheat, graded and ready for commercial flour milling.';
  } else if (cleanName.includes('groundnut') || cleanName.includes('peanut') || cleanName.includes('mungfali')) {
    detectedCategory = 'Oilseeds / Legumes';
    confidence = 94;
    qualityIndicator = 'Two-seeded mature pods with dry shells and crisp kernel texture';
    suggestedDescription = 'Organically grown bold groundnuts in shell. High oil yield and sweet taste.';
  } else if (cleanName.includes('cotton') || cleanName.includes('kapas')) {
    detectedCategory = 'Commercial Fiber';
    confidence = 93;
    qualityIndicator = 'White lustrous lint, good tensile strength and low leaf residue';
    suggestedDescription = 'Seed cotton with high ginning turnout percentage. Free of moisture staining.';
  } else if (cleanName.includes('moong') || cleanName.includes('dal') || cleanName.includes('pulse')) {
    detectedCategory = 'Pulses';
    confidence = 96;
    qualityIndicator = 'Uniform green hue, zero weevil holes, low foreign seeds (<1%)';
    suggestedDescription = 'First-grade kharif green gram pulse, harvested at peak maturity and machine destoned.';
  }

  return {
    isVerified: true,
    confidence,
    detectedCategory,
    qualityIndicator,
    suggestedDescription,
    disclaimer: 'AI visual indicator only; does not replace laboratory certified analysis.'
  };
};
