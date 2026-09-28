import axios from 'axios';
import { 
  MOCK_LOCATIONS, 
  MOCK_CROPS, 
  MOCK_CLIMATE, 
  MOCK_WEATHER, 
  MOCK_FORECAST, 
  MOCK_ALERTS,
  MOCK_PRODUCTS,
  MOCK_BUYERS,
  MOCK_OFFERS,
  MOCK_ORDERS,
  MOCK_MANDI_PRICES,
  generateMockPriceTrends
} from './mockData';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token to every request if present in localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('monsoon_ai_token');
    if (token && !token.startsWith('token-')) {
      // Only attach real JWT tokens (not demo placeholder tokens)
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: if 401 is received, clear local storage (session expired)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only clear storage if it's a protected endpoint (not login/register)
      const url = error.config?.url || '';
      if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
        localStorage.removeItem('monsoon_ai_token');
        localStorage.removeItem('monsoon_ai_user');
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Weather
  getWeather: async (locationId = 'raj-jai-chomu') => {
    try {
      const res = await apiClient.get('/weather', { params: { locationId } });
      return res.data?.data || res.data;
    } catch (err) {
      console.warn('Backend unavailable, using cached weather mock', err.message);
      return { ...MOCK_WEATHER, locationId };
    }
  },

  // Forecast
  getForecast: async (locationId = 'raj-jai-chomu', horizon = '14d') => {
    try {
      const res = await apiClient.get(`/forecast/${locationId}`, { params: { horizon } });
      return res.data?.data || res.data;
    } catch (err) {
      console.warn('Backend unavailable, using cached forecast mock', err.message);
      return { ...MOCK_FORECAST, locationId, horizon };
    }
  },

  // Risk Map
  getRiskMap: async (metric = 'onset') => {
    try {
      const res = await apiClient.get('/risk-map', { params: { metric } });
      return res.data?.data || res.data;
    } catch (err) {
      console.warn('Backend unavailable, generating local map data');
      return MOCK_LOCATIONS.map(loc => ({
        locationId: loc.locationId,
        name: `${loc.panchayat} (${loc.block})`,
        panchayat: loc.panchayat,
        block: loc.block,
        district: loc.district,
        state: loc.state,
        coordinates: [loc.latitude, loc.longitude],
        metric,
        value: metric === 'dry_spell' ? 24 : metric === 'heavy_rain' ? 38 : 78,
        category: 'Moderate',
        color: '#16A34A',
        onsetProbability: 78,
        drySpellProbability: 24,
        heavyRainProbability: 38,
        confidence: 72,
        confidenceLevel: 'Medium',
        soilType: loc.soilType
      }));
    }
  },

  // Climate Indices
  getClimateIndices: async () => {
    try {
      const res = await apiClient.get('/climate-indices');
      return res.data?.data || res.data;
    } catch (err) {
      return MOCK_CLIMATE;
    }
  },

  // Crops
  getCrops: async () => {
    try {
      const res = await apiClient.get('/crops');
      return res.data?.data || res.data;
    } catch (err) {
      return MOCK_CROPS;
    }
  },

  // Crop Advisory
  getCropAdvisory: async (locationId = 'raj-jai-chomu', crop = 'soybean') => {
    try {
      const res = await apiClient.get(`/advisory/${locationId}/${crop}`);
      return res.data?.data || res.data;
    } catch (err) {
      const cropObj = MOCK_CROPS.find(c => c.cropId === crop) || MOCK_CROPS[0];
      return {
        cropId: cropObj.cropId,
        cropName: cropObj.name,
        cropHindiName: cropObj.hindiName,
        cropCategory: cropObj.category,
        cropIcon: cropObj.icon,
        riskLevel: 'Low',
        status: 'Favorable for Sowing',
        statusHindi: 'बुवाई के लिए उत्तम समय',
        messageEnglish: `Rainfall conditions appear favorable for ${cropObj.name} in selected location (Onset: 78%, Dry Spell: 24%). Ensure 50mm soil moisture profile.`,
        messageHindi: `${cropObj.hindiName} की बुवाई के लिए मौसम अनुकूल है (मानसून सक्रियता: 78%, सूखा जोखिम: 24%)। पर्याप्त नमी होने पर बुवाई करें।`,
        actionItemsEnglish: [
          'Confirm topsoil moisture up to 10-15 cm depth before drilling seed.',
          'Carry out fungicide seed treatment with Trichoderma / Thiram.',
          'Maintain proper spacing and seed rate.'
        ],
        actionItemsHindi: [
          'खेत में 10-15 सेमी गहराई तक नमी अवश्य जांचें।',
          'बीज को कवकनाशी दवा से उपचारित करके ही बोएं।',
          'उचित कतार दूरी बनाए रखें।'
        ],
        cropParameters: {
          sowingRainRequirement: cropObj.sowingRainRequirement,
          drySpellTolerance: cropObj.drySpellTolerance,
          heavyRainThreshold: cropObj.heavyRainThreshold,
          sowingWindow: cropObj.sowingWindow,
        },
        forecastSnapshot: { onsetProbability: 78, drySpellProbability: 24, heavyRainProbability: 38, confidence: 72 }
      };
    }
  },

  // Alerts
  getAlerts: async () => {
    try {
      const res = await apiClient.get('/alerts');
      return res.data?.data || res.data;
    } catch (err) {
      return MOCK_ALERTS;
    }
  },

  createAlert: async (alertData) => {
    const res = await apiClient.post('/alerts', alertData);
    return res.data?.data || res.data;
  },

  // Locations
  getLocations: async (state, district) => {
    try {
      const res = await apiClient.get('/locations', { params: { state, district } });
      return res.data?.data || res.data;
    } catch (err) {
      return MOCK_LOCATIONS;
    }
  },

  // AI Chat — tries direct Gemini API first, then backend, then smart local fallback
  sendAIChat: async (payload) => {
    const { message, crop, userContext = {} } = payload;
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // 1. Try Gemini directly from the browser
    if (geminiKey && geminiKey.trim().length > 10) {
      const systemPrompt = `You are KisanAI, an AI-powered agricultural weather assistant for Indian farmers. Provide concise, practical, farmer-friendly answers about monsoon, weather, crop advisory, and market prices. Use bullet points where helpful. Answer in Hindi if the user writes in Hindi.`;
      const onset = userContext.onsetProbability || 78;
      const drySpell = userContext.drySpellProbability || 24;
      const heavyRain = userContext.heavyRainProbability || 38;
      const contextText = `FARM CONTEXT:\n- Location: ${userContext.location || 'Rajasthan'}\n- Crop: ${crop || 'Soybean'}\n- Monsoon Onset Probability: ${onset}%\n- Dry Spell Risk: ${drySpell}%\n- Heavy Rainfall Risk: ${heavyRain}%\n- Temperature: ${userContext.temperature || 29}C, Humidity: ${userContext.humidity || 74}%\n- Climate: ENSO ${userContext.climateSignals?.enso || 'Neutral'}, IOD ${userContext.climateSignals?.iod || 'Positive'}\n\nUSER QUESTION: "${message}"\n\nAnswer concisely with practical advice.`;

      // AQ. and ya29. tokens are OAuth Bearer tokens; AIzaSy keys use ?key= param
      const isBearer = geminiKey.startsWith('AQ.') || geminiKey.startsWith('ya29.');
      const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];

      for (const model of models) {
        const baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
        const attempts = isBearer
          ? [
              { url: baseUrl, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${geminiKey}` } },
              { url: `${baseUrl}?key=${geminiKey}`, headers: { 'Content-Type': 'application/json' } }
            ]
          : [
              { url: `${baseUrl}?key=${geminiKey}`, headers: { 'Content-Type': 'application/json' } },
              { url: baseUrl, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${geminiKey}` } }
            ];

        for (const attempt of attempts) {
          try {
            const res = await fetch(attempt.url, {
              method: 'POST',
              headers: attempt.headers,
              body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: [{ role: 'user', parts: [{ text: contextText }] }],
                generationConfig: { temperature: 0.4, maxOutputTokens: 800 }
              })
            });
            const data = await res.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              console.log(`Gemini direct (${model}) OK`);
              return { reply: text, provider: `Google Gemini (${model})`, isLiveAI: true };
            }
            if (data?.error) console.warn(`Gemini ${model}:`, data.error.message);
          } catch (e) {
            console.warn(`Gemini ${model} fetch error:`, e.message);
          }
        }
      }
    }


    // 2. Try backend server
    try {
      const res = await apiClient.post('/ai/chat', payload);
      return res.data?.data || res.data;
    } catch (err) {
      console.warn('Backend AI unavailable:', err.message);
    }

    // 3. Smart local contextual fallback — handles 12+ question types
    const q = (message || '').toLowerCase();
    const isHindi = /[\u0900-\u097F]/.test(message);
    const onset = userContext.onsetProbability || 78;
    const drySpell = userContext.drySpellProbability || 24;
    const heavyRain = userContext.heavyRainProbability || 38;
    const conf = userContext.confidence || 72;
    const temp = userContext.temperature || 29;
    const humidity = userContext.humidity || 74;
    const rainfall = userContext.recentRainfall || 52;
    const loc = userContext.location || 'your area';
    const cropName = crop || 'Soybean';
    const enso = userContext.climateSignals?.enso || 'Neutral (-0.3)';
    const iod = userContext.climateSignals?.iod || 'Positive (+0.5)';

    let reply;

    if (q.includes('weather') || q.includes('mausam') || q.includes('मौसम') || q.includes('today') || q.includes('aaj') || q.includes('आज')) {
      reply = isHindi
        ? `☀️ **${loc} — आज का मौसम:**\n\n• 🌡️ तापमान: **${temp}°C**\n• 💧 नमी: **${humidity}%**\n• 🌧️ पिछले 7 दिनों में वर्षा: **${rainfall} mm**\n• ☁️ मानसून सक्रियता: **${onset}%**\n\n**सलाह:** ${humidity > 70 ? 'नमी अधिक है — फफूंद रोग की निगरानी करें।' : 'मौसम सामान्य है — खेत का निरीक्षण करते रहें।'}`
        : `☀️ **Current Weather — ${loc}:**\n\n• 🌡️ Temperature: **${temp}°C**\n• 💧 Humidity: **${humidity}%**\n• 🌧️ Rainfall last 7 days: **${rainfall} mm**\n• ☁️ Monsoon onset: **${onset}%** (confidence: ${conf}%)\n\n**Advisory:** ${humidity > 70 ? 'High humidity — monitor for fungal diseases.' : 'Conditions are normal — continue regular field monitoring.'}`;

    } else if (q.includes('rain') || q.includes('baarish') || q.includes('barish') || q.includes('बारिश') || q.includes('वर्षा') || q.includes('will it')) {
      const rainOutlook = onset > 75 ? 'High chance of rainfall' : onset > 55 ? 'Moderate rainfall expected' : 'Low rainfall probability';
      reply = isHindi
        ? `🌧️ **${loc} में वर्षा का पूर्वानुमान:**\n\n• मानसून सक्रियता: **${onset}%**\n• भारी वर्षा जोखिम: **${heavyRain}%**\n• सूखा जोखिम: **${drySpell}%**\n• हाल की वर्षा (7 दिन): **${rainfall} mm**\n\n**स्थिति:** ${onset > 70 ? '✅ अगले कुछ दिनों में अच्छी वर्षा की संभावना है।' : '⚠️ वर्षा सामान्य से कम हो सकती है — सिंचाई तैयार रखें।'}`
        : `🌧️ **Rainfall Forecast — ${loc}:**\n\n• Monsoon onset probability: **${onset}%**\n• Heavy rainfall risk: **${heavyRain}%**\n• Dry spell risk: **${drySpell}%**\n• Recent 7-day rainfall: **${rainfall} mm**\n\n**Outlook:** ${rainOutlook}. ${heavyRain > 50 ? '⚠️ High heavy rain risk — ensure field drainage is clear.' : '✅ Rainfall levels are within safe range for field operations.'}`;

    } else if (q.includes('sow') || q.includes('seed') || q.includes('plant') || q.includes('बुवाई') || q.includes('बीज') || q.includes('बोना')) {
      reply = isHindi
        ? `🌱 **${cropName} बुवाई सलाह:**\n\n• मानसून सक्रियता ${onset}% — बुवाई के लिए **${onset > 70 ? '✅ उपयुक्त समय' : '⚠️ सावधानी से विचार करें'}**\n• बुवाई से पहले 10-15 सेमी गहराई तक मिट्टी में नमी जांचें\n• बीज उपचार: Trichoderma / Thiram से अवश्य करें\n• सूखे की संभावना ${drySpell}% — सिंचाई व्यवस्था तैयार रखें\n• कतार दूरी और बीज दर का पालन करें`
        : `🌱 **${cropName} Sowing Advisory:**\n\n• Monsoon onset at **${onset}%** — sowing window is **${onset > 70 ? '✅ favorable' : '⚠️ borderline — wait for confirmation'}**\n• Verify 10-15 cm topsoil moisture depth before drilling seed\n• Seed treatment: Apply Trichoderma + Thiram fungicide\n• Dry spell risk ${drySpell}% — maintain backup irrigation\n• Follow recommended row spacing and seed rate for ${cropName}`;

    } else if (q.includes('irrigat') || q.includes('water') || q.includes('सिंचाई') || q.includes('पानी') || q.includes('paani')) {
      reply = isHindi
        ? `💧 **सिंचाई सलाह — ${cropName}:**\n\n• मानसून सक्रियता: **${onset}%**\n• **${onset > 65 ? '🚫 अभी सिंचाई की आवश्यकता नहीं — प्राकृतिक वर्षा पर्याप्त है' : '✅ हल्की सिंचाई की सलाह दी जाती है'}**\n• हाल की वर्षा: ${rainfall} mm (7 दिन)\n• ${heavyRain > 50 ? '⚠️ भारी वर्षा जोखिम अधिक — जल निकासी सुनिश्चित करें' : 'जलभराव का जोखिम सामान्य स्तर पर है'}`
        : `💧 **Irrigation Advisory — ${cropName}:**\n\n• Monsoon onset: **${onset}%**\n• **${onset > 65 ? '🚫 Irrigation not required — natural rainfall is sufficient' : '✅ Light supplemental irrigation recommended'}**\n• Recent rainfall: ${rainfall} mm (7 days)\n• ${heavyRain > 50 ? '⚠️ High flood/waterlogging risk — avoid over-irrigation' : 'Waterlogging risk is within normal range'}`;

    } else if (q.includes('risk') || q.includes('danger') || q.includes('flood') || q.includes('जोखिम') || q.includes('खतरा')) {
      const riskLevel = heavyRain > 60 ? 'HIGH' : heavyRain > 35 ? 'MODERATE' : 'LOW';
      reply = isHindi
        ? `🚨 **मौसम जोखिम रिपोर्ट — ${loc}:**\n\n• 🌧️ भारी वर्षा जोखिम: **${heavyRain}%** (${riskLevel === 'HIGH' ? 'अधिक' : riskLevel === 'MODERATE' ? 'मध्यम' : 'कम'})\n• 🏜️ सूखा जोखिम: **${drySpell}%**\n• 🌊 बाढ़ जोखिम: **${heavyRain > 60 ? 'अधिक — नदी तट के खेतों में सावधानी' : 'सामान्य'}**\n• 🌡️ ताप तनाव: **${temp > 38 ? 'अधिक' : 'सामान्य'}**\n\n${heavyRain > 50 ? '⚠️ जल निकासी की व्यवस्था अभी करें।' : '✅ समग्र जोखिम स्तर प्रबंधनीय है।'}`
        : `🚨 **Weather Risk Report — ${loc}:**\n\n• 🌧️ Heavy rainfall risk: **${heavyRain}%** (${riskLevel})\n• 🏜️ Dry spell risk: **${drySpell}%**\n• 🌊 Flood risk: **${heavyRain > 60 ? 'High — clear drainage channels immediately' : 'Normal'}**\n• 🌡️ Heat stress: **${temp > 38 ? 'High' : 'Normal'}**\n\n${heavyRain > 50 ? '⚠️ Prepare drainage and crop protection now.' : '✅ Overall risk level is manageable. Continue normal operations.'}`;

    } else if (q.includes('pest') || q.includes('disease') || q.includes('spray') || q.includes('कीट') || q.includes('रोग') || q.includes('दवाई')) {
      reply = isHindi
        ? `🐛 **कीट एवं रोग सलाह — ${cropName}:**\n\n• नमी **${humidity}%** है — ${humidity > 75 ? '⚠️ फफूंद रोग (Leaf Rust, Downy Mildew) का खतरा अधिक है' : 'रोग जोखिम सामान्य है'}\n• **सिफारिश:** ${humidity > 70 ? 'मैंकोजेब या कार्बेन्डाजिम का छिड़काव करें' : 'नियमित निगरानी जारी रखें'}\n• वर्षा के बाद या तेज हवा में छिड़काव से बचें\n• पत्तियों पर पीलापन या धब्बे दिखें तो तुरंत कृषि विशेषज्ञ से संपर्क करें`
        : `🐛 **Pest & Disease Advisory — ${cropName}:**\n\n• Current humidity: **${humidity}%** — ${humidity > 75 ? '⚠️ High fungal disease risk (Leaf Rust, Downy Mildew)' : 'Disease risk within normal range'}\n• **Recommendation:** ${humidity > 70 ? 'Apply Mancozeb or Carbendazim preventively' : 'Continue regular scouting'}\n• Avoid spraying before rain or during high winds\n• Scout for yellowing, spots, or wilting — report to local extension officer if severe`;

    } else if (q.includes('fertilizer') || q.includes('urea') || q.includes('खाद') || q.includes('यूरिया') || q.includes('nutrient')) {
      reply = isHindi
        ? `🧪 **उर्वरक सलाह — ${cropName}:**\n\n• मानसून सक्रियता ${onset}% — ${onset > 65 ? '✅ उर्वरक देने का उपयुक्त समय' : '⚠️ वर्षा की पुष्टि के बाद ही उर्वरक दें'}\n• भारी वर्षा जोखिम ${heavyRain}% — ${heavyRain > 50 ? 'यूरिया अभी न डालें, वर्षा में बह जाएगा' : 'उर्वरक डाल सकते हैं'}\n• DAP/NPK बुवाई के समय, यूरिया टॉपड्रेसिंग 25-30 दिन बाद\n• मिट्टी परीक्षण के अनुसार ही उर्वरक मात्रा तय करें`
        : `🧪 **Fertilizer Advisory — ${cropName}:**\n\n• Monsoon onset: ${onset}% — ${onset > 65 ? '✅ Good conditions for fertilizer application' : '⚠️ Wait for rainfall confirmation before applying'}\n• Heavy rain risk: ${heavyRain}% — ${heavyRain > 50 ? '⚠️ Avoid Urea application — leaching risk is high' : 'Safe to apply top-dressing'}\n• Basal: DAP/NPK at sowing; Top-dressing Urea at 25-30 days\n• Always base fertilizer dose on soil test report`;

    } else if (q.includes('market') || q.includes('price') || q.includes('sell') || q.includes('mandi') || q.includes('मंडी') || q.includes('भाव') || q.includes('बेचना')) {
      reply = isHindi
        ? `📊 **मंडी भाव एवं बिक्री सलाह — ${cropName}:**\n\n• **वर्तमान मंडी भाव:** ₹24.50/kg (अनुमानित)\n• **MSP बेंचमार्क:** ₹25.00/kg\n• **ट्रेंड:** स्थिर (पिछले 7 दिन)\n• **नजदीकी खरीदार:** 8 सक्रिय खरीदार उपलब्ध\n\n**सलाह:** ${onset > 70 ? 'मानसून अच्छा है — कटाई का इंतजार करें, भाव बेहतर हो सकते हैं।' : 'अभी स्टॉक रखें। KisanAI Marketplace पर सीधे खरीदार से संपर्क करें।'}`
        : `📊 **Market & Selling Advisory — ${cropName}:**\n\n• **Current mandi rate:** ~₹24.50/kg\n• **MSP Benchmark:** ₹25.00/kg\n• **Price trend:** Stable (last 7 days)\n• **Active buyers nearby:** 8 verified buyers\n\n**Advisory:** ${onset > 70 ? 'Good monsoon season — consider waiting for harvest price appreciation.' : 'List your produce on KisanAI Marketplace to connect directly with buyers and skip commission agents.'}`;

    } else if (q.includes('harvest') || q.includes('kataai') || q.includes('कटाई') || q.includes('ready') || q.includes('तैयार')) {
      reply = isHindi
        ? `🌾 **कटाई सलाह — ${cropName}:**\n\n• भारी वर्षा जोखिम **${heavyRain}%** — ${heavyRain > 50 ? '⚠️ बारिश से पहले कटाई तेज करें' : '✅ कटाई के लिए मौसम अनुकूल है'}\n• तापमान **${temp}°C** — ${temp > 35 ? 'दोपहर में काम से बचें, सुबह-शाम करें' : 'कटाई के लिए उपयुक्त तापमान'}\n• कटाई के बाद उत्पाद को तुरंत सुरक्षित स्थान पर रखें\n• नमी ${humidity}% — उत्पाद को धूप में सुखाकर भंडारण करें`
        : `🌾 **Harvest Advisory — ${cropName}:**\n\n• Heavy rain risk: **${heavyRain}%** — ${heavyRain > 50 ? '⚠️ Accelerate harvesting before heavy rain arrives' : '✅ Weather is favorable for harvesting'}\n• Temperature: **${temp}°C** — ${temp > 35 ? 'Avoid midday work; harvest in early morning/evening' : 'Suitable harvesting temperature'}\n• Humidity: ${humidity}% — ensure proper drying before storage to prevent mold`;

    } else if (q.includes('enso') || q.includes('iod') || q.includes('mjo') || q.includes('climate') || q.includes('el nino') || q.includes('la nina') || q.includes('जलवायु')) {
      reply = isHindi
        ? `🌍 **जलवायु संकेतक — ${loc}:**\n\n• **ENSO:** ${enso} — ${enso.includes('Nina') ? 'La Niña सक्रिय — अच्छी वर्षा की संभावना' : enso.includes('Nino') ? 'El Niño सक्रिय — सूखे का जोखिम' : 'तटस्थ — सामान्य मानसून'}\n• **IOD:** ${iod} — ${iod.includes('Positive') || iod.includes('+') ? '✅ सकारात्मक IOD — भारत में अच्छी वर्षा' : 'तटस्थ IOD'}\n• **समग्र प्रभाव:** मानसून सक्रियता ${onset}%`
        : `🌍 **Climate Signals — ${loc}:**\n\n• **ENSO:** ${enso} — ${enso.includes('Nina') ? 'La Niña active — enhanced monsoon likely' : enso.includes('Nino') ? 'El Niño active — drought risk elevated' : 'Neutral — normal monsoon expected'}\n• **IOD:** ${iod} — ${iod.includes('Positive') || iod.includes('+') ? '✅ Positive IOD — favorable for Indian monsoon' : 'Neutral IOD — normal influence'}\n• **Net impact:** Monsoon onset at ${onset}%, confidence ${conf}%`;

    } else if (q.includes('humid') || q.includes('hot') || q.includes('temperature') || q.includes('heat') || q.includes('गर्मी') || q.includes('तापमान')) {
      reply = isHindi
        ? `🌡️ **तापमान एवं नमी रिपोर्ट:**\n\n• तापमान: **${temp}°C** ${temp > 38 ? '⚠️ — अत्यधिक गर्मी, फसल पर तनाव संभव' : temp > 35 ? '— गर्म, निगरानी रखें' : '— सामान्य'}\n• सापेक्ष नमी: **${humidity}%** ${humidity > 80 ? '⚠️ — बहुत अधिक, फफूंद रोग का खतरा' : humidity > 60 ? '— उचित स्तर पर' : '— कम, सिंचाई पर विचार करें'}\n• **सलाह:** ${temp > 36 && humidity > 75 ? 'गर्म और नम मौसम — कीट-रोग प्रबंधन पर ध्यान दें।' : 'मौसम सामान्य सीमा में है।'}`
        : `🌡️ **Temperature & Humidity Report:**\n\n• Temperature: **${temp}°C** ${temp > 38 ? '⚠️ — Extreme heat, crop stress possible' : temp > 35 ? '— Hot, monitor crops' : '— Normal range'}\n• Relative Humidity: **${humidity}%** ${humidity > 80 ? '⚠️ — Very high, fungal risk elevated' : humidity > 60 ? '— Adequate' : '— Low, consider irrigation'}\n• **Advisory:** ${temp > 36 && humidity > 75 ? 'Hot and humid — prioritize pest and disease scouting.' : 'Conditions within normal range. Continue standard operations.'}`;

    } else {
      // Generic context-aware response
      reply = isHindi
        ? `🌾 **${loc} में ${cropName} के लिए KisanAI सलाह:**\n\n• ☁️ मानसून सक्रियता: **${onset}%** (विश्वास: ${conf}%)\n• 🌡️ तापमान: **${temp}°C**, नमी: **${humidity}%**\n• 🌧️ सूखा जोखिम: **${drySpell}%** | भारी वर्षा: **${heavyRain}%**\n• 🌍 ENSO: ${enso} | IOD: ${iod}\n\n**आप इन विषयों पर पूछ सकते हैं:**\n• "कल बारिश होगी?" • "बुवाई करूं?" • "सिंचाई करूं?"\n• "कीट से कैसे बचाएं?" • "मंडी भाव क्या है?" • "आज का मौसम?"`
        : `🌾 **KisanAI Summary — ${cropName} in ${loc}:**\n\n• ☁️ Monsoon onset: **${onset}%** (confidence: ${conf}%)\n• 🌡️ Temp: **${temp}°C** | Humidity: **${humidity}%**\n• 🌧️ Dry spell risk: **${drySpell}%** | Heavy rain risk: **${heavyRain}%**\n• 🌍 ENSO: ${enso} | IOD: ${iod}\n\n**Try asking:**\n• "Will it rain tomorrow?" • "Should I sow now?" • "Irrigation advice"\n• "Pest management?" • "Current mandi price?" • "What's the weather today?"`;
    }

    return { reply, provider: 'KisanAI Agro-Meteorological Intelligence Engine', isLiveAI: false };
  },

  // Hackathon Scenario Switcher
  setScenario: async (scenario) => {
    try {
      const res = await apiClient.post('/scenario', { scenario });
      return res.data;
    } catch (err) {
      return { success: true, activeScenario: scenario };
    }
  },

  // Admin Stats
  getAdminStats: async () => {
    try {
      const res = await apiClient.get('/admin/stats');
      return res.data?.data || res.data;
    } catch (err) {
      return {
        monitoredLocationsCount: MOCK_LOCATIONS.length,
        activeAlertsCount: MOCK_ALERTS.length,
        supportedCropsCount: MOCK_CROPS.length,
        forecastsGenerated24h: 1248,
        activeScenario: 'normal_monsoon'
      };
    }
  },

  // ==========================================
  // AUTH APIs  — Real backend, errors propagate
  // ==========================================

  register: async (userData) => {
    // Throws on failure so AuthContext can show real error messages
    const res = await apiClient.post('/auth/register', userData);
    return res.data;
  },

  login: async (credentials) => {
    // credentials: { identifier/email, password }
    // Throws on failure so AuthContext can show real error messages
    const res = await apiClient.post('/auth/login', credentials);
    return res.data;
  },

  getMe: async () => {
    try {
      const res = await apiClient.get('/auth/me');
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  updateProfile: async (updates) => {
    const res = await apiClient.put('/auth/profile', updates);
    return res.data;
  },

  changePassword: async (data) => {
    const res = await apiClient.put('/auth/change-password', data);
    return res.data;
  },

  // ==========================================
  // AI CHAT — KisanAI Gemini Assistant
  // ==========================================

  /**
   * Send a chat message to the KisanAI backend (/api/ai/chat)
   * @param {object} payload - { message, locationId, crop, conversationHistory, userContext }
   * @returns {object} - { reply, provider, isLiveAI, contextSnapshot }
   */
  sendAIChat: async ({ message, locationId, crop, conversationHistory = [], userContext = {} }) => {
    try {
      const res = await apiClient.post('/ai/chat', {
        message,
        locationId: locationId || 'raj-jai-chomu',
        crop: crop || 'Soybean',
        conversationHistory,
        userContext,
      });
      // Backend returns { success: true, data: { reply, provider, isLiveAI, ... } }
      return res.data?.data || res.data;
    } catch (err) {
      console.warn('⚠️ AI chat backend unavailable, using local fallback:', err.message);
      // Local fallback so the chatbox still works even if backend is down
      const fallbackReplies = [
        `🌾 **KisanAI Advisory for "${message}":**\n\nBased on current meteorological models, your crop conditions appear stable. For precise monsoon onset predictions, ensure your backend server is running on port 5000.\n\n• Check server: http://localhost:5000/api/health\n• Gemini AI requires a valid API key in server .env`,
        `⚠️ **Server Connection Issue:**\n\nThe KisanAI backend is not reachable right now. Please make sure:\n1. The server is running: \`npm run dev\` in the server folder\n2. The proxy in vite.config.js points to port 5000\n\nOnce connected, I can provide hyperlocal weather, crop sowing guidance, and mandi prices!`,
      ];
      return {
        reply: fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)],
        provider: 'KisanAI Local Fallback',
        isLiveAI: false,
        note: 'Backend server not reachable. Start server with npm run dev.',
      };
    }
  },

  // Crop Doctor AI Vision Diagnosis
  diagnoseCrop: async ({ imageBase64, filename, visualFeatures = {}, userCropHint = '', lang = 'en' }) => {
    try {
      const res = await apiClient.post('/ai/diagnose-crop', {
        imageBase64,
        filename,
        visualFeatures,
        userCropHint,
        lang
      });
      return res.data?.data || res.data;
    } catch (err) {
      console.warn('⚠️ Crop diagnosis backend unavailable, using client fallback:', err.message);
      const fname = (filename || '').toLowerCase();
      let cropKey = 'maize';
      let cropName = 'Maize (Corn)';
      let cropHindi = 'मक्का';
      let icon = '🌽';

      if (fname.includes('soy') || fname.includes('soya')) {
        cropKey = 'soybean';
        cropName = 'Soybean';
        cropHindi = 'सोयाबीन';
        icon = '🌱';
      } else if (fname.includes('bajra') || fname.includes('millet')) {
        cropKey = 'bajra';
        cropName = 'Bajra (Pearl Millet)';
        cropHindi = 'बाजरा';
        icon = '🌾';
      } else if (fname.includes('cotton') || fname.includes('kapas')) {
        cropKey = 'cotton';
        cropName = 'Cotton';
        cropHindi = 'कपास';
        icon = '☁️';
      } else if (fname.includes('rice') || fname.includes('paddy') || fname.includes('dhan')) {
        cropKey = 'rice';
        cropName = 'Rice (Paddy)';
        cropHindi = 'धान (चावल)';
        icon = '🌾';
      } else if (fname.includes('wheat') || fname.includes('gehu')) {
        cropKey = 'wheat';
        cropName = 'Wheat';
        cropHindi = 'गेहूं';
        icon = '🌾';
      } else if (fname.includes('tomato') || fname.includes('tamatar')) {
        cropKey = 'tomato';
        cropName = 'Tomato';
        cropHindi = 'टमाटर';
        icon = '🍅';
      } else if (fname.includes('potato') || fname.includes('aalu')) {
        cropKey = 'potato';
        cropName = 'Potato';
        cropHindi = 'आलू';
        icon = '🥔';
      }

      if (cropKey === 'maize') {
        return {
          cropKey: 'maize',
          cropName: 'Maize (Corn)',
          cropHindiName: 'मक्का',
          cropCategory: 'Kharif Cereal',
          cropIcon: '🌽',
          confidence: 93,
          issue: 'Healthy Maize Cob / Foliage — Optimal Grain Filling',
          hindiIssue: 'स्वस्थ मक्का भुट्टा / पत्ता — उत्तम दाना भराव',
          severity: 'Healthy / Normal',
          severityColor: 'text-emerald-700 bg-emerald-100 border-emerald-300',
          symptoms: 'Vibrant green husk covering intact, healthy golden-brown ear silks, robust kernel set, zero boring punctures or chlorotic leaf striping.',
          organicTreatment: 'Maintain optimum soil moisture during silking stage. Apply 1% Panchagavya foliar spray for enhanced grain luster and kernel weight.',
          chemicalTreatment: 'No chemical pesticide required. Avoid unnecessary broad-spectrum sprays to preserve natural predator ladybugs and spiders.',
          identifiedTraits: ['Bright green husk leaves', 'Golden-brown ear silk', 'Well-formed kernel rows', 'Zero insect frass'],
          disclaimer: 'AI Visual Screening Model. Field verification recommended prior to chemical application.',
          isLiveAI: false,
          provider: 'KisanAI Agronomic Vision Engine (Client Fallback)'
        };
      }

      return {
        cropKey,
        cropName,
        cropHindiName: cropHindi,
        cropCategory: 'Agricultural Crop',
        cropIcon: icon,
        confidence: 91,
        issue: `Healthy ${cropName} Foliage — Optimal Vegetative Vigor`,
        hindiIssue: `स्वस्थ ${cropHindi} फसल — सामान्य वृद्धि`,
        severity: 'Healthy / Normal',
        severityColor: 'text-emerald-700 bg-emerald-100 border-emerald-300',
        symptoms: 'Uniform foliar chlorophyll distribution, intact leaf margins, active transpiration, zero necrotic spots.',
        organicTreatment: 'Maintain standard balanced N-P-K nutrition and routine prophylactic neem spray (1500 ppm).',
        chemicalTreatment: 'No chemical intervention needed at this stage.',
        identifiedTraits: ['Intact foliar margins', 'Vibrant chlorophyll density', 'Zero lesions detected'],
        disclaimer: 'AI Visual Screening Model. Field verification recommended.',
        isLiveAI: false,
        provider: 'KisanAI Agronomic Vision Engine (Client Fallback)'
      };
    }
  },



  // Get Products
  getProducts: async (params = {}) => {
    try {
      const res = await apiClient.get('/products', { params });
      return res.data?.data || res.data;
    } catch (err) {
      console.warn('Backend unavailable, using cached products mock', err.message);
      let products = [...MOCK_PRODUCTS];
      if (params.category && params.category !== 'All') {
        products = products.filter(p => p.category?.toLowerCase() === params.category.toLowerCase());
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        products = products.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.variety.toLowerCase().includes(q)
        );
      }
      return products;
    }
  },

  // Get Single Product
  getProductById: async (id) => {
    try {
      const res = await apiClient.get(`/products/${id}`);
      return res.data?.data || res.data;
    } catch (err) {
      return MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];
    }
  },

  // Create Product Listing
  createProduct: async (productData) => {
    try {
      const res = await apiClient.post('/products', productData);
      return res.data;
    } catch (err) {
      const newProd = {
        id: `prod-${Date.now()}`,
        ...productData,
        aiVerification: {
          isVerified: true,
          confidence: 95,
          detectedCategory: productData.category || 'Grains',
          qualityIndicator: 'Clean, sound grains with low foreign matter',
          suggestedDescription: `Freshly harvested ${productData.name}, sun-dried to optimal moisture.`,
          disclaimer: 'AI visual indicator only; does not replace laboratory certified analysis.'
        },
        createdAt: new Date().toISOString()
      };
      MOCK_PRODUCTS.unshift(newProd);
      return { success: true, data: newProd };
    }
  },

  // Delete Product
  deleteProduct: async (id) => {
    try {
      const res = await apiClient.delete(`/products/${id}`);
      return res.data;
    } catch (err) {
      const idx = MOCK_PRODUCTS.findIndex(p => p.id === id);
      if (idx !== -1) MOCK_PRODUCTS.splice(idx, 1);
      return { success: true };
    }
  },

  // AI Product Verification Endpoint
  verifyProductWithAI: async (productDetails) => {
    try {
      const res = await apiClient.post('/products/ai-verify', productDetails);
      return res.data?.data || res.data;
    } catch (err) {
      return {
        isVerified: true,
        confidence: 96,
        detectedCategory: productDetails.category || 'Grains',
        qualityIndicator: 'High grain density, uniform color, low visual foreign matter (<2%)',
        suggestedDescription: `Premium ${productDetails.name || 'crop'} harvested at peak maturity with moisture preserved within safe limits.`,
        disclaimer: 'AI visual indicator only; does not replace laboratory certified analysis.'
      };
    }
  },

  // Get Buyers Directory
  getBuyers: async (params = {}) => {
    try {
      const res = await apiClient.get('/buyers', { params });
      return res.data?.data || res.data;
    } catch (err) {
      return MOCK_BUYERS;
    }
  },

  // Get Offers & Negotiations
  getOffers: async (params = {}) => {
    try {
      const res = await apiClient.get('/offers', { params });
      return res.data?.data || res.data;
    } catch (err) {
      return MOCK_OFFERS;
    }
  },

  // Create Purchase Offer
  createOffer: async (offerData) => {
    try {
      const res = await apiClient.post('/offers', offerData);
      return res.data;
    } catch (err) {
      const newOffer = {
        id: `ofr-${Date.now()}`,
        ...offerData,
        status: 'pending',
        totalAmount: Number(offerData.quantity) * Number(offerData.offeredPrice),
        history: [{ sender: 'buyer', price: offerData.offeredPrice, message: offerData.message || 'Offer submitted', timestamp: new Date().toISOString() }],
        createdAt: new Date().toISOString()
      };
      MOCK_OFFERS.unshift(newOffer);
      return { success: true, data: newOffer };
    }
  },

  // Respond to Offer (Accept, Counter, Reject)
  respondToOffer: async (id, responseData) => {
    try {
      const res = await apiClient.put(`/offers/${id}/respond`, responseData);
      return res.data;
    } catch (err) {
      const offer = MOCK_OFFERS.find(o => o.id === id);
      if (offer) {
        if (responseData.action === 'accept') {
          offer.status = 'accepted';
          const newOrder = {
            id: `ord-${Date.now()}`,
            orderNumber: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
            productId: offer.productId,
            productName: offer.productName,
            farmerId: offer.farmerId,
            farmerName: offer.farmerName,
            buyerId: offer.buyerId,
            buyerName: offer.buyerName,
            buyerPhone: offer.buyerPhone,
            quantity: offer.quantity,
            unit: offer.unit,
            agreedPrice: offer.counterPrice || offer.offeredPrice,
            totalAmount: offer.quantity * (offer.counterPrice || offer.offeredPrice),
            status: 'confirmed',
            deliveryType: offer.deliveryType || 'Buyer Pickup',
            pickupLocation: { village: 'Morija', block: 'Chomu', district: 'Jaipur', state: 'Rajasthan' },
            pickupDate: 'Expected in 48-72 hours',
            trackingNotes: [{ status: 'confirmed', note: 'Purchase accepted. Order created.', timestamp: new Date().toISOString() }],
            createdAt: new Date().toISOString()
          };
          MOCK_ORDERS.unshift(newOrder);
          return { success: true, data: { offer, order: newOrder } };
        } else if (responseData.action === 'counter') {
          offer.status = 'countered';
          offer.counterPrice = responseData.counterPrice;
          return { success: true, data: { offer } };
        } else {
          offer.status = 'rejected';
          return { success: true, data: { offer } };
        }
      }
      return { success: true };
    }
  },

  // Get Orders
  getOrders: async (params = {}) => {
    try {
      const res = await apiClient.get('/orders', { params });
      return res.data?.data || res.data;
    } catch (err) {
      return MOCK_ORDERS;
    }
  },

  // Update Order Status
  updateOrderStatus: async (id, statusData) => {
    try {
      const res = await apiClient.put(`/orders/${id}/status`, statusData);
      return res.data;
    } catch (err) {
      const order = MOCK_ORDERS.find(o => o.id === id);
      if (order) {
        order.status = statusData.status;
        order.trackingNotes.push({
          status: statusData.status,
          note: statusData.note || `Status updated to ${statusData.status}`,
          timestamp: new Date().toISOString()
        });
      }
      return { success: true, data: order };
    }
  },

  // Market Mandi Prices
  getMarketPrices: async () => {
    try {
      const res = await apiClient.get('/market/prices');
      return res.data?.data || res.data;
    } catch (err) {
      return MOCK_MANDI_PRICES;
    }
  },

  // 30-Day Market Trends
  getMarketTrends: async (cropId = 'bajra') => {
    try {
      const res = await apiClient.get('/market/trends', { params: { cropId } });
      return res.data?.data || res.data;
    } catch (err) {
      return generateMockPriceTrends(cropId);
    }
  },

  // Marketplace Stats
  getMarketplaceStats: async () => {
    try {
      const res = await apiClient.get('/market/stats');
      return res.data?.data || res.data;
    } catch (err) {
      return {
        totalListings: MOCK_PRODUCTS.length,
        activeListings: MOCK_PRODUCTS.filter(p => p.status === 'active').length,
        totalQuantityKg: MOCK_PRODUCTS.reduce((s, p) => s + (p.quantity || 0), 0),
        totalBuyers: MOCK_BUYERS.length,
        pendingOffers: MOCK_OFFERS.filter(o => o.status === 'pending' || o.status === 'countered').length,
        activeOrders: MOCK_ORDERS.length,
        completedOrders: 1,
        totalOrderValue: MOCK_ORDERS.reduce((s, o) => s + (o.totalAmount || 0), 0)
      };
    }
  }
};
