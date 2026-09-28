/**
 * KisanAI Probabilistic Risk Engine (Prototype / MVP)
 * 
 * Computes estimated probabilities for:
 * 1. Sustained Monsoon Onset Probability (%)
 * 2. Prolonged Dry Spell Probability (%)
 * 3. Heavy Rainfall Probability (%)
 * 4. Model Confidence Score (%)
 * 
 * Combines:
 * - Dynamic atmospheric signals (Rainfall tendency, humidity, pressure)
 * - Large-scale climate teleconnections (ENSO index, IOD index, MJO phase & amplitude)
 * - Historical anomaly indicators
 * 
 * DISCLAIMER: This is a hackathon prototype probabilistic engine designed for local
 * decision support and must be evaluated with local meteorological datasets.
 */

export const calculateProbabilisticRisks = ({
  recentRainfall7d = 45, // mm in last 7 days
  currentRainfall24h = 12, // mm in last 24h
  humidity = 75, // %
  dryDaysCount = 2,
  temperature = 30, // °C
  historicalAnomaly = 5, // % deviation from 30-year normal
  enso = { status: 'Neutral', index: -0.3 },
  iod = { status: 'Positive', index: 0.5 },
  mjo = { phase: 4, amplitude: 1.2 },
  scenarioOverride = null,
}) => {
  // If scenario override is active (e.g. from Hackathon Demo Panel)
  if (scenarioOverride) {
    return applyScenarioMetrics(scenarioOverride);
  }

  // --- 1. BASE ONSET CALCULATION ---
  // Rain continuity weight + Humidity weight
  let baseOnset = 40;
  if (recentRainfall7d >= 50) baseOnset += 25;
  else if (recentRainfall7d >= 25) baseOnset += 15;
  else if (recentRainfall7d < 10) baseOnset -= 15;

  if (humidity >= 80) baseOnset += 15;
  else if (humidity >= 65) baseOnset += 8;
  else if (humidity < 50) baseOnset -= 15;

  // ENSO Impact: La Niña (negative index) favors Indian monsoon; El Niño (positive index) inhibits
  if (enso.index <= -0.5) baseOnset += 10; // La Nina favorable
  else if (enso.index >= 0.5) baseOnset -= 12; // El Nino unfavorable

  // IOD Impact: Positive IOD favors Indian monsoon
  if (iod.index >= 0.4) baseOnset += 8;
  else if (iod.index <= -0.4) baseOnset -= 8;

  // MJO Impact: Phases 3, 4, 5 actively enhance convection over Arabian Sea / Bay of Bengal
  if ([3, 4, 5].includes(mjo.phase) && mjo.amplitude >= 1.0) {
    baseOnset += 12;
  } else if ([7, 8, 1].includes(mjo.phase)) {
    baseOnset -= 8; // Suppressed phase
  }

  const onsetProbability = Math.min(95, Math.max(10, Math.round(baseOnset)));

  // --- 2. DRY SPELL PROBABILITY ---
  // Dry spell rises if dry days accumulate and large-scale convection weakens
  let baseDrySpell = 20;
  if (dryDaysCount >= 5) baseDrySpell += 35;
  else if (dryDaysCount >= 3) baseDrySpell += 18;
  
  if (humidity < 60) baseDrySpell += 15;
  if (recentRainfall7d < 15) baseDrySpell += 15;

  // Suppressed MJO or El Nino spikes dry spell probability
  if (enso.index >= 0.5) baseDrySpell += 12;
  if ([1, 7, 8].includes(mjo.phase)) baseDrySpell += 10;
  if (iod.index < -0.3) baseDrySpell += 8;

  const drySpellProbability = Math.min(92, Math.max(8, Math.round(baseDrySpell)));

  // --- 3. HEAVY RAIN PROBABILITY ---
  let baseHeavyRain = 18;
  if (currentRainfall24h >= 40) baseHeavyRain += 35;
  else if (currentRainfall24h >= 20) baseHeavyRain += 20;

  if (humidity >= 85) baseHeavyRain += 15;
  if (historicalAnomaly > 20) baseHeavyRain += 10;

  // Positive IOD + MJO Phase 4/5 dramatically surges intense convective storms
  if (iod.index > 0.4 && [3, 4, 5].includes(mjo.phase)) {
    baseHeavyRain += 18;
  }

  const heavyRainProbability = Math.min(90, Math.max(5, Math.round(baseHeavyRain)));

  // --- 4. MODEL CONFIDENCE CALCULATION ---
  // High consistency among signals yields higher confidence
  let confidenceScore = 65;
  if (mjo.amplitude > 1.0) confidenceScore += 8;
  if (Math.abs(enso.index) > 0.4) confidenceScore += 6;
  if (humidity > 70 && recentRainfall7d > 30) confidenceScore += 8;
  
  const confidence = Math.min(92, Math.max(45, Math.round(confidenceScore)));
  const confidenceLevel = confidence >= 75 ? 'High' : confidence >= 60 ? 'Medium' : 'Low';

  return {
    onsetProbability,
    drySpellProbability,
    heavyRainProbability,
    confidence,
    confidenceLevel,
    isModelEstimate: true,
    engineVersion: 'KisanAI-v1.4-Probabilistic',
    timestamp: new Date().toISOString()
  };
};

/**
 * Demo Scenario Presets for Hackathon Presentations
 */
function applyScenarioMetrics(scenario) {
  switch (scenario) {
    case 'delayed_onset':
      return {
        onsetProbability: 32,
        drySpellProbability: 64,
        heavyRainProbability: 12,
        confidence: 76,
        confidenceLevel: 'High',
        scenarioName: 'Delayed Onset (High Dry-Spell Risk)',
        isModelEstimate: true
      };
    case 'false_onset_dry_spell':
      return {
        onsetProbability: 48,
        drySpellProbability: 79,
        heavyRainProbability: 15,
        confidence: 68,
        confidenceLevel: 'Medium',
        scenarioName: 'False Onset + Extended Dry Spell',
        isModelEstimate: true
      };
    case 'heavy_rainfall':
      return {
        onsetProbability: 88,
        drySpellProbability: 14,
        heavyRainProbability: 82,
        confidence: 84,
        confidenceLevel: 'High',
        scenarioName: 'Excess / Heavy Rainfall Alert',
        isModelEstimate: true
      };
    case 'monsoon_revival':
      return {
        onsetProbability: 84,
        drySpellProbability: 18,
        heavyRainProbability: 42,
        confidence: 80,
        confidenceLevel: 'High',
        scenarioName: 'Monsoon Revival Phase',
        isModelEstimate: true
      };
    case 'normal_monsoon':
    default:
      return {
        onsetProbability: 78,
        drySpellProbability: 24,
        heavyRainProbability: 38,
        confidence: 72,
        confidenceLevel: 'Medium',
        scenarioName: 'Normal Monsoon Favorable Outlook',
        isModelEstimate: true
      };
  }
}
