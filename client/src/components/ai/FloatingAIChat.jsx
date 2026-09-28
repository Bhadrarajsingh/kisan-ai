import React from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Bot, Sparkles } from 'lucide-react';
import AIChatModal from './AIChatModal';

const FloatingAIChat = () => {
  const { isAIChatOpen, setIsAIChatOpen } = useApp();
  const { lang } = useLanguage();

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAIChatOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-agri-600 to-agri-700 hover:from-agri-700 hover:to-agri-800 text-white font-bold rounded-full shadow-lg shadow-agri-700/30 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/40"
          aria-label="Open KisanAI Assistant"
        >
          {/* Pulsing indicator */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-yellow-400"></span>
          </span>

          <Bot className="w-5 h-5 text-white animate-float" />
          <span className="text-xs sm:text-sm tracking-tight font-extrabold">
            {lang === 'hi' ? '🤖 किसानAI से पूछें' : '🤖 Ask KisanAI'}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      {/* Modal Popup */}
      <AIChatModal
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />
    </>
  );
};

export default FloatingAIChat;
