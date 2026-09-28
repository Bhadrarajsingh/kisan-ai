import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import {
  ShoppingBag,
  Store,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  MapPin,
  Truck,
  Building2,
  DollarSign,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  X,
  Phone,
  MessageSquare,
  RefreshCw,
  Scale,
  Calendar,
  Layers,
  Sliders,
  Check,
  Award,
  Wheat,
  Bot
} from 'lucide-react';

const CATEGORIES = [
  { id: 'All', name: 'All Categories', icon: '🌾' },
  { id: 'Grains', name: 'Grains & Millets', icon: '🌾' },
  { id: 'Pulses', name: 'Pulses / Dal', icon: '🥜' },
  { id: 'Oilseeds', name: 'Oilseeds', icon: '🌱' },
  { id: 'Vegetables', name: 'Vegetables', icon: '🥕' },
  { id: 'Fruits', name: 'Fruits', icon: '🍎' },
  { id: 'Spices', name: 'Spices', icon: '🌶️' },
  { id: 'Dairy', name: 'Dairy & Ghee', icon: '🥛' },
  { id: 'Other', name: 'Other Produce', icon: '📦' }
];

const MarketplacePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'browse';

  const { t, lang } = useLanguage();
  const { selectedLocation, openAIChatWithPrompt } = useApp();
  const { user } = useAuth();

  // Active Tab
  const [activeTab, setActiveTab] = useState(initialTab);

  // Data states
  const [products, setProducts] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [offers, setOffers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [mandiPrices, setMandiPrices] = useState([]);
  const [priceTrends, setPriceTrends] = useState(null);
  const [selectedCropTrend, setSelectedCropTrend] = useState('bajra');
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');

  // Modal states
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [selectedProductForOffer, setSelectedProductForOffer] = useState(null);
  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);
  const [selectedOfferForCounter, setSelectedOfferForCounter] = useState(null);
  const [counterPriceInput, setCounterPriceInput] = useState('');
  const [counterMessageInput, setCounterMessageInput] = useState('');

  // Sell Produce Form State
  const [sellForm, setSellForm] = useState({
    name: 'Desi Pearl Millet (Bajra)',
    hindiName: 'देसी बाजरा',
    category: 'Grains',
    variety: 'Hybrid Pioneer 86M84',
    quantity: 500,
    unit: 'kg',
    expectedPrice: 24.5,
    minOrderQuantity: 100,
    negotiable: true,
    qualityGrade: 'Grade A (Premium)',
    moisturePercent: 11.0,
    organicStatus: 'Naturally Grown (No Chemicals)',
    harvestDate: new Date().toISOString().split('T')[0],
    state: selectedLocation?.state || 'Rajasthan',
    district: selectedLocation?.district || 'Jaipur',
    block: selectedLocation?.block || 'Chomu',
    village: selectedLocation?.panchayat || 'Morija',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80'
  });

  // AI Verification State in Modal
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [aiVerificationResult, setAiVerificationResult] = useState(null);

  // Purchase Offer Form
  const [offerForm, setOfferForm] = useState({
    quantity: 100,
    offeredPrice: 24,
    deliveryType: 'Buyer Pickup',
    message: ''
  });

  // Sync tab with URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Load all initial marketplace data
  const loadMarketplaceData = async () => {
    setIsLoading(true);
    try {
      const [prodsData, buyersData, offersData, ordersData, pricesData, trendsData, statsData] = await Promise.all([
        api.getProducts(),
        api.getBuyers(),
        api.getOffers(),
        api.getOrders(),
        api.getMarketPrices(),
        api.getMarketTrends(selectedCropTrend),
        api.getMarketplaceStats()
      ]);

      setProducts(prodsData || []);
      setBuyers(buyersData || []);
      setOffers(offersData || []);
      setOrders(ordersData || []);
      setMandiPrices(pricesData || []);
      setPriceTrends(trendsData || null);
      setStats(statsData || null);
    } catch (err) {
      console.error('Failed loading marketplace data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  // When crop trend changes
  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const trend = await api.getMarketTrends(selectedCropTrend);
        setPriceTrends(trend);
      } catch (e) {
        console.error(e);
      }
    };
    fetchTrend();
  }, [selectedCropTrend]);

  // AI Verification scan trigger
  const runAiVerificationScan = async () => {
    setIsAiScanning(true);
    try {
      const res = await api.verifyProductWithAI({
        name: sellForm.name,
        category: sellForm.category,
        variety: sellForm.variety,
        quantity: sellForm.quantity,
        unit: sellForm.unit,
        expectedPrice: sellForm.expectedPrice,
        moisturePercent: sellForm.moisturePercent
      });
      setAiVerificationResult(res);
    } catch (err) {
      console.error('AI Verification failed', err);
    } finally {
      setIsAiScanning(false);
    }
  };

  // Publish produce listing
  const handlePublishProduce = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...sellForm,
        farmerId: user?.id || 'usr-kisan-101',
        farmerName: user?.name || 'Ramesh Patel',
        farmerPhone: user?.phone || '9876543210',
        location: {
          state: sellForm.state,
          district: sellForm.district,
          block: sellForm.block,
          village: sellForm.village,
          distanceKm: 4.5
        },
        images: [sellForm.image]
      };

      const res = await api.createProduct(payload);
      if (res && res.data) {
        setProducts([res.data, ...products]);
        setIsSellModalOpen(false);
        handleTabChange('myProducts');
      }
    } catch (err) {
      console.error('Error publishing product:', err);
    }
  };

  // Submit Purchase Offer
  const handleOpenOfferModal = (product) => {
    setSelectedProductForOffer(product);
    setOfferForm({
      quantity: Math.min(product.minOrderQuantity || 50, product.quantity),
      offeredPrice: product.expectedPrice,
      deliveryType: 'Buyer Pickup',
      message: `Interested in procuring ${product.name} with prompt payment on pickup.`
    });
    setIsOfferModalOpen(true);
  };

  const handleSubmitOffer = async (e) => {
    e.preventDefault();
    if (!selectedProductForOffer) return;

    try {
      const payload = {
        productId: selectedProductForOffer.id,
        productName: selectedProductForOffer.name,
        farmerId: selectedProductForOffer.farmerId,
        farmerName: selectedProductForOffer.farmerName,
        buyerId: user?.id || 'byr-guest-101',
        buyerName: user?.name || 'Local Mandi Buyer / Trader',
        buyerPhone: user?.phone || '9829012345',
        quantity: Number(offerForm.quantity),
        unit: selectedProductForOffer.unit || 'kg',
        offeredPrice: Number(offerForm.offeredPrice),
        deliveryType: offerForm.deliveryType,
        message: offerForm.message
      };

      const res = await api.createOffer(payload);
      if (res && res.data) {
        setOffers([res.data, ...offers]);
        setIsOfferModalOpen(false);
        handleTabChange('offers');
      }
    } catch (err) {
      console.error('Error sending offer:', err);
    }
  };

  // Respond to Offer (Accept / Counter / Reject)
  const handleRespondToOffer = async (offerId, action) => {
    try {
      if (action === 'counter') {
        const offer = offers.find(o => o.id === offerId);
        setSelectedOfferForCounter(offer);
        setCounterPriceInput(offer.offeredPrice ? (offer.offeredPrice + 1).toString() : '25');
        setCounterMessageInput('Produce is premium Grade A, moisture tested. Counter offered price.');
        setIsCounterModalOpen(true);
        return;
      }

      const res = await api.respondToOffer(offerId, { action });
      if (res && res.success) {
        // Refresh offers and orders
        const updatedOffers = offers.map(o => {
          if (o.id === offerId) {
            return { ...o, status: action === 'accept' ? 'accepted' : 'rejected' };
          }
          return o;
        });
        setOffers(updatedOffers);

        if (action === 'accept' && res.data?.order) {
          setOrders([res.data.order, ...orders]);
          handleTabChange('orders');
        }
      }
    } catch (err) {
      console.error('Failed to respond to offer:', err);
    }
  };

  const handleSendCounterOffer = async (e) => {
    e.preventDefault();
    if (!selectedOfferForCounter) return;

    try {
      const res = await api.respondToOffer(selectedOfferForCounter.id, {
        action: 'counter',
        counterPrice: Number(counterPriceInput),
        message: counterMessageInput
      });

      if (res && res.success) {
        const updatedOffers = offers.map(o => {
          if (o.id === selectedOfferForCounter.id) {
            return {
              ...o,
              status: 'countered',
              counterPrice: Number(counterPriceInput)
            };
          }
          return o;
        });
        setOffers(updatedOffers);
        setIsCounterModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to send counter offer:', err);
    }
  };

  // Advance Order Status
  const handleAdvanceOrderStatus = async (orderId, currentStatus) => {
    let nextStatus = 'processing';
    let note = '';

    if (currentStatus === 'confirmed') {
      nextStatus = 'processing';
      note = 'Farmer bagged and weighed produce into standard jute bags.';
    } else if (currentStatus === 'processing') {
      nextStatus = 'ready_for_pickup';
      note = 'Produce lot staged at farm yard, ready for buyer dispatch vehicle.';
    } else if (currentStatus === 'ready_for_pickup') {
      nextStatus = 'completed';
      note = 'Buyer vehicle arrived, weighbridge ticket verified, instant payment released.';
    }

    try {
      const res = await api.updateOrderStatus(orderId, { status: nextStatus, note });
      if (res && res.data) {
        setOrders(orders.map(o => o.id === orderId ? res.data : o));
      }
    } catch (err) {
      console.error('Failed updating order status:', err);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.village?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.block?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = gradeFilter === 'All' || p.qualityGrade?.includes(gradeFilter);
    const matchesPrice = !maxPriceFilter || p.expectedPrice <= Number(maxPriceFilter);

    return matchesCategory && matchesSearch && matchesGrade && matchesPrice;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* 1. Header Banner & Farm-to-Market Persona */}
      <div className="relative overflow-hidden bg-gradient-to-br from-agri-950 via-agri-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-agri-800/40">
        
        {/* Subtle Decorative Elements */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-agri-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-12 bottom-0 opacity-10 pointer-events-none">
          <Wheat className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agri-500/20 border border-agri-400/30 text-agri-300 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>{lang === 'hi' ? 'फार्म-टू-मार्केट प्लेटफॉर्म' : 'Farm-to-Market Ecosystem'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              {t.marketplace?.title || 'Farmer Marketplace & Direct Trade'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t.marketplace?.subtitle || 'Connect weather-resilient harvested crops directly with verified traders, processors, and transparent APMC mandi benchmarks.'}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsSellModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-agri-600 hover:from-emerald-600 hover:to-agri-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>{t.marketplace?.sellProduceBtn || '+ Sell Your Produce'}</span>
            </button>

            <button
              onClick={() => openAIChatWithPrompt(lang === 'hi' ? 'मेरी 500 किग्रा बाजरा की फसल को सही भाव पर कैसे बेचूं?' : 'I have 500 kg Bajra. How can I find the best nearby buyers and prices?')}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm backdrop-blur-md border border-white/20 transition-all"
            >
              <Bot className="w-4 h-4 text-yellow-300" />
              <span>{lang === 'hi' ? 'AI बाजार सहायक' : 'AI Market Assistant'}</span>
            </button>
          </div>
        </div>

        {/* 2. End-to-End Farmer Lifecycle Pathway (Predict -> Plan -> Grow -> Monitor -> Harvest -> Sell) */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            {lang === 'hi' ? 'सम्पूर्ण किसान यात्रा (Predict → Plan → Grow → Monitor → Harvest → Sell)' : 'Complete Farmer Journey: Weather Intelligence to Direct Monetization'}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { step: '1. PREDICT', title: 'Monsoon Risk', desc: '7-30d Teleconnections', active: false, link: '/forecast' },
              { step: '2. PLAN', title: 'Sowing Window', desc: 'Moisture Thresholds', active: false, link: '/crop-advisory' },
              { step: '3. GROW', title: 'Agro Advisory', desc: 'Pest & Spray Timing', active: false, link: '/farmer-advisory' },
              { step: '4. MONITOR', title: 'GIS Risk Map', desc: 'Block & Dry Spells', active: false, link: '/risk-map' },
              { step: '5. HARVEST', title: 'Mandi Rates', desc: 'Live APMC Benchmarks', active: true, action: () => handleTabChange('intelligence') },
              { step: '6. SELL', title: 'Direct Trade', desc: 'Offers & Farm-gate', active: true, action: () => handleTabChange('browse') }
            ].map((st, idx) => (
              <div
                key={idx}
                onClick={st.action || undefined}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  st.active
                    ? 'bg-agri-500/20 border-agri-400/50 text-white cursor-pointer hover:bg-agri-500/30'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="text-[9px] font-black text-agri-400 tracking-wider uppercase">{st.step}</div>
                <div className="text-xs font-bold truncate mt-0.5">{st.title}</div>
                <div className="text-[10px] text-slate-400 truncate">{st.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Marketplace Metrics Strip */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-black text-slate-900">{stats.activeListings}</div>
              <div className="text-[11px] text-slate-500 font-medium">Active Crop Listings</div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-black text-slate-900">{stats.totalBuyers}</div>
              <div className="text-[11px] text-slate-500 font-medium">Verified Buyers</div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-black text-slate-900">{offers.length}</div>
              <div className="text-[11px] text-slate-500 font-medium">Active Negotiations</div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-black text-slate-900">{orders.length}</div>
              <div className="text-[11px] text-slate-500 font-medium">Orders & Deliveries</div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Main Navigation Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-2xs overflow-x-auto flex items-center gap-1 scrollbar-none">
        {[
          { id: 'browse', name: lang === 'hi' ? 'उपज खोजें' : 'Browse Produce', icon: Store, count: products.length },
          { id: 'myProducts', name: lang === 'hi' ? 'मेरी उपज (Farmer)' : 'My Produce', icon: Layers, count: products.filter(p => p.farmerId === (user?.id || 'usr-kisan-101')).length },
          { id: 'offers', name: lang === 'hi' ? 'मोलभाव व प्रस्ताव' : 'Offers & Negotiation', icon: MessageSquare, count: offers.length, badgeColor: 'bg-amber-500' },
          { id: 'orders', name: lang === 'hi' ? 'ऑर्डर व डिलीवरी' : 'Orders & Logistics', icon: Truck, count: orders.length },
          { id: 'intelligence', name: lang === 'hi' ? 'मंडी भाव व रुझान' : 'Market Intelligence', icon: TrendingUp },
          { id: 'buyers', name: lang === 'hi' ? 'निकटवर्ती खरीदार' : 'Nearby Buyers', icon: Building2, count: buyers.length }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-agri-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.name}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: BROWSE PRODUCE LISTINGS */}
      {/* ========================================================================= */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          
          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map(cat => {
              const isCatActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    isCatActive
                      ? 'bg-agri-700 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Search & Refinement Bar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={t.marketplace?.filters?.searchPlaceholder || "Search crop name, variety, village, or block..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-agri-500/20 focus:border-agri-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium text-slate-700"
              >
                <option value="All">All Grades</option>
                <option value="Grade A">Grade A (Premium)</option>
                <option value="Grade B">Grade B (Standard)</option>
              </select>

              <input
                type="number"
                placeholder="Max ₹/kg"
                value={maxPriceFilter}
                onChange={(e) => setMaxPriceFilter(e.target.value)}
                className="w-28 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-medium"
              />

              {(searchQuery || maxPriceFilter || gradeFilter !== 'All' || selectedCategory !== 'All') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setMaxPriceFilter('');
                    setGradeFilter('All');
                    setSelectedCategory('All');
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 text-xs font-bold"
                  title="Clear Filters"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl">
                🌾
              </div>
              <h3 className="text-base font-bold text-slate-800">No produce listings found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No active lots match your current search and category filters. Try clearing filters or be the first to list produce!
              </p>
              <button
                onClick={() => setIsSellModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-agri-600 hover:bg-agri-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>List Produce Now</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
                >
                  {/* Image & Badges Header */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-white/90 backdrop-blur-md text-slate-800 shadow-xs">
                        {product.category}
                      </span>

                      {product.aiVerification?.isVerified && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/90 backdrop-blur-md text-white shadow-xs">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                          <span>AI Verified ({product.aiVerification.confidence}%)</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Image Stats */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white">
                      <div>
                        <span className="text-[11px] text-slate-200 block">{product.variety}</span>
                        <h3 className="text-sm font-black text-white truncate max-w-[200px]">
                          {lang === 'hi' ? product.hindiName || product.name : product.name}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-emerald-300 font-bold block">Expected</span>
                        <span className="text-lg font-black text-white leading-tight">
                          ₹{product.expectedPrice}
                          <span className="text-xs font-normal text-slate-300">/{product.unit}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    
                    {/* Specs Grid */}
                    <div className="grid grid-cols-3 gap-2 py-2 bg-slate-50/80 rounded-2xl p-2.5 text-center border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Quantity</span>
                        <span className="text-xs font-black text-slate-800">
                          {product.quantity} {product.unit}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Grade</span>
                        <span className="text-xs font-black text-emerald-700">
                          {product.qualityGrade?.split(' ')[0] || 'Grade A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Moisture</span>
                        <span className="text-xs font-black text-slate-800">
                          {product.moisturePercent || '11.0'}%
                        </span>
                      </div>
                    </div>

                    {/* AI Verified Quality Tag */}
                    {product.aiVerification?.qualityIndicator && (
                      <div className="flex items-start gap-2 p-2.5 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-[11px] text-emerald-900 leading-tight">
                        <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{product.aiVerification.qualityIndicator}</span>
                      </div>
                    )}

                    {/* Location & Farmer Info */}
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">
                          {product.location.village}, {product.location.block}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 shrink-0">
                        {product.negotiable ? '🤝 Negotiable' : '🔒 Fixed Price'}
                      </span>
                    </div>

                    {/* Action CTA */}
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => handleOpenOfferModal(product)}
                        className="flex-1 py-2.5 px-3 bg-agri-600 hover:bg-agri-700 text-white font-extrabold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Make Offer / Buy</span>
                      </button>

                      <button
                        onClick={() => openAIChatWithPrompt(`Analyze market viability and expected buyer interest for ${product.name} at ₹${product.expectedPrice}/${product.unit} in ${product.location.block}.`)}
                        className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                        title="AI Analysis"
                      >
                        <Bot className="w-3.5 h-3.5 text-agri-700" />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MY PRODUCE (FARMER INVENTORY MANAGEMENT) */}
      {/* ========================================================================= */}
      {activeTab === 'myProducts' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {lang === 'hi' ? 'मेरी फसल व उपज सूची' : 'My Listed Farm Produce'}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'hi' ? 'अपनी सक्रिय उपज देखें, नया लॉट जोड़ें या प्राप्त खरीदार बोलियां प्रबंधित करें।' : 'Manage your harvested stock, monitor active listings, and check incoming buyer requests.'}
              </p>
            </div>

            <button
              onClick={() => setIsSellModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-agri-600 hover:bg-agri-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{lang === 'hi' ? '+ नया लॉट जोड़ें' : '+ Add New Lot'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {products
              .filter(p => p.farmerId === (user?.id || 'usr-kisan-101'))
              .map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={prod.images?.[0] || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80'}
                      alt={prod.name}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">{prod.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {prod.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                        <span>{prod.variety}</span>
                        <span>•</span>
                        <span>{prod.quantity} {prod.unit}</span>
                        <span>•</span>
                        <span className="font-extrabold text-slate-800">₹{prod.expectedPrice}/{prod.unit}</span>
                        <span>•</span>
                        <span className="text-slate-400">Harvest: {prod.harvestDate}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 italic max-w-xl">
                        "{prod.aiVerification?.suggestedDescription || 'Fresh farm lot ready for dispatch'}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <button
                      onClick={() => handleTabChange('offers')}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                    >
                      View Inquiries
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to remove this listing?')) {
                          await api.deleteProduct(prod.id);
                          setProducts(products.filter(p => p.id !== prod.id));
                        }
                      }}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: OFFERS & NEGOTIATION WORKFLOW */}
      {/* ========================================================================= */}
      {activeTab === 'offers' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              {lang === 'hi' ? 'खरीद प्रस्ताव व मोलभाव (Negotiation Center)' : 'Purchase Offers & Negotiation Hub'}
            </h2>
            <p className="text-xs text-slate-500">
              {lang === 'hi' ? 'खरीदारों द्वारा भेजे गए खरीद प्रस्तावों की समीक्षा करें। आप सीधे स्वीकार कर सकते हैं, अस्वीकार कर सकते हैं या नया भाव (Counter Offer) प्रस्तावित कर सकते हैं।' : 'Review direct buyer purchase requests. Accept at offer price, propose a counter-offer, or reject.'}
            </p>
          </div>

          <div className="space-y-4">
            {offers.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400">
                No active purchase inquiries yet. Browse produce and click "Make Offer" to test the negotiation flow!
              </div>
            ) : (
              offers.map((offer) => {
                const isPending = offer.status === 'pending';
                const isCountered = offer.status === 'countered';
                const isAccepted = offer.status === 'accepted';
                const isRejected = offer.status === 'rejected';

                return (
                  <div
                    key={offer.id}
                    className={`bg-white rounded-3xl p-5 border transition-all ${
                      isAccepted
                        ? 'border-emerald-300 bg-emerald-50/20'
                        : isCountered
                        ? 'border-amber-300 bg-amber-50/20'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      
                      {/* Left: Product & Buyer Info */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-900">{offer.productName}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            isAccepted
                              ? 'bg-emerald-100 text-emerald-800'
                              : isCountered
                              ? 'bg-amber-100 text-amber-800'
                              : isRejected
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {offer.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 flex items-center gap-2">
                          <span className="font-bold text-slate-800">{offer.buyerName}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-500">
                            <Phone className="w-3 h-3" /> {offer.buyerPhone}
                          </span>
                        </div>
                      </div>

                      {/* Right: Price & Quantity Calculation */}
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block font-bold uppercase">Requested Qty</span>
                          <span className="text-sm font-black text-slate-800">
                            {offer.quantity} {offer.unit}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block font-bold uppercase">Offered Price</span>
                          <span className="text-base font-black text-emerald-700">
                            ₹{offer.offeredPrice}/{offer.unit}
                          </span>
                        </div>

                        {offer.counterPrice && (
                          <div className="text-right">
                            <span className="text-[10px] text-amber-600 block font-bold uppercase">Counter Price</span>
                            <span className="text-base font-black text-amber-700">
                              ₹{offer.counterPrice}/{offer.unit}
                            </span>
                          </div>
                        )}

                        <div className="text-right pl-4 border-l border-slate-200">
                          <span className="text-[10px] text-slate-400 block font-bold uppercase">Total Deal Value</span>
                          <span className="text-base font-black text-slate-900">
                            ₹{(offer.counterPrice || offer.offeredPrice) * offer.quantity}
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* Negotiation History & Message */}
                    <div className="py-3">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Negotiation Thread & Notes
                      </div>
                      <div className="space-y-1.5">
                        {offer.history?.map((h, i) => (
                          <div
                            key={i}
                            className={`p-2.5 rounded-xl text-xs flex items-start justify-between gap-3 ${
                              h.sender === 'farmer'
                                ? 'bg-emerald-50/80 border border-emerald-100 text-emerald-900'
                                : 'bg-slate-50 border border-slate-100 text-slate-800'
                            }`}
                          >
                            <div>
                              <span className="font-extrabold uppercase text-[10px] text-slate-400 block">
                                {h.sender === 'farmer' ? '👨🌾 Farmer Response' : '🏢 Buyer Offer'}
                              </span>
                              <p className="text-xs font-medium mt-0.5">{h.message}</p>
                            </div>
                            <span className="text-xs font-black shrink-0">₹{h.price}/{offer.unit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Negotiation Action Buttons */}
                    {(isPending || isCountered) && (
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => handleRespondToOffer(offer.id, 'reject')}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-bold rounded-xl transition-colors"
                        >
                          Decline Offer
                        </button>

                        <button
                          onClick={() => handleRespondToOffer(offer.id, 'counter')}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                        >
                          Send Counter-Offer
                        </button>

                        <button
                          onClick={() => handleRespondToOffer(offer.id, 'accept')}
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4 text-white" />
                          <span>Accept Offer & Create Order</span>
                        </button>
                      </div>
                    )}

                    {isAccepted && (
                      <div className="pt-3 border-t border-emerald-100 flex items-center justify-between text-xs text-emerald-800 font-bold">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Offer accepted! Active purchase order generated.</span>
                        </span>
                        <button
                          onClick={() => handleTabChange('orders')}
                          className="text-emerald-700 underline text-xs font-bold hover:text-emerald-900"
                        >
                          Track Logistics in Orders →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ORDERS & LOGISTICS TRACKING */}
      {/* ========================================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              {lang === 'hi' ? 'ऑर्डर प्रबंधन व लॉजिस्टिक्स' : 'Order Lifecycle & Logistics Tracking'}
            </h2>
            <p className="text-xs text-slate-500">
              {lang === 'hi' ? 'सत्यापित खरीद ऑर्डर, पिकअप स्लॉट, बोरियों में पैकिंग और भुगतान स्थिति को ट्रैक करें।' : 'Track confirmed farm-gate orders, pickup appointments, weighbridge receipts, and fulfillment stages.'}
            </p>
          </div>

          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-400">
                No orders generated yet. Accept an offer to create an active order!
              </div>
            ) : (
              orders.map((order) => {
                const stages = ['confirmed', 'processing', 'ready_for_pickup', 'completed'];
                const currentStageIdx = stages.indexOf(order.status);

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-5"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-agri-700 px-2 py-0.5 rounded bg-agri-50">
                            {order.orderNumber}
                          </span>
                          <h3 className="text-sm font-black text-slate-900">{order.productName}</h3>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Buyer: <span className="font-bold text-slate-700">{order.buyerName}</span> ({order.buyerPhone})
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Amount</span>
                        <span className="text-lg font-black text-slate-900">₹{order.totalAmount}</span>
                        <span className="text-[11px] text-slate-500 block">
                          ({order.quantity} {order.unit} @ ₹{order.agreedPrice}/{order.unit})
                        </span>
                      </div>
                    </div>

                    {/* Interactive Stepper Progress Bar */}
                    <div className="py-2">
                      <div className="grid grid-cols-4 gap-2 relative">
                        {[
                          { key: 'confirmed', label: '1. Confirmed', desc: 'Agreement Signed' },
                          { key: 'processing', label: '2. Bagging', desc: 'Weighed & Packed' },
                          { key: 'ready_for_pickup', label: '3. Farm Ready', desc: 'Ready for Dispatch' },
                          { key: 'completed', label: '4. Completed', desc: 'Payment Settled' }
                        ].map((st, i) => {
                          const isDone = i <= currentStageIdx;
                          const isCurrent = i === currentStageIdx;

                          return (
                            <div key={st.key} className="text-center relative">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold transition-all ${
                                  isDone
                                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                                    : 'bg-slate-100 text-slate-400'
                                }`}
                              >
                                {isDone ? <Check className="w-4 h-4 text-white" /> : i + 1}
                              </div>
                              <div className={`text-xs font-bold mt-1.5 ${isCurrent ? 'text-emerald-700' : 'text-slate-700'}`}>
                                {st.label}
                              </div>
                              <div className="text-[10px] text-slate-400 hidden sm:block">{st.desc}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Logistics & Location Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl text-xs text-slate-600 border border-slate-100">
                      <div>
                        <span className="font-bold text-slate-800 block mb-0.5">Pickup Location:</span>
                        <p>{order.pickupLocation?.village}, {order.pickupLocation?.block}, {order.pickupLocation?.district}</p>
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block mb-0.5">Pickup Window:</span>
                        <p>{order.pickupDate || 'Scheduled within 48 hours'}</p>
                      </div>
                    </div>

                    {/* Advance Status Button for Farmer / Admin */}
                    {order.status !== 'completed' && (
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-[11px] text-slate-400">
                          Click to advance logistics state as you prepare produce:
                        </span>
                        <button
                          onClick={() => handleAdvanceOrderStatus(order.id, order.status)}
                          className="px-4 py-2 bg-agri-600 hover:bg-agri-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                        >
                          <span>Advance to Next Step</span>
                          <ArrowRight className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: MARKET INTELLIGENCE & PRICE TRENDS */}
      {/* ========================================================================= */}
      {activeTab === 'intelligence' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {lang === 'hi' ? 'मंडी भाव व 30-दिवसीय मूल्य रुझान' : 'Mandi Intelligence & 30-Day Price Trends'}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'hi' ? 'सरकारी न्यूनतम समर्थन मूल्य (MSP) और स्थानीय APMC मंडियों के वास्तविक भावों की तुलना देखें।' : 'Real-time APMC Mandi rates compared against Minimum Support Prices (MSP) and historical price movements.'}
              </p>
            </div>

            {/* Crop Selector Strip */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {[
                { id: 'bajra', name: 'Bajra' },
                { id: 'soybean', name: 'Soybean' },
                { id: 'wheat', name: 'Wheat' },
                { id: 'cotton', name: 'Cotton' },
                { id: 'groundnut', name: 'Groundnut' },
                { id: 'pulses', name: 'Moong Dal' }
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCropTrend(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    selectedCropTrend === c.id
                      ? 'bg-agri-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Comparison Summary Cards */}
          {priceTrends && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Current Mandi Rate
                </span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  ₹{priceTrends.currentPriceKg}
                  <span className="text-xs font-normal text-slate-500"> / kg</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-600">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Trend: {priceTrends.trend.toUpperCase()}</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Official MSP Benchmark
                </span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  ₹{priceTrends.mspKg}
                  <span className="text-xs font-normal text-slate-500"> / kg</span>
                </div>
                <div className="text-xs text-slate-500 mt-2 font-medium">
                  Govt. Minimum Support Price floor
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Selling Recommendation
                </span>
                <p className="text-xs font-bold text-slate-800 mt-1 leading-relaxed">
                  {priceTrends.recommendation}
                </p>
                <button
                  onClick={() => openAIChatWithPrompt(`Explain current mandi price movements for ${priceTrends.cropName} and advise whether I should sell now or hold.`)}
                  className="mt-2 text-xs font-bold text-agri-600 hover:text-agri-800 flex items-center gap-1"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Ask AI for Selling Advice →</span>
                </button>
              </div>
            </div>
          )}

          {/* 30-Day Interactive Recharts Timeline */}
          {priceTrends && priceTrends.points && (
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    30-Day Mandi Price & Arrival Volume Timeline ({priceTrends.cropName})
                  </h3>
                  <p className="text-xs text-slate-400">
                    Daily weighted average trading price (₹/kg) vs MSP floor
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-agri-600"></span>
                    <span className="font-semibold text-slate-700">Mandi Price</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-rose-500"></span>
                    <span className="font-semibold text-slate-700">MSP Benchmark</span>
                  </div>
                </div>
              </div>

              <div className="h-64 sm:h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={priceTrends.points} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="mandiGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16A34A" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#16A34A" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748B' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748B' }} domain={['dataMin - 2', 'dataMax + 2']} tickLine={false} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white p-3 rounded-xl text-xs shadow-lg space-y-1">
                              <p className="font-bold">{data.date}</p>
                              <p className="text-emerald-400 font-extrabold">Price: ₹{data.marketPrice}/kg</p>
                              <p className="text-rose-300">MSP Floor: ₹{data.mspBenchmark}/kg</p>
                              <p className="text-slate-400">Daily Arrivals: {data.volumeTons} Tons</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="marketPrice"
                      stroke="#16A34A"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#mandiGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Mandi Benchmark Table */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 bg-slate-50/80 border-b border-slate-200 font-black text-xs text-slate-700 uppercase tracking-wider">
              Major Kharif Crops APMC Mandi Rate Board
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3.5">Crop</th>
                    <th className="p-3.5">Benchmark Mandi</th>
                    <th className="p-3.5">Mandi Price</th>
                    <th className="p-3.5">Govt. MSP</th>
                    <th className="p-3.5">Trend</th>
                    <th className="p-3.5">Demand Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {mandiPrices.map((mp) => (
                    <tr key={mp.cropId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900">
                        {mp.cropName} <span className="text-slate-400 font-normal">({mp.hindiName})</span>
                      </td>
                      <td className="p-3.5 text-slate-600">{mp.benchmarkMandi}</td>
                      <td className="p-3.5 font-black text-slate-900">₹{(mp.currentMandiPrice / 100).toFixed(2)}/kg</td>
                      <td className="p-3.5 text-slate-500">₹{(mp.mspPrice / 100).toFixed(2)}/kg</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          mp.priceChangePct >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {mp.priceChangePct > 0 ? `+${mp.priceChangePct}%` : `${mp.priceChangePct}%`}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-slate-700">{mp.demandLevel}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: NEARBY BUYERS DIRECTORY */}
      {/* ========================================================================= */}
      {activeTab === 'buyers' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              {lang === 'hi' ? 'सत्यापित खरीदार व व्यापारी निर्देशिका' : 'Verified Nearby Buyers & Wholesale Traders'}
            </h2>
            <p className="text-xs text-slate-500">
              {lang === 'hi' ? 'अपने जिले के पंजीकृत अनाज व्यापारी, तेल मिल मालिक और दाल प्रोसेसर्स से सीधे संपर्क करें।' : 'Discover institutional buyers, processors, and APMC wholesalers actively seeking harvested produce.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {buyers.map((buyer) => (
              <div
                key={buyer.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        {buyer.buyerType}
                      </span>
                      <h3 className="text-sm font-black text-slate-900 mt-1.5">{buyer.businessName}</h3>
                      <p className="text-xs text-slate-500">Contact: {buyer.contactPerson}</p>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-xl text-xs font-bold text-amber-800">
                      <span>★</span>
                      <span>{buyer.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{buyer.location.block}, {buyer.location.district} ({buyer.location.distanceKm} km away)</span>
                  </div>

                  {/* Demand Crops Pills */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">
                      Actively Procuring Crops:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {buyer.demandCrops?.map((dc, i) => (
                        <div
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-bold text-slate-700 flex items-center gap-1.5"
                        >
                          <span>{dc.cropName}:</span>
                          <span className="text-emerald-700">{dc.priceRange}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-600 font-semibold">
                    <Phone className="w-3.5 h-3.5 text-agri-600" />
                    <span>{buyer.phone}</span>
                  </div>

                  <button
                    onClick={() => {
                      setIsSellModalOpen(true);
                    }}
                    className="px-4 py-2 bg-agri-600 hover:bg-agri-700 text-white rounded-xl font-bold transition-colors shadow-xs"
                  >
                    List Crop for Buyer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: SELL PRODUCE LISTING FORM WITH AI VERIFICATION */}
      {/* ========================================================================= */}
      {isSellModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl border border-slate-200 animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {lang === 'hi' ? 'अपनी उपज बेचें (List Your Produce)' : 'List Your Harvested Farm Produce'}
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in crop metrics and run instant AI image verification to attract buyers.
                </p>
              </div>
              <button
                onClick={() => setIsSellModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishProduce} className="space-y-4 text-xs">
              
              {/* Row 1: Crop Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Crop Name (फसल का नाम)</label>
                  <input
                    type="text"
                    required
                    value={sellForm.name}
                    onChange={(e) => setSellForm({ ...sellForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-agri-500/20"
                    placeholder="e.g. Bajra (Pearl Millet), Soybean"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Category (श्रेणी)</label>
                  <select
                    value={sellForm.category}
                    onChange={(e) => setSellForm({ ...sellForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  >
                    {CATEGORIES.filter(c => c.id !== 'All').map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Variety & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Variety (किस्म / बीज)</label>
                  <input
                    type="text"
                    value={sellForm.variety}
                    onChange={(e) => setSellForm({ ...sellForm, variety: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                    placeholder="e.g. Pioneer 86M84, JS 9560"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Quantity (मात्रा)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={sellForm.quantity}
                    onChange={(e) => setSellForm({ ...sellForm, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Unit (इकाई)</label>
                  <select
                    value={sellForm.unit}
                    onChange={(e) => setSellForm({ ...sellForm, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="quintal">Quintal (100 kg)</option>
                    <option value="ton">Metric Ton (1000 kg)</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Expected Price & Quality Grade */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Expected Price (₹/kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={sellForm.expectedPrice}
                    onChange={(e) => setSellForm({ ...sellForm, expectedPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none font-black text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Grade (गुणवत्ता)</label>
                  <select
                    value={sellForm.qualityGrade}
                    onChange={(e) => setSellForm({ ...sellForm, qualityGrade: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  >
                    <option value="Grade A (Premium)">Grade A (Premium)</option>
                    <option value="Grade B (Standard)">Grade B (Standard)</option>
                    <option value="Grade C (Fair)">Grade C (Fair)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Moisture % (नमी)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={sellForm.moisturePercent}
                    onChange={(e) => setSellForm({ ...sellForm, moisturePercent: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 4: Location pre-fill */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase">State</label>
                  <input
                    type="text"
                    value={sellForm.state}
                    onChange={(e) => setSellForm({ ...sellForm, state: e.target.value })}
                    className="w-full text-xs font-bold bg-transparent border-none p-0 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase">District</label>
                  <input
                    type="text"
                    value={sellForm.district}
                    onChange={(e) => setSellForm({ ...sellForm, district: e.target.value })}
                    className="w-full text-xs font-bold bg-transparent border-none p-0 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase">Block</label>
                  <input
                    type="text"
                    value={sellForm.block}
                    onChange={(e) => setSellForm({ ...sellForm, block: e.target.value })}
                    className="w-full text-xs font-bold bg-transparent border-none p-0 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase">Village / Farm</label>
                  <input
                    type="text"
                    value={sellForm.village}
                    onChange={(e) => setSellForm({ ...sellForm, village: e.target.value })}
                    className="w-full text-xs font-bold bg-transparent border-none p-0 focus:outline-none"
                  />
                </div>
              </div>

              {/* AI Product Verification Scan Widget */}
              <div className="p-4 bg-gradient-to-br from-emerald-50 via-agri-50 to-slate-50 rounded-2xl border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span className="font-extrabold text-xs text-emerald-950">
                      AI Product Quality Verification & Description Generator
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={runAiVerificationScan}
                    disabled={isAiScanning}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs transition-colors flex items-center gap-1"
                  >
                    {isAiScanning ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Bot className="w-3 h-3" />
                    )}
                    <span>{isAiScanning ? 'Scanning...' : 'Run AI Scan'}</span>
                  </button>
                </div>

                {aiVerificationResult && (
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs space-y-1.5 animate-fadeIn">
                    <div className="flex items-center justify-between text-emerald-800 font-bold">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        AI Confidence: {aiVerificationResult.confidence}% ({aiVerificationResult.detectedCategory})
                      </span>
                      <span className="text-[10px] text-slate-400">Model: Vision Heuristics</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      <strong>Visual Quality:</strong> {aiVerificationResult.qualityIndicator}
                    </p>
                    <p className="text-[11px] text-slate-600 italic">
                      "{aiVerificationResult.suggestedDescription}"
                    </p>
                    <div className="text-[9px] text-slate-400 pt-1">
                      ⚠️ {aiVerificationResult.disclaimer}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSellModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-xs"
                >
                  Publish Produce Listing
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: MAKE OFFER / BUY PRODUCE MODAL */}
      {/* ========================================================================= */}
      {isOfferModalOpen && selectedProductForOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl border border-slate-200 animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Send Purchase Request</h3>
                <p className="text-xs text-slate-500">Make an offer to buy from {selectedProductForOffer.farmerName}</p>
              </div>
              <button onClick={() => setIsOfferModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>{selectedProductForOffer.name}</span>
                <span className="text-emerald-700">₹{selectedProductForOffer.expectedPrice}/{selectedProductForOffer.unit}</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Available: {selectedProductForOffer.quantity} {selectedProductForOffer.unit} • Grade: {selectedProductForOffer.qualityGrade}
              </div>
            </div>

            <form onSubmit={handleSubmitOffer} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Quantity Required ({selectedProductForOffer.unit})
                  </label>
                  <input
                    type="number"
                    required
                    min={selectedProductForOffer.minOrderQuantity || 1}
                    max={selectedProductForOffer.quantity}
                    value={offerForm.quantity}
                    onChange={(e) => setOfferForm({ ...offerForm, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Offered Price (₹/{selectedProductForOffer.unit})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={offerForm.offeredPrice}
                    onChange={(e) => setOfferForm({ ...offerForm, offeredPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Logistics / Pickup Option</label>
                <select
                  value={offerForm.deliveryType}
                  onChange={(e) => setOfferForm({ ...offerForm, deliveryType: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="Buyer Pickup">Buyer Pickup (I will send vehicle to farm)</option>
                  <option value="Farmer Delivery">Farmer Delivery (Farmer brings to Mandi)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Note to Farmer</label>
                <textarea
                  rows="2"
                  value={offerForm.message}
                  onChange={(e) => setOfferForm({ ...offerForm, message: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                  placeholder="e.g. Can pick up tomorrow morning with immediate payment."
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl flex items-center justify-between font-black text-xs text-emerald-950">
                <span>Calculated Offer Value:</span>
                <span className="text-base text-emerald-700">
                  ₹{Number(offerForm.quantity) * Number(offerForm.offeredPrice)}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl shadow-xs"
                >
                  Submit Offer
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: COUNTER OFFER MODAL */}
      {/* ========================================================================= */}
      {isCounterModalOpen && selectedOfferForCounter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl border border-slate-200 animate-scaleUp text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-900">Propose Counter-Offer</h3>
              <button onClick={() => setIsCounterModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl text-amber-900 space-y-1">
              <p>Buyer offered: <strong>₹{selectedOfferForCounter.offeredPrice}/{selectedOfferForCounter.unit}</strong> for {selectedOfferForCounter.quantity} {selectedOfferForCounter.unit}.</p>
            </div>

            <form onSubmit={handleSendCounterOffer} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Your Counter Price (₹/kg)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={counterPriceInput}
                  onChange={(e) => setCounterPriceInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-amber-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Reason / Note</label>
                <input
                  type="text"
                  value={counterMessageInput}
                  onChange={(e) => setCounterMessageInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="e.g. Well-graded, minimal broken grain."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCounterModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black"
                >
                  Send Counter-Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MarketplacePage;
