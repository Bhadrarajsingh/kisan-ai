import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Sprout, 
  MapPin, 
  Phone, 
  User, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  CloudRain,
  ShieldCheck 
} from 'lucide-react';

import LanguageSwitcher from '../components/common/LanguageSwitcher';
import { detectCurrentLocation } from '../services/locationService';
import { 
  INDIA_LOCATION_DATA, 
  ALL_INDIAN_STATES, 
  getDistrictsForState, 
  getVillagesForDistrict 
} from '../data/indiaLocations';

const RegisterPage = () => {
  const { register, authError } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    role: 'farmer',
    state: 'Rajasthan',
    district: 'Jaipur',
    panchayat: 'Morija',
    farmSizeAcres: '5.0',
    primaryCrop: 'Soybean',
    language: 'hi'
  });
  const [loading, setLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [detectSuccess, setDetectSuccess] = useState(false);

  // Derive cascading options (State -> District -> Village / Panchayat)
  const districtList = formData.state ? getDistrictsForState(formData.state) : [];
  const panchayatList = formData.state && formData.district 
    ? getVillagesForDistrict(formData.state, formData.district) 
    : [];

  const handleStateChange = (e) => {
    const newState = e.target.value;
    const availableDistricts = getDistrictsForState(newState);
    const firstDistrict = availableDistricts[0] || '';
    const availableVillages = getVillagesForDistrict(newState, firstDistrict);
    const firstPanchayat = availableVillages[0] || '';

    setFormData(prev => ({
      ...prev,
      state: newState,
      district: firstDistrict,
      panchayat: firstPanchayat
    }));
  };

  const handleDistrictChange = (e) => {
    const newDistrict = e.target.value;
    const availableVillages = getVillagesForDistrict(formData.state, newDistrict);
    const firstPanchayat = availableVillages[0] || '';

    setFormData(prev => ({
      ...prev,
      district: newDistrict,
      panchayat: firstPanchayat
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDetectGPSLocation = async () => {
    setDetectingLocation(true);
    setDetectSuccess(false);
    try {
      const loc = await detectCurrentLocation();
      console.log('Detected raw location details:', loc);
      
      // 1. Match State
      const stateSearch = `${loc.state || ''} ${loc.rawAddress || ''}`.toLowerCase();
      const matchedState = ALL_INDIAN_STATES.find(s => 
        stateSearch.includes(s.toLowerCase()) || (loc.state && loc.state.toLowerCase().includes(s.toLowerCase()))
      ) || loc.state || 'Rajasthan';
      
      // 2. Match District from the matched state's official district list
      const availableDistricts = getDistrictsForState(matchedState);
      const districtSearch = `${loc.district || ''} ${loc.city || ''} ${loc.county || ''} ${loc.rawAddress || ''}`.toLowerCase();
      
      let matchedDistrict = availableDistricts.find(d => 
        districtSearch.includes(d.toLowerCase()) || 
        (loc.district && d.toLowerCase() === loc.district.toLowerCase())
      );

      // Coordinate boundary heuristics for Rajasthan (Udaipur vs Jaipur vs others)
      if (!matchedDistrict && loc.latitude && loc.longitude) {
        if (loc.latitude >= 23.8 && loc.latitude <= 25.2 && loc.longitude >= 73.0 && loc.longitude <= 74.4) {
          matchedDistrict = 'Udaipur';
        } else {
          matchedDistrict = loc.district || availableDistricts[0] || 'Udaipur';
        }
      } else if (!matchedDistrict) {
        matchedDistrict = loc.district || availableDistricts[0] || 'Udaipur';
      }

      // 3. Match Village/Panchayat
      const availableVillages = getVillagesForDistrict(matchedState, matchedDistrict);
      const villageSearch = `${loc.panchayat || ''} ${loc.rawAddress || ''}`.toLowerCase();
      const matchedVillage = availableVillages.find(v => 
        villageSearch.includes(v.toLowerCase()) || (loc.panchayat && loc.panchayat.toLowerCase().includes(v.toLowerCase()))
      ) || loc.panchayat || availableVillages[0] || 'City / Village';
      
      setFormData(prev => ({
        ...prev,
        state: matchedState,
        district: matchedDistrict,
        panchayat: matchedVillage
      }));
      setDetectSuccess(true);
      setTimeout(() => setDetectSuccess(false), 3500);
    } catch (err) {
      console.warn('Location detection error', err);
      alert('Could not auto-detect location. Please choose your state/district from the list.');
    } finally {
      setDetectingLocation(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Please fill in Name and Email Address');
      return;
    }
    setLoading(true);
    const res = await register({
      name: formData.name,
      phone: formData.phone || '',
      email: formData.email,
      password: formData.password || 'password123',
      role: formData.role,
      farmSizeAcres: Number(formData.farmSizeAcres) || 4,
      primaryCrop: formData.primaryCrop,
      location: {
        state: formData.state || 'Rajasthan',
        district: formData.district || 'Jaipur',
        block: formData.district || 'District Region',
        panchayat: formData.panchayat || 'Morija'
      }
    });
    setLoading(false);
    if (res?.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 bg-gradient-to-b from-agri-50/50 via-slate-50 to-white">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-agri-700 to-agri-900 text-white p-6 sm:p-8 text-center relative">
          <div className="absolute top-4 right-4 z-20">
            <LanguageSwitcher />
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-2 text-white">
            <Sprout className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {lang === 'hi' ? 'नया किसान पंजीकरण (Kisan Registration)' : 'Farmer & Agri-Member Registration'}
          </h2>
          <p className="text-xs text-agri-200 mt-1">
            {lang === 'hi' ? 'अति-स्थानीय मौसम और फसल सलाह प्राप्त करने के लिए अपनी जानकारी भरें' : 'Get hyperlocal monsoon intelligence and crop-specific alerts'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          
          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
              {authError}
            </div>
          )}

          {/* Personal Info Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {lang === 'hi' ? 'पूरा नाम (Full Name)' : 'Full Name'} *
              </label>
              <input
                type="text"
                name="name"
                placeholder="e.g. Suresh Kumar"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-agri-500 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {lang === 'hi' ? 'मोबाइल नंबर (Mobile)' : 'Mobile Number'} *
              </label>
              <input
                type="tel"
                name="phone"
                maxLength="10"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-agri-500 focus:bg-white focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Email and Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {lang === 'hi' ? 'ईमेल पता (Email)' : 'Email Address'} *
              </label>
              <input
                type="email"
                name="email"
                placeholder="farmer@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-agri-500 focus:bg-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {lang === 'hi' ? 'पासवर्ड (Password)' : 'Password'} *
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-agri-500 focus:bg-white focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {lang === 'hi' ? 'भूमिका (Role)' : 'Role'}
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-agri-500 focus:bg-white focus:outline-none font-medium"
            >
              <option value="farmer">Farmer / किसान</option>
              <option value="agronomist">Agronomist / कृषि वैज्ञानिक</option>
              <option value="extension_officer">Extension Officer / कृषि अधिकारी</option>
            </select>
          </div>

          {/* Location Details Cascading Hierarchy */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {lang === 'hi' ? 'खेत का स्थान (Farm Location Hierarchy)' : 'Farm Location Hierarchy'}
              </span>

              <button
                type="button"
                onClick={handleDetectGPSLocation}
                disabled={detectingLocation}
                className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                  detectSuccess 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                    : 'bg-agri-50 hover:bg-agri-100 text-agri-700 border-agri-200'
                }`}
                title="Detect your live district & panchayat automatically"
              >
                {detectingLocation ? (
                  <span className="w-3 h-3 border-2 border-agri-600 border-t-transparent rounded-full animate-spin"></span>
                ) : detectSuccess ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-agri-600" />
                )}
                <span>
                  {detectingLocation 
                    ? (lang === 'hi' ? 'स्थान खोजा जा रहा है...' : 'Detecting...') 
                    : detectSuccess 
                    ? (lang === 'hi' ? 'स्थान प्राप्त हुआ!' : 'Location Detected!') 
                    : (lang === 'hi' ? '📍 मेरा स्थान प्राप्त करें' : '📍 Auto-Detect Location')}
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* 1. State Dropdown */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                  {lang === 'hi' ? '1. राज्य (State)' : '1. State'}
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleStateChange}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-agri-500 focus:bg-white focus:outline-none"
                >
                  {ALL_INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* 2. District Dropdown */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                  {lang === 'hi' ? '2. ज़िला (District)' : '2. District'}
                </label>
                {districtList.length > 0 ? (
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleDistrictChange}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-agri-500 focus:bg-white focus:outline-none"
                  >
                    {districtList.map((dist) => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name="district"
                    placeholder="Enter District"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-agri-500 focus:bg-white focus:outline-none"
                  />
                )}
              </div>

              {/* 3. Panchayat / Village Dropdown */}
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                  {lang === 'hi' ? '3. ग्राम पंचायत / गाँव (Village)' : '3. Panchayat / Village'}
                </label>
                {panchayatList.length > 0 ? (
                  <select
                    name="panchayat"
                    value={formData.panchayat}
                    onChange={handleChange}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-agri-500 focus:bg-white focus:outline-none"
                  >
                    {panchayatList.map((panch) => (
                      <option key={panch} value={panch}>{panch}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name="panchayat"
                    placeholder="Enter Village/Panchayat"
                    value={formData.panchayat}
                    onChange={handleChange}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-agri-500 focus:bg-white focus:outline-none"
                  />
                )}
              </div>

            </div>
          </div>

          {/* Farm Details (Acres + Crop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {lang === 'hi' ? 'खेत का क्षेत्रफल (Farm Size in Acres)' : 'Farm Land Size (Acres)'}
              </label>
              <input
                type="number"
                step="0.5"
                name="farmSizeAcres"
                placeholder="e.g. 4.5"
                value={formData.farmSizeAcres}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-agri-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {lang === 'hi' ? 'मुख्य खरीफ फसल (Primary Crop)' : 'Primary Crop'}
              </label>
              <select
                name="primaryCrop"
                value={formData.primaryCrop}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-agri-500 focus:bg-white focus:outline-none font-medium"
              >
                <option value="Soybean">Soybean (सोयाबीन)</option>
                <option value="Maize">Maize / Corn (मक्का)</option>
                <option value="Bajra">Bajra / Millet (बाजरा)</option>
                <option value="Rice">Paddy / Rice (धान)</option>
                <option value="Cotton">Cotton (कपास)</option>
                <option value="Groundnut">Groundnut (मूंगफली)</option>
                <option value="Pulses">Pulses / Moong (दालें)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-agri-600 hover:bg-agri-700 text-white rounded-xl text-xs font-bold shadow-md shadow-agri-700/20 transition-all flex items-center justify-center gap-1.5 mt-4"
          >
            <span>{lang === 'hi' ? 'पंजीकरण पूरा करें' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center text-xs text-slate-600 pt-2">
            <span>{lang === 'hi' ? 'पहले से खाता है?' : 'Already have an account?'} </span>
            <Link to="/login" className="text-agri-700 font-bold hover:underline">
              {lang === 'hi' ? 'लॉगिन करें' : 'Sign In'}
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
