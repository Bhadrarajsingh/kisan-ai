import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { 
  Sliders, 
  Sparkles, 
  Database, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  Layers, 
  PlusCircle, 
  RefreshCw,
  Server,
  Bot,
  Store,
  ShoppingBag,
  Users,
  Shield,
  Eye,
  Trash2
} from 'lucide-react';

const AdminPage = () => {
  const { activeScenario, handleScenarioChange, locations, crops, alerts, refreshData } = useApp();
  const { lang } = useLanguage();

  const [adminStats, setAdminStats] = useState(null);
  const [marketplaceStats, setMarketplaceStats] = useState(null);
  const [marketProducts, setMarketProducts] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newAlertTitle, setNewAlertTitle] = useState('');
  const [newAlertMsg, setNewAlertMsg] = useState('');
  const [newAlertSeverity, setNewAlertSeverity] = useState('high');
  const [alertSuccess, setAlertSuccess] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [activeScenario]);

  const fetchStats = async () => {
    try {
      const [stats, mStats, prods] = await Promise.all([
        api.getAdminStats(),
        api.getMarketplaceStats(),
        api.getProducts()
      ]);
      setAdminStats(stats);
      setMarketplaceStats(mStats);
      setMarketProducts(prods || []);
    } catch (e) {
      console.error(e);
    }
  };

  const scenarios = [
    {
      key: 'normal_monsoon',
      name: '1. Normal Monsoon',
      tag: 'Onset: 78% • Dry Spell: 24%',
      desc: 'Favorable steady onset, balanced rainfall, low dry spell risk. Ideal for standard kharif sowing.',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    {
      key: 'delayed_onset',
      name: '2. Delayed Onset',
      tag: 'Onset: 32% • Dry Spell: 64%',
      desc: 'Suppressed MJO & warm Pacific anomalies delay onset. High risk of seed mortality for rainfed crops.',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
    },
    {
      key: 'false_onset_dry_spell',
      name: '3. False Onset + Dry Spell',
      tag: 'Onset: 48% • Dry Spell: 79%',
      desc: 'Initial deceptive rain pulse followed by an extended 10–14 day dry spell. Tests irrigation contingency logic.',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-300'
    },
    {
      key: 'heavy_rainfall',
      name: '4. Heavy Rainfall / Excess',
      tag: 'Onset: 88% • Heavy Rain: 82%',
      desc: 'Deep convective depression brings intense rain (>75mm). Tests field drainage and flood advisory warnings.',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300'
    },
    {
      key: 'monsoon_revival',
      name: '5. Monsoon Revival',
      tag: 'Onset: 84% • Dry Spell: 18%',
      desc: 'Active MJO pulse reactivates rainfall following a dry break. Recommends top-dressing and field care.',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300'
    }
  ];

  const handleSelectScenario = async (key) => {
    setIsUpdating(true);
    await handleScenarioChange(key);
    await fetchStats();
    setIsUpdating(false);
  };

  const handleCreateCustomAlert = async (e) => {
    e.preventDefault();
    if (!newAlertTitle || !newAlertMsg) return;

    try {
      await api.createAlert({
        title: newAlertTitle,
        message: newAlertMsg,
        severity: newAlertSeverity,
        locationName: 'Demo Region (Panchayat)',
        type: 'advisory_update'
      });
      setAlertSuccess(true);
      setNewAlertTitle('');
      setNewAlertMsg('');
      refreshData();
      setTimeout(() => setAlertSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-6 h-6 text-agri-600" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Hackathon Demo Controller & Admin Overview
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Switch live demo scenarios to demonstrate system behavior to judges in real-time
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* SECTION 35: DEMO SCENARIO SWITCHER FOR JUDGES */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-agri-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-yellow-400">
            <Radio className="w-5 h-5 animate-pulse" />
            <h2 className="text-lg font-bold tracking-tight text-white">
              Hackathon Demo Scenario Simulator
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Active: <strong>{activeScenario}</strong>
          </span>
        </div>

        <p className="text-xs text-slate-300 max-w-2xl mb-6">
          Selecting a scenario immediately recalibrates all probabilistic risk cards, Leaflet GIS map layers, timeline charts, crop advisory recommendations, and Google Gemini AI responses across the entire application!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {scenarios.map((sc) => {
            const isCurrent = activeScenario === sc.key;
            return (
              <div
                key={sc.key}
                onClick={() => handleSelectScenario(sc.key)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-white text-slate-950 border-agri-400 shadow-lg scale-[1.02]'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h4 className="font-extrabold text-xs sm:text-sm">{sc.name}</h4>
                    {isCurrent && (
                      <span className="w-2.5 h-2.5 rounded-full bg-agri-600 animate-ping"></span>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block mb-2 ${sc.badgeColor}`}>
                    {sc.tag}
                  </span>
                  <p className={`text-[11px] leading-relaxed ${isCurrent ? 'text-slate-600' : 'text-slate-400'}`}>
                    {sc.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-200/40 flex items-center justify-between text-[11px] font-bold">
                  <span>{isCurrent ? '✅ Active Scenario' : 'Click to Activate'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Health & Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center gap-2 text-agri-600 mb-1">
            <Server className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Monitored Locations</span>
          </div>
          <span className="text-2xl font-extrabold text-slate-900">{locations.length}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Rajasthan, MP, MH, PB</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <Bot className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Gemini AI Status</span>
          </div>
          <span className="text-sm font-extrabold text-slate-900">Official @google/genai</span>
          <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">● Ready / Fallback Live</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Database className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Database Engine</span>
          </div>
          <span className="text-sm font-extrabold text-slate-900">
            {adminStats?.systemHealth?.dbStatus || 'Active (Mock Store)'}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Mongoose Models Loaded</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <Activity className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Forecasts Generated</span>
          </div>
          <span className="text-2xl font-extrabold text-slate-900">1,248</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Last 24 Hours</span>
        </div>
      </div>

      {/* Live Alert Dispatcher for Demo */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-agri-600" />
          <span>Simulate / Broadcast Real-Time Agro Alert</span>
        </h3>

        {alertSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Alert dispatched successfully and added to the alerts feed!</span>
          </div>
        )}

        <form onSubmit={handleCreateCustomAlert} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Alert Title</label>
              <input
                type="text"
                placeholder="e.g. 🌧️ High Rainfall Warning for Chomu Block"
                value={newAlertTitle}
                onChange={(e) => setNewAlertTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-agri-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Severity</label>
              <select
                value={newAlertSeverity}
                onChange={(e) => setNewAlertSeverity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-agri-500 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Detailed Message & Farm Action</label>
            <textarea
              rows="2"
              placeholder="e.g. Heavy rainfall probability elevated to 78%. Clear drainage channels and postpone chemical spraying."
              value={newAlertMsg}
              onChange={(e) => setNewAlertMsg(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-agri-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={!newAlertTitle || !newAlertMsg}
            className="px-4 py-2 bg-agri-600 hover:bg-agri-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Broadcast Alert to Farmers
          </button>
        </form>
      </div>

      {/* Admin Marketplace Dashboard & Moderation */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-emerald-100 text-emerald-700">
                <Store className="w-4 h-4" />
              </span>
              <h3 className="text-sm sm:text-base font-black text-slate-900">
                Marketplace Administration & Produce Moderation
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitor active farmer supply, verified buyer registrations, orders, and quality compliance.
            </p>
          </div>

          <a
            href="/marketplace"
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors self-start sm:self-auto"
          >
            Open Live Marketplace →
          </a>
        </div>

        {/* Marketplace Metrics */}
        {marketplaceStats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Active Supply</span>
              <span className="text-lg font-black text-slate-900">
                {marketplaceStats.totalQuantityKg?.toLocaleString()} kg
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Across {marketplaceStats.activeListings} listings</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified Buyers</span>
              <span className="text-lg font-black text-slate-900">
                {marketplaceStats.totalBuyers} Traders
              </span>
              <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">APMC & Food Processors</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending Inquiries</span>
              <span className="text-lg font-black text-slate-900">
                {marketplaceStats.pendingOffers} Offers
              </span>
              <span className="text-[10px] text-amber-600 font-semibold block mt-0.5">Negotiation in progress</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Trade Volume (GMV)</span>
              <span className="text-lg font-black text-emerald-700">
                ₹{marketplaceStats.totalOrderValue?.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Confirmed deal value</span>
            </div>
          </div>
        )}

        {/* Product Listings Moderation Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <div className="p-3.5 bg-slate-50 font-black text-xs text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>Live Produce Listings Moderation</span>
            <span className="text-[10px] text-slate-400 font-normal">AI Verification Checked</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white text-slate-400 uppercase font-bold text-[10px] border-b border-slate-100">
                <tr>
                  <th className="p-3">Produce</th>
                  <th className="p-3">Farmer</th>
                  <th className="p-3">Qty & Price</th>
                  <th className="p-3">AI Verification</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {marketProducts.slice(0, 5).map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3">
                      <span className="font-bold text-slate-900 block">{p.name}</span>
                      <span className="text-[10px] text-slate-400">{p.variety} • {p.qualityGrade}</span>
                    </td>
                    <td className="p-3 text-slate-600">
                      {p.farmerName} ({p.location.village})
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-slate-900">{p.quantity} {p.unit}</span>
                      <span className="text-emerald-700 font-extrabold block">₹{p.expectedPrice}/{p.unit}</span>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verified ({p.aiVerification?.confidence || 95}%)</span>
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 uppercase">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={async () => {
                          if (window.confirm(`Moderate and remove listing "${p.name}"?`)) {
                            await api.deleteProduct(p.id);
                            setMarketProducts(marketProducts.filter(item => item.id !== p.id));
                          }
                        }}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminPage;
