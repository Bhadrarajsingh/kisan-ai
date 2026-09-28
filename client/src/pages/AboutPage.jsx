import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  CloudRain, 
  Globe2, 
  Cpu, 
  Bot, 
  Sprout, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle,
  Database,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const { lang } = useLanguage();

  const workflowSteps = [
    {
      step: '01',
      title: 'Global Climate Ingestion',
      desc: 'Monitors large-scale ocean-atmosphere oscillations (ENSO / ONI index, Indian Ocean Dipole, Madden-Julian Oscillation phase & amplitude).',
      icon: Globe2,
      color: 'bg-indigo-100 text-indigo-700'
    },
    {
      step: '02',
      title: 'Hyperlocal Weather & Terrain',
      desc: 'Combines IMD gridded datasets, Open-Meteo observations, elevation, soil type, and historical 30-year rainfall anomalies.',
      icon: Database,
      color: 'bg-blue-100 text-blue-700'
    },
    {
      step: '03',
      title: 'Probabilistic Agro-Risk Engine',
      desc: 'Computes calibrated probabilities for sustained monsoon onset, prolonged dry spells, heavy rainfall bursts, and model confidence.',
      icon: Cpu,
      color: 'bg-amber-100 text-amber-700'
    },
    {
      step: '04',
      title: 'Rule-Based Agronomic Filter',
      desc: 'Applies crop-specific agronomic thresholds (Soybean, Maize, Bajra, Rice, Cotton, Groundnut, Pulses) to formulate concrete field operations.',
      icon: Sprout,
      color: 'bg-emerald-100 text-emerald-700'
    },
    {
      step: '05',
      title: 'Conversational Gemini AI',
      desc: 'Google Gemini 2.5 Flash analyzes the full meteorological context and delivers empathetic, concise, bilingual (English/Hindi) guidance.',
      icon: Bot,
      color: 'bg-purple-100 text-purple-700'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-agri-700 uppercase tracking-widest bg-agri-50 px-3 py-1 rounded-full border border-agri-200">
          Smart India Hackathon Prototype
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How Kisan<span className="text-agri-600">AI</span> Works
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          From equatorial ocean waves to village panchayat seed drills — an intelligent pipeline bridging global climate physics and farmer decisions.
        </p>
      </div>

      {/* Architecture Workflow Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {workflowSteps.map((ws, idx) => {
          const Icon = ws.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft flex flex-col justify-between relative group hover:border-agri-400 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-slate-400 tracking-widest">{ws.step}</span>
                  <div className={`w-9 h-9 rounded-xl ${ws.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1.5 leading-snug">
                  {ws.title}
                </h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {ws.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Probabilistic Science & Uncertainty Philosophy */}
      <div className="bg-gradient-to-r from-slate-900 to-agri-950 rounded-3xl p-8 sm:p-10 text-white shadow-xl">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Core Design Principle: Probabilistic Honesty</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Why Probabilities Instead of Deterministic Claims?
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            The Indian Summer Monsoon is governed by chaotic atmospheric dynamics. Claiming exact deterministic dates (e.g. "It will rain precisely on July 4 at 3 PM") is scientifically irresponsible and leads to catastrophic seed mortality if a dry spell intervenes.
          </p>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            KisanAI quantifies uncertainty through <strong>probabilistic envelopes</strong> (e.g., 78% onset likelihood, 24% dry spell probability), enabling farmers to prepare contingency irrigation and select resilient seed varieties.
          </p>

          <div className="pt-2 flex gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-agri-500 hover:bg-agri-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <span>Try Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutPage;
