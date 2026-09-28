import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { 
  Satellite, 
  Layers, 
  Droplets, 
  Activity, 
  Sparkles, 
  MapPin, 
  RefreshCw, 
  Info, 
  ShieldCheck, 
  AlertCircle,
  Eye,
  Sliders,
  Calendar,
  CheckCircle2,
  Bot
} from 'lucide-react';

const SatelliteMonitorPage = () => {
  const { lang } = useLanguage();
  const { selectedLocation, selectedCrop, openAIChatWithPrompt } = useApp();

  const [activeLayer, setActiveLayer] = useState('ndvi'); // 'ndvi', 'moisture', 'stress', 'waterlogging'
  const [selectedZone, setSelectedZone] = useState('Central Agricultural Belt');
  const [timeRange, setTimeRange] = useState('latest');

  const satelliteZones = [
    {
      id: 'zone-1',
      name: 'North-West Kharif Blocks (Morija / Chomu)',
      ndviScore: 0.68,
      ndviStatus: 'Vigorous / Healthy Canopy',
      ndviColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      waterStress: 'Low (18%)',
      soilSaturation: '54%',
      waterloggingRisk: 'Low',
      canopyCoverage: '78%',
      lastPassDate: '2026-09-24 (Sentinel-2 L2A)',
      anomaliesDetected: 'None. Uniform vegetative chlorophyll index.'
    },
    {
      id: 'zone-2',
      name: 'South-East Lowland Drainage Basin',
      ndviScore: 0.52,
      ndviStatus: 'Moderate Moisture Stress',
      ndviColor: 'text-amber-600 bg-amber-50 border-amber-200',
      waterStress: 'Moderate (38%)',
      soilSaturation: '42%',
      waterloggingRisk: 'Moderate in depressions',
      canopyCoverage: '61%',
      lastPassDate: '2026-09-24 (Sentinel-2 L2A)',
      anomaliesDetected: 'Localized soil moisture deficit in unbunded plots.'
    },
    {
      id: 'zone-3',
      name: 'Riverbed / Alluvial Valley Plain',
      ndviScore: 0.74,
      ndviStatus: 'Dense Vegetative Growth',
      ndviColor: 'text-emerald-700 bg-emerald-100 border-emerald-300',
      waterStress: 'Minimal (9%)',
      soilSaturation: '68%',
      waterloggingRisk: 'Elevated if >60mm rainfall occurs',
      canopyCoverage: '84%',
      lastPassDate: '2026-09-23 (Landsat 9 OLI-2)',
      anomaliesDetected: 'High biomass index; monitor for fungal humidity spots.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-800/40 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold tracking-wide uppercase">
              <Satellite className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'उपग्रह फसल निगरानी (Satellite Remote Sensing)' : 'Satellite Crop Intelligence'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {lang === 'hi' ? 'रिमोट सेंसिंग व NDVI फसल स्वास्थ्य' : 'Optical & Radar Crop Canopy Monitoring'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lang === 'hi' 
                ? 'Sentinel-2 एवं Landsat रिमोट सेंसिंग स्पेक्ट्रल बैंड्स द्वारा खेत स्तर पर हरित आवरण (NDVI), वनस्पति जल तनाव एवं संभावित जलभराव का उपग्रह विश्लेषण।'
                : '10-meter spatial resolution spectral indices monitoring Normalized Difference Vegetation Index (NDVI), crop chlorophyll vitality, and field surface moisture.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => openAIChatWithPrompt(`Explain current satellite NDVI vegetation index for ${selectedCrop.name} in ${selectedLocation.block} and what it indicates about crop stress.`)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
            >
              <Bot className="w-4 h-4 text-yellow-300" />
              <span>{lang === 'hi' ? 'AI सैटेलाइट व्याख्या' : 'AI Satellite Diagnosis'}</span>
            </button>
            <div className="px-3 py-2 bg-white/10 rounded-2xl text-[11px] font-semibold text-slate-300 backdrop-blur-md border border-white/15">
              <span>Sensor: </span>
              <strong className="text-white">Sentinel-2 (MSI)</strong>
            </div>
          </div>
        </div>

        {/* Prototype Dataset Badge */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-[11px]">
            <Info className="w-3.5 h-3.5 text-indigo-400" />
            <span>SIH Calibration: Calibrated against ISRO Bhuvan & Copernicus Sentinel-2 Level-2A surface reflectance data.</span>
          </span>
          <span className="text-[10px] text-indigo-300">Revisit Cycle: 5 Days</span>
        </div>
      </div>

      {/* 2. Layer Selection Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'ndvi', name: 'NDVI Vegetation Vigor', icon: Activity, metric: '0.68 Avg' },
            { id: 'moisture', name: 'Canopy Water Content (NDWI)', icon: Droplets, metric: 'Adequate' },
            { id: 'stress', name: 'Crop Thermal Stress', icon: Sparkles, metric: 'Low Stress' },
            { id: 'waterlogging', name: 'Surface Soil Saturation', icon: Layers, metric: 'No Flood' }
          ].map(layer => {
            const Icon = layer.icon;
            const isSelected = activeLayer === layer.id;
            return (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{layer.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {layer.metric}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 px-2 text-xs text-slate-500">
          <span>Target:</span>
          <strong className="text-slate-800">{selectedLocation.panchayat}, {selectedLocation.block}</strong>
        </div>
      </div>

      {/* 3. Satellite Heatmap / Spectral Viewer Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Simulated Imagery (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-lg relative min-h-[380px] flex flex-col justify-between p-6">
          
          {/* Simulated Satellite Multispectral Canvas Background */}
          <div className="absolute inset-0 opacity-70 bg-[radial-gradient(#16a34a_2px,transparent_2px)] [background-size:24px_24px] pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/90 to-emerald-950/40 pointer-events-none"></div>

          {/* Top Canvas HUD */}
          <div className="relative z-10 flex items-center justify-between text-xs text-white">
            <div className="flex items-center gap-2 bg-slate-800/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono font-bold">BAND B4 (Red) + B8 (NIR) Composite</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-indigo-900/80 px-2.5 py-1 rounded-lg border border-indigo-700 text-[11px] font-mono">
                Lat: 27.17° N | Lon: 75.72° E
              </span>
            </div>
          </div>

          {/* Center Visual Mock Graphic / False Color Field Polygons */}
          <div className="relative z-10 my-auto py-8">
            <div className="max-w-md mx-auto grid grid-cols-3 gap-3 p-4 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700 shadow-2xl">
              <div className="p-3 rounded-xl bg-emerald-600/40 border border-emerald-400/50 text-center space-y-1">
                <span className="text-[10px] text-emerald-300 font-bold uppercase block">Plot A (Kharif)</span>
                <span className="text-lg font-black text-white">0.76</span>
                <span className="text-[9px] text-emerald-300 block">Dense Canopy</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/30 border border-emerald-400/40 text-center space-y-1">
                <span className="text-[10px] text-emerald-300 font-bold uppercase block">Plot B (Bajra)</span>
                <span className="text-lg font-black text-white">0.68</span>
                <span className="text-[9px] text-emerald-300 block">Healthy Vigor</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/30 border border-amber-400/40 text-center space-y-1">
                <span className="text-[10px] text-amber-300 font-bold uppercase block">Plot C (Fallow)</span>
                <span className="text-lg font-black text-white">0.34</span>
                <span className="text-[9px] text-amber-300 block">Sparse Cover</span>
              </div>
            </div>
            <p className="text-center text-xs text-slate-400 mt-3 font-mono">
              [ 10m Pixel Grid • Cloud Cover: 4.2% • Zenith Angle: 28.4° ]
            </p>
          </div>

          {/* Bottom NDVI Index Legend Bar */}
          <div className="relative z-10 bg-slate-800/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="font-bold text-slate-300 text-[11px] uppercase">NDVI Spectral Spectrum:</span>
            
            <div className="flex-1 max-w-sm mx-2">
              <div className="h-3 rounded-full bg-gradient-to-r from-rose-600 via-amber-400 via-emerald-400 to-emerald-800 shadow-inner"></div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>0.0 (Bare Soil)</span>
                <span>0.4 (Moderate)</span>
                <span>0.8+ (Lush Crop)</span>
              </div>
            </div>

            <span className="font-bold text-emerald-400">Current Field: 0.68</span>
          </div>

        </div>

        {/* Right Intelligence Diagnosis Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>AI Spectral Interpretation</span>
            </div>

            <h3 className="text-sm font-black text-slate-900 leading-snug">
              Optimal Chlorophyll Absorption Observed Across {selectedCrop.name} Fields
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              Optical NIR/Red ratio indicates strong vegetative vigor with zero severe moisture deficit. Current canopy closure has reached approximately <strong>78%</strong>.
            </p>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 text-xs text-emerald-900 space-y-1">
              <span className="font-bold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Agro Action Guidance:
              </span>
              <p className="text-[11px]">
                Crop vegetative expansion is progressing on schedule. Postpone supplementary irrigation by 3–4 days as root zone spectral moisture remains adequate.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Satellite Passes & Metadata
            </span>

            <div className="space-y-2 text-xs divide-y divide-slate-100 font-medium">
              <div className="flex justify-between pt-1">
                <span className="text-slate-500">Primary Constellation</span>
                <span className="font-bold text-slate-900">ESA Sentinel-2B</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500">Radar Satellite (SAR)</span>
                <span className="font-bold text-slate-900">Sentinel-1 (C-Band)</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500">Surface Reflectance QA</span>
                <span className="font-bold text-emerald-600">Passed (Clear Sky)</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500">Next Satellite Overpass</span>
                <span className="font-bold text-indigo-600">In 38 Hours</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 4. Detailed Zone-by-Zone Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Sub-Panchayat Satellite Crop Vigor Audit
            </h3>
            <p className="text-xs text-slate-500">Granular spectral breakdown across agricultural clusters</p>
          </div>
          <span className="text-xs font-bold text-slate-500">{satelliteZones.length} Zones Analyzed</span>
        </div>

        <div className="divide-y divide-slate-100">
          {satelliteZones.map(zone => (
            <div key={zone.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
              <div className="space-y-1 max-w-lg">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-slate-900">{zone.name}</h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${zone.ndviColor}`}>
                    NDVI {zone.ndviScore} ({zone.ndviStatus})
                  </span>
                </div>
                <p className="text-xs text-slate-500">{zone.anomaliesDetected}</p>
                <div className="text-[11px] text-slate-400">Imagery: {zone.lastPassDate}</div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center sm:text-right shrink-0">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Water Stress</span>
                  <span className="text-xs font-black text-slate-800">{zone.waterStress}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Soil Moisture</span>
                  <span className="text-xs font-black text-slate-800">{zone.soilSaturation}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Canopy %</span>
                  <span className="text-xs font-black text-slate-800">{zone.canopyCoverage}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SatelliteMonitorPage;
