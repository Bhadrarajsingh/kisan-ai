import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import ForecastTimeline from '../components/dashboard/ForecastTimeline';
import LocationSelector from '../components/common/LocationSelector';
import ClimateCard from '../components/dashboard/ClimateCard';
import { 
  CalendarDays, 
  CloudRain, 
  Droplets, 
  Thermometer, 
  Sun, 
  Wind, 
  Gauge, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

const ForecastDetailPage = () => {
  const { forecast, weather, selectedLocation, openAIChatWithPrompt } = useApp();
  const { t, lang } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-agri-600" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {lang === 'hi' ? 'विस्तृत 30-दिवसीय मौसम आउटलुक' : 'Detailed 30-Day Probabilistic Forecast'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistical ensemble outlook calibrated for {selectedLocation.panchayat}, {selectedLocation.block}
          </p>
        </div>

        <button
          onClick={() => openAIChatWithPrompt('Give me a detailed 30-day breakdown of rainfall, temperature and dry spell risks.')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-agri-600 hover:bg-agri-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs self-start md:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>AI Forecast Summary</span>
        </button>
      </div>

      {/* Location Selector */}
      <LocationSelector compact />

      {/* Primary Timeline Chart */}
      <ForecastTimeline />

      {/* Daily Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <CloudRain className="w-4 h-4 text-agri-600" />
          <span>Daily Probabilistic Matrix</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Condition</th>
                <th className="py-2.5 px-3">Rain Probability</th>
                <th className="py-2.5 px-3">Expected (mm)</th>
                <th className="py-2.5 px-3">Temp Range</th>
                <th className="py-2.5 px-3">Humidity</th>
                <th className="py-2.5 px-3">Dry Risk</th>
                <th className="py-2.5 px-3">Heavy Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(forecast?.timeline || []).map((day, idx) => (
                <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2 px-3 font-semibold text-slate-900 whitespace-nowrap">{day.day}</td>
                  <td className="py-2 px-3">{day.condition}</td>
                  <td className="py-2 px-3 font-bold text-sky-700">{day.rainfallProb}%</td>
                  <td className="py-2 px-3 font-bold text-slate-800">{day.expectedRainfallMm} mm</td>
                  <td className="py-2 px-3 text-slate-700">{day.tempMin}° - {day.tempMax}°C</td>
                  <td className="py-2 px-3 text-slate-700">{day.humidity}%</td>
                  <td className="py-2 px-3 font-bold text-amber-700">{day.drySpellRisk}%</td>
                  <td className="py-2 px-3 font-bold text-rose-700">{day.heavyRainRisk}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Climate Indicators Breakdown */}
      <ClimateCard />

    </div>
  );
};

export default ForecastDetailPage;
