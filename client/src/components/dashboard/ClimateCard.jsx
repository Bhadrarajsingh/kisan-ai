import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Globe2, Activity, Waves, Wind, HelpCircle, Info } from 'lucide-react';

const ClimateCard = () => {
  const { climate, openAIChatWithPrompt } = useApp();
  const { t } = useLanguage();

  const enso = climate?.enso || { status: 'Neutral', index: -0.4, description: 'Neutral Pacific conditions.' };
  const iod = climate?.iod || { status: 'Positive', index: +0.5, description: 'Positive Indian Ocean Dipole.' };
  const mjo = climate?.mjo || { phase: 4, amplitude: 1.2, status: 'Active over Bay of Bengal' };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
            <Globe2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              {t.dashboard.climateSignals.title}
            </h3>
            <p className="text-[11px] text-slate-500">
              {t.dashboard.climateSignals.subtitle}
            </p>
          </div>
        </div>

        <button
          onClick={() => openAIChatWithPrompt('Explain how ENSO, IOD and MJO currently affect the rainfall in my area.')}
          className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 transition-colors"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Explain Signals</span>
        </button>
      </div>

      {/* 3 Climate Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        
        {/* 1. ENSO */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-indigo-200 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5 text-blue-500" />
                ENSO
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                enso.index <= -0.5 ? 'bg-emerald-100 text-emerald-800' : enso.index >= 0.5 ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {enso.status}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-xl font-black text-slate-900">
                {enso.index > 0 ? `+${enso.index}` : enso.index}
              </span>
              <span className="text-[11px] text-slate-500">Oceanic Niño Index</span>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              {enso.description || 'ENSO represents tropical Pacific ocean-atmosphere conditions influencing monsoon circulation.'}
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-400">
            Source: NOAA / CPC Model Output
          </div>
        </div>

        {/* 2. IOD */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-indigo-200 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-600" />
                Indian Ocean Dipole (IOD)
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                iod.index >= 0.4 ? 'bg-emerald-100 text-emerald-800' : iod.index <= -0.4 ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-800'
              }`}>
                {iod.status}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-xl font-black text-slate-900">
                {iod.index > 0 ? `+${iod.index}` : iod.index}
              </span>
              <span className="text-[11px] text-slate-500">Dipole Mode Index (°C)</span>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              {iod.description || 'Positive IOD warms western Indian Ocean waters, promoting moist convective surges over India.'}
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-400">
            Source: Australian BoM / IMD
          </div>
        </div>

        {/* 3. MJO */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-indigo-200 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-indigo-500" />
                MJO Oscillation
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                Phase {mjo.phase}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-xl font-black text-slate-900">
                {mjo.amplitude}
              </span>
              <span className="text-[11px] text-slate-500">RMM Index Amplitude</span>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              {mjo.status || 'Active eastward moving convective pulse traversing equatorial maritime zone.'}
            </p>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-400">
            Source: Wheeler-Hendon Index
          </div>
        </div>

      </div>

      {/* Probabilistic Disclaimer */}
      <div className="mt-3 p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100/60 text-[11px] text-indigo-900 flex items-start gap-2">
        <HelpCircle className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
        <p className="leading-tight">
          {t.dashboard.climateSignals.disclaimer}
        </p>
      </div>
    </div>
  );
};

export default ClimateCard;
