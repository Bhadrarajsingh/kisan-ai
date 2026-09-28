import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { 
  FlaskConical, 
  Droplets, 
  Sparkles, 
  Layers, 
  Thermometer, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Bot, 
  RefreshCw,
  FileText,
  Activity,
  ArrowRight
} from 'lucide-react';

const SoilIntelligencePage = () => {
  const { lang } = useLanguage();
  const { selectedLocation, selectedCrop, weather, forecast, openAIChatWithPrompt } = useApp();

  const [soilType, setSoilType] = useState(selectedLocation?.soilType || 'Sandy Loam / Alluvial');

  // Soil Health Metrics
  const soilMetrics = {
    type: selectedLocation?.soilType || 'Sandy Loam / Alluvial',
    moisturePercent: 48,
    moistureStatus: 'Adequate for Kharif Tillage',
    ph: 6.8,
    phStatus: 'Near Neutral (Optimal nutrient availability)',
    nitrogenKgHa: 240,
    nitrogenStatus: 'Medium',
    phosphorusKgHa: 28,
    phosphorusStatus: 'High',
    potassiumKgHa: 195,
    potassiumStatus: 'Medium',
    organicCarbonPercent: 0.62,
    organicCarbonStatus: 'Medium',
    electricalConductivity: '0.38 dS/m (Normal, Non-Saline)',
    waterHoldingCapacity: 'Medium (42 mm/meter root zone)',
    drainageClass: 'Well Drained',
    lastTestDate: 'Soil Health Card Issued: 12 August 2026'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-800/40 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wide uppercase">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'मृदा स्वास्थ्य एवं पोषक तत्व विश्लेषण' : 'Soil Intelligence & Nutrient Profiling'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              {lang === 'hi' ? 'खेत की मिट्टी, नमी एवं N-P-K विश्लेषण' : 'Soil Chemistry, Moisture & Root Zone Dynamics'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lang === 'hi' 
                ? 'मिट्टी के प्रकार, पीएच (pH), नाइट्रोजन-फास्फोरस-पोटाश (N-P-K) स्तर एवं जल धारण क्षमता को आगामी मानसून वर्षा के साथ जोड़कर वैज्ञानिक अनुशंसा।'
                : 'Coupling edaphic soil profiles (texture, N-P-K, pH, water holding capacity) with real-time probabilistic monsoon models for precision fertilizer and tillage recommendations.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => openAIChatWithPrompt(`Analyze my soil condition (${soilMetrics.type}, pH ${soilMetrics.ph}, Moisture ${soilMetrics.moisturePercent}%) for ${selectedCrop.name} under current monsoon forecast.`)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all"
            >
              <Bot className="w-4 h-4 text-yellow-200" />
              <span>{lang === 'hi' ? 'AI मृदा सलाह' : 'AI Soil Guidance'}</span>
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kisan Soil Health Card Registry: {soilMetrics.lastTestDate}</span>
          </span>
          <span className="text-[10px] text-amber-300 font-bold">Block: {selectedLocation.block}</span>
        </div>
      </div>

      {/* 2. Primary Soil Indicators (pH, Moisture, Soil Type, Organic Carbon) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Soil Moisture (नमी)
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-1">
            <span>{soilMetrics.moisturePercent}%</span>
            <Droplets className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-[11px] font-bold text-emerald-700 block">
            {soilMetrics.moistureStatus}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Soil pH (अम्लीयता / क्षारीयता)
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-1">
            <span>{soilMetrics.ph}</span>
            <span className="text-xs font-normal text-slate-500">pH</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 block">
            {soilMetrics.phStatus}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Soil Texture & Type
          </span>
          <div className="text-base sm:text-lg font-black text-slate-900 truncate">
            {soilMetrics.type.split('/')[0]}
          </div>
          <span className="text-[11px] text-slate-500 block truncate">
            Drainage: {soilMetrics.drainageClass}
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Organic Carbon (जैविक कार्बन)
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-1">
            <span>{soilMetrics.organicCarbonPercent}%</span>
          </div>
          <span className="text-[11px] font-bold text-amber-700 block">
            Status: {soilMetrics.organicCarbonStatus}
          </span>
        </div>

      </div>

      {/* 3. N-P-K Major Macronutrient Gauges */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wide">
              Major Nutrient Balance (N - P - K Status)
            </h3>
            <p className="text-xs text-slate-500">Primary soil nutrient bioavailability for {selectedCrop.name}</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Card Status: Balanced
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Nitrogen */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-700">Nitrogen (N) - नाइट्रोजन</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800">
                {soilMetrics.nitrogenStatus}
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {soilMetrics.nitrogenKgHa} <span className="text-xs font-normal text-slate-500">kg/ha</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: '60%' }}></div>
            </div>
            <p className="text-[11px] text-slate-500">
              Target for {selectedCrop.name}: 250–280 kg/ha. Top-dress with Urea after first rain spell.
            </p>
          </div>

          {/* Phosphorus */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-700">Phosphorus (P) - फास्फोरस</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                {soilMetrics.phosphorusStatus}
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {soilMetrics.phosphorusKgHa} <span className="text-xs font-normal text-slate-500">kg/ha</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: '82%' }}></div>
            </div>
            <p className="text-[11px] text-slate-500">
              Sufficient reserve. Avoid excess SSP/DAP application to prevent phosphate lockup.
            </p>
          </div>

          {/* Potassium */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-700">Potassium (K) - पोटाश</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">
                {soilMetrics.potassiumStatus}
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {soilMetrics.potassiumKgHa} <span className="text-xs font-normal text-slate-500">kg/ha</span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '55%' }}></div>
            </div>
            <p className="text-[11px] text-slate-500">
              Moderate. Apply Muriate of Potash (MOP) to boost drought and pest tolerance.
            </p>
          </div>

        </div>
      </div>

      {/* 4. AI Integrated Recommendation: Soil + Weather + Crop */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-agri-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-800/40 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm sm:text-base font-black text-white">
              AI Integrated Agro-Edaphic Prescription (Soil + Weather + Crop)
            </h3>
          </div>
          <span className="text-[11px] text-emerald-300 font-bold bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
            Tri-Factor Calibration
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-amber-400 font-bold uppercase text-[10px]">1. Edaphic Factor (Soil)</span>
            <p className="text-slate-300">
              {soilMetrics.type} with 48% current moisture profile and optimal neutral pH of {soilMetrics.ph}.
            </p>
          </div>

          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-blue-400 font-bold uppercase text-[10px]">2. Meteorological Factor (Weather)</span>
            <p className="text-slate-300">
              Onset Probability: {forecast?.onsetProbability || 78}% with low immediate dry spell risk ({forecast?.drySpellProbability || 24}%).
            </p>
          </div>

          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-emerald-400 font-bold uppercase text-[10px]">3. Biological Factor (Crop)</span>
            <p className="text-slate-300">
              {selectedCrop.name} has root depth tolerance up to 45–60 cm and thrives in moderately drained loam.
            </p>
          </div>
        </div>

        <div className="p-4 bg-emerald-500/15 rounded-2xl border border-emerald-400/30 text-xs text-slate-200 leading-relaxed">
          <strong className="text-emerald-300 font-bold block mb-1">
            💡 Prescribed Fertilizer & Sowing Protocol:
          </strong>
          Because your soil has high Phosphorus reserves ({soilMetrics.phosphorusKgHa} kg/ha) but moderate Nitrogen, <strong>reduce basal DAP dosage by 15%</strong> and apply <strong>Zinc Sulphate (25 kg/ha)</strong> prior to sowing. Moisture levels (48%) are sufficient for germination without supplementary pre-sowing irrigation.
        </div>
      </div>

    </div>
  );
};

export default SoilIntelligencePage;
