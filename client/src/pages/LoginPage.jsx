import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  CloudRain
} from 'lucide-react';

import LanguageSwitcher from '../components/common/LanguageSwitcher';

const LoginPage = () => {
  const { login, authError, setAuthError } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res?.success) {
      navigate('/dashboard');
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail('ramesh.farmer@kisan.in');
    setPassword('password123');
    setLoading(true);
    const res = await login('ramesh.farmer@kisan.in', 'password123');
    setLoading(false);
    if (res?.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8 bg-gradient-to-b from-agri-50/50 via-slate-50 to-white">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-agri-700 to-agri-900 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute top-4 right-4 z-20">
            <LanguageSwitcher />
          </div>

          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-3 text-white shadow-inner">
            <CloudRain className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            Kisan<span className="text-agri-300">AI</span>
          </h2>
          <p className="text-xs text-agri-200 mt-1">
            {lang === 'hi' ? 'किसान पोर्टल में आपका स्वागत है' : 'Hyperlocal Farmer & Agri-Intelligence Login'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-5">
          
          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {lang === 'hi' ? 'ईमेल पता' : 'Email Address'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="farmer@kisan.in"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-agri-500 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  {lang === 'hi' ? 'पासवर्ड' : 'Password'}
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-agri-500 focus:bg-white focus:outline-none transition-all placeholder:text-slate-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-agri-600 hover:bg-agri-700 text-white rounded-xl text-xs font-bold shadow-md shadow-agri-700/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>{lang === 'hi' ? 'लॉगिन करें' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Login */}
          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={handleQuickDemoLogin}
              type="button"
              disabled={loading}
              className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>1-Click Farmer Demo Login (Ramesh Patel)</span>
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-1">
              Demo: <span className="font-mono font-semibold text-slate-500">ramesh.farmer@kisan.in</span>
            </p>
          </div>

          {/* Register Link */}
          <div className="text-center text-xs text-slate-600 pt-1">
            <span>{lang === 'hi' ? 'नया खाता बनाना चाहते हैं?' : "Don't have an account?"} </span>
            <Link to="/register" className="text-agri-700 font-bold hover:underline">
              {lang === 'hi' ? 'नया किसान पंजीकरण करें' : 'Register New Farmer'}
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;

