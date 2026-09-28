import React from 'react';
import AIChatModal from '../components/ai/AIChatModal';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import LocationSelector from '../components/common/LocationSelector';
import CropSelector from '../components/advisory/CropSelector';
import { Bot, Sparkles, Sprout, ShieldCheck, Zap, HelpCircle } from 'lucide-react';

const AIChatPage = () => {
  const { selectedLocation, selectedCrop, forecast, openAIChatWithPrompt } = useApp();
  const { t, lang } = useLanguage();

  const suggestedQuestions = [
    { title: 'Sowing Timing', prompt: `Should I sow ${selectedCrop.name} now in ${selectedLocation.panchayat}?` },
    { title: 'Dry Spell Window', prompt: `Is a prolonged dry spell expected in the next 14 days?` },
    { title: 'Pesticide & Spraying', prompt: `Is it safe to spray pesticides given the rainfall forecast?` },
    { title: 'Heavy Rain Prep', prompt: `What field drainage steps should I take for heavy rain?` },
    { title: 'Hindi Guidance', prompt: `मुझे मेरी फसल के लिए सरल हिंदी में जानकारी दीजिए।` },
    { title: 'Climate Teleconnections', prompt: `How are ENSO and IOD influencing our monsoon this week?` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-agri-600" />
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {t.ai.title}
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Powered by Google Gemini 2.5 Flash + Local Agro-Meteorological Risk Context
        </p>
      </div>

      {/* Grid: Context Selectors + Embedded Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Context & Quick Prompts */}
        <div className="lg:col-span-4 space-y-4">
          <LocationSelector compact />
          <CropSelector compact />

          {/* Context Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-soft text-xs space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Active AI Reasoning Context</span>
            </h4>
            <div className="space-y-1 text-slate-600">
              <p>• Location: <strong>{selectedLocation.panchayat}, {selectedLocation.block}</strong></p>
              <p>• Crop: <strong>{selectedCrop.name} ({selectedCrop.category})</strong></p>
              <p>• Onset Prob: <strong>{forecast?.onsetProbability || 78}%</strong></p>
              <p>• Dry Spell Prob: <strong>{forecast?.drySpellProbability || 24}%</strong></p>
              <p>• Heavy Rain Prob: <strong>{forecast?.heavyRainProbability || 38}%</strong></p>
            </div>
          </div>

          {/* Suggested Quick Questions */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-soft">
            <h4 className="font-bold text-xs text-slate-900 mb-2.5 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Suggested Agricultural Prompts</span>
            </h4>

            <div className="space-y-1.5">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => openAIChatWithPrompt(q.prompt)}
                  className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-agri-50 border border-slate-200 hover:border-agri-300 text-xs text-slate-700 transition-colors flex items-center justify-between group"
                >
                  <span className="truncate">{q.title}</span>
                  <Sparkles className="w-3.5 h-3.5 text-slate-400 group-hover:text-agri-600 shrink-0" />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Full Embedded Chat Box */}
        <div className="lg:col-span-8">
          <AIChatModal isOpen={true} embedded={true} />
        </div>

      </div>

    </div>
  );
};

export default AIChatPage;
