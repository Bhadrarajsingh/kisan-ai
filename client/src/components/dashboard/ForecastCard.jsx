import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, ArrowUpRight, TrendingUp, AlertTriangle, CloudRain, ShieldCheck } from 'lucide-react';

const ForecastCard = ({
  type = 'onset',
  title,
  subtitle,
  value = 78,
  confidenceLevel = 'Medium',
  riskLabel = 'Favorable',
  icon: Icon = CloudRain,
  themeColor = 'green', // 'green', 'amber', 'rose', 'blue'
  promptContext = ''
}) => {
  const { openAIChatWithPrompt } = useApp();
  const { t } = useLanguage();

  const colorStyles = {
    green: {
      border: 'border-agri-200 hover:border-agri-300',
      bgGrad: 'from-agri-50/70 to-white',
      text: 'text-agri-700',
      iconBg: 'bg-agri-100 text-agri-700',
      bar: 'bg-agri-500',
      badge: 'bg-agri-100 text-agri-800 border-agri-200'
    },
    amber: {
      border: 'border-amber-200 hover:border-amber-300',
      bgGrad: 'from-amber-50/70 to-white',
      text: 'text-amber-700',
      iconBg: 'bg-amber-100 text-amber-700',
      bar: 'bg-amber-500',
      badge: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    rose: {
      border: 'border-rose-200 hover:border-rose-300',
      bgGrad: 'from-rose-50/70 to-white',
      text: 'text-rose-700',
      iconBg: 'bg-rose-100 text-rose-700',
      bar: 'bg-rose-500',
      badge: 'bg-rose-100 text-rose-800 border-rose-200'
    },
    blue: {
      border: 'border-monsoon-200 hover:border-monsoon-300',
      bgGrad: 'from-monsoon-50/70 to-white',
      text: 'text-monsoon-700',
      iconBg: 'bg-monsoon-100 text-monsoon-700',
      bar: 'bg-monsoon-500',
      badge: 'bg-monsoon-100 text-monsoon-800 border-monsoon-200'
    }
  };

  const style = colorStyles[themeColor] || colorStyles.green;

  const handleAskAI = (e) => {
    e.stopPropagation();
    openAIChatWithPrompt(promptContext || `Explain my ${title} forecast of ${value}% and what agricultural actions I should take.`);
  };

  return (
    <div className={`relative bg-gradient-to-b ${style.bgGrad} rounded-2xl border ${style.border} p-5 shadow-soft hover:shadow-md transition-all duration-200 flex flex-col justify-between group`}>
      
      {/* Top row */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-xl ${style.iconBg} flex items-center justify-center shadow-xs`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h3>
              <p className="text-[11px] text-slate-500 leading-tight">{subtitle}</p>
            </div>
          </div>
          
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${style.badge}`}>
            {riskLabel}
          </span>
        </div>

        {/* Big percentage display */}
        <div className="my-3 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${style.text}`}>
              {value}%
            </span>
            <span className="text-[11px] font-medium text-slate-500">estimated prob.</span>
          </div>

          {/* Uncertainty indicator */}
          <span className="text-[11px] text-slate-400 font-medium">
            ±5% range
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-4">
          <div
            className={`h-full ${style.bar} transition-all duration-700 ease-out rounded-full`}
            style={{ width: `${Math.min(100, Math.max(5, value))}%` }}
          />
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-500 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-slate-400" />
          <span>Confidence: <strong>{confidenceLevel}</strong></span>
        </span>

        <button
          onClick={handleAskAI}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-agri-700 hover:text-agri-900 bg-white hover:bg-agri-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors shadow-2xs"
          title="Ask KisanAI about this metric"
        >
          <Sparkles className="w-3 h-3 text-agri-600" />
          <span>{t.dashboard.topCards.askAI}</span>
        </button>
      </div>
    </div>
  );
};

export default ForecastCard;
