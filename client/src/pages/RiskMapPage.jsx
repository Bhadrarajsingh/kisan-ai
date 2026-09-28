import React from 'react';
import RiskMap from '../components/map/RiskMap';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Map, Layers, ShieldAlert, Sparkles, Sprout, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RiskMapPage = () => {
  const { locations, selectedLocation, handleLocationChange, forecast, openAIChatWithPrompt } = useApp();
  const { t, lang } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-agri-600" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {lang === 'hi' ? 'मानसून जोखिम मानचित्र (GIS)' : 'Monsoon Risk GIS Map'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Color-coded Block & Panchayat level risk boundaries for Rajasthan, MP, Maharashtra & Punjab
          </p>
        </div>

        <button
          onClick={() => openAIChatWithPrompt(`Analyze the regional rainfall risk distribution across the blocks in the map for me.`)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-agri-600 hover:bg-agri-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs self-start md:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>Regional AI Analysis</span>
        </button>
      </div>

      {/* Main Interactive Map */}
      <RiskMap height="550px" />

      {/* Monitored Blocks Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-agri-600" />
          <span>Monitored Block Risk Matrix ({locations.length} Active Regions)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {locations.map((loc) => {
            const isSelected = loc.locationId === selectedLocation.locationId;
            return (
              <div
                key={loc.locationId}
                onClick={() => handleLocationChange(loc.locationId)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-agri-50/70 border-agri-500 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-bold text-xs text-slate-900">{loc.panchayat} ({loc.block})</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                      {loc.state}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    District: {loc.district} • Soil: {loc.soilType}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600">
                    Onset: <strong className="text-emerald-700">{isSelected ? forecast?.onsetProbability || 78 : 74}%</strong>
                  </span>
                  <span className="text-slate-600">
                    Dry Risk: <strong className="text-amber-700">{isSelected ? forecast?.drySpellProbability || 24 : 28}%</strong>
                  </span>
                  <span className="text-agri-700 font-bold flex items-center gap-0.5">
                    Select <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default RiskMapPage;
