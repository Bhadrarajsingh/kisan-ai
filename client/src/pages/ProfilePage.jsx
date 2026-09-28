import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  User, 
  MapPin, 
  Sprout, 
  Phone, 
  Mail, 
  ShieldCheck, 
  LogOut, 
  Award, 
  Calendar, 
  Edit3, 
  Save, 
  Layers,
  ArrowRight
} from 'lucide-react';

const ProfilePage = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Ramesh Patel',
    phone: user?.phone || '9876543210',
    email: user?.email || 'ramesh.farmer@kisan.in',
    farmSizeAcres: user?.farmSizeAcres || 5.0,
    primaryCrop: user?.primaryCrop || 'Soybean',
    panchayat: user?.location?.panchayat || 'Morija',
    block: user?.location?.block || 'Chomu',
    district: user?.location?.district || 'Jaipur',
    state: user?.location?.state || 'Rajasthan'
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateUserProfile({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      farmSizeAcres: Number(formData.farmSizeAcres),
      primaryCrop: formData.primaryCrop,
      location: {
        state: formData.state,
        district: formData.district,
        block: formData.block,
        panchayat: formData.panchayat
      }
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {lang === 'hi' ? 'किसान प्रोफाइल एवं खेत विवरण' : 'Kisan Member Profile'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Personalized Hyperlocal Meteorological & Agronomic Details
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'लॉगआउट' : 'Log Out'}</span>
        </button>
      </div>

      {/* Kisan Digital Identity Card */}
      <div className="bg-gradient-to-br from-agri-800 via-agri-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        
        {/* Subtle decorative watermark */}
        <div className="absolute right-4 -bottom-4 text-white/5 font-black text-9xl pointer-events-none select-none">
          KISAN
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-2xl font-bold shadow-inner shrink-0">
              {user?.name?.charAt(0) || 'R'}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-amber-950">
                  {user?.kisanId || 'KISAN-782941'}
                </span>
                <span className="text-xs text-agri-200 capitalize">
                  {user?.role || 'Verified Farmer'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {user?.name || 'Ramesh Patel'}
              </h2>
              <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-agri-400" />
                <span>{user?.location?.panchayat || 'Morija'}, {user?.location?.district || 'Jaipur'}, {user?.location?.state || 'Rajasthan'}</span>
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-xs space-y-1 self-stretch sm:self-auto min-w-[160px]">
            <span className="text-[10px] text-agri-300 font-bold uppercase tracking-wider block">Farm Specifications</span>
            <div className="flex justify-between font-bold">
              <span>Land Size:</span>
              <span className="text-amber-300">{user?.farmSizeAcres || 5.0} Acres</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Target Crop:</span>
              <span className="text-emerald-300">{user?.primaryCrop || 'Soybean'}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Profile Details & Edit Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-agri-600" />
            <span>Farm & Account Specifications</span>
          </h3>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-agri-600" />
            <span>{isEditing ? 'Cancel' : 'Edit Details'}</span>
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Farm Land Size (Acres)</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.farmSizeAcres}
                  onChange={(e) => setFormData({ ...formData, farmSizeAcres: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Crop</label>
                <select
                  value={formData.primaryCrop}
                  onChange={(e) => setFormData({ ...formData, primaryCrop: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="Soybean">Soybean (सोयाबीन)</option>
                  <option value="Maize">Maize (मक्का)</option>
                  <option value="Bajra">Bajra (बाजरा)</option>
                  <option value="Rice">Paddy / Rice (धान)</option>
                  <option value="Cotton">Cotton (कपास)</option>
                  <option value="Groundnut">Groundnut (मूंगफली)</option>
                  <option value="Pulses">Pulses (दालें)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-agri-600 hover:bg-agri-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-2xl">
              <span className="text-slate-400 block text-[11px] mb-1">Registered Phone</span>
              <span className="font-bold text-slate-900">+91 {user?.phone || '9876543210'}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl">
              <span className="text-slate-400 block text-[11px] mb-1">Farm Area</span>
              <span className="font-bold text-slate-900">{user?.farmSizeAcres || 5.0} Acres</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl">
              <span className="text-slate-400 block text-[11px] mb-1">Registered Crop</span>
              <span className="font-bold text-agri-700">{user?.primaryCrop || 'Soybean'}</span>
            </div>
          </div>
        )}

        {/* Action Link to Farmer Advisory */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            View customized sowing forecast for {user?.location?.panchayat || 'Morija'}
          </span>
          <Link
            to="/farmer-advisory"
            className="inline-flex items-center gap-1 text-xs font-bold text-agri-700 hover:text-agri-800"
          >
            <span>Go to Kisan Advisory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
};

export default ProfilePage;
