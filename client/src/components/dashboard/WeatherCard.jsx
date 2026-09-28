import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Thermometer, Droplets, Wind, Gauge, CloudRain, Sun, Sprout } from 'lucide-react';

const WeatherCard = () => {
  const { weather, selectedLocation } = useApp();
  const { t, lang } = useLanguage();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft h-full flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Hyperlocal Micro-Weather</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {selectedLocation.panchayat}, {selectedLocation.block}
          </p>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-agri-100 text-agri-800 border border-agri-200 shrink-0 text-center">
          {weather?.condition || 'Scattered Clouds'}
        </span>
      </div>

      {/* 2x2 Clean Spacious Grid */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Temperature */}
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Thermometer className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-500 truncate">Temp</span>
          </div>
          <div>
            <div className="text-lg font-black text-slate-900 leading-tight">
              {weather?.temperature || 29.5}°C
            </div>
            <div className="text-[10px] font-medium text-slate-400 mt-0.5">
              {weather?.tempMin}° / {weather?.tempMax}°C
            </div>
          </div>
        </div>

        {/* Humidity */}
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Droplets className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-500 truncate">Humidity</span>
          </div>
          <div>
            <div className="text-lg font-black text-slate-900 leading-tight">
              {weather?.humidity || 74}%
            </div>
            <div className="text-[10px] font-medium text-blue-600 mt-0.5">
              Dewpoint Active
            </div>
          </div>
        </div>

        {/* Past 24h Rain */}
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
              <CloudRain className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-500 truncate">24h Rain</span>
          </div>
          <div>
            <div className="text-lg font-black text-slate-900 leading-tight">
              {weather?.rainfall24h || 14.2} <span className="text-xs font-semibold text-slate-500">mm</span>
            </div>
            <div className="text-[10px] font-medium text-slate-400 mt-0.5">
              7d: {weather?.recentRainfall7d || 52}mm
            </div>
          </div>
        </div>

        {/* Soil Moisture */}
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Sprout className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-500 truncate">Moisture</span>
          </div>
          <div>
            <div className="text-lg font-black text-slate-900 leading-tight">
              {weather?.soilMoisture || 62}%
            </div>
            <div className="text-[10px] font-semibold text-emerald-600 mt-0.5">
              Tillage Ready
            </div>
          </div>
        </div>

      </div>

      {/* Atmospheric Footer Strip */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
        <span>Pressure: {weather?.pressure || 1004.8} hPa</span>
        <span>Wind: {weather?.windSpeed || 14} km/h</span>
      </div>

    </div>
  );
};

export default WeatherCard;
