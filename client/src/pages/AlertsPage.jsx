import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import AlertCard from '../components/alerts/AlertCard';
import { Bell, Filter, ShieldAlert, PlusCircle, CheckCircle2, MessageSquare } from 'lucide-react';

const AlertsPage = () => {
  const { alerts } = useApp();
  const { lang } = useLanguage();
  const [filterType, setFilterType] = useState('all');

  const filterOptions = [
    { key: 'all', label: 'All Alerts' },
    { key: 'dry_spell', label: 'Dry Spell' },
    { key: 'heavy_rain', label: 'Heavy Rain' },
    { key: 'monsoon_onset', label: 'Monsoon Onset' },
    { key: 'advisory_update', label: 'Advisory Updates' }
  ];

  const filteredAlerts = filterType === 'all'
    ? alerts
    : alerts.filter(a => a.type === filterType);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-agri-600" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {lang === 'hi' ? 'मानसून एवं कृषि चेतावनी केंद्र' : 'Monsoon & Agro Alert Center'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Active weather alerts, dry spell warnings and critical agricultural actions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
            {alerts.length} Active Bulletins
          </span>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {filterOptions.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilterType(f.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              filterType === f.key
                ? 'bg-agri-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Alert Stream Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAlerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
          No alerts found under the "{filterType}" category.
        </div>
      )}

    </div>
  );
};

export default AlertsPage;
