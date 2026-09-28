import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Sprout, Check } from 'lucide-react';

const CropSelector = ({ compact = false }) => {
  const { crops, selectedCrop, handleCropChange } = useApp();
  const { lang } = useLanguage();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sprout className="w-4 h-4 text-agri-600" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            {lang === 'hi' ? 'अपनी फसल चुनें' : 'Select Target Crop'}
          </h3>
        </div>
        <span className="text-[11px] text-slate-500">
          {crops.length} {lang === 'hi' ? 'प्रमुख फसलें उपलब्ध' : 'Major Kharif Crops'}
        </span>
      </div>

      {/* Grid of crop pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {crops.map((crop) => {
          const isSelected = crop.cropId === selectedCrop.cropId;
          return (
            <button
              key={crop.cropId}
              onClick={() => handleCropChange(crop.cropId)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                isSelected
                  ? 'bg-agri-50 border-agri-500 text-agri-950 font-bold shadow-xs ring-1 ring-agri-500'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 font-medium'
              }`}
            >
              <span className="text-xl mb-1">{crop.icon || '🌱'}</span>
              <span className="text-xs truncate w-full">
                {lang === 'hi' ? crop.hindiName : crop.name}
              </span>
              <span className="text-[9px] text-slate-400 mt-0.5 truncate w-full">
                {crop.category}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CropSelector;
