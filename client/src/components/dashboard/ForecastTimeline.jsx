import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { Calendar, CloudRain, Droplets, Sun, AlertTriangle } from 'lucide-react';

const ForecastTimeline = () => {
  const { forecast, horizon, handleHorizonChange, isLoading } = useApp();
  const { t } = useLanguage();
  const [activeMetric, setActiveMetric] = useState('rain'); // 'rain', 'temp', 'risk'

  const timelineData = forecast?.timeline || [];

  const horizons = [
    { key: '7d', label: t.dashboard.timeline.horizon7 },
    { key: '14d', label: t.dashboard.timeline.horizon14 },
    { key: '21d', label: t.dashboard.timeline.horizon21 },
    { key: '30d', label: t.dashboard.timeline.horizon30 },
  ];

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-700 min-w-[180px] backdrop-blur-md">
          <p className="font-bold text-slate-200 border-b border-slate-700 pb-1.5 mb-1.5 flex items-center justify-between">
            <span>{data.day}</span>
            <span className="text-agri-400 font-semibold">{data.condition}</span>
          </p>
          <div className="space-y-1 text-slate-300">
            <p className="flex justify-between">
              <span>Rain Probability:</span>
              <span className="font-bold text-sky-400">{data.rainfallProb}%</span>
            </p>
            <p className="flex justify-between">
              <span>Expected Rain:</span>
              <span className="font-bold text-sky-300">{data.expectedRainfallMm} mm</span>
            </p>
            <p className="flex justify-between">
              <span>Temperature:</span>
              <span className="font-bold text-amber-300">{data.tempMin}°C - {data.tempMax}°C</span>
            </p>
            <p className="flex justify-between">
              <span>Humidity:</span>
              <span className="font-bold text-blue-300">{data.humidity}%</span>
            </p>
            <p className="flex justify-between">
              <span>Dry Spell Risk:</span>
              <span className="font-bold text-amber-400">{data.drySpellRisk}%</span>
            </p>
            <p className="flex justify-between">
              <span>Heavy Rain Risk:</span>
              <span className="font-bold text-rose-400">{data.heavyRainRisk}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft">
      {/* Header with Title and Horizon Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-agri-600" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              {t.dashboard.timeline.title}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Expected precipitation and temperature variations over the next {horizon.replace('d', ' days')}
          </p>
        </div>

        {/* Horizon Filter Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          {horizons.map((h) => (
            <button
              key={h.key}
              onClick={() => handleHorizonChange(h.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                horizon === h.key
                  ? 'bg-white text-agri-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart container with horizontal scroll support on small screens */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[600px] h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={timelineData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                yAxisId="prob"
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                unit="%"
              />
              <YAxis
                yAxisId="rain"
                orientation="right"
                domain={[0, 'auto']}
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                unit="mm"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                iconType="circle"
              />

              {/* Rain Probability Area */}
              <Area
                yAxisId="prob"
                type="monotone"
                dataKey="rainfallProb"
                name="Rainfall Prob (%)"
                stroke="#0284c7"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#rainGrad)"
              />

              {/* Expected Rain mm Bars */}
              <Bar
                yAxisId="rain"
                dataKey="expectedRainfallMm"
                name="Expected Rain (mm)"
                fill="#38bdf8"
                radius={[4, 4, 0, 0]}
                barSize={14}
              />

              {/* Dry Spell Risk Line */}
              <Line
                yAxisId="prob"
                type="monotone"
                dataKey="drySpellRisk"
                name="Dry Spell Risk (%)"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />

              {/* Heavy Rain Risk Line */}
              <Line
                yAxisId="prob"
                type="monotone"
                dataKey="heavyRainRisk"
                name="Heavy Rain Risk (%)"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="2 2"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary insights under timeline */}
      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-2.5 bg-slate-50 rounded-xl">
          <span className="text-slate-500 text-[11px] block">Cumulative Rainfall</span>
          <span className="text-sm font-bold text-slate-800">{forecast?.expectedRainfallMm || 114} mm</span>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-xl">
          <span className="text-slate-500 text-[11px] block">Wettest Day</span>
          <span className="text-sm font-bold text-monsoon-700">
            {timelineData.reduce((prev, curr) => curr.expectedRainfallMm > (prev?.expectedRainfallMm || 0) ? curr : prev, timelineData[0])?.day || 'Day 4'}
          </span>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-xl">
          <span className="text-slate-500 text-[11px] block">Soil Moisture Status</span>
          <span className="text-sm font-bold text-agri-700">{forecast?.soilMoistureStatus || 'Adequate for Tillage'}</span>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-xl">
          <span className="text-slate-500 text-[11px] block">Forecast Model</span>
          <span className="text-sm font-bold text-slate-700">KisanAI Ensemble</span>
        </div>
      </div>
    </div>
  );
};

export default ForecastTimeline;
