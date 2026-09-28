import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher = ({ className = '' }) => {
  const { lang, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-200 shadow-sm ${
        lang === 'hi'
          ? 'bg-agri-100 text-agri-900 border-agri-300 hover:bg-agri-200'
          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
      } ${className}`}
      title="Switch Language / भाषा बदलें"
      aria-label="Toggle language between English and Hindi"
    >
      <Globe className="w-3.5 h-3.5 text-agri-600 animate-spin-slow" />
      <span>{lang === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}</span>
    </button>
  );
};

export default LanguageSwitcher;
