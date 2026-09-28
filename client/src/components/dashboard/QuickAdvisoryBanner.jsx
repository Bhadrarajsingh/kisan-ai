import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Sprout, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

const QuickAdvisoryBanner = () => {
  const { selectedCrop, selectedLocation, forecast, openAIChatWithPrompt } = useApp();
  const { lang } = useLanguage();

  const isFavorable = forecast?.onsetProbability >= 70 && forecast?.drySpellProbability <= 30;
  const isHighDry = forecast?.drySpellProbability > 50;
  const isHeavyRain = forecast?.heavyRainProbability > 65;

  return (
    <div className={`rounded-2xl border p-4 sm:p-5 shadow-soft transition-all ${
      isHeavyRain 
        ? 'bg-gradient-to-r from-rose-50 via-white to-rose-50/50 border-rose-200' 
        : isHighDry 
        ? 'bg-gradient-to-r from-amber-50 via-white to-amber-50/50 border-amber-200'
        : 'bg-gradient-to-r from-agri-50 via-white to-agri-50/50 border-agri-200'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-start gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-2xl ${
            isHeavyRain ? 'bg-rose-100 text-rose-700' : isHighDry ? 'bg-amber-100 text-amber-700' : 'bg-agri-100 text-agri-700'
          }`}>
            {selectedCrop.icon || '🌱'}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {lang === 'hi' ? 'त्वरित फसल निर्णय' : 'Immediate Crop Advisory'}
              </span>
              <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${
                isHeavyRain
                  ? 'bg-rose-100 text-rose-800 border-rose-200'
                  : isHighDry
                  ? 'bg-amber-100 text-amber-800 border-amber-200'
                  : 'bg-agri-100 text-agri-800 border-agri-200'
              }`}>
                {isHeavyRain 
                  ? (lang === 'hi' ? '⚠️ जल निकासी सतर्कता' : '⚠️ Ensure Drainage') 
                  : isHighDry 
                  ? (lang === 'hi' ? '⏳ सिंचाई प्रतीक्षा' : '⏳ Prepare Irrigation Backup') 
                  : (lang === 'hi' ? '✅ बुवाई अनुकूल' : '✅ Sowing Favorable')}
              </span>
            </div>

            <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
              {lang === 'hi'
                ? `${selectedLocation.panchayat} में ${selectedCrop.hindiName} के लिए: ${
                    isHeavyRain 
                      ? 'भारी वर्षा का जोखिम अधिक है। जलभराव रोकने के लिए नालियां तैयार रखें।'
                      : isHighDry 
                      ? 'आगामी शुष्क दौर के कारण असिंचित बुवाई 5-7 दिन टालें।'
                      : 'मिट्टी में 50 मिमी नमी सुनिश्चित कर प्रमाणित बीज से बुवाई प्रारंभ करें।'
                  }`
                : `${selectedCrop.name} in ${selectedLocation.panchayat}: ${
                    isHeavyRain
                      ? `Heavy rainfall risk is elevated (${forecast?.heavyRainProbability}%). Clear field drainage furrows.`
                      : isHighDry
                      ? `Dry spell likelihood is high (${forecast?.drySpellProbability}%). Delay rainfed sowing unless irrigation is assured.`
                      : `Onset conditions are favorable (${forecast?.onsetProbability}%). Confirm 10-15cm moist soil depth before drilling seed.`
                  }`}
            </h4>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <button
            onClick={() => openAIChatWithPrompt(`Should I sow ${selectedCrop.name} now in ${selectedLocation.panchayat}?`)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-2xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-agri-600" />
            <span>{lang === 'hi' ? 'AI से परामर्श' : 'Ask AI'}</span>
          </button>

          <Link
            to="/farmer-advisory"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-agri-600 hover:bg-agri-700 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow transition-all"
          >
            <span>{lang === 'hi' ? 'पूरी किसान सलाह' : 'Full Advisory'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default QuickAdvisoryBanner;
