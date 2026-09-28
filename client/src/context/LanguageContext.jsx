import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    appName: 'KisanAI',
    tagline: 'Hyperlocal Monsoon & Agricultural Intelligence for Smarter Farming',
    subTagline: 'From climate signals to local agricultural decisions.',
    nav: {
      dashboard: 'Dashboard',
      farmerAdvisory: 'Farmer Advisory',
      riskMap: 'Risk Map',
      cropAdvisory: 'Crop Advisory',
      forecast: 'Forecast Details',
      aiAssistant: 'AI Assistant',
      alerts: 'Alerts',
      marketplace: 'Farmer Marketplace',
      marketIntelligence: 'Market Intelligence',
      about: 'How It Works',
      admin: 'Demo / Admin',
    },
    marketplace: {
      title: 'Farmer Marketplace & Farm-to-Market',
      subtitle: 'Direct farm-gate trade connecting climate-smart farmers with verified buyers and mandi intelligence',
      sellProduceBtn: '+ Sell Your Produce',
      tabs: {
        browse: 'Browse Produce',
        myProducts: 'My Produce',
        offers: 'Negotiations & Offers',
        orders: 'Orders & Logistics',
        intelligence: 'Market Mandi Intel',
        buyers: 'Nearby Buyers'
      },
      categories: {
        all: 'All Categories',
        grains: 'Grains & Millets',
        pulses: 'Pulses',
        oilseeds: 'Oilseeds',
        vegetables: 'Vegetables',
        fruits: 'Fruits',
        spices: 'Spices',
        dairy: 'Dairy & Ghee',
        other: 'Other Produce'
      },
      filters: {
        searchPlaceholder: 'Search crops, grains, pulse, variety, or village...',
        filterCategory: 'Category',
        priceRange: 'Price Range',
        qualityGrade: 'Quality Grade',
        location: 'Location'
      },
      productCard: {
        quantity: 'Available',
        price: 'Price',
        minOrder: 'Min Order',
        grade: 'Grade',
        moisture: 'Moisture',
        harvest: 'Harvested',
        sendOfferBtn: 'Make Offer / Buy',
        aiVerified: 'AI Quality Verified',
        negotiable: 'Negotiable',
        fixed: 'Fixed Price'
      }
    },
    hero: {
      title: 'Hyperlocal Monsoon Intelligence for Smarter Farming',
      subtitle: 'Predict localized monsoon risks, understand upcoming dry spells and heavy rainfall, and receive crop-specific agricultural advisories using climate signals, weather data and AI.',
      exploreBtn: 'Explore Dashboard',
      askAIBtn: 'Ask AI Assistant',
      disclaimerBadge: 'Probabilistic Meteorological AI Engine',
    },
    features: {
      hyperlocal: { title: 'Hyperlocal Forecast', desc: 'Block and Panchayat-level probabilistic risk insights with calibrated uncertainty.' },
      climate: { title: 'Climate Intelligence', desc: 'ENSO, IOD and MJO global teleconnection signals affecting Indian monsoon.' },
      aiAssistant: { title: 'AI Agricultural Assistant', desc: 'Interactive conversational guidance powered by Google Gemini AI and real farm context.' },
      smartAdvisory: { title: 'Smart Advisories', desc: 'Convert weather probabilities into concrete, crop-specific sowing & irrigation actions.' },
      riskMaps: { title: 'Risk Maps', desc: 'Interactive color-coded GIS block visualization of onset, dry spell, and flood risks.' },
      regionalLang: { title: 'Regional Language', desc: 'Complete Hindi & English support tailored for Indian farming communities.' }
    },
    dashboard: {
      title: 'Monsoon Intelligence Dashboard',
      subtitle: 'Hyperlocal climate teleconnections and 7–30 day probabilistic agricultural risk outlook',
      selectLocation: 'Select Location',
      useMyLocation: 'Use My Location',
      state: 'State',
      district: 'District',
      block: 'Block',
      panchayat: 'Panchayat',
      cropSelector: 'Selected Crop',
      topCards: {
        onsetTitle: 'Monsoon Onset',
        onsetSub: 'Probability of sustained onset',
        drySpellTitle: 'Dry Spell',
        drySpellSub: 'Probability of prolonged dry spell',
        heavyRainTitle: 'Heavy Rain',
        heavyRainSub: 'Probability of heavy rainfall',
        confidenceTitle: 'Forecast Confidence',
        confidenceSub: 'Model confidence score',
        askAI: 'Ask AI',
      },
      timeline: {
        title: 'Probabilistic Forecast Timeline',
        horizon7: '7 Days',
        horizon14: '14 Days',
        horizon21: '21 Days',
        horizon30: '30 Days',
        rainProb: 'Rainfall Probability (%)',
        expectedRain: 'Expected Rainfall (mm)',
        dryRisk: 'Dry Spell Risk (%)',
        heavyRisk: 'Heavy Rain Risk (%)',
      },
      climateSignals: {
        title: 'Global Climate Signals & Teleconnections',
        subtitle: 'Large-scale ocean-atmospheric drivers shaping the Indian summer monsoon season',
        ensoTitle: 'ENSO (El Niño / La Niña)',
        iodTitle: 'IOD (Indian Ocean Dipole)',
        mjoTitle: 'MJO (Madden-Julian Oscillation)',
        disclaimer: 'Climate teleconnections provide probabilistic boundary conditions and do not imply deterministic guarantees.',
      }
    },
    farmer: {
      title: 'Kisan Agricultural Advisory',
      subtitle: 'Simple, clear, and actionable field guidance for your village',
      locationLabel: 'Location',
      cropLabel: 'Crop',
      currentStatus: 'Current Farming Advisory',
      waterReq: 'Water Requirement',
      dryTolerance: 'Dry Spell Resilience',
      heavyRainLimit: 'Heavy Rain Threshold',
      actionTitle: 'Recommended Field Actions',
      disclaimer: 'Always verify soil moisture depth with a spade (10-15 cm) before sowing.'
    },
    ai: {
      title: 'KisanAI Agricultural Assistant',
      subtitle: 'Ask about your forecast, rainfall risk or crop decisions',
      placeholder: 'Ask any question (e.g. Should I sow soybean now?)...',
      send: 'Send',
      quickChips: [
        'Should I sow now?',
        'Is a dry spell coming?',
        'Explain my rainfall risk',
        'What should I do before heavy rain?',
        'हिंदी में समझाइए'
      ],
      clearChat: 'Clear Chat',
      thinking: 'KisanAI is analyzing local climate signals & farm data...',
    },
    common: {
      low: 'Low',
      moderate: 'Moderate',
      high: 'High',
      critical: 'Critical',
      veryHigh: 'Very High',
      viewAdvisory: 'View Advisory',
      refresh: 'Refresh',
      loading: 'Loading data...',
      activeScenario: 'Demo Scenario',
      switchLanguage: 'हिंदी में देखें'
    }
  },
  hi: {
    appName: 'किसानAI',
    tagline: 'स्मार्ट खेती के लिए अति-स्थानीय मानसून व कृषि पूर्वानुमान',
    subTagline: 'जलवायु संकेतों से स्थानीय कृषि निर्णयों तक।',
    nav: {
      dashboard: 'डैशबोर्ड',
      farmerAdvisory: 'किसान सलाह',
      riskMap: 'जोखिम मानचित्र',
      cropAdvisory: 'फसल परामर्श',
      forecast: 'विस्तृत पूर्वानुमान',
      aiAssistant: 'AI सहायक',
      alerts: 'चेतावनी',
      marketplace: 'किसान मंडी (Marketplace)',
      marketIntelligence: 'मंडी भाव विश्लेषण',
      about: 'यह कैसे काम करता है',
      admin: 'डेमो / एडमिन',
    },
    marketplace: {
      title: 'किसान बाजार व फसल विक्रय (Farm-to-Market)',
      subtitle: 'जलवायु-सचेत किसानों को सत्यापित खरीदारों और रीयल-टाइम मंडी भाव से जोड़ने वाला सीधा मंच',
      sellProduceBtn: '+ अपनी उपज बेचें',
      tabs: {
        browse: 'उपज खरीदें / खोजें',
        myProducts: 'मेरी लिस्टिंग',
        offers: 'मोलभाव व प्रस्ताव',
        orders: 'ऑर्डर व डिलीवरी',
        intelligence: 'मंडी भाव व रुझान',
        buyers: 'निकटवर्ती खरीदार'
      },
      categories: {
        all: 'सभी श्रेणियां',
        grains: 'अनाज व मोटे अनाज',
        pulses: 'दालें / दलहन',
        oilseeds: 'तिलहन',
        vegetables: 'सब्जियां',
        fruits: 'फल',
        spices: 'मसाले',
        dairy: 'डेयरी व देसी घी',
        other: 'अन्य उपज'
      },
      filters: {
        searchPlaceholder: 'फसल, किस्म, अनाज, दाल या गांव का नाम खोजें...',
        filterCategory: 'श्रेणी',
        priceRange: 'मूल्य दायरा',
        qualityGrade: 'गुणवत्ता ग्रेड',
        location: 'स्थान'
      },
      productCard: {
        quantity: 'उपलब्ध मात्रा',
        price: 'अपेक्षित मूल्य',
        minOrder: 'न्यूनतम ऑर्डर',
        grade: 'ग्रेड',
        moisture: 'नमी (Moisture)',
        harvest: 'कटाई तिथि',
        sendOfferBtn: 'खरीद प्रस्ताव भेजें',
        aiVerified: 'AI गुणवत्ता सत्यापित',
        negotiable: 'मोलभाव संभव',
        fixed: 'निश्चित भाव'
      }
    },
    hero: {
      title: 'स्मार्ट खेती के लिए सटीक मानसून व कृषि बुद्धिमत्ता',
      subtitle: 'जलवायु संकेतों, मौसम डेटा और AI की मदद से स्थानीय मानसून जोखिम, वर्षा विराम और भारी बारिश का पूर्वानुमान समझें तथा फसल अनुसार सही सलाह प्राप्त करें।',
      exploreBtn: 'डैशबोर्ड देखें',
      askAIBtn: 'AI सहायक से पूछें',
      disclaimerBadge: 'संभाव्यता आधारित मौसम AI मॉडल',
    },
    features: {
      hyperlocal: { title: 'अति-स्थानीय पूर्वानुमान', desc: 'ब्लॉक और पंचायत स्तर पर जोखिम व वर्षा संभावना का सटीक विश्लेषण।' },
      climate: { title: 'जलवायु संकेत', desc: 'ENSO, IOD और MJO जैसे वैश्विक जलवायु तंत्रों का भारतीय मानसून पर प्रभाव।' },
      aiAssistant: { title: 'AI कृषि सहायक', desc: 'गूगल जेमिनी AI द्वारा आपके खेत और मौसम के आधार पर तुरंत सरल उत्तर।' },
      smartAdvisory: { title: 'स्मार्ट फसल सलाह', desc: 'मौसम की संभावनाओं को बुवाई, सिंचाई और खाद के सही निर्णयों में बदलें।' },
      riskMaps: { title: 'जोखिम मानचित्र', desc: 'मानसून आगमन, सूखे और जलभराव का रंगीन इंटरएक्टिव नक्शा।' },
      regionalLang: { title: 'सरल हिंदी माध्यम', desc: 'भारतीय किसान भाइयों के लिए पूरी तरह सरल हिंदी भाषा में उपलब्ध।' }
    },
    dashboard: {
      title: 'मानसून इंटेलिजेंस डैशबोर्ड',
      subtitle: 'अति-स्थानीय जलवायु संकेत एवं 7–30 दिवसीय संभाव्य कृषि जोखिम आउटलुक',
      selectLocation: 'स्थान चुनें',
      useMyLocation: 'मेरा स्थान चुनें',
      state: 'राज्य',
      district: 'जिला',
      block: 'ब्लॉक / तहसील',
      panchayat: 'ग्राम पंचायत',
      cropSelector: 'चुनी गई फसल',
      topCards: {
        onsetTitle: 'मानसून सक्रियता',
        onsetSub: 'लगातार मानसूनी वर्षा की संभावना',
        drySpellTitle: 'वर्षा विराम / सूखा',
        drySpellSub: 'लंबे शुष्क दौर की संभावना',
        heavyRainTitle: 'भारी वर्षा',
        heavyRainSub: 'अत्यधिक बारिश का जोखिम',
        confidenceTitle: 'मॉडल विश्वास',
        confidenceSub: 'पूर्वानुमान विश्वसनीयता स्तर',
        askAI: 'AI से पूछें',
      },
      timeline: {
        title: 'संभाव्य मौसम पूर्वानुमान समयरेखा',
        horizon7: '7 दिन',
        horizon14: '14 दिन',
        horizon21: '21 दिन',
        horizon30: '30 दिन',
        rainProb: 'वर्षा संभावना (%)',
        expectedRain: 'अनुमानित वर्षा (मिमी)',
        dryRisk: 'सूखा जोखिम (%)',
        heavyRisk: 'भारी वर्षा जोखिम (%)',
      },
      climateSignals: {
        title: 'वैश्विक जलवायु संकेत एवं भारतीय मानसून',
        subtitle: 'महासागरीय एवं वायुमंडलीय प्रणालियां जो मानसूनी वर्षा को प्रभावित करती हैं',
        ensoTitle: 'ENSO (एल नीनो / ला नीना)',
        iodTitle: 'IOD (हिंद महासागर द्विध्रुव)',
        mjoTitle: 'MJO (मैडेन-जूलियन दोलन)',
        disclaimer: 'जलवायु संकेत संभाव्य परिस्थितियां बताते हैं, यह निश्चित भविष्यवाणी नहीं हैं।',
      }
    },
    farmer: {
      title: 'किसान कृषि परामर्श केंद्र',
      subtitle: 'आपके गांव और पंचायत के लिए सरल व स्पष्ट कृषि सलाह',
      locationLabel: 'स्थान',
      cropLabel: 'फसल',
      currentStatus: 'वर्तमान कृषि सलाह स्थिति',
      waterReq: 'वर्षा व जल आवश्यकता',
      dryTolerance: 'सूखा सहनशीलता',
      heavyRainLimit: 'अत्यधिक वर्षा सीमा',
      actionTitle: 'खेत में करने योग्य जरूरी काम',
      disclaimer: 'बुवाई से पहले फावड़े से 10-15 सेमी गहराई तक मिट्टी की नमी अवश्य जांचें।'
    },
    ai: {
      title: 'किसानAI कृषि सहायक',
      subtitle: 'मौसम, वर्षा जोखिम या अपनी फसल संबंधी कोई भी सवाल पूछें',
      placeholder: 'अपना प्रश्न यहाँ लिखें (जैसे: क्या मुझे अभी सोयाबीन बोना चाहिए?)...',
      send: 'पूछें',
      quickChips: [
        'क्या मैं अभी बुवाई करूँ?',
        'क्या सूखा आने वाला है?',
        'मेरी वर्षा जोखिम समझाइए',
        'भारी बारिश से पहले क्या करूँ?',
        'सरल हिंदी में सलाह दें'
      ],
      clearChat: 'चैट साफ करें',
      thinking: 'किसानAI स्थानीय मौसम डेटा और जलवायु संकेतों का विश्लेषण कर रहा है...',
    },
    common: {
      low: 'कम',
      moderate: 'मध्यम',
      high: 'अधिक',
      critical: 'अति-गंभीर',
      veryHigh: 'अत्यधिक',
      viewAdvisory: 'सलाह देखें',
      refresh: 'ताज़ा करें',
      loading: 'डेटा लोड हो रहा है...',
      activeScenario: 'डेमो परिदृश्य',
      switchLanguage: 'Switch to English'
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('monsoon_ai_lang');
    if (saved === 'hi' || saved === 'en') {
      setLang(saved);
    }
  }, []);

  const toggleLanguage = () => {
    const next = lang === 'en' ? 'hi' : 'en';
    setLang(next);
    localStorage.setItem('monsoon_ai_lang', next);
  };

  const t = translations[lang] || translations.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
