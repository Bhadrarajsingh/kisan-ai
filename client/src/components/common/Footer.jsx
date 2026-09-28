import React from 'react';
import { Link } from 'react-router-dom';
import { CloudRain, Heart, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Col 1: Brand */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-agri-600 flex items-center justify-center text-white">
                <CloudRain className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Kisan<span className="text-agri-400">AI</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hyperlocal agricultural & weather intelligence platform developed for Indian farmers, converting complex climate signals into localized agricultural decisions.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>AI-Powered Agro-Meteorological Intelligence</span>
            </div>
          </div>

          {/* Col 2: Platform Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Intelligence Dashboard</Link></li>
              <li><Link to="/farmer-advisory" className="hover:text-white transition-colors">Farmer Advisory (हिंदी)</Link></li>
              <li><Link to="/risk-map" className="hover:text-white transition-colors">Monsoon Risk GIS Map</Link></li>
              <li><Link to="/crop-advisory" className="hover:text-white transition-colors">Crop Sowing & Water Matrix</Link></li>
              <li><Link to="/forecast" className="hover:text-white transition-colors">30-Day Probabilistic Outlook</Link></li>
            </ul>
          </div>

          {/* Col 3: Scientific Drivers */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Climate Teleconnections</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• ENSO (El Niño Southern Oscillation)</li>
              <li>• IOD (Indian Ocean Dipole)</li>
              <li>• MJO (Madden-Julian Oscillation)</li>
              <li>• IMD / NCMRWF Gridded Precipitation</li>
              <li>• Google Gemini Multimodal Reasoning</li>
            </ul>
          </div>

          {/* Col 4: Hackathon Notice & Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Meteorological Notice</h4>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 text-[11px] text-slate-300 leading-relaxed space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Probabilistic Estimates</span>
              </div>
              <p>
                All generated percentages represent model-based probabilities rather than absolute deterministic predictions. Agricultural decisions should be validated with local KVK soil tests.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} KisanAI — Hyperlocal Agricultural & Weather Intelligence for Smarter Farming.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-slate-300">How It Works</Link>
            <Link to="/admin" className="hover:text-slate-300">Hackathon Scenarios</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
