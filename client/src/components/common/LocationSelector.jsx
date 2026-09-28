import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin, Navigation, Compass, Layers, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const LocationSelector = ({ compact = false }) => {
  const { 
    locations, 
    selectedLocation, 
    handleLocationChange, 
    detectUserLocation, 
    isDetectingLocation, 
    locationStatus 
  } = useApp();
  const { t, lang } = useLanguage();

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-soft p-4 ${compact ? 'py-3' : ''}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-agri-100 flex items-center justify-center text-agri-700 shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                {t.dashboard.selectLocation}
              </h3>
              {selectedLocation.isGPSDetected && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200 animate-pulse">
                  <Navigation className="w-2.5 h-2.5" />
                  Live GPS
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              {selectedLocation.panchayat} • {selectedLocation.district}, {selectedLocation.state}
            </p>
          </div>
        </div>

        {/* Use My Location Button */}
        <button
          onClick={detectUserLocation}
          disabled={isDetectingLocation}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-monsoon-800 bg-monsoon-50 hover:bg-monsoon-100 border border-monsoon-200 rounded-lg transition-all self-start md:self-auto shadow-2xs hover:shadow-xs active:scale-95 disabled:opacity-60"
          title="Detect your exact physical GPS location"
        >
          {isDetectingLocation ? (
            <Loader2 className="w-3.5 h-3.5 text-monsoon-600 animate-spin" />
          ) : (
            <Navigation className="w-3.5 h-3.5 text-monsoon-600 animate-pulse" />
          )}
          <span>{isDetectingLocation ? 'Detecting GPS...' : t.dashboard.useMyLocation}</span>
        </button>
      </div>

      {/* GPS Status Message Toast Banner if active */}
      {locationStatus && (
        <div className="mb-3 p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2 animate-fadeIn">
          {isDetectingLocation ? (
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span className="font-medium text-[11px]">{locationStatus}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* State */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            {t.dashboard.state}
          </label>
          <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 truncate">
            {selectedLocation.state}
          </div>
        </div>

        {/* District */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            {t.dashboard.district}
          </label>
          <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 truncate">
            {selectedLocation.district}
          </div>
        </div>

        {/* Panchayat dropdown */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            {t.dashboard.panchayat}
          </label>
          <select
            value={selectedLocation.locationId}
            onChange={(e) => handleLocationChange(e.target.value)}
            className="w-full px-3 py-2 bg-agri-50/50 border border-agri-300 rounded-lg text-xs font-semibold text-agri-950 focus:outline-none focus:ring-2 focus:ring-agri-500 transition-all cursor-pointer"
          >
            {locations.map((loc) => (
              <option key={loc.locationId} value={loc.locationId}>
                {loc.isGPSDetected ? `📍 ${loc.panchayat} (Your Detected Location)` : `${loc.panchayat} (${loc.district})`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metadata strip */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
        <div className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-slate-400" />
          <span>Coordinates: <strong>{selectedLocation.latitude.toFixed(3)}°N, {selectedLocation.longitude.toFixed(3)}°E</strong></span>
        </div>
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <span>Zone: <strong>{selectedLocation.agroClimaticZone || 'Regional Agro Zone'}</strong></span>
        </div>
        <div>
          <span>Elevation: <strong>{selectedLocation.elevation || 280}m</strong></span>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;
