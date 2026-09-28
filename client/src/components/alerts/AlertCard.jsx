import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  AlertTriangle, 
  CloudRain, 
  Sun, 
  Sprout, 
  BellRing, 
  CheckCircle2, 
  MessageSquare,
  Clock,
  Sparkles,
  MapPin
} from 'lucide-react';

const AlertCard = ({ alert }) => {
  const { lang } = useLanguage();
  const { openAIChatWithPrompt } = useApp();
  const [showSMSModal, setShowSMSModal] = useState(false);

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'critical':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'moderate':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'dry_spell': return <Sun className="w-5 h-5 text-amber-600" />;
      case 'heavy_rain': return <CloudRain className="w-5 h-5 text-rose-600" />;
      case 'monsoon_onset': return <Sprout className="w-5 h-5 text-agri-600" />;
      default: return <BellRing className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
            {getIcon(alert.type)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${getSeverityBadge(alert.severity)}`}>
                {alert.severity} Severity
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {alert.timeframe}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
              {lang === 'hi' ? alert.titleHindi || alert.title : alert.title}
            </h4>
          </div>
        </div>

        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg shrink-0">
          {alert.metricValue}
        </span>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed mb-3">
        {lang === 'hi' ? alert.messageHindi || alert.message : alert.message}
      </p>

      {/* Action Strip */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-3 text-xs">
        <span className="font-bold text-slate-800 block mb-1">
          {lang === 'hi' ? 'आवश्यक कृषि कार्रवाई:' : 'Action Required:'}
        </span>
        <span className="text-slate-700 font-medium">
          {lang === 'hi' ? alert.actionRequiredHindi || alert.actionRequired : alert.actionRequired}
        </span>
      </div>

      {/* Card Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-500 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-slate-400" />
          <span>{alert.locationName}</span>
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSMSModal(!showSMSModal)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg transition-colors"
            title="Simulate SMS Alert for Farmers"
          >
            <MessageSquare className="w-3 h-3 text-slate-500" />
            <span>Kisan SMS</span>
          </button>

          <button
            onClick={() => openAIChatWithPrompt(`Explain what I should do regarding the alert: "${alert.title}" in ${alert.locationName}`)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-agri-700 bg-agri-50 hover:bg-agri-100 px-2.5 py-1 rounded-lg border border-agri-200 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-agri-600" />
            <span>Ask AI</span>
          </button>
        </div>
      </div>

      {/* Simulated SMS Dropdown */}
      {showSMSModal && (
        <div className="mt-3 p-3 bg-slate-900 text-white rounded-xl text-xs space-y-1.5 animate-fadeIn font-mono">
          <div className="text-agri-400 text-[10px] font-bold uppercase tracking-wider flex items-center justify-between">
            <span>Simulated Kisan Portal SMS (160 Chars)</span>
            <span>📱 SMS-IN</span>
          </div>
          <p className="text-slate-200 text-[11px]">
            [KisanAI] {alert.title.slice(0, 40)}: {alert.actionRequired.slice(0, 90)} - Dial 1800-XXX for Voice KVK.
          </p>
        </div>
      )}
    </div>
  );
};

export default AlertCard;
