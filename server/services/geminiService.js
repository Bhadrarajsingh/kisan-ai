import axios from 'axios';

// ── System prompt for KisanAI assistant ─────────────────────────────────────
const SYSTEM_PROMPT = `You are KisanAI, an expert AI agricultural assistant for Indian farmers. You are warm, helpful, and speak like a knowledgeable agricultural extension officer who genuinely cares about farmers.

Your capabilities:
- Hyperlocal monsoon and weather intelligence (onset probability, dry spells, heavy rain risk)
- Crop-specific sowing, irrigation, and pest management advisory
- Mandi price intelligence and farm-to-market guidance
- Climate signal interpretation (ENSO, IOD, MJO)
- Soil moisture and fertilizer recommendations

Rules:
- Answer the EXACT question asked. If someone says "hi" or casual greetings, greet them back warmly and ask how you can help.
- Keep responses concise — use bullet points for clarity, suitable for mobile reading.
- When asked in Hindi (Devanagari), reply entirely in simple, polite Hindi.
- Always use the actual numbers from the meteorological context provided.
- Never invent data — always base forecasts on provided probabilities.
- If the question is unrelated to agriculture/weather, politely note your focus areas and offer to help with farming questions.
- For general questions like "what is soybean?" answer accurately and then connect it to farming context.`;

/**
 * Generate agricultural advisory response using Gemini AI via @google/genai SDK
 */
export const askKisanAI = async ({
  message,
  conversationHistory = [],
  context = {}
}) => {
  const {
    location = 'Chomu Panchayat, Jaipur, Rajasthan',
    crop = 'Soybean',
    onsetProbability = 78,
    drySpellProbability = 24,
    heavyRainProbability = 38,
    confidence = 72,
    recentRainfall = 45,
    rainfallProbability = 76,
    temperature = 29,
    humidity = 74,
    climateSignals = {
      enso: 'Neutral (-0.4)',
      iod: 'Positive (+0.5)',
      mjo: 'Phase 4, Amplitude 1.2'
    },
    marketplace = {
      cropMandiPrice: '₹24.50/kg',
      mspBenchmark: '₹25.00/kg',
      mandiTrend: 'stable',
      nearbyBuyersCount: 8,
      topBuyerNames: ['ABC Grain Traders', 'Malwa Agro Processors'],
      totalListingsActive: 6
    }
  } = context;

  const apiKey = (process.env.GROQ_API_KEY || '').trim();
  const isKeyConfigured = apiKey.startsWith('gsk_');

  // Detect Hindi language intent
  const isHindi = /[\u0900-\u097F]/.test(message) ||
    message.toLowerCase().includes('hindi') ||
    message.toLowerCase().includes('हिंदी');

  // Build meteorological + market context string
  const contextBlock = `
[CURRENT FARM & WEATHER CONTEXT]
Location: ${location}
Crop: ${crop}
Monsoon Onset Probability: ${onsetProbability}%
Dry Spell Probability: ${drySpellProbability}%
Heavy Rainfall Probability: ${heavyRainProbability}%
Model Confidence: ${confidence}%
Recent 7-Day Rainfall: ${recentRainfall} mm
Expected Rainfall (7-Day): ${rainfallProbability}%
Temperature: ${temperature}°C | Humidity: ${humidity}%
ENSO: ${climateSignals.enso} | IOD: ${climateSignals.iod} | MJO: ${climateSignals.mjo}
Mandi Price (${crop}): ${marketplace.cropMandiPrice} | MSP: ${marketplace.mspBenchmark} | Trend: ${marketplace.mandiTrend}
Active Nearby Buyers: ${marketplace.nearbyBuyersCount} (${marketplace.topBuyerNames.join(', ')})
[END CONTEXT]

User message: "${message}"
`;

  // ── Try Groq (Llama 3) via REST API ───────────
  if (isKeyConfigured) {
    try {
      const messages = [{ role: 'system', content: SYSTEM_PROMPT }];
      
      const recentHistory = conversationHistory.slice(-8);
      for (const turn of recentHistory) {
        if (turn.role && turn.content) {
          messages.push({
            role: turn.role === 'user' ? 'user' : 'assistant',
            content: turn.content
          });
        }
      }
      messages.push({ role: 'user', content: contextBlock });

      const requestBody = {
        model: 'openai/gpt-oss-20b',
        messages,
        temperature: 0.5,
        max_tokens: 800
      };

      const url = 'https://api.groq.com/openai/v1/chat/completions';
      const response = await axios.post(url, requestBody, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        timeout: 12000
      });
      
      const text = response.data?.choices?.[0]?.message?.content;
      if (text && text.trim().length > 0) {
        console.log(`✅ Groq LIVE response from gpt-oss-20b`);
        return {
          reply: text.trim(),
          provider: `Groq (GPT OSS 20B)`,
          isLiveAI: true,
          contextSnapshot: { location, crop, onsetProbability, drySpellProbability }
        };
      }
    } catch (err) {
      console.warn(`⚠️  Groq REST error: ${err.response?.data?.error?.message || err.message}`);
    }
  } else {
    if (!apiKey) console.warn('⚠️  GROQ_API_KEY not set in .env.');
    else console.warn(`⚠️  GROQ_API_KEY format unrecognized (starts with: ${apiKey.slice(0,6)}). Use gsk_... key from console.groq.com`);
  }

  // ── Smart Conversational Fallback ─────────────────────────────────────────
  // This handles any message intelligently without Gemini
  console.log('ℹ️  Using smart conversational fallback engine');
  const reply = generateConversationalFallback({
    message,
    isHindi,
    location,
    crop,
    onsetProbability,
    drySpellProbability,
    heavyRainProbability,
    confidence,
    recentRainfall,
    rainfallProbability,
    temperature,
    humidity,
    climateSignals,
    marketplace
  });

  return {
    reply,
    provider: 'KisanAI Intelligence Engine',
    isLiveAI: false,
    contextSnapshot: { location, crop, onsetProbability, drySpellProbability }
  };
};

