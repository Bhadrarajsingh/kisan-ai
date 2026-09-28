import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';
import {
  TrendingUp,
  Store,
  Building2,
  DollarSign,
  ArrowRight,
  Sparkles,
  Bot,
  MapPin,
  Calendar,
  Scale,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Wheat,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const MarketIntelligencePage = () => {
  const { t, lang } = useLanguage();
  const { selectedLocation, selectedCrop, openAIChatWithPrompt } = useApp();

  const [mandiPrices, setMandiPrices] = useState([]);
  const [selectedCropId, setSelectedCropId] = useState('bajra');
  const [priceTrends, setPriceTrends] = useState(null);
  const [buyers, setBuyers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const cropsList = [
    { id: 'bajra', name: 'Bajra (Pearl Millet)', hindi: 'बाजरा', icon: '🌾' },
    { id: 'soybean', name: 'Soybean (Yellow)', hindi: 'सोयाबीन', icon: '🌱' },
    { id: 'wheat', name: 'Wheat (Sharbati)', hindi: 'गेहूं', icon: '🌾' },
    { id: 'cotton', name: 'Raw Cotton (Kapas)', hindi: 'कपास', icon: '🧶' },
    { id: 'groundnut', name: 'Groundnut (Peanuts)', hindi: 'मूंगफली', icon: '🥜' },
    { id: 'pulses', name: 'Green Gram (Moong)', hindi: 'हरा मूंग', icon: '🫘' }
  ];

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [prices, trends, buyersData] = await Promise.all([
        api.getMarketPrices(),
        api.getMarketTrends(selectedCropId),
        api.getBuyers()
      ]);
      setMandiPrices(prices || []);
      setPriceTrends(trends || null);
      setBuyers(buyersData || []);
    } catch (err) {
      console.error('Failed to load marketing intelligence:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const trend = await api.getMarketTrends(selectedCropId);
        setPriceTrends(trend);
      } catch (e) {
        console.error(e);
      }
    };
    fetchTrend();
  }, [selectedCropId]);

  const currentCropObj = cropsList.find(c => c.id === selectedCropId) || cropsList[0];
  const currentMandiPriceObj = mandiPrices.find(m => m.cropId === selectedCropId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* 1. Header Banner Dedicated to Agricultural Marketing */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-agri-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        
        {/* Subtle Decorative */}
        <div className="absolute -right-8 -top-8 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide uppercase">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'कृषि विपणन एवं मंडी विश्लेषण' : 'Agricultural Marketing & Price Intelligence'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              {lang === 'hi' ? 'मंडी भाव, MSP एवं बाजार रुझान' : 'APMC Mandi Rates, MSP & Market Trends'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lang === 'hi'
                ? 'सरकारी न्यूनतम समर्थन मूल्य (MSP), स्थानीय कृषि उपज मंडियों के वास्तविक भाव और 30-दिवसीय मूल्य रुझानों का पारदर्शी विश्लेषण।'
                : 'Empowering farmers with daily benchmark APMC prices, 30-day historical time-series, Govt. MSP comparisons, and AI harvest monetization advice.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 transition-all"
            >
              <Store className="w-4 h-4" />
              <span>{lang === 'hi' ? 'सीधे खरीदारों को बेचें' : 'Sell to Direct Buyers'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => openAIChatWithPrompt(`What is the current market trend for ${currentCropObj.name} in Rajasthan/MP, and should I sell my crop now or wait?`)}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-md border border-white/20 transition-all"
            >
              <Bot className="w-4 h-4 text-yellow-300" />
              <span>{lang === 'hi' ? 'AI विपणन सलाह' : 'Ask AI Market Timing'}</span>
            </button>
          </div>
        </div>

        {/* Live Mandi Ticker Bar */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-4 overflow-x-auto scrollbar-none text-xs">
          <span className="font-extrabold text-emerald-400 text-[11px] uppercase tracking-wider shrink-0 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Live Mandi Board:
          </span>
          <div className="flex items-center gap-6 shrink-0 text-slate-200">
            {mandiPrices.map(mp => (
              <div key={mp.cropId} className="flex items-center gap-2 shrink-0">
                <span className="font-bold">{mp.cropName.split(' ')[0]}:</span>
                <span className="font-black text-white">₹{(mp.currentMandiPrice / 100).toFixed(2)}/kg</span>
                <span className={`text-[10px] font-extrabold flex items-center ${
                  mp.priceChangePct >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {mp.priceChangePct >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {mp.priceChangePct > 0 ? `+${mp.priceChangePct}%` : `${mp.priceChangePct}%`}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 2. Crop Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {cropsList.map(c => {
          const isSelected = selectedCropId === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCropId(c.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all ${
                isSelected
                  ? 'bg-agri-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{c.icon}</span>
              <span>{lang === 'hi' ? c.hindi : c.name}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Highlighted Metrics Cards for Selected Crop */}
      {priceTrends && currentMandiPriceObj && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Spot Mandi Price */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Spot Mandi Rate (मौजूदा भाव)
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              ₹{priceTrends.currentPriceKg}
              <span className="text-xs font-normal text-slate-500"> / kg</span>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <span>Benchmark:</span>
              <span className="font-bold text-slate-700">{currentMandiPriceObj.benchmarkMandi}</span>
            </div>
          </div>

          {/* Card 2: Government MSP Floor */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Govt. MSP Benchmark (समर्थन मूल्य)
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-700">
              ₹{priceTrends.mspKg}
              <span className="text-xs font-normal text-slate-500"> / kg</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Official minimum floor rate declared by CACP
            </div>
          </div>

          {/* Card 3: Mandi Arrivals & Demand */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Daily Mandi Arrivals & Demand
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {currentMandiPriceObj.marketArrivalsTons}
              <span className="text-xs font-normal text-slate-500"> Tons</span>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <span>Demand Level:</span>
              <span className="px-2 py-0.2 rounded-full font-bold text-emerald-800 bg-emerald-100 text-[10px]">
                {currentMandiPriceObj.demandLevel}
              </span>
            </div>
          </div>

          {/* Card 4: Active Local Buyers */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Nearby Active Buyers
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {currentMandiPriceObj.topBuyerCount}
              <span className="text-xs font-normal text-slate-500"> Traders</span>
            </div>
            <Link
              to="/marketplace?tab=buyers"
              className="text-[11px] font-bold text-agri-600 hover:text-agri-800 flex items-center gap-1 mt-1"
            >
              <span>View Buyer Directory</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

        </div>
      )}

      {/* 4. Interactive 30-Day Recharts Trend Chart */}
      {priceTrends && priceTrends.points && (
        <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200/90 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">
                  30-Day Historical Price Movement & Trend Outlook
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {currentCropObj.name}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparison of weighted daily market trading price against the statutory MSP baseline.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-agri-600"></span>
                <span>Mandi Spot Price (₹/kg)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-0.5 bg-rose-500"></span>
                <span>Govt. MSP Benchmark</span>
              </div>
            </div>
          </div>

          <div className="h-72 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceTrends.points} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="marketingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748B' }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} domain={['dataMin - 1.5', 'dataMax + 1.5']} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-2xl text-xs shadow-xl space-y-1">
                          <p className="font-bold border-b border-slate-800 pb-1">{data.date}</p>
                          <p className="text-emerald-400 font-black">Mandi Price: ₹{data.marketPrice}/kg</p>
                          <p className="text-rose-300 font-medium">MSP Benchmark: ₹{data.mspBenchmark}/kg</p>
                          <p className="text-slate-400 text-[10px]">Arrival Volume: {data.volumeTons} Tons</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="marketPrice"
                  stroke="#16A34A"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#marketingGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* AI Selling Recommendation Insight */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-950 font-black block">AI Market Timing Advisory:</strong>
                <p className="text-emerald-900 mt-0.5">{priceTrends.recommendation}</p>
              </div>
            </div>

            <Link
              to="/marketplace"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shrink-0 transition-colors shadow-xs self-start sm:self-auto"
            >
              List Produce on Marketplace →
            </Link>
          </div>
        </div>
      )}

      {/* 5. Complete APMC Mandi Rate Board Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Official Mandi Benchmark Board
            </h3>
            <p className="text-xs text-slate-500">Live prices from APMC markets across major agricultural hubs</p>
          </div>

          <button
            onClick={loadData}
            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
            title="Refresh Mandi Prices"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-100">
              <tr>
                <th className="p-3.5">Crop Name</th>
                <th className="p-3.5">Terminal Mandi Yard</th>
                <th className="p-3.5">Mandi Price (₹/kg)</th>
                <th className="p-3.5">Govt. MSP (₹/kg)</th>
                <th className="p-3.5">Weekly Shift</th>
                <th className="p-3.5">Arrival Volume</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {mandiPrices.map((mp) => (
                <tr key={mp.cropId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900">
                    {mp.cropName} <span className="text-slate-400 font-normal">({mp.hindiName})</span>
                  </td>
                  <td className="p-3.5 text-slate-600">{mp.benchmarkMandi}</td>
                  <td className="p-3.5 font-black text-slate-900">
                    ₹{(mp.currentMandiPrice / 100).toFixed(2)}
                  </td>
                  <td className="p-3.5 text-slate-500">
                    ₹{(mp.mspPrice / 100).toFixed(2)}
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      mp.priceChangePct >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {mp.priceChangePct > 0 ? `+${mp.priceChangePct}%` : `${mp.priceChangePct}%`}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-700 font-bold">
                    {mp.marketArrivalsTons} Tons/day
                  </td>
                  <td className="p-3.5 text-right">
                    <Link
                      to="/marketplace"
                      className="px-3 py-1 bg-agri-50 hover:bg-agri-100 text-agri-700 font-bold rounded-lg text-xs transition-colors"
                    >
                      Sell This Crop
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default MarketIntelligencePage;
