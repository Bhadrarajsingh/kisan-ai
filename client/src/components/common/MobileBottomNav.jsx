import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  Home, 
  Map, 
  Sprout, 
  Store, 
  Bot 
} from 'lucide-react';

const MobileBottomNav = () => {
  const { pathname } = useLocation();
  const { lang } = useLanguage();
  const { openAIChatWithPrompt } = useApp();

  const navItems = [
    { label: lang === 'hi' ? 'होम' : 'Home', path: '/dashboard', icon: Home },
    { label: lang === 'hi' ? 'नक्शा' : 'Risk Map', path: '/risk-map', icon: Map },
    { label: lang === 'hi' ? 'फसल' : 'Crop', path: '/crop-advisory', icon: Sprout },
    { label: lang === 'hi' ? 'मंडी' : 'Market', path: '/marketplace', icon: Store, badge: 'Trade' },
    { label: lang === 'hi' ? 'AI सहायक' : 'AI Help', path: '/ai-chat', icon: Bot, isAi: true }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                isActive
                  ? 'text-agri-600 font-black'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-emerald-600 text-white rounded-full text-[8px] font-black uppercase">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-agri-600 mt-0.5"></span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