/**
 * Conversational fallback engine — understands what the user is actually asking
 * and gives relevant, data-driven replies for any question.
 */
function generateConversationalFallback({
  message,
  isHindi,
  location,
  crop,
  onsetProbability,
  drySpellProbability,
  heavyRainProbability,
  confidence,
  recentRainfall,
  rainfallProbability,
  temperature,
  humidity,
  climateSignals,
  marketplace
}) {
  const q = message.toLowerCase().trim();

  // ── GREETINGS ───────────────────────────────────────────────────────────────
  const greetings = ['hi', 'hello', 'hey', 'hii', 'helo', 'hyy', 'hyyy', 'hai', 'हाय', 'नमस्ते', 'नमस्कार', 'हेलो', 'good morning', 'good evening', 'good afternoon', 'sup', 'yo'];
  if (greetings.some(g => q === g || q.startsWith(g + ' ') || q.endsWith(' ' + g))) {
    if (isHindi || q.includes('नमस्')) {
      return `🙏 **नमस्ते! मैं KisanAI हूँ।**\n\n` +
        `मैं आपका कृषि सहायक हूँ। आज **${location}** में:\n` +
        `• मानसून सक्रियता: **${onsetProbability}%**\n` +
        `• तापमान: **${temperature}°C** | आर्द्रता: **${humidity}%**\n\n` +
        `आप मुझसे क्या जानना चाहते हैं? बुवाई, मौसम, मंडी भाव, या कुछ और? 🌾`;
    }
    return `👋 **Hello! I'm KisanAI, your farm assistant.**\n\n` +
      `Today in **${location}**:\n` +
      `• Monsoon onset probability: **${onsetProbability}%**\n` +
      `• Temperature: **${temperature}°C** | Humidity: **${humidity}%**\n` +
      `• ${crop} crop conditions: **${onsetProbability >= 65 ? 'Favorable' : 'Monitor closely'}**\n\n` +
      `How can I help you today? Ask me about rain, sowing, irrigation, mandi prices, or crop advice! 🌾`;
  }

  // ── HOW ARE YOU / GENERAL CHAT ───────────────────────────────────────────
  if (q.includes('how are you') || q.includes('how r u') || q.includes('kaise ho') || q.includes('कैसे हो')) {
    if (isHindi) {
      return `😊 मैं बिल्कुल ठीक हूँ, धन्यवाद! आपके खेत की चिंता मुझे रखती है।\n\n**${location}** में आज का हाल:\n• तापमान: ${temperature}°C | नमी: ${humidity}%\n• ${crop} के लिए स्थिति ${onsetProbability >= 65 ? 'अनुकूल है ✅' : 'निगरानी में रखें ⚠️'}\n\nकोई सवाल हो तो पूछें!`;
    }
    return `😊 I'm doing great, thanks for asking! I'm always here monitoring your farm conditions.\n\nCurrently in **${location}**: ${temperature}°C, ${humidity}% humidity, ${crop} outlook is **${onsetProbability >= 65 ? 'favorable ✅' : 'needs monitoring ⚠️'}**.\n\nWhat can I help you with today?`;
  }

  // ── RAIN / BAARISH ───────────────────────────────────────────────────────
  if (q.includes('rain') || q.includes('baarish') || q.includes('barish') || q.includes('बारिश') || q.includes('वर्षा') || q.includes('rainfall') || q.includes('monsoon') || q.includes('मानसून')) {
    if (isHindi) {
      return `🌧️ **${location} - वर्षा पूर्वानुमान:**\n\n` +
        `• **मानसून सक्रियता:** ${onsetProbability}% संभावना (मॉडल विश्वास: ${confidence}%)\n` +
        `• **अगले 7 दिन:** वर्षा की संभावना **${rainfallProbability}%**\n` +
        `• **पिछले 7 दिन:** ${recentRainfall} मिमी वर्षा\n` +
        `• **भारी बारिश जोखिम:** ${heavyRainProbability}%\n` +
        `• **सूखा जोखिम:** ${drySpellProbability}%\n\n` +
        `${onsetProbability >= 70 ? '✅ मानसून अच्छी स्थिति में है।' : '⚠️ मानसून अनिश्चित है, सतर्क रहें।'}`;
    }
    return `🌧️ **Rainfall Forecast for ${location}:**\n\n` +
      `• **Monsoon Onset Probability:** ${onsetProbability}% (Confidence: ${confidence}%)\n` +
      `• **Next 7-Day Rainfall Probability:** ${rainfallProbability}%\n` +
      `• **Last 7-Day Rainfall:** ${recentRainfall} mm\n` +
      `• **Heavy Rain Risk:** ${heavyRainProbability}%\n` +
      `• **Dry Spell Risk:** ${drySpellProbability}%\n\n` +
      `${onsetProbability >= 70 ? '✅ Monsoon conditions are favorable.' : '⚠️ Monsoon is uncertain — monitor daily.'}`;
  }

  // ── SOWING / BUWAI ───────────────────────────────────────────────────────
  if (q.includes('sow') || q.includes('buwai') || q.includes('बुवाई') || q.includes('plant') || q.includes('seed') || q.includes('बीज') || q.includes('लगाना')) {
    const favorable = onsetProbability >= 70 && drySpellProbability <= 35;
    if (isHindi) {
      return `🌱 **${crop} बुवाई सलाह (${location}):**\n\n` +
        `• मानसून सक्रियता: **${onsetProbability}%** | सूखा जोखिम: **${drySpellProbability}%**\n` +
        `• **निर्णय: ${favorable ? '✅ बुवाई के लिए अनुकूल समय' : '⚠️ बुवाई में थोड़ी प्रतीक्षा करें'}**\n\n` +
        `${favorable ? '• खेत में 50-75 मिमी नमी की पुष्टि करके बुवाई शुरू करें।\n• बीजोपचार (ट्राइकोडर्मा) अवश्य करें।' :
          `• सूखे का जोखिम ${drySpellProbability}% है — बारिश की पुष्टि होने पर ही बुवाई करें।\n• सिंचाई का बैकअप तैयार रखें।`}`;
    }
    return `🌱 **${crop} Sowing Advisory for ${location}:**\n\n` +
      `• Onset Probability: **${onsetProbability}%** | Dry Spell Risk: **${drySpellProbability}%**\n` +
      `• **Decision: ${favorable ? '✅ Favorable for sowing now' : '⚠️ Wait for more reliable rainfall'}**\n\n` +
      `${favorable ?
        `• Confirm 50–70 mm soil moisture depth before sowing.\n• Apply fungicide seed treatment (Trichoderma / Thiram).\n• Best sowing window: next 3–5 days if moisture holds.` :
        `• Dry spell risk at ${drySpellProbability}% — delay rainfed sowing.\n• Prepare supplemental irrigation backup.\n• Monitor rainfall for next 48–72 hours before deciding.`}`;
  }

  // ── IRRIGATION / SINCHAI ─────────────────────────────────────────────────
  if (q.includes('irrig') || q.includes('sinchai') || q.includes('सिंचाई') || q.includes('water') || q.includes('पानी') || q.includes('drip')) {
    if (isHindi) {
      return `💧 **सिंचाई सलाह (${location} - ${crop}):**\n\n` +
        `• **वर्तमान आर्द्रता:** ${humidity}% | तापमान: ${temperature}°C\n` +
        `• **अगले 7 दिन वर्षा:** ${rainfallProbability}% संभावना\n\n` +
        `${rainfallProbability >= 60 ? '✅ अगले कुछ दिनों में अच्छी बारिश की संभावना है। सिंचाई को 3-4 दिन टाल सकते हैं।' :
          `⚠️ बारिश अनिश्चित है। ${temperature >= 30 ? 'अधिक तापमान के कारण' : ''} हल्की सिंचाई करें।`}\n\n` +
        `• ड्रिप सिंचाई: सुबह 6-8 बजे या शाम को करें।\n• बाढ़ सिंचाई से बचें — नमी का नुकसान होता है।`;
    }
    return `💧 **Irrigation Advisory for ${crop} in ${location}:**\n\n` +
      `• Humidity: ${humidity}% | Temperature: ${temperature}°C\n` +
      `• Rainfall next 7 days: **${rainfallProbability}% probability**\n\n` +
      `${rainfallProbability >= 60 ?
        `✅ Good rain expected — you can **skip irrigation for 3–4 days** and save water.\n• Monitor soil moisture before deciding.` :
        `⚠️ Rain is uncertain. **Light irrigation recommended** in the next 24–36 hours.\n• Apply at root zone depth only (5–8 cm).`}\n\n` +
      `• Best timing: early morning (5–8 AM) or evening to minimize evaporation.\n• Avoid overhead irrigation if heavy rain risk (${heavyRainProbability}%) is high.`;
  }

  // ── PESTICIDE / SPRAY / KEETNASHAK ──────────────────────────────────────
  if (q.includes('pest') || q.includes('spray') || q.includes('keetnashak') || q.includes('कीटनाशक') || q.includes('fungic') || q.includes('disease') || q.includes('बीमारी') || q.includes('कीट')) {
    if (isHindi) {
      return `🧪 **कीटनाशक/स्प्रे सलाह (${location}):**\n\n` +
        `• **स्प्रे के लिए मौसम:** ${humidity > 80 || heavyRainProbability > 50 ? '⚠️ अभी नहीं — आर्द्रता अधिक है / बारिश संभव' : '✅ उपयुक्त है'}\n` +
        `• आर्द्रता: ${humidity}% | भारी बारिश जोखिम: ${heavyRainProbability}%\n\n` +
        `**सामान्य सलाह:**\n` +
        `• स्प्रे सुबह 7-10 बजे या शाम 4-6 बजे करें।\n` +
        `• बारिश से 6 घंटे पहले और बाद में स्प्रे न करें।\n` +
        `• ${humidity > 80 ? 'उच्च आर्द्रता में फंगल रोग का खतरा — मैन्कोजेब या कॉपर ऑक्सीक्लोराइड का उपयोग करें।' : 'मौसम ठीक है, नियमित IPM कार्यक्रम जारी रखें।'}`;
    }
    return `🧪 **Spray & Pest Management Advisory for ${location}:**\n\n` +
      `• **Spray Conditions:** ${humidity > 80 || heavyRainProbability > 50 ? '⚠️ NOT ideal — high humidity / rain expected' : '✅ Good conditions for spraying'}\n` +
      `• Humidity: ${humidity}% | Heavy Rain Risk: ${heavyRainProbability}%\n\n` +
      `**Recommendations:**\n` +
      `• Spray timing: 7–10 AM or 4–6 PM (avoid midday heat).\n` +
      `• Do NOT spray within 6 hours before/after rain.\n` +
      `• ${humidity > 80 ? `High humidity (${humidity}%) increases fungal risk — apply Mancozeb or Copper Oxychloride preventively.` : 'Weather is suitable — proceed with your scheduled IPM program.'}`;
  }

  // ── MANDI / PRICE / SELL / MARKET ────────────────────────────────────────
  if (q.includes('price') || q.includes('mandi') || q.includes('sell') || q.includes('market') || q.includes('buyer') || q.includes('भाव') || q.includes('मंडी') || q.includes('बेचना') || q.includes('rate') || q.includes('रेट')) {
    if (isHindi) {
      return `🛒 **${crop} मंडी बाजार (${location}):**\n\n` +
        `• **वर्तमान मंडी भाव:** ${marketplace.cropMandiPrice}\n` +
        `• **सरकारी MSP:** ${marketplace.mspBenchmark}\n` +
        `• **बाजार रुख:** ${marketplace.mandiTrend === 'upward' ? '📈 तेजी (+2-3%)' : marketplace.mandiTrend === 'downward' ? '📉 गिरावट' : '➡️ स्थिर'}\n` +
        `• **निकट खरीदार:** ${marketplace.nearbyBuyersCount} सत्यापित खरीदार उपलब्ध\n` +
        `  (${marketplace.topBuyerNames.join(', ')})\n\n` +
        `**सलाह:** नमी <12% सुनिश्चित करके KisanAI Marketplace पर लिस्ट करें और सीधे भाव पाएं।`;
    }
    return `🛒 **${crop} Market Intelligence (${location}):**\n\n` +
      `• **Current Mandi Price:** ${marketplace.cropMandiPrice}\n` +
      `• **MSP Benchmark:** ${marketplace.mspBenchmark}\n` +
      `• **Market Trend:** ${marketplace.mandiTrend === 'upward' ? '📈 Rising (+2-3%)' : marketplace.mandiTrend === 'downward' ? '📉 Falling' : '➡️ Stable'}\n` +
      `• **Active Nearby Buyers:** ${marketplace.nearbyBuyersCount} verified buyers\n` +
      `  (${marketplace.topBuyerNames.join(', ')})\n\n` +
      `**Tip:** List your produce on KisanAI Marketplace to get direct purchase offers and negotiate farm-gate prices above mandi rates.`;
  }

  // ── FERTILIZER / UREA / NUTRIENT ─────────────────────────────────────────
  if (q.includes('fertiliz') || q.includes('urea') || q.includes('khad') || q.includes('खाद') || q.includes('nutrient') || q.includes('npk') || q.includes('dap')) {
    if (isHindi) {
      return `🌿 **${crop} उर्वरक सलाह (${location}):**\n\n` +
        `• **बारिश की स्थिति:** ${recentRainfall} मिमी (7 दिन) | आर्द्रता: ${humidity}%\n\n` +
        `**उर्वरक डालने का सही समय:**\n` +
        `• ${rainfallProbability > 60 ? '⚠️ बारिश की उम्मीद है — यूरिया/DAP अभी न डालें, बह जाएगा।' : '✅ मौसम ठीक है — उर्वरक डाल सकते हैं।'}\n` +
        `• बारिश से 2-3 दिन पहले या बाद में उर्वरक डालें।\n` +
        `• जड़ के पास मिट्टी में मिलाएं, पत्तियों पर न डालें।`;
    }
    return `🌿 **${crop} Fertilizer Advisory (${location}):**\n\n` +
      `• **Conditions:** ${recentRainfall}mm rainfall (7 days) | Humidity: ${humidity}%\n\n` +
      `**Best Time to Apply:**\n` +
      `• ${rainfallProbability > 60 ? `⚠️ Rain expected (${rainfallProbability}%) — DELAY fertilizer application to avoid runoff loss.` : '✅ Weather suitable — go ahead with planned fertilizer application.'}\n` +
      `• Apply 2–3 days before or after a rain event for best absorption.\n` +
      `• Incorporate into soil near root zone — avoid foliar application in high humidity.`;
  }

  // ── TEMPERATURE / WEATHER CONDITIONS ────────────────────────────────────
  if (q.includes('temp') || q.includes('hot') || q.includes('cold') || q.includes('weather') || q.includes('गर्मी') || q.includes('ठंड') || q.includes('तापमान') || q.includes('मौसम')) {
    if (isHindi) {
      return `🌡️ **${location} - मौसम की स्थिति:**\n\n` +
        `• **तापमान:** ${temperature}°C ${temperature > 35 ? '(बहुत गर्म ⚠️)' : temperature > 30 ? '(गर्म)' : '(सामान्य ✅)'}\n` +
        `• **आर्द्रता:** ${humidity}%\n` +
        `• **पिछले 7 दिन बारिश:** ${recentRainfall} मिमी\n\n` +
        `**${crop} पर प्रभाव:**\n` +
        `${temperature > 35 ? '• अत्यधिक गर्मी से फूल झड़ सकते हैं। सुबह सिंचाई करें।' : temperature > 30 ? '• मध्यम गर्मी सामान्य है। नमी बनाए रखें।' : '• तापमान अनुकूल है — फसल वृद्धि के लिए उपयुक्त।'}`;
    }
    return `🌡️ **Weather Conditions in ${location}:**\n\n` +
      `• **Temperature:** ${temperature}°C ${temperature > 35 ? '(Very Hot ⚠️)' : temperature > 30 ? '(Warm)' : '(Normal ✅)'}\n` +
      `• **Humidity:** ${humidity}%\n` +
      `• **Last 7-Day Rainfall:** ${recentRainfall} mm\n\n` +
      `**Impact on ${crop}:**\n` +
      `${temperature > 35 ?
        `• High heat stress — flower/pod drop risk. Irrigate early morning.\n• Avoid spraying in midday heat.` :
        temperature > 30 ?
          `• Warm but manageable. Maintain soil moisture to offset evapotranspiration.` :
          `• Optimal temperature for ${crop} growth and development.`}`;
  }

  // ── THANK YOU ───────────────────────────────────────────────────────────
  if (q.includes('thank') || q.includes('thanks') || q.includes('shukriya') || q.includes('dhanyawad') || q.includes('शुक्रिया') || q.includes('धन्यवाद') || q.includes('ok') || q.includes('okay') || q.includes('good') || q.includes('nice') || q.includes('great')) {
    if (isHindi) {
      return `🙏 **आपका स्वागत है!**\n\nमुझे खुशी है कि मैं आपकी मदद कर सका। ${location} में आपकी ${crop} की फसल अच्छी रहे! कभी भी कोई सवाल हो — मैं यहाँ हूँ। 🌾`;
    }
    return `😊 **You're welcome!**\n\nHappy to help! Wishing you a great harvest for your ${crop} in ${location}. Feel free to ask anything anytime — I'm always here! 🌾`;
  }

  // ── WHAT CAN YOU DO / HELP ───────────────────────────────────────────────
  if (q.includes('help') || q.includes('मदद') || q.includes('what can') || q.includes('kya kar') || q.includes('features') || q.includes('क्या कर')) {
    if (isHindi) {
      return `🤖 **KisanAI आपकी कैसे मदद कर सकता है:**\n\n` +
        `• 🌧️ **मौसम पूर्वानुमान** — बारिश, सूखा, भारी वर्षा जोखिम\n` +
        `• 🌱 **बुवाई सलाह** — सही समय और मिट्टी की नमी\n` +
        `• 💧 **सिंचाई मार्गदर्शन** — कब और कितना पानी\n` +
        `• 🧪 **कीटनाशक/उर्वरक** — सुरक्षित उपयोग समय\n` +
        `• 🛒 **मंडी भाव** — ताज़ा कीमत और खरीदार जानकारी\n` +
        `• 🌐 **जलवायु संकेत** — ENSO, IOD, MJO विश्लेषण\n\n` +
        `बस अपना सवाल पूछें! 😊`;
    }
    return `🤖 **KisanAI can help you with:**\n\n` +
      `• 🌧️ **Weather Forecasts** — Rain, dry spell, heavy rainfall risk\n` +
      `• 🌱 **Sowing Guidance** — Optimal timing and soil moisture\n` +
      `• 💧 **Irrigation Advisory** — When and how much to water\n` +
      `• 🧪 **Pesticide/Fertilizer** — Safe application timing\n` +
      `• 🛒 **Mandi Prices** — Live rates and verified buyers\n` +
      `• 🌐 **Climate Signals** — ENSO, IOD, MJO analysis\n\n` +
      `Just ask your question in any language! 😊`;
  }

  // ── DEFAULT: Ask what they need (don't give generic agricultural briefing) ──
  const shortQuery = message.length < 20;
  if (isHindi) {
    return `🤔 **"${message}" के बारे में:**\n\n` +
      `${shortQuery ? 'क्षमा करें, मैं आपका सवाल पूरी तरह नहीं समझ पाया।' : `मुझे "${message}" के बारे में और जानकारी चाहिए।`}\n\n` +
      `**${location}** में आज:\n` +
      `• मानसून: ${onsetProbability}% | तापमान: ${temperature}°C\n\n` +
      `क्या आप बुवाई, बारिश, सिंचाई, कीटनाशक, या मंडी भाव के बारे में पूछना चाहते हैं? 🌾`;
  }
  return `🤔 **Regarding "${message}":**\n\n` +
    `${shortQuery ? 'Could you elaborate a bit? I want to give you the most accurate advice.' : `Let me help you with "${message}".`}\n\n` +
    `**Current conditions in ${location}:** Onset ${onsetProbability}%, Temp ${temperature}°C, Humidity ${humidity}%\n\n` +
    `You can ask me about: **rain forecast**, **sowing timing**, **irrigation**, **mandi prices**, **pest control**, or **fertilizer advice**. 🌾`;
}

export const askMonsoonAI = askKisanAI;
