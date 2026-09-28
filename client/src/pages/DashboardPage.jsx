import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LocationSelector from '../components/common/LocationSelector';
import ForecastCard from '../components/dashboard/ForecastCard';
import ForecastTimeline from '../components/dashboard/ForecastTimeline';
import ClimateCard from '../components/dashboard/ClimateCard';
import WeatherCard from '../components/dashboard/WeatherCard';
import QuickAdvisoryBanner from '../components/dashboard/QuickAdvisoryBanner';
import CropSelector from '../components/advisory/CropSelector';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { 
  CloudRain, 
  Sun, 
  Waves, 
  ShieldCheck, 
  Sparkles, 
  RefreshCw,
  Info,
  Store,
  TrendingUp,
  ArrowRight,
  Building2,
  ShoppingBag,
  Bot,
  MapPin,
  Wind,
  Droplets,
  Thermometer,
  Satellite,
  FlaskConical,
  Camera,
  SlidersHorizontal,
  Wifi,
  WifiOff,
  CheckCircle2
} from 'lucide-react';

const DashboardPage = () => {
  const { forecast, selectedLocation, selectedCrop, isLoading, refreshData, openAIChatWithPrompt } = useApp();
  const { t, lang } = useLanguage();
  const { user } = useAuth();

  // Low Network Mode state
  const [isLowNetwork, setIsLowNetwork] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Just now');

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 900);
  };

  const getRiskLabel = (type, val) => {
    if (type === 'onset') return val >= 70 ? 'Favorable' : val >= 50 ? 'Moderate' : 'Delayed Risk';
    if (type === 'dry') return val >= 60 ? 'Elevated Risk' : val >= 30 ? 'Moderate' : 'Low Risk';
    if (type === 'heavy') return val >= 70 ? 'High / Flood Alert' : val >= 40 ? 'Moderate' : 'Normal';
    return 'Calibrated';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* 0. Low-Network Mode Banner & Sync Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2">
          {isLowNetwork ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              🟡 {lang === 'hi' ? 'सीमित नेटवर्क (कैश सक्रिय)' : 'Limited Network (Offline Cache Active)'}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              🟢 {lang === 'hi' ? 'ऑनलाइन नेटवर्क' : 'Online & Live Synced'}
            </span>
          )}
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            {lang === 'hi' ? `अंतिम सिंक: ${lastSyncTime} • प्रोफाइल, पूर्वानुमान, अलर्ट सुरक्षित हैं` : `Synced: ${lastSyncTime} • Advisory & alerts cached`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLowNetwork(!isLowNetwork)}
            className="text-[11px] font-bold text-slate-600 hover:text-slate-900 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            {isLowNetwork ? 'Switch to Online' : 'Simulate 2G/Offline'}
          </button>

          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-agri-50 text-agri-800 hover:bg-agri-100 border border-agri-200 rounded-lg text-xs font-bold transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-agri-600' : ''}`} />
            <span>{isSyncing ? (lang === 'hi' ? 'सिंक हो रहा है...' : 'Syncing...') : (lang === 'hi' ? 'डेटा सिंक' : 'Sync Data')}</span>
          </button>
        </div>
      </div>

      {/* 1. Farmer Command Center Top Section */}
      <div className="bg-gradient-to-br from-emerald-800 via-agri-900 to-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl border border-emerald-700/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        {/* Farmer Welcome & Local Real-time Weather Strip */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">👨‍🌾</span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {lang === 'hi' ? 'शुभ प्रभात, किसान भाई' : 'Good Morning, Farmer'} {user?.name ? user.name.split(' ')[0] : ''}
              </h1>
            </div>
            <div className="flex items-center gap-2 text-agri-200 text-xs sm:text-sm mt-1 font-semibold">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{selectedLocation?.panchayat || 'Jaitaran'}, {selectedLocation?.district || 'Pali'}, {selectedLocation?.state || 'Rajasthan'}</span>
              <span className="text-slate-400">•</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-400/30">
                Command Center
              </span>
            </div>
          </div>

          {/* Today's Weather Snapshot Strip */}
          <div className="flex items-center flex-wrap gap-3 sm:gap-4 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15">
            <div className="flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-[10px] text-slate-300 uppercase font-black">Today</div>
                <div className="text-sm font-extrabold text-white">29°C</div>
              </div>
            </div>
            <div className="h-6 w-px bg-white/15"></div>
            <div className="flex items-center gap-1.5">
              <CloudRain className="w-4 h-4 text-sky-400" />
              <div>
                <div className="text-[10px] text-slate-300 uppercase font-black">Rain</div>
                <div className="text-sm font-extrabold text-white">68%</div>
              </div>
            </div>
            <div className="h-6 w-px bg-white/15"></div>
            <div className="flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-300" />
              <div>
                <div className="text-[10px] text-slate-300 uppercase font-black">Humidity</div>
                <div className="text-sm font-extrabold text-white">72%</div>
              </div>
            </div>
            <div className="h-6 w-px bg-white/15"></div>
            <div className="flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-emerald-300" />
              <div>
                <div className="text-[10px] text-slate-300 uppercase font-black">Wind</div>
                <div className="text-sm font-extrabold text-white">14 km/h</div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Risk Cards specified in prompt: Rain Risk (72%), Crop Risk (Medium), Soil Moisture (48%), Market (8 Buyers) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 my-5">
          {/* Card 1: Rain Risk */}
          <div className="bg-white/10 hover:bg-white/15 border border-white/15 p-3.5 sm:p-4 rounded-2xl backdrop-blur-sm transition-all">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span className="flex items-center gap-1 font-bold">
                🌧️ {lang === 'hi' ? 'वर्षा जोखिम' : 'Rain Risk'}
              </span>
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">72%</div>
            <p className="text-[11px] text-rose-300 font-bold mt-1">
              {lang === 'hi' ? 'भारी वर्षा / जलभराव जोखिम' : 'Heavy Rainfall / Waterlogging Alert'}
            </p>
          </div>

          {/* Card 2: Crop Risk */}
          <div className="bg-white/10 hover:bg-white/15 border border-white/15 p-3.5 sm:p-4 rounded-2xl backdrop-blur-sm transition-all">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span className="flex items-center gap-1 font-bold">
                🌱 {lang === 'hi' ? 'फसल तनाव' : 'Crop Risk'}
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-300">Medium</div>
            <p className="text-[11px] text-slate-300 mt-1">
              {selectedCrop?.name || 'Bajra'} • {lang === 'hi' ? 'फूल आने की अवस्था' : 'Flowering Stage'}
            </p>
          </div>

          {/* Card 3: Soil Moisture */}
          <div className="bg-white/10 hover:bg-white/15 border border-white/15 p-3.5 sm:p-4 rounded-2xl backdrop-blur-sm transition-all">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span className="flex items-center gap-1 font-bold">
                💧 {lang === 'hi' ? 'मृदा नमी' : 'Soil Moisture'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-300">48%</div>
            <p className="text-[11px] text-slate-300 mt-1">
              Loamy Soil • {lang === 'hi' ? 'अनुकूलतम स्तर' : 'Optimal Capacity'}
            </p>
          </div>

          {/* Card 4: Market Buyers */}
          <div className="bg-white/10 hover:bg-white/15 border border-white/15 p-3.5 sm:p-4 rounded-2xl backdrop-blur-sm transition-all">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span className="flex items-center gap-1 font-bold">
                🛒 {lang === 'hi' ? 'मंडी मांग' : 'Market Demand'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-300">8 Buyers</div>
            <p className="text-[11px] text-slate-300 mt-1">
              {lang === 'hi' ? 'निकटतम 25 किमी में सक्रिय' : 'Active within 25 km'}
            </p>
          </div>
        </div>

        {/* Today's AI Recommendation Box */}
        <div className="bg-emerald-950/60 border border-emerald-400/40 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-xs font-black text-emerald-300 uppercase tracking-wide">
                {lang === 'hi' ? "आज की AI सिफारिश (Today's AI Recommendation)" : "Today's AI Recommendation"}
              </div>
              <p className="text-sm font-bold text-white mt-0.5 leading-snug">
                “Heavy rainfall may occur in the coming period. Monitor field drainage and follow local agricultural guidance.”
              </p>
              <p className="text-xs text-emerald-200/80 mt-1">
                {lang === 'hi' ? 'आगामी 48 घंटों में जल निकासी नालियों को साफ रखें एवं यूरिया/स्प्रे छिड़काव 2 दिन टालें।' : 'Clear excess water drains immediately and delay chemical pesticide/fertilizer spraying until rainfall subsides.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => openAIChatWithPrompt('What specific drainage and fertilizer steps should I take today given the 72% rain risk?')}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-agri-600 hover:from-emerald-600 hover:to-agri-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-md flex items-center gap-1.5"
            >
              <Bot className="w-4 h-4 text-white" />
              <span>{lang === 'hi' ? 'AI से परामर्श लें' : 'Ask AI Doctor'}</span>
            </button>
            <Link
              to="/risk-map"
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/15"
            >
              {lang === 'hi' ? 'नक्शा देखें' : 'View Risk Map'}
            </Link>
          </div>
        </div>

        {/* Quick Launchpad to all 4 New Modules */}
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Link
            to="/satellite-monitor"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 text-xs font-bold text-white transition-colors"
          >
            <Satellite className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="truncate">{lang === 'hi' ? 'उपग्रह NDVI' : 'Satellite NDVI'}</span>
          </Link>
          <Link
            to="/soil-intelligence"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 text-xs font-bold text-white transition-colors"
          >
            <FlaskConical className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">{lang === 'hi' ? 'मृदा N-P-K' : 'Soil Intel'}</span>
          </Link>
          <Link
            to="/crop-doctor"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 text-xs font-bold text-white transition-colors"
          >
            <Camera className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate">{lang === 'hi' ? 'AI फसल डॉक्टर' : 'AI Crop Doctor'}</span>
          </Link>
          <Link
            to="/impact-simulator"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 text-xs font-bold text-white transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="truncate">{lang === 'hi' ? 'जलवायु सिम्युलेटर' : 'Sell or Store?'}</span>
          </Link>
        </div>

      </div>

      {/* 2. Location Selector Component */}
      <LocationSelector />

      {/* 2. Crop Selector Strip */}
      <CropSelector />

      {/* 3. Immediate Action Advisory Banner */}
      <QuickAdvisoryBanner />

      {/* 4. Complete Farm-to-Market Journey Navigator */}
      <div className="bg-gradient-to-r from-agri-900 via-slate-900 to-agri-950 p-4 sm:p-5 rounded-3xl text-white shadow-md border border-agri-800/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Store className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-white">
                {lang === 'hi' ? 'पूर्ण किसान यात्रा (Farm-to-Market Journey)' : 'Integrated Farm-to-Market Lifecycle'}
              </h3>
              <p className="text-[11px] text-slate-300">
                {lang === 'hi' ? 'मौसम पूर्वानुमान से लेकर फसल की सीधी बिक्री तक' : 'From climate prediction to direct farm-gate monetization'}
              </p>
            </div>
          </div>

          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs self-start md:self-auto"
          >
            <span>{lang === 'hi' ? 'किसान मंडी खोलें' : 'Open Marketplace'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { step: '1. PREDICT', title: 'Weather Risk', path: '/forecast', icon: '🌦️' },
            { step: '2. PLAN', title: 'Sowing Decision', path: '/crop-advisory', icon: '🌱' },
            { step: '3. GROW', title: 'Crop Advisory', path: '/farmer-advisory', icon: '🌾' },
            { step: '4. MONITOR', title: 'Risk Map', path: '/risk-map', icon: '🗺️' },
            { step: '5. HARVEST', title: 'Mandi Rates', path: '/marketplace?tab=intelligence', icon: '📊' },
            { step: '6. SELL', title: 'Direct Buyers', path: '/marketplace', icon: '🛒' }
          ].map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors block text-left"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span>{item.icon}</span>
                <span className="text-[9px] font-black text-agri-400 tracking-wider">{item.step}</span>
              </div>
              <div className="text-xs font-bold text-white truncate">{item.title}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Top Forecast Cards (4 Cards: Onset, Dry Spell, Heavy Rain, Model Confidence) */}
      {isLoading ? (
        <LoadingSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Monsoon Onset */}
          <ForecastCard
            type="onset"
            title={t.dashboard.topCards.onsetTitle}
            subtitle={t.dashboard.topCards.onsetSub}
            value={forecast?.onsetProbability || 78}
            confidenceLevel={forecast?.confidenceLevel || 'Medium'}
            riskLabel={getRiskLabel('onset', forecast?.onsetProbability || 78)}
            icon={CloudRain}
            themeColor="green"
            promptContext={`Explain my monsoon onset probability of ${forecast?.onsetProbability}% in ${selectedLocation.panchayat} and what it means for ${selectedCrop.name}.`}
          />

          {/* 2. Dry Spell */}
          <ForecastCard
            type="dry_spell"
            title={t.dashboard.topCards.drySpellTitle}
            subtitle={t.dashboard.topCards.drySpellSub}
            value={forecast?.drySpellProbability || 24}
            confidenceLevel={forecast?.confidenceLevel || 'Medium'}
            riskLabel={getRiskLabel('dry', forecast?.drySpellProbability || 24)}
            icon={Sun}
            themeColor={forecast?.drySpellProbability > 50 ? 'amber' : 'green'}
            promptContext={`Explain my dry spell risk of ${forecast?.drySpellProbability}% for ${selectedCrop.name} in ${selectedLocation.panchayat}.`}
          />

          {/* 3. Heavy Rain */}
          <ForecastCard
            type="heavy_rain"
            title={t.dashboard.topCards.heavyRainTitle}
            subtitle={t.dashboard.topCards.heavyRainSub}
            value={forecast?.heavyRainProbability || 38}
            confidenceLevel={forecast?.confidenceLevel || 'Medium'}
            riskLabel={getRiskLabel('heavy', forecast?.heavyRainProbability || 38)}
            icon={Waves}
            themeColor={forecast?.heavyRainProbability > 60 ? 'rose' : 'blue'}
            promptContext={`Explain heavy rainfall probability of ${forecast?.heavyRainProbability}% and waterlogging risk for ${selectedCrop.name}.`}
          />

          {/* 4. Forecast Confidence */}
          <ForecastCard
            type="confidence"
            title={t.dashboard.topCards.confidenceTitle}
            subtitle={t.dashboard.topCards.confidenceSub}
            value={forecast?.confidence || 72}
            confidenceLevel={forecast?.confidenceLevel || 'Medium'}
            riskLabel="Model Reliability"
            icon={ShieldCheck}
            themeColor="blue"
            promptContext={`How confident is KisanAI in the forecast for ${selectedLocation.panchayat}? What models are used?`}
          />

        </div>
      )}

      {/* 5. Forecast Timeline (7, 14, 21, 30 Days Recharts) */}
      <ForecastTimeline />

      {/* 6. Grid: Hyperlocal Micro-Weather + Climate Teleconnections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <WeatherCard />
        </div>
        <div className="lg:col-span-8">
          <ClimateCard />
        </div>
      </div>

      {/* 7. Marketplace & Mandi Pulse Strip */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-900">
                {lang === 'hi' ? 'मंडी भाव व खरीदार पल्स' : 'Market Pulse & Nearby Buyer Demand'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                Live Mandi
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedCrop.name} benchmark mandi rate: <strong className="text-slate-800">₹24.50 - ₹44.80/kg</strong> • <strong>8 verified buyers</strong> active within 25 km
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/marketplace?tab=intelligence"
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            {lang === 'hi' ? '30-दिन भाव चार्ट' : 'Price Trends'}
          </Link>
          <Link
            to="/marketplace"
            className="px-4 py-2 bg-agri-600 hover:bg-agri-700 text-white rounded-xl text-xs font-black transition-colors shadow-xs flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-white" />
            <span>{lang === 'hi' ? 'फसल बेचें' : 'Sell Produce'}</span>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;
