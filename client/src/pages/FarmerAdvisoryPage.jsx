import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import AdvisoryCard from '../components/advisory/AdvisoryCard';
import CropSelector from '../components/advisory/CropSelector';
import LocationSelector from '../components/common/LocationSelector';
import LanguageSwitcher from '../components/common/LanguageSwitcher';
import { Sprout, HelpCircle, PhoneCall, Volume2 } from 'lucide-react';

const FarmerAdvisoryPage = () => {
  const { t, lang, toggleLanguage } = useLanguage();
  const { selectedLocation, selectedCrop, openAIChatWithPrompt } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header with High-Contrast Farmer Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-agri-900 text-white p-6 rounded-3xl shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {t.farmer.title}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-agri-200">
            {t.farmer.subtitle} ({selectedLocation.panchayat}, {selectedLocation.district})
          </p>
        </div>

        {/* Quick Language Toggle & Kisan Call Center */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher className="bg-white/10 text-white border-white/20 hover:bg-white/20" />
          
          <button
            onClick={() => openAIChatWithPrompt(lang === 'hi' ? 'मुझे सरल हिंदी में मेरी फसल के लिए पूरी सलाह बताएं' : 'Explain the complete farm advisory in simple points.')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-agri-500 hover:bg-agri-600 text-white rounded-full text-xs font-bold transition-colors shadow-sm"
          >
            <Volume2 className="w-4 h-4" />
            <span>{lang === 'hi' ? 'AI से सुनें' : 'Listen with AI'}</span>
          </button>
        </div>
      </div>

      {/* Location and Crop Selectors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LocationSelector compact />
        <CropSelector compact />
      </div>

      {/* Main Big Advisory Card */}
      <AdvisoryCard />

      {/* Harvest Stage & Farm-to-Market Monetization Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-agri-900 to-slate-900 text-white p-6 rounded-3xl shadow-md border border-emerald-700/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
              {lang === 'hi' ? 'फसल कटाई के बाद सीधी बिक्री' : 'Post-Harvest Monetization'}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white">
            {lang === 'hi' ? `क्या आपकी ${selectedCrop.hindiName || selectedCrop.name} कटाई के लिए तैयार है?` : `Is your ${selectedCrop.name} ready for harvest?`}
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            {lang === 'hi' 
              ? `मध्यस्थों के बिना सीधे ${selectedLocation.district} के सत्यापित व्यापारियों और प्रोसेसर्स से जुड़ें। रीयल-टाइम मंडी भाव देखें और अपनी उपज का अच्छा दाम पाएं।`
              : `Bypass unorganized middlemen. Connect your harvest directly with verified flour mills, oil crushers, and APMC traders in ${selectedLocation.district} with transparent price negotiation.`}
          </p>
        </div>

        <a
          href="/marketplace"
          className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-2xl transition-all shadow-md shrink-0 self-start md:self-auto"
        >
          <span>{lang === 'hi' ? 'मंडी में उपज लिस्ट करें' : 'List Produce on Marketplace'}</span>
          <span>→</span>
        </a>
      </div>

      {/* Kisan Support Footer Strip */}
      <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-agri-600" />
          <span>{lang === 'hi' ? 'किसान कॉल सेंटर टोल-फ्री सहायता: 1800-180-1551' : 'Kisan Call Center Toll-Free Help: 1800-180-1551'}</span>
        </div>
        <span className="text-[11px] text-slate-500">
          {lang === 'hi' ? 'कृषि विज्ञान केंद्र (KVK) द्वारा सत्यापित दिशानिर्देश' : 'Verified against ICAR & IMD Agromet Bulletins'}
        </span>
      </div>

    </div>
  );
};

export default FarmerAdvisoryPage;
