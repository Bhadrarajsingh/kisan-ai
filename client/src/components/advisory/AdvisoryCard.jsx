import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { 
  Sprout, 
  MapPin, 
  CloudRain, 
  Sun, 
  Waves, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  Droplets
} from 'lucide-react';

const AdvisoryCard = () => {
  const { selectedLocation, selectedCrop, forecast, openAIChatWithPrompt } = useApp();
  const { lang, setLang } = useLanguage();

  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdvisory();
  }, [selectedLocation.locationId, selectedCrop.cropId, forecast]);

  const fetchAdvisory = async () => {
    setLoading(true);
    try {
      const data = await api.getCropAdvisory(selectedLocation.locationId, selectedCrop.cropId);
      setAdvisory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isHighHeavyRain = forecast?.heavyRainProbability >= 70;
  const isHighDry = forecast?.drySpellProbability >= 60 || forecast?.onsetProbability < 50;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
      
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 ${
        isHighHeavyRain 
          ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white' 
          : isHighDry 
          ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white' 
          : 'bg-gradient-to-r from-agri-600 to-agri-800 text-white'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
              {selectedCrop.icon || '🌱'}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                  {lang === 'hi' ? 'किसान कृषि परामर्श' : 'Kisan Field Advisory'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-white/20 text-white backdrop-blur-xs">
                  {advisory?.riskLevel || 'Moderate'} Risk
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                {lang === 'hi' ? selectedCrop.hindiName : selectedCrop.name} — {selectedLocation.panchayat}
              </h2>
              <p className="text-xs text-white/80 mt-0.5">
                {selectedLocation.block} Block • {selectedLocation.district} District • {selectedLocation.state}
              </p>
            </div>
          </div>

          {/* Quick AI & Lang Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => openAIChatWithPrompt(`What should I do for my ${selectedCrop.name} crop in ${selectedLocation.panchayat}?`)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-slate-900 hover:bg-slate-50 rounded-xl text-xs font-bold shadow-md transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-agri-600" />
              <span>{lang === 'hi' ? 'AI से पूछें' : 'Ask AI'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* 4 Metric Pill Strips */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100 border-b border-slate-200 bg-slate-50/50">
        <div className="p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-agri-100 text-agri-700 flex items-center justify-center shrink-0">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">
              {lang === 'hi' ? 'मानसून सक्रियता' : 'Monsoon Onset'}
            </span>
            <span className="text-base font-extrabold text-slate-900">{forecast?.onsetProbability || 78}%</span>
          </div>
        </div>

        <div className="p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">
              {lang === 'hi' ? 'सूखा / विराम जोखिम' : 'Dry Spell Risk'}
            </span>
            <span className="text-base font-extrabold text-slate-900">{forecast?.drySpellProbability || 24}%</span>
          </div>
        </div>

        <div className="p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">
              {lang === 'hi' ? 'भारी वर्षा जोखिम' : 'Heavy Rain Risk'}
            </span>
            <span className="text-base font-extrabold text-slate-900">{forecast?.heavyRainProbability || 38}%</span>
          </div>
        </div>

        <div className="p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">
              {lang === 'hi' ? 'न्यूनतम वर्षा आवश्यकता' : 'Sowing Water Req.'}
            </span>
            <span className="text-base font-extrabold text-slate-900">
              {selectedCrop.sowingRainRequirement?.minMm || 50} mm
            </span>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 sm:p-8 space-y-6">
        
        {/* Core Advisory Message Card */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {lang === 'hi' ? 'मुख्य कृषि सिफारिश' : 'Key Field Guidance'}
            </span>
            <span className="text-xs font-extrabold text-agri-700 bg-agri-100 px-2.5 py-0.5 rounded-full">
              {lang === 'hi' ? advisory?.statusHindi || 'बुवाई अनुकूल' : advisory?.status || 'Favorable for Sowing'}
            </span>
          </div>
          <p className="text-sm sm:text-base font-medium text-slate-800 leading-relaxed">
            {lang === 'hi' ? advisory?.messageHindi : advisory?.messageEnglish}
          </p>
        </div>

        {/* Action Items */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-agri-600" />
            <span>{lang === 'hi' ? 'खेत में करने योग्य जरूरी काम (Action Items)' : 'Recommended Farm Operations'}</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(lang === 'hi' ? advisory?.actionItemsHindi : advisory?.actionItemsEnglish)?.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-agri-100 text-agri-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-xs text-slate-700 leading-relaxed font-medium">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Crop Agronomic Requirements Accordion/Strip */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 font-semibold block mb-1">
              {lang === 'hi' ? 'बुवाई का समय' : 'Sowing Window'}
            </span>
            <span className="text-slate-800 font-bold">{selectedCrop.sowingWindow}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 font-semibold block mb-1">
              {lang === 'hi' ? 'सूखा सहनशीलता' : 'Dry Spell Tolerance'}
            </span>
            <span className="text-slate-800 font-bold">Max {selectedCrop.drySpellTolerance?.maxDays} Days</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 font-semibold block mb-1">
              {lang === 'hi' ? 'जल निकासी संवेदनशीलता' : 'Drainage Sensitivity'}
            </span>
            <span className="text-slate-800 font-bold">{selectedCrop.heavyRainThreshold?.drainageSensitivity || 'High'}</span>
          </div>
        </div>

        {/* Uncertainty / Scientific Disclaimer Box */}
        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-2 text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-tight text-[11px]">
            {lang === 'hi'
              ? 'महत्वपूर्ण सूचना: यह कृषि परामर्श संभाव्यता मौसम मॉडल पर आधारित अनुमान है। बुवाई से पहले खेत में फावड़े से 10-15 सेमी गहराई तक मिट्टी की वास्तविक नमी और स्थानीय कृषि विज्ञान केंद्र (KVK) के निर्देशों की पुष्टि अवश्य करें।'
              : 'Important Notice: This agricultural advisory is a model-based probabilistic estimate. Always cross-reference with local Krishi Vigyan Kendra (KVK) guidance and physically check 10-15 cm soil moisture depth.'}
          </p>
        </div>

      </div>

    </div>
  );
};

export default AdvisoryCard;
