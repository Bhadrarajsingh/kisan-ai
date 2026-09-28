import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import CropSelector from '../components/advisory/CropSelector';
import AdvisoryCard from '../components/advisory/AdvisoryCard';
import LocationSelector from '../components/common/LocationSelector';
import { Sprout, Droplets, Sun, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

const CropAdvisoryPage = () => {
  const { crops, selectedCrop, handleCropChange, forecast } = useApp();
  const { lang } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      <div>
        <div className="flex items-center gap-2">
          <Sprout className="w-6 h-6 text-agri-600" />
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'hi' ? 'फसल परामर्श एवं जल प्रबंधन मैट्रिक्स' : 'Crop Advisory & Agronomic Matrix'}
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Crop-specific moisture requirements, drought tolerance and waterlogging sensitivity
        </p>
      </div>

      <LocationSelector compact />
      <CropSelector />

      {/* Primary Advisory Card */}
      <AdvisoryCard />

      {/* Comprehensive Crop Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Sprout className="w-4 h-4 text-agri-600" />
          <span>Major Kharif Crop Comparison & Sowing Matrix</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Crop</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Min Sowing Rain</th>
                <th className="py-2.5 px-3">Dry Tolerance</th>
                <th className="py-2.5 px-3">Heavy Rain Max</th>
                <th className="py-2.5 px-3">Sowing Window</th>
                <th className="py-2.5 px-3">Drainage Need</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {crops.map((c) => {
                const isSelected = c.cropId === selectedCrop.cropId;
                return (
                  <tr
                    key={c.cropId}
                    onClick={() => handleCropChange(c.cropId)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-agri-50 font-semibold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-2.5 px-3 flex items-center gap-2 whitespace-nowrap">
                      <span className="text-base">{c.icon}</span>
                      <span className="text-slate-900 font-bold">{c.name} ({c.hindiName})</span>
                    </td>
                    <td className="py-2.5 px-3">{c.category}</td>
                    <td className="py-2.5 px-3 font-bold text-sky-700">{c.sowingRainRequirement?.minMm} mm</td>
                    <td className="py-2.5 px-3">{c.drySpellTolerance?.maxDays} Days</td>
                    <td className="py-2.5 px-3">{c.heavyRainThreshold?.maxDailyMm} mm/day</td>
                    <td className="py-2.5 px-3 text-slate-700">{c.sowingWindow}</td>
                    <td className="py-2.5 px-3 text-slate-700 truncate max-w-[150px]">{c.heavyRainThreshold?.drainageSensitivity}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default CropAdvisoryPage;
