import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import {
  CloudRain,
  Menu,
  Sparkles,
  MapPin,
  User,
  LogIn,
  Store,
  ChevronDown,
} from 'lucide-react';

const Navbar = ({ onOpenSidebar }) => {
  const { pathname } = useLocation();
  const { t, lang } = useLanguage();
  const { selectedLocation, selectedCrop, crops, handleCropChange, openAIChatWithPrompt } = useApp();
  const { user, isAuthenticated } = useAuth();

  const getPageTitle = (path) => {
    switch (path) {
      case '/': return 'Hyperlocal Monsoon Intelligence';
      case '/dashboard': return t.nav.dashboard;
      case '/farmer-advisory': return t.nav.farmerAdvisory;
      case '/risk-map': return t.nav.riskMap;
      case '/crop-advisory': return t.nav.cropAdvisory;
      case '/forecast': return t.nav.forecast;
      case '/ai-chat': return t.nav.aiAssistant;
      case '/alerts': return t.nav.alerts;
      case '/marketplace': return t.nav.marketplace || 'Farmer Marketplace';
      case '/market-intelligence': return lang === 'hi' ? 'कृषि विपणन एवं मंडी भाव' : 'Agricultural Market Intelligence';
      case '/about': return t.nav.about;
      case '/admin': return t.nav.admin;
      case '/login': return 'Kisan Portal Login';
      case '/register': return 'Farmer Registration';
      case '/profile': return 'Kisan Member Profile';
      default: return 'KisanAI';
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Left: Mobile Sidebar Toggle & Page Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Open Navigation Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-agri-600 flex items-center justify-center text-white font-bold">
                <CloudRain className="w-4 h-4" />
              </div>
              <span className="text-base font-extrabold text-slate-900">
                Kisan<span className="text-agri-600">AI</span>
              </span>
            </div>

            {/* Desktop Current Breadcrumb / Title */}
            <div className="hidden lg:flex items-center gap-2.5">
              <h2 className="text-sm font-extrabold text-slate-800 tracking-tight">
                {getPageTitle(pathname)}
              </h2>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-agri-50 border border-agri-200/80 rounded-lg text-xs font-bold text-agri-800">
                <MapPin className="w-3.5 h-3.5 text-agri-600" />
                <span>{selectedLocation.panchayat}, {selectedLocation.block}</span>
              </div>
            </div>
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Active Crop Pill — clickable dropdown */}
            <NavbarCropDropdown
              selectedCrop={selectedCrop}
              crops={crops}
              lang={lang}
              handleCropChange={handleCropChange}
            />

            {/* Quick Marketplace Pill */}
            <Link
              to="/marketplace"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition-colors shadow-2xs"
            >
              <Store className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'hi' ? 'किसान मंडी' : 'Marketplace'}</span>
            </Link>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Quick Ask AI CTA button */}
            <button
              onClick={() => openAIChatWithPrompt('What is the current monsoon risk for my selected crop?')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-agri-600 to-agri-700 hover:from-agri-700 hover:to-agri-800 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            {/* User Profile / Login Button */}
            {isAuthenticated && user ? (
              <Link
                to="/profile"
                className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 transition-colors"
                title="View Farmer Profile & Kisan ID"
              >
                <div className="w-6 h-6 rounded-lg bg-agri-600 text-white flex items-center justify-center text-[11px] font-bold">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <span className="hidden md:inline truncate max-w-[100px]">{user.name?.split(' ')[0]}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-agri-600" />
                <span>Login</span>
              </Link>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};

/* ── Crop dropdown sub-component ── */
const NavbarCropDropdown = ({ selectedCrop, crops, lang, handleCropChange }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  // Close on outside click
  React.useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative hidden sm:block">
      {/* Trigger pill */}
      <button
        id="navbar-crop-dropdown-trigger"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 px-2.5 py-1 border rounded-lg text-xs font-semibold transition-all ${
          open
            ? 'bg-agri-50 border-agri-400 text-agri-900 shadow-sm'
            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
        }`}
        title={lang === 'hi' ? 'फसल बदलें' : 'Change Crop'}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selectedCrop.icon}</span>
        <span>{lang === 'hi' ? selectedCrop.hindiName : selectedCrop.name}</span>
        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="listbox"
          aria-label={lang === 'hi' ? 'फसल चुनें' : 'Select Crop'}
          className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 p-3"
          style={{ animation: 'navDropdownIn 0.15s ease' }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 px-1">
            {lang === 'hi' ? 'फसल बदलें' : 'Change Crop'}
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {(crops || []).map((crop) => {
              const isSelected = crop.cropId === selectedCrop.cropId;
              return (
                <button
                  key={crop.cropId}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => { handleCropChange(crop.cropId); setOpen(false); }}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-agri-50 border-agri-500 text-agri-950 font-bold ring-1 ring-agri-400'
                      : 'bg-slate-50 hover:bg-agri-50 hover:border-agri-200 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="text-lg mb-0.5">{crop.icon || '🌱'}</span>
                  <span className="text-[10px] leading-tight truncate w-full font-medium">
                    {lang === 'hi' ? crop.hindiName : crop.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Keyframe animation */}
      <style>{`
        @keyframes navDropdownIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Navbar;
