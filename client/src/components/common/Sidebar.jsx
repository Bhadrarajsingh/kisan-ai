import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import {
  CloudRain,
  LayoutDashboard,
  Map,
  Sprout,
  Bot,
  Bell,
  Sliders,
  SlidersHorizontal,
  Info,
  CalendarDays,
  Sparkles,
  ChevronRight,
  User,
  LogIn,
  LogOut,
  Store,
  TrendingUp,
  MessageSquare,
  Truck,
  Building2,
  Satellite,
  FlaskConical,
  Camera,
  Package,
  X,
} from 'lucide-react';

const Sidebar = ({ isOpen = false, onClose }) => {
  const { pathname } = useLocation();
  const { t, lang } = useLanguage();
  const { alerts, activeScenario, openAIChatWithPrompt } = useApp();
  const { user, isAuthenticated, logout } = useAuth();

  const weatherLinks = [
    { name: t.nav.dashboard || 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: lang === 'hi' ? 'मौसम पूर्वानुमान' : 'Weather Intelligence', path: '/forecast', icon: CalendarDays },
    { name: lang === 'hi' ? 'मानसून विश्लेषण' : 'Monsoon Forecast', path: '/farmer-advisory', icon: CloudRain, highlight: true },
    { name: t.nav.riskMap || 'Risk Map', path: '/risk-map', icon: Map },
    { name: lang === 'hi' ? 'फसल परामर्श' : 'Crop Intelligence', path: '/crop-advisory', icon: Sprout },
    { name: lang === 'hi' ? 'उपग्रह निगरानी (NDVI)' : 'Satellite Monitor', path: '/satellite-monitor', icon: Satellite, badge: 'Live' },
    { name: lang === 'hi' ? 'मृदा विश्लेषण (Soil)' : 'Soil Intelligence', path: '/soil-intelligence', icon: FlaskConical },
    { name: lang === 'hi' ? 'AI फसल डॉक्टर' : 'AI Crop Doctor', path: '/crop-doctor', icon: Camera, badge: 'AI' },
    { name: lang === 'hi' ? 'जलवायु सिम्युलेटर' : 'Impact Simulator', path: '/impact-simulator', icon: SlidersHorizontal },
    { name: t.nav.alerts || 'Early Warnings', path: '/alerts', icon: Bell, badge: alerts.length },
  ];

  const marketingLinks = [
    { name: lang === 'hi' ? 'किसान मंडी (Marketplace)' : 'Kisan Marketplace', path: '/marketplace', icon: Store, badge: 'Trade' },
    { name: lang === 'hi' ? 'मंडी भाव व विश्लेषण' : 'Market Intelligence (MSP)', path: '/market-intelligence', icon: TrendingUp },
    { name: lang === 'hi' ? 'मेरी फसल उपज' : 'My Produce', path: '/marketplace?tab=my_produce', icon: Package },
    { name: lang === 'hi' ? 'मोलभाव व प्रस्ताव' : 'Offers & Negotiation', path: '/marketplace?tab=offers', icon: MessageSquare },
    { name: lang === 'hi' ? 'ऑर्डर व डिलीवरी' : 'Orders & Logistics', path: '/marketplace?tab=orders', icon: Truck },
    { name: lang === 'hi' ? 'निकटवर्ती खरीदार' : 'Nearby Buyers', path: '/marketplace?tab=buyers', icon: Building2 },
  ];

  const assistLinks = [
    { name: lang === 'hi' ? 'AI किसान सहायक' : 'AI Farmer Assistant', path: '/ai-chat', icon: Bot },
    { name: lang === 'hi' ? 'किसान प्रोफ़ाइल' : 'Farmer Profile', path: '/profile', icon: User },
    { name: t.nav.admin || 'Admin & Scenarios', path: '/admin', icon: Sliders },
    { name: t.nav.about || 'About Platform', path: '/about', icon: Info },
  ];

  const getScenarioLabel = (s) => {
    switch (s) {
      case 'delayed_onset': return 'Delayed Onset (Dry)';
      case 'false_onset_dry_spell': return 'False Onset';
      case 'heavy_rainfall': return 'Heavy Rain Alert';
      case 'monsoon_revival': return 'Monsoon Revival';
      default: return 'Normal Monsoon';
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 shadow-xs">
      
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <Link to="/" onClick={onClose} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-agri-500 to-agri-700 flex items-center justify-center text-white shadow-md shadow-agri-600/20 group-hover:scale-105 transition-transform shrink-0">
            <CloudRain className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 tracking-tight block">
              Kisan<span className="text-agri-600">AI</span>
            </span>
            <p className="text-[11px] text-slate-500 leading-tight">
              Hyperlocal Agricultural Intel
            </p>
          </div>
        </Link>

        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* User Status Bar */}
      <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
        {isAuthenticated && user ? (
          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-2.5 w-full hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-xl bg-agri-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div className="truncate flex-1">
              <span className="text-xs font-bold text-slate-900 block truncate">{user.name}</span>
              <span className="text-[10px] text-slate-400 block truncate">{user.kisanId || 'Kisan Member'}</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </Link>
        ) : (
          <div className="flex items-center justify-between w-full text-xs">
            <span className="text-slate-500 text-[11px]">Kisan Portal:</span>
            <Link
              to="/login"
              onClick={onClose}
              className="font-bold text-agri-700 hover:text-agri-800 flex items-center gap-1"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login / Register</span>
            </Link>
          </div>
        )}
      </div>

      {/* Main Navigation Links Grouped into Sections */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-4">
        
        {/* SECTION 1: WEATHER & CROP INTELLIGENCE */}
        <div className="space-y-1">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 mb-1 flex items-center justify-between">
            <span>{lang === 'hi' ? 'मानसून व फसल सलाह' : 'Weather & Agro Intel'}</span>
          </div>

          {weatherLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-agri-50 text-agri-900 shadow-xs border border-agri-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-agri-600' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </div>

                {link.badge ? (
                  <span className="w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center">
                    {link.badge}
                  </span>
                ) : isActive ? (
                  <ChevronRight className="w-3.5 h-3.5 text-agri-600" />
                ) : null}
              </Link>
            );
          })}
        </div>

        {/* SECTION 2: AGRICULTURAL MARKETING (SEPARATE DEDICATED SECTION) */}
        <div className="space-y-1 pt-2 border-t border-slate-100">
          <div className="text-[10px] font-black text-emerald-800 uppercase tracking-wider px-3 mb-1.5 flex items-center gap-1.5 bg-emerald-50/80 py-1 rounded-lg border border-emerald-100/60">
            <Store className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === 'hi' ? 'कृषि विपणन (Marketing & Mandi)' : 'Agricultural Marketing'}</span>
          </div>

          {marketingLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.path.split('?')[0] && (link.path.includes('?') ? window.location.search.includes(link.path.split('?')[1]) : !window.location.search);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-950 shadow-xs border border-emerald-200 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="truncate">{link.name}</span>
                </div>

                {link.badge ? (
                  <span className="px-1.5 py-0.5 bg-emerald-600 text-white rounded-md text-[9px] font-black uppercase">
                    {link.badge}
                  </span>
                ) : isActive ? (
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                ) : null}
              </Link>
            );
          })}
        </div>

        {/* SECTION 3: ASSIST & DEMO */}
        <div className="space-y-1 pt-2 border-t border-slate-100">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 mb-1">
            {lang === 'hi' ? 'सहायक व एडमिन' : 'Assist & Admin'}
          </div>

          {assistLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-agri-50 text-agri-900 shadow-xs border border-agri-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-agri-600' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-agri-600" />}
              </Link>
            );
          })}
        </div>

      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-100 space-y-3 bg-slate-50/60">
        
        {/* Active Demo Scenario */}
        <Link
          to="/admin"
          onClick={onClose}
          className="block p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 hover:bg-amber-100/80 transition-colors"
        >
          <div className="flex items-center justify-between text-[11px] font-bold mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              Scenario Mode
            </span>
            <span className="text-[10px] text-amber-700 underline">Change</span>
          </div>
          <p className="text-xs font-extrabold truncate">
            {getScenarioLabel(activeScenario)}
          </p>
        </Link>

        {/* Ask AI CTA Button */}
        <button
          onClick={() => {
            if (onClose) onClose();
            openAIChatWithPrompt('What is the current monsoon risk for my selected crop?');
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-gradient-to-r from-agri-600 to-agri-700 hover:from-agri-700 hover:to-agri-800 text-white rounded-xl text-xs font-bold shadow-sm shadow-agri-700/20 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span>{lang === 'hi' ? 'किसानAI से पूछें' : 'Ask KisanAI'}</span>
        </button>

        {/* Language Switcher + Logout */}
        <div className="pt-1 flex items-center justify-between text-xs">
          <span className="text-[11px] font-semibold text-slate-500">Language / भाषा:</span>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            {isAuthenticated && (
              <button
                id="sidebar-logout-btn"
                onClick={() => { if (onClose) onClose(); logout(); }}
                title={lang === 'hi' ? 'लॉग आउट' : 'Logout'}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 hover:border-rose-300 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'लॉगआउट' : 'Logout'}</span>
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs animate-fadeIn"
            onClick={onClose}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 animate-slideRight">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
