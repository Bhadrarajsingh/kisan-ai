import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  CloudRain, 
  Sparkles, 
  Globe2, 
  Map, 
  Sprout, 
  Bot, 
  Languages, 
  ArrowRight, 
  ShieldCheck,
  TrendingUp,
  Activity,
  Layers,
  CheckCircle2,
  CalendarDays
} from 'lucide-react';

const LandingPage = () => {
  const { t, lang } = useLanguage();
  const { openAIChatWithPrompt, forecast, selectedLocation } = useApp();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      title: t.features.hyperlocal.title,
      desc: t.features.hyperlocal.desc,
      icon: Map,
      color: 'bg-emerald-100 text-emerald-700',
      link: '/dashboard'
    },
    {
      title: t.features.climate.title,
      desc: t.features.climate.desc,
      icon: Globe2,
      color: 'bg-indigo-100 text-indigo-700',
      link: '/forecast'
    },
    {
      title: t.features.aiAssistant.title,
      desc: t.features.aiAssistant.desc,
      icon: Bot,
      color: 'bg-blue-100 text-blue-700',
      link: '/ai-chat'
    },
    {
      title: t.features.smartAdvisory.title,
      desc: t.features.smartAdvisory.desc,
      icon: Sprout,
      color: 'bg-amber-100 text-amber-700',
      link: '/farmer-advisory'
    },
    {
      title: t.features.riskMaps.title,
      desc: t.features.riskMaps.desc,
      icon: Layers,
      color: 'bg-rose-100 text-rose-700',
      link: '/risk-map'
    },
    {
      title: t.features.regionalLang.title,
      desc: t.features.regionalLang.desc,
      icon: Languages,
      color: 'bg-purple-100 text-purple-700',
      link: '/farmer-advisory'
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 overflow-hidden bg-gradient-to-b from-agri-50/60 via-slate-50 to-white border-b border-slate-200/60">
        
        {/* Subtle decorative atmospheric grid/rings */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-agri-200/30 to-monsoon-200/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Hackathon Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-agri-100/90 border border-agri-300 text-agri-900 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-agri-600" />
              <span>{t.hero.disclaimerBadge}</span>
            </div>

            {/* Main Hero Header */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-tight">
              Kisan<span className="text-agri-600">AI</span>
              <span className="block text-xl sm:text-3xl lg:text-4xl font-bold text-slate-700 mt-2">
                {t.hero.title}
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              {t.hero.subtitle}
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-agri-600 hover:bg-agri-700 text-white rounded-xl text-sm font-bold shadow-md shadow-agri-700/20 hover:shadow-lg transition-all"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-agri-600 hover:bg-agri-700 text-white rounded-xl text-sm font-bold shadow-md shadow-agri-700/20 hover:shadow-lg transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'लॉगिन करें / शुरू करें' : 'Login / Get Started'}</span>
                </Link>
              )}

              <button
                onClick={() => openAIChatWithPrompt('What is the probabilistic monsoon risk for sowing in my block right now?')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-sm font-bold shadow-sm transition-all"
              >
                <Bot className="w-4 h-4 text-agri-600" />
                <span>{t.hero.askAIBtn}</span>
              </button>
            </div>


          </div>
        </div>
      </section>

      {/* Section: Interactive Feature Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Climate-to-Farm Intelligence
          </h2>
          <p className="text-sm text-slate-600">
            Engineered to convert macro-meteorological uncertainty into micro-agricultural certainty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Link
                key={idx}
                to={feat.link}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-soft hover:shadow-md hover:border-agri-300 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl ${feat.color} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-agri-700 transition-colors mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-agri-700 group-hover:translate-x-1 transition-transform">
                  <span>Explore Feature</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Section 34: Prominent Landing Page Final Message */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-agri-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agri-500/20 text-agri-300 text-xs font-bold border border-agri-400/30">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Scientific Teleconnections to Panchayat Soil</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              “From Global Climate Signals to Local Farming Decisions.”
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              KisanAI combines climate indicators (ENSO, IOD, MJO), weather information, probabilistic risk analysis and conversational AI to help farmers understand upcoming monsoon and weather conditions at local scale.
            </p>

            <div className="pt-4 flex flex-wrap gap-3">
              <Link
                to="/farmer-advisory"
                className="px-5 py-2.5 bg-agri-500 hover:bg-agri-600 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                View Sowing Advisory
              </Link>
              <Link
                to="/risk-map"
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-all"
              >
                Inspect Risk Map
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
