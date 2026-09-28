import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Trash2, 
  X, 
  User, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio
} from 'lucide-react';

const AIChatModal = ({ isOpen, onClose, embedded = false }) => {
  const { selectedLocation, selectedCrop, forecast, weather, climate, initialAIQuery, setInitialAIQuery } = useApp();
  const { t, lang } = useLanguage();

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: lang === 'hi'
        ? `नमस्ते! मैं **किसानAI** हूँ, आपका अति-स्थानीय कृषि मौसम व मंडी सहायक।\n\nवर्तमान में **${selectedLocation.panchayat}** में **${selectedCrop.hindiName || selectedCrop.name}** के लिए मानसून सक्रियता **${forecast?.onsetProbability || 78}%** और सूखा जोखिम **${forecast?.drySpellProbability || 24}%** है।\n\nआप मुझसे बोलकर (🎤 Mic दबाकर) या लिखकर पूछ सकते हैं — जैसे: “कल बारिश होगी क्या?” या “मेरी फसल का मंडी भाव क्या है?”`
        : `Hello! I am **KisanAI**, your hyperlocal agricultural weather and farm-to-market assistant.\n\nCurrently for **${selectedCrop.name}** in **${selectedLocation.panchayat}**, sustained onset probability is **${forecast?.onsetProbability || 78}%** with a dry-spell risk of **${forecast?.drySpellProbability || 24}%**.\n\nYou can speak to me in voice (tap 🎤 Mic) or ask questions about rain, sowing, drainage, or mandi selling prices.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Text-to-Speech handler
  const speakMessage = (msgId, text) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_~`]/g, '').replace(/https?:\/\/\S+/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Voice Assistant (Speech-to-Text) toggle
  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(lang === 'hi' ? 'आपके ब्राउज़र में वॉइस इनपुट समर्थित नहीं है। कृपया Google Chrome या Edge का उपयोग करें।' : 'Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
          handleSendMessage(transcript, true);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  // Pre-fill initial query if passed from "Ask AI" button
  useEffect(() => {
    if (initialAIQuery) {
      handleSendMessage(initialAIQuery);
      setInitialAIQuery('');
    }
  }, [initialAIQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputText;
    if (!query || query.trim() === '' || isTyping) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await api.sendAIChat({
        message: query.trim(),
        locationId: selectedLocation.locationId,
        crop: selectedCrop.name,
        conversationHistory: messages.slice(-6).map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          content: m.text
        })),
        userContext: {
          location: `${selectedLocation.panchayat}, ${selectedLocation.block}, ${selectedLocation.district}`,
          crop: selectedCrop.name,
          onsetProbability: forecast?.onsetProbability || 78,
          drySpellProbability: forecast?.drySpellProbability || 24,
          heavyRainProbability: forecast?.heavyRainProbability || 38,
          confidence: forecast?.confidence || 72,
          recentRainfall: weather?.recentRainfall7d || 52,
          temperature: weather?.temperature || 29.5,
          humidity: weather?.humidity || 74,
          climateSignals: {
            enso: `${climate?.enso?.status} (${climate?.enso?.index})`,
            iod: `${climate?.iod?.status} (${climate?.iod?.index})`,
            mjo: `Phase ${climate?.mjo?.phase}, Amp ${climate?.mjo?.amplitude}`
          }
        }
      });

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.reply,
        provider: response.provider,
        isLiveAI: response.isLiveAI,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: `I experienced a temporary network delay, but based on your local metrics: Onset probability is ${forecast?.onsetProbability}%, and dry spell risk is ${forecast?.drySpellProbability}%. Sowing is recommended once 50mm moisture depth is established.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'reset',
        sender: 'ai',
        text: lang === 'hi' ? 'चैट रीसेट हो गई है। आप कोई भी नया प्रश्न पूछ सकते हैं।' : 'Chat history cleared. Feel free to ask another farm question.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Helper to format simple markdown bolding and bullet points
  const formatText = (content) => {
    return content.split('\n').map((line, idx) => {
      // Bold replacement
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="text-slate-900 font-bold">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs leading-relaxed my-0.5">
            {formattedParts}
          </li>
        );
      }
      return (
        <p key={idx} className="text-xs leading-relaxed my-1">
          {formattedParts}
        </p>
      );
    });
  };

  if (!isOpen && !embedded) return null;

  const content = (
    <div className={`flex flex-col h-full bg-white ${embedded ? 'rounded-2xl border border-slate-200/80 shadow-soft' : ''}`}>
      
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-agri-600 to-agri-500 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                {t.ai.title}
              </h3>
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                Gemini AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {selectedLocation.panchayat} • Crop: {selectedCrop.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClearChat}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {!embedded && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/40">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 max-w-[88%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs shadow-2xs ${
                isUser ? 'bg-agri-600 text-white' : 'bg-white border border-slate-200 text-agri-700'
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-3 rounded-2xl text-xs shadow-2xs relative ${
                isUser
                  ? 'bg-agri-600 text-white rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
              }`}>
                <div>{formatText(msg.text)}</div>
                
                <div className={`mt-2 text-[9px] flex items-center justify-between gap-3 pt-1 border-t ${
                  isUser ? 'text-agri-200 border-agri-500/40' : 'text-slate-400 border-slate-100'
                }`}>
                  <div className="flex items-center gap-2">
                    <span>{msg.provider || ''}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Speaker Button for Text-to-Speech (Voice Output) */}
                  {!isUser && (
                    <button
                      type="button"
                      onClick={() => speakMessage(msg.id, msg.text)}
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors ${
                        speakingMsgId === msg.id 
                          ? 'bg-emerald-100 text-emerald-800 animate-pulse' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      }`}
                      title={speakingMsgId === msg.id ? 'Stop Voice' : 'Listen in Hindi/English'}
                    >
                      {speakingMsgId === msg.id ? (
                        <>
                          <VolumeX className="w-3 h-3 text-emerald-700" />
                          <span>Mute</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3 text-slate-600" />
                          <span>{lang === 'hi' ? 'बोलकर सुनें' : 'Listen'}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-2.5 max-w-[80%]">
            <div className="w-7 h-7 rounded-full bg-white border border-slate-200 text-agri-700 shrink-0 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin-slow" />
            </div>
            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 text-xs text-slate-500 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-agri-500 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-agri-500 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-agri-500 animate-bounce [animation-delay:0.4s]"></span>
              <span className="ml-1 text-[11px]">{t.ai.thinking}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips matching exact user requirements */}
      <div className="px-4 py-2 bg-slate-50/90 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { label: lang === 'hi' ? '🌧️ बारिश कब होगी?' : '🌧️ Will it rain?', query: lang === 'hi' ? 'मेरे गाँव में बारिश कब होगी?' : 'Will it rain tomorrow in my panchayat?' },
          { label: lang === 'hi' ? '🌱 फसल सलाह' : '🌱 Crop advice', query: lang === 'hi' ? 'मेरी फसल के लिए क्या सलाह है?' : 'What is the crop advisory for my stage?' },
          { label: lang === 'hi' ? '💧 सिंचाई' : '💧 Irrigation', query: lang === 'hi' ? 'क्या मुझे अभी सिंचाई करनी चाहिए?' : 'Should I irrigate now given rainfall probability?' },
          { label: lang === 'hi' ? '🚨 मौसम जोखिम' : '🚨 Risk', query: lang === 'hi' ? 'वर्तमान मौसम व सूखा जोखिम क्या है?' : 'What is the current heavy rain and dry spell risk?' },
          { label: lang === 'hi' ? '🛒 फसल बेचें' : '🛒 Sell my crop', query: lang === 'hi' ? 'मैं अपनी फसल मंडी में कैसे बेचूँ?' : 'How can I sell my produce on KisanAI marketplace?' },
          { label: lang === 'hi' ? '📈 मंडी भाव' : '📈 Market info', query: lang === 'hi' ? 'निकटतम मंडी में आज का न्यूनतम व अधिकतम भाव क्या है?' : 'What are the current mandi rates and price trends?' },
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(item.query)}
            className="shrink-0 px-2.5 py-1 bg-white hover:bg-agri-50 text-slate-700 hover:text-agri-800 border border-slate-200 hover:border-agri-300 rounded-full text-[11px] font-semibold transition-all shadow-2xs whitespace-nowrap"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Listening Status Bar when Microphone is active */}
      {isListening && (
        <div className="px-4 py-2 bg-rose-50 border-t border-rose-200 flex items-center justify-between animate-fadeIn text-xs text-rose-800 font-bold">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
            <span>{lang === 'hi' ? '🎤 सुन रहे हैं... बोलिए (बोलते ही अपने आप भेजा जाएगा)' : '🎤 Listening to your voice... Speak now'}</span>
          </div>
          <button
            onClick={toggleVoiceInput}
            className="px-2 py-0.5 bg-rose-200 hover:bg-rose-300 text-rose-950 rounded text-[10px]"
          >
            Stop
          </button>
        </div>
      )}

      {/* Input Box with Voice & Send */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Microphone Voice Assistant Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`p-2.5 rounded-xl border transition-all shrink-0 flex items-center justify-center ${
              isListening
                ? 'bg-rose-600 text-white border-rose-700 shadow-md animate-pulse ring-2 ring-rose-400'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300'
            }`}
            title={lang === 'hi' ? 'बोलकर पूछें (Voice Assistant)' : 'Speak (Voice Assistant)'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? (lang === 'hi' ? 'सुन रहे हैं... बोलिए...' : 'Listening...') : (lang === 'hi' ? 'बोलें या लिखें (उदा. क्या कल बारिश होगी?)...' : 'Ask anything or speak (e.g. Will it rain?)...')}
            className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-agri-500 focus:bg-white transition-all"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="px-4 py-2.5 bg-agri-600 hover:bg-agri-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.ai.send}</span>
          </button>
        </form>
      </div>

    </div>
  );

  if (embedded) {
    return <div className="h-[600px]">{content}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full sm:max-w-lg h-[85vh] sm:h-[650px] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 animate-slideUp">
        {content}
      </div>
    </div>
  );
};

export default AIChatModal;
