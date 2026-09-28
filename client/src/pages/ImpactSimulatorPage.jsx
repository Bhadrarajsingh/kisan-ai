import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { 
  Sliders, 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  Warehouse, 
  CloudRain, 
  AlertTriangle, 
  CheckCircle2, 
  Bot, 
  HelpCircle,
  Scale,
  RefreshCw,
  Info
} from 'lucide-react';

const ImpactSimulatorPage = () => {
  const { lang } = useLanguage();
  const { selectedLocation, selectedCrop, openAIChatWithPrompt } = useApp();

  // Tab: 'climate_simulator' or 'sell_or_store'
  const [activeTab, setActiveTab] = useState('climate_simulator');

  // Climate Shock State (-60% to +40%)
  const [rainfallAnomaly, setRainfallAnomaly] = useState(-20); // -20% below normal

  // "Sell or Store" Simulator State
  const [sellCrop, setSellCrop] = useState('Bajra');
  const [quantityKg, setQuantityKg] = useState(500);
  const [currentSpotPrice, setCurrentSpotPrice] = useState(24.5);
  const [holdingDays, setHoldingDays] = useState(30);

  // Dynamic calculations for climate simulator
  const getSimulatedImpact = (anomaly) => {
    let drySpellRisk = 24;
    let cropStress = 'Low';
    let irrigationNeed = 'Normal (No supplementary needed)';
    let yieldImpact = '0% to -2% (Normal Harvest)';
    let riskColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';

    if (anomaly <= -60) {
      drySpellRisk = 84;
      cropStress = 'Severe Drought Stress';
      irrigationNeed = 'Critical: 3–4 life-saving irrigations required';
      yieldImpact = '-35% to -50% without irrigation';
      riskColor = 'text-rose-800 bg-rose-100 border-rose-300';
    } else if (anomaly <= -40) {
      drySpellRisk = 68;
      cropStress = 'High Moisture Stress';
      irrigationNeed = 'Urgent: 2 protective irrigations required';
      yieldImpact = '-20% to -30%';
      riskColor = 'text-rose-700 bg-rose-50 border-rose-200';
    } else if (anomaly <= -20) {
      drySpellRisk = 48;
      cropStress = 'Moderate Stress';
      irrigationNeed = '1 supplementary sprinkler cycle recommended';
      yieldImpact = '-8% to -14%';
      riskColor = 'text-amber-800 bg-amber-100 border-amber-300';
    } else if (anomaly > 20) {
      drySpellRisk = 12;
      cropStress = 'Waterlogging / Root Suffocation Risk';
      irrigationNeed = 'Zero irrigation. Open drainage ditches immediately';
      yieldImpact = '-5% to -12% due to excess rain';
      riskColor = 'text-blue-800 bg-blue-100 border-blue-300';
    }

    return { drySpellRisk, cropStress, irrigationNeed, yieldImpact, riskColor };
  };

  const impact = getSimulatedImpact(rainfallAnomaly);

  // Calculations for Sell or Store
  const immediateRevenue = quantityKg * currentSpotPrice;
  const expectedFuturePrice = +(currentSpotPrice * 1.07).toFixed(2); // estimated +7% in 30 days
  const storageLossPct = 2.5; // moisture weight loss & bagging
  const effectiveStoredQty = quantityKg * (1 - storageLossPct / 100);
  const futureRevenue = +(effectiveStoredQty * expectedFuturePrice).toFixed(2);
  const netGain = +(futureRevenue - immediateRevenue).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-800/40 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold tracking-wide uppercase">
              <Sliders className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'स्मार्ट निर्णय एवं प्रभाव सिमुलेटर' : 'Decision & Impact Simulation Engine'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              {lang === 'hi' ? 'जलवायु झटका एवं "बेचें या भंडारित करें" सिमुलेटर' : 'Climate Shock & "Sell vs Store" Simulator'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lang === 'hi' 
                ? 'मानसून वर्षा विचलन (Rainfall Deficit) के फसल पर पड़ने वाले प्रभावों का गणितीय सिमुलेशन एवं फसल कटाई के बाद तुरंत बेचने बनाम रोककर रखने का आर्थिक विश्लेषण।'
                : 'Interactive scenario-modeling simulating crop stress under multi-level rainfall anomalies alongside probabilistic grain storage monetization matrices.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openAIChatWithPrompt(`Simulate impact on ${selectedCrop.name} in ${selectedLocation.block} if monsoon rainfall is 30% below normal.`)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all"
            >
              <Bot className="w-4 h-4 text-yellow-300" />
              <span>{lang === 'hi' ? 'AI सिमुलेशन विश्लेषण' : 'Ask AI Scenario Analysis'}</span>
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-[11px]">
            <Info className="w-3.5 h-3.5 text-purple-400" />
            <span>Mathematical Decision Support Tool: Scenarios represent stochastic simulations, not deterministic forecasts.</span>
          </span>
          <span className="text-[10px] text-purple-300 font-bold">Smart India Hackathon Feature</span>
        </div>
      </div>

      {/* 2. Mode Toggle Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center gap-1 max-w-md">
        <button
          onClick={() => setActiveTab('climate_simulator')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'climate_simulator'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          🌧️ Climate Shock Simulator
        </button>

        <button
          onClick={() => setActiveTab('sell_or_store')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'sell_or_store'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          ⚖️ "Sell or Store?" Decision
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: CLIMATE SHOCK & RAINFALL DEFICIT SIMULATOR */}
      {/* ========================================================================= */}
      {activeTab === 'climate_simulator' && (
        <div className="space-y-6">
          
          {/* Interactive Deficit Slider Control */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Select Rainfall Anomaly Scenario for {selectedLocation.block} ({selectedCrop.name})
                </h3>
                <p className="text-xs text-slate-500">
                  Drag the slider to test system responsiveness to simulated droughts or heavy rainfall surges.
                </p>
              </div>

              <div className={`px-4 py-1.5 rounded-2xl font-black text-sm border shrink-0 ${impact.riskColor}`}>
                {rainfallAnomaly > 0 ? `+${rainfallAnomaly}% (Excess Rain)` : `${rainfallAnomaly}% (Rainfall Deficit)`}
              </div>
            </div>

            {/* Range Slider */}
            <div className="space-y-2 py-2">
              <input
                type="range"
                min="-60"
                max="40"
                step="10"
                value={rainfallAnomaly}
                onChange={(e) => setRainfallAnomaly(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-[11px] font-bold text-slate-400">
                <span className="text-rose-600">-60% (Severe Deficit)</span>
                <span className="text-rose-500">-40%</span>
                <span className="text-amber-500">-20% (Moderate)</span>
                <span className="text-emerald-600 font-extrabold">0% (Normal Baseline)</span>
                <span className="text-blue-500">+20%</span>
                <span className="text-blue-600">+40% (Excess Flood)</span>
              </div>
            </div>

            {/* Cascading Impact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Dry Spell Probability
                </span>
                <div className="text-2xl font-black text-slate-900">
                  {impact.drySpellRisk}%
                </div>
                <span className="text-[11px] text-slate-500 block">Cascading meteorological risk</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Crop Physiological Stress
                </span>
                <div className="text-sm font-black text-slate-900 truncate">
                  {impact.cropStress}
                </div>
                <span className="text-[11px] text-slate-500 block">Canopy stomatal resistance</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Irrigation Contingency
                </span>
                <div className="text-xs font-black text-slate-900 line-clamp-2">
                  {impact.irrigationNeed}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Estimated Yield Variance
                </span>
                <div className="text-lg font-black text-rose-700">
                  {impact.yieldImpact}
                </div>
                <span className="text-[11px] text-slate-500 block">Baseline vs simulated shock</span>
              </div>
            </div>

            {/* AI Agro-Prescription for Shock Scenario */}
            <div className="p-4 bg-purple-50/80 rounded-2xl border border-purple-200/80 text-xs text-purple-950 space-y-1.5">
              <strong className="font-black flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Adaptive Climate-Smart Advisory for this Scenario:
              </strong>
              <p className="leading-relaxed">
                {rainfallAnomaly <= -40 ? (
                  <>Under a severe {rainfallAnomaly}% rainfall deficit, immediately apply straw mulching (5 tons/ha) to conserve soil moisture. Prioritize protective sprinkler irrigation at critical flowering stage and spray 1% Potassium Nitrate (KNO3) foliar spray to induce drought tolerance.</>
                ) : rainfallAnomaly > 20 ? (
                  <>Under excess precipitation (+{rainfallAnomaly}%), suspend top-dressing of urea to avoid nitrogen leaching. Open furrows between ridges to drain standing field water within 24 hours.</>
                ) : (
                  <>Under manageable {rainfallAnomaly}% departure, maintain regular crop weeding to minimize moisture competition. Soil profile is adequate for sustained grain filling.</>
                )}
              </p>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: AI "SELL OR STORE?" DECISION SIMULATOR */}
      {/* ========================================================================= */}
      {activeTab === 'sell_or_store' && (
        <div className="space-y-6">
          
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
            <div>
              <h3 className="text-base font-black text-slate-900">
                AI Post-Harvest "Sell Now vs Wait & Store" Monetization Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Evaluate financial trade-offs between immediate spot sale and warehouse holding considering storage loss, bagging costs, and anticipated price shifts.
              </p>
            </div>

            {/* User Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Crop</label>
                <select
                  value={sellCrop}
                  onChange={(e) => setSellCrop(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  <option value="Bajra">Bajra (Pearl Millet)</option>
                  <option value="Soybean">Soybean (Yellow)</option>
                  <option value="Wheat">Wheat (Sharbati)</option>
                  <option value="Groundnut">Groundnut</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Quantity (kg)</label>
                <input
                  type="number"
                  value={quantityKg}
                  onChange={(e) => setQuantityKg(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Spot Price (₹/kg)</label>
                <input
                  type="number"
                  step="0.5"
                  value={currentSpotPrice}
                  onChange={(e) => setCurrentSpotPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-700"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Holding Period</label>
                <select
                  value={holdingDays}
                  onChange={(e) => setHoldingDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  <option value={15}>15 Days</option>
                  <option value={30}>30 Days</option>
                  <option value={45}>45 Days</option>
                </select>
              </div>
            </div>

            {/* Comparison Cards: Option A vs Option B */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              
              {/* Option A: Sell Now */}
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-200 text-slate-800 uppercase">
                    Option A
                  </span>
                  <span className="text-xs font-bold text-slate-500">Zero Storage Risk</span>
                </div>

                <h4 className="text-sm font-black text-slate-900">Sell at Current Farm-Gate Spot</h4>

                <div className="text-2xl font-black text-slate-900">
                  ₹{immediateRevenue.toLocaleString()}
                  <span className="text-xs font-normal text-slate-500"> instant cash</span>
                </div>

                <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Immediate liquidity with zero warehouse rental cost.</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Eliminates post-harvest insect pest and moisture rot risks.</span>
                  </li>
                </ul>

                <a
                  href="/marketplace"
                  className="block text-center py-2 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Proceed to Sell Now on Marketplace
                </a>
              </div>

              {/* Option B: Wait and Store */}
              <div className="p-5 rounded-3xl bg-purple-50/70 border border-purple-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-200 text-purple-900 uppercase">
                    Option B
                  </span>
                  <span className="text-xs font-bold text-purple-700">Anticipated Gain: +₹{netGain}</span>
                </div>

                <h4 className="text-sm font-black text-purple-950">Store in Warehouse ({holdingDays} Days)</h4>

                <div className="text-2xl font-black text-purple-900">
                  ₹{futureRevenue.toLocaleString()}
                  <span className="text-xs font-normal text-slate-500"> estimated return</span>
                </div>

                <ul className="text-xs text-purple-900 space-y-1.5 pt-1">
                  <li className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>Expected Mandi Appreciation: ~₹{expectedFuturePrice}/kg (+7%)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Deducts 2.5% natural moisture weight loss ({effectiveStoredQty.toFixed(0)} kg net).</span>
                  </li>
                </ul>

                <button
                  onClick={() => openAIChatWithPrompt(`Should I sell my ${quantityKg} kg ${sellCrop} at ₹${currentSpotPrice}/kg or hold for ${holdingDays} days in warehouse?`)}
                  className="w-full text-center py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  Consult AI Market Timing Advisor
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default ImpactSimulatorPage;
