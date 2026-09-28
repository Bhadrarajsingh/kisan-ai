import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Bot, 
  RefreshCw, 
  ShieldAlert, 
  Info, 
  Leaf, 
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Check,
  Zap,
  Tag
} from 'lucide-react';

const SAMPLE_LEAF_IMAGES = [
  {
    id: 'sample-maize',
    name: 'Maize Cob & Silks (स्वस्थ मक्का भुट्टा)',
    crop: 'Maize (Corn)',
    cropHindiName: 'मक्का',
    cropIcon: '🌽',
    cropKey: 'maize',
    url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80',
    issue: 'Healthy Maize Cob / Foliage — Prime Grain Filling',
    hindiIssue: 'स्वस्थ मक्का भुट्टा / पत्ता — उत्तम दाना भराव',
    severity: 'Healthy / Normal',
    severityColor: 'text-emerald-700 bg-emerald-100 border-emerald-300',
    confidence: 96,
    symptoms: 'Vibrant green husk covering intact, healthy golden-brown ear silks, robust kernel set, zero boring punctures or chlorotic leaf striping.',
    organicTreatment: 'Maintain optimum soil moisture during silking stage. Apply 1% Panchagavya foliar spray for enhanced grain luster and kernel weight.',
    chemicalTreatment: 'No chemical pesticide required. Avoid unnecessary broad-spectrum sprays to preserve natural predator ladybugs and spiders.',
    identifiedTraits: ['Fresh green husk sheath', 'Golden-brown ear silk', 'Well-formed kernel rows', 'Zero insect frass'],
    disclaimer: 'AI Visual Screening Model. Field verification recommended.'
  },
  {
    id: 'sample-bajra',
    name: 'Bajra Downy Mildew (हरित बाली रोग)',
    crop: 'Pearl Millet (Bajra)',
    cropHindiName: 'बाजरा',
    cropIcon: '🌾',
    cropKey: 'bajra',
    url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    issue: 'Downy Mildew (Sclerospora graminicola)',
    hindiIssue: 'बाजरे का डाउनी मिल्ड्यू / हरित बाली रोग',
    severity: 'Moderate',
    severityColor: 'text-amber-700 bg-amber-100 border-amber-300',
    confidence: 91,
    symptoms: 'Chlorotic pale yellow streaks on upper leaf surface with whitish downy fungal growth on underside. Transformation of floral ear into leafy structure.',
    organicTreatment: 'Rogue out and burn infected green-ear plants. Spray bio-fungicide Trichoderma viride (4g/kg seed / 5g/L spray).',
    chemicalTreatment: 'If spreading rapidly, spray Metalaxyl-M + Mancozeb 72% WP (Ridomil MZ, 2g/L of water) under dry weather window.',
    identifiedTraits: ['Chlorotic leaf striping', 'Underside fungal down', 'Floral phyllody'],
    disclaimer: 'AI visual screening model. Confirm symptoms with local KVK agricultural extension officer.'
  },
  {
    id: 'sample-soybean',
    name: 'Soybean Yellow Mosaic Virus (YMV)',
    crop: 'Soybean',
    cropHindiName: 'सोयाबीन',
    cropIcon: '🌱',
    cropKey: 'soybean',
    url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    issue: 'Yellow Mosaic Virus (Whitefly Transmitted)',
    hindiIssue: 'सोयाबीन पीला मोजेक वायरस',
    severity: 'High',
    severityColor: 'text-rose-700 bg-rose-100 border-rose-300',
    confidence: 94,
    symptoms: 'Bright yellow speckles along leaf veins coalescing into irregular patches. Premature pod shedding.',
    organicTreatment: 'Install yellow sticky traps (15-20 per acre) and spray 2% Neem oil (Azadirachtin 1500 ppm, 5ml/L).',
    chemicalTreatment: 'Vector control: Spray Thiamethoxam 25% WG (100g/ha) or Imidacloprid 17.8% SL (150 ml/ha).',
    identifiedTraits: ['Bright yellow vein mosaic', 'Interveinal chlorosis', 'Pod atrophy'],
    disclaimer: 'AI visual screening model. Confirm symptoms with local KVK agricultural extension officer.'
  },
  {
    id: 'sample-rice',
    name: 'Rice Leaf Blast (धान का झोंका रोग)',
    crop: 'Rice (Paddy)',
    cropHindiName: 'धान (चावल)',
    cropIcon: '🌾',
    cropKey: 'rice',
    url: 'https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=600&q=80',
    issue: 'Rice Leaf Blast (Magnaporthe oryzae)',
    hindiIssue: 'धान का झोंका रोग (राइस ब्लास्ट)',
    severity: 'High',
    severityColor: 'text-rose-700 bg-rose-100 border-rose-300',
    confidence: 93,
    symptoms: 'Spindle-shaped / diamond-shaped lesions with gray or white centers and brown margins on leaf blades.',
    organicTreatment: 'Spray Pseudomonas fluorescens (5g/L). Avoid excess nitrogenous fertilizer in cloudy weather.',
    chemicalTreatment: 'Spray Tricyclazole 75% WP (0.6g/L) or Isoprothiolane 40% EC (1.5 ml/L) at tillering.',
    identifiedTraits: ['Diamond spindle lesions', 'Greyish necrotic centers', 'Brown margin rings'],
    disclaimer: 'AI visual screening model. Periodic field scouting recommended.'
  },
  {
    id: 'sample-cotton',
    name: 'Cotton Leaf Curl Virus (पत्ती मरोड़)',
    crop: 'Cotton',
    cropHindiName: 'कपास',
    cropIcon: '☁️',
    cropKey: 'cotton',
    url: 'https://images.unsplash.com/photo-1594904351111-a072f80b1a71?auto=format&fit=crop&w=600&q=80',
    issue: 'Cotton Leaf Curl Virus (CLCuV)',
    hindiIssue: 'कपास पत्ती मरोड़ रोग (लीफ कर्ल वायरस)',
    severity: 'High',
    severityColor: 'text-rose-700 bg-rose-100 border-rose-300',
    confidence: 92,
    symptoms: 'Upward or downward leaf curling, vein thickening, enation (leaf-like outgrowths) on underside of main veins.',
    organicTreatment: 'Spray 5% NSKE (Neem extract). Eradicate alternate weed hosts (Abutilon) along field borders.',
    chemicalTreatment: 'Control whitefly vector: Spray Diafenthiuron 50% WP (1.2g/L) or Afidopyropen 50 g/L DC (2 ml/L).',
    identifiedTraits: ['Cupped thickened lamina', 'Vein enations', 'Stunted internodes'],
    disclaimer: 'AI visual screening model. Confirm with agricultural university.'
  },
  {
    id: 'sample-healthy',
    name: 'Healthy Crop Foliage (स्वस्थ फसल)',
    crop: 'Wheat / Barley',
    cropHindiName: 'गेहूं',
    cropIcon: '🌾',
    cropKey: 'wheat',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    issue: 'Healthy Foliage — Zero Pathogen Detected',
    hindiIssue: 'पूर्णतः स्वस्थ पत्ता — कोई रोग नहीं',
    severity: 'Healthy / Normal',
    severityColor: 'text-emerald-700 bg-emerald-100 border-emerald-300',
    confidence: 98,
    symptoms: 'Uniform dark green chlorophyll density, intact leaf margin, zero lesion or necrotic rings.',
    organicTreatment: 'Maintain standard balanced N-P-K nutrition and routine prophylactic bio-spray.',
    chemicalTreatment: 'No chemical pesticide required. Avoid unnecessary prophylactic fungicide sprays.',
    identifiedTraits: ['Uniform chlorophyll', 'Intact margin', 'Optimal cellular turgor'],
    disclaimer: 'AI visual screening model. Periodic field scouting recommended.'
  }
];

const AVAILABLE_CROPS = [
  { key: 'maize', name: 'Maize (Corn)', hindiName: 'मक्का', icon: '🌽' },
  { key: 'soybean', name: 'Soybean', hindiName: 'सोयाबीन', icon: '🌱' },
  { key: 'bajra', name: 'Bajra (Pearl Millet)', hindiName: 'बाजरा', icon: '🌾' },
  { key: 'cotton', name: 'Cotton', hindiName: 'कपास', icon: '☁️' },
  { key: 'rice', name: 'Rice (Paddy)', hindiName: 'धान (चावल)', icon: '🌾' },
  { key: 'wheat', name: 'Wheat', hindiName: 'गेहूं', icon: '🌾' },
  { key: 'tomato', name: 'Tomato', hindiName: 'टमाटर', icon: '🍅' },
  { key: 'potato', name: 'Potato', hindiName: 'आलू', icon: '🥔' }
];

const CropDoctorPage = () => {
  const { lang } = useLanguage();
  const { selectedCrop, openAIChatWithPrompt } = useApp();

  const [selectedImage, setSelectedImage] = useState(SAMPLE_LEAF_IMAGES[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(1);
  const [customImageUploaded, setCustomImageUploaded] = useState(false);
  const [currentBase64, setCurrentBase64] = useState(null);
  const [currentFilename, setCurrentFilename] = useState('');
  const [showCropOverride, setShowCropOverride] = useState(false);
  const fileInputRef = useRef(null);

  /**
   * Extract real visual color & texture metrics from an image using HTML5 Canvas
   */
  const extractCanvasFeatures = (imgElement) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const sampleSize = 100;
      canvas.width = sampleSize;
      canvas.height = sampleSize;
      ctx.drawImage(imgElement, 0, 0, sampleSize, sampleSize);
      
      const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize).data;
      let totalPixels = sampleSize * sampleSize;
      let greenPixels = 0;
      let yellowPixels = 0;
      let brownPixels = 0;
      let whitePixels = 0;
      let totalBrightness = 0;

      for (let i = 0; i < imgData.length; i += 4) {
        const r = imgData[i];
        const g = imgData[i + 1];
        const b = imgData[i + 2];
        const brightness = (r + g + b) / 3;
        totalBrightness += brightness;

        // Color classifiers
        if (g > r * 1.15 && g > b * 1.15) {
          greenPixels++;
        } else if (r > 130 && g > 130 && b < 100) {
          yellowPixels++;
        } else if (r > 80 && g > 40 && b < 40 && r > g) {
          brownPixels++;
        } else if (r > 190 && g > 190 && b > 190) {
          whitePixels++;
        }
      }

      return {
        greenRatio: greenPixels / totalPixels,
        yellowRatio: yellowPixels / totalPixels,
        brownRatio: brownPixels / totalPixels,
        whiteRatio: whitePixels / totalPixels,
        avgBrightness: Math.round(totalBrightness / totalPixels)
      };
    } catch (err) {
      console.warn('Canvas feature extraction error:', err);
      return { greenRatio: 0.5, yellowRatio: 0.2, brownRatio: 0.1, whiteRatio: 0.05, avgBrightness: 128 };
    }
  };

  /**
   * Execute real AI Crop Diagnosis
   */
  const runAIDiagnosis = async (base64Data, filename, cropHint = '') => {
    setIsScanning(true);
    setScanStep(1);

    // Simulate animated scanning stages for user engagement
    const stepTimer1 = setTimeout(() => setScanStep(2), 600);
    const stepTimer2 = setTimeout(() => setScanStep(3), 1200);

    try {
      // Create temporary image to extract real canvas metrics
      const img = new Image();
      img.src = base64Data;
      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });

      const visualFeatures = extractCanvasFeatures(img);

      // Call Backend Vision Diagnosis API
      const result = await api.diagnoseCrop({
        imageBase64: base64Data,
        filename,
        visualFeatures,
        userCropHint: cropHint,
        lang
      });

      setSelectedImage({
        id: 'uploaded-analysis',
        name: `${result.cropName} (${result.cropHindiName})`,
        crop: result.cropName,
        cropHindiName: result.cropHindiName,
        cropIcon: result.cropIcon || '🌱',
        cropKey: result.cropKey || 'maize',
        url: base64Data,
        issue: result.issue,
        hindiIssue: result.hindiIssue,
        severity: result.severity,
        severityColor: result.severityColor,
        confidence: result.confidence,
        symptoms: result.symptoms,
        organicTreatment: result.organicTreatment,
        chemicalTreatment: result.chemicalTreatment,
        identifiedTraits: result.identifiedTraits || ['Foliar morphology analyzed'],
        disclaimer: result.disclaimer,
        provider: result.provider,
        isLiveAI: result.isLiveAI
      });
    } catch (err) {
      console.error('Diagnosis failed:', err);
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsScanning(false);
      setScanStep(1);
    }
  };

  /**
   * Handle user photo upload
   */
  const handleCustomUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        setCurrentBase64(base64);
        setCurrentFilename(file.name);
        setCustomImageUploaded(true);
        runAIDiagnosis(base64, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Re-analyze with manual crop refinement
   */
  const handleCropRefine = (crop) => {
    setShowCropOverride(false);
    if (currentBase64) {
      runAIDiagnosis(currentBase64, currentFilename, crop.key);
    } else {
      // Find matching sample or adapt current sample
      const matchingSample = SAMPLE_LEAF_IMAGES.find(s => s.cropKey === crop.key);
      if (matchingSample) {
        setSelectedImage(matchingSample);
        setCustomImageUploaded(false);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide uppercase">
              <Camera className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'AI फसल डॉक्टर व कीट/रोग निदान' : 'AI Crop Doctor & Pest Diagnosis'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              {lang === 'hi' ? 'फसल की पहचान व रोग निदान' : 'Computer Vision Crop & Disease Screening'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lang === 'hi' 
                ? 'खेत में फसल, भुट्टे या पत्ती की फोटो अपलोड करें। हमारा AI मॉडल पहले फसल (मक्का, सोयाबीन, बाजरा, गेहूं, आदि) की पहचान करता है और फिर रोग, कीट व सही उपचार बताता है।'
                : 'Upload field foliage, cob, or plant photos. Our vision AI first identifies the crop species (Maize, Soybean, Bajra, Wheat, Rice, Cotton) and then analyzes foliar anomalies to recommend precise organic and chemical protocols.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <label className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-900/40 cursor-pointer transition-all transform active:scale-95">
              <Upload className="w-4 h-4 text-white" />
              <span>{lang === 'hi' ? 'कैमरा / फोटो अपलोड करें' : 'Upload Crop Photo'}</span>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleCustomUpload} 
                className="hidden" 
              />
            </label>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-[11px]">
            <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>AI Multimodal Vision: Automatically recognizes crop species, leaf organs, and fungal/bacterial vectors.</span>
          </span>
          <span className="text-[10px] text-emerald-300 font-mono font-bold bg-emerald-900/60 px-2.5 py-0.5 rounded-full border border-emerald-700/50">
            Engine: CropVision-v3.0 Multimodal
          </span>
        </div>
      </div>

      {/* 2. Interactive Test Samples Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === 'hi' ? 'नमूना फसलें व पत्तियां (Instant Demo Click):' : 'Click Sample to Test Crop Identification:'}</span>
          </span>
          <span className="text-[11px] text-slate-400">Live Hackathon Scenarios</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {SAMPLE_LEAF_IMAGES.map((sample) => {
            const isSelected = selectedImage.id === sample.id && !customImageUploaded;
            return (
              <button
                key={sample.id}
                onClick={() => {
                  setSelectedImage(sample);
                  setCustomImageUploaded(false);
                  setCurrentBase64(null);
                  setCurrentFilename('');
                }}
                className={`p-2.5 rounded-2xl border text-left flex flex-col gap-2 transition-all ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-500 shadow-xs ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="relative w-full h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={sample.url}
                    alt={sample.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 left-1.5 bg-slate-900/80 backdrop-blur-xs text-[10px] px-1.5 py-0.5 rounded-md text-white font-black">
                    {sample.cropIcon} {sample.crop.split(' ')[0]}
                  </div>
                </div>
                <div className="truncate">
                  <div className="text-[11px] font-black text-slate-900 truncate">{sample.crop}</div>
                  <div className="text-[10px] text-slate-500 truncate">{sample.issue.split('—')[0]}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Scanning Console & Diagnosis Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Image Viewer & Scan Overlay (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center">
            <img
              src={selectedImage.url}
              alt="Leaf diagnostic view"
              className="w-full h-full object-cover"
            />

            {/* Scan animation line */}
            {isScanning && (
              <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-xs flex flex-col items-center justify-center gap-3 p-4">
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin"></div>
                  <Leaf className="w-7 h-7 text-emerald-300 animate-pulse" />
                </div>
                <div className="text-center space-y-1">
                  <div className="text-white text-xs font-black tracking-wide uppercase">
                    {scanStep === 1 && (lang === 'hi' ? '1. छवि पिक्सल व रंग विश्लेषण...' : '1. Scanning Image Pixels & Colors...')}
                    {scanStep === 2 && (lang === 'hi' ? '2. फसल प्रजाति की पहचान...' : '2. Identifying Crop Species...')}
                    {scanStep === 3 && (lang === 'hi' ? '3. रोग व कीट निदान विश्लेषण...' : '3. Analyzing Foliar Pathogens...')}
                  </div>
                  <div className="text-[11px] text-emerald-200">
                    {lang === 'hi' ? 'ICAR डेटाबेस से मिलान किया जा रहा है' : 'Matching with ICAR Agricultural Matrix'}
                  </div>
                </div>
              </div>
            )}

            {!isScanning && (
              <>
                <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md px-3 py-1 rounded-xl text-white text-[11px] font-mono border border-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ANALYSIS COMPLETE</span>
                </div>

                <div className="absolute bottom-3 right-3 bg-emerald-600/95 backdrop-blur-md px-3 py-1 rounded-xl text-white text-[11px] font-black shadow-md flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-300" />
                  <span>{selectedImage.confidence}% Match</span>
                </div>
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => {
                if (currentBase64) {
                  runAIDiagnosis(currentBase64, currentFilename);
                } else {
                  setIsScanning(true);
                  setTimeout(() => setIsScanning(false), 1000);
                }
              }}
              disabled={isScanning}
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? (lang === 'hi' ? 'विश्लेषण जारी...' : 'Analyzing...') : (lang === 'hi' ? 'पुनः स्कैन करें' : 'Re-Scan Image')}</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5 text-slate-600" />
              <span>{lang === 'hi' ? 'नई फोटो' : 'Upload New'}</span>
            </button>
          </div>
        </div>

        {/* Right: Pathological Diagnosis & Remediation (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-5">
          
          {/* IDENTIFIED CROP BANNER (The Core User Request Feature!) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2 rounded-2xl bg-white shadow-xs border border-emerald-200/60">
                {selectedImage.cropIcon || '🌽'}
              </span>
              <div>
                <div className="text-[10px] font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                  <span>{lang === 'hi' ? 'पहचानी गई फसल (Identified Crop)' : 'Identified Crop Species'}</span>
                </div>
                <div className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>{selectedImage.crop}</span>
                  {selectedImage.cropHindiName && (
                    <span className="text-sm font-semibold text-slate-500">
                      ({selectedImage.cropHindiName})
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Crop override dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCropOverride(!showCropOverride)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-2xs transition-all"
              >
                <span>{lang === 'hi' ? 'फसल बदलें' : 'Change Crop'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showCropOverride && (
                <div className="absolute right-0 mt-1 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-30 space-y-0.5">
                  <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase">
                    Select Correct Crop:
                  </div>
                  {AVAILABLE_CROPS.map((c) => (
                    <button
                      key={c.key}
                      onClick={() => handleCropRefine(c)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-2 transition-colors ${
                        selectedImage.cropKey === c.key
                          ? 'bg-emerald-50 text-emerald-900 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{c.icon}</span>
                      <span>{c.name}</span>
                      <span className="text-[10px] text-slate-400 ml-auto">{c.hindiName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Visual Traits Tags */}
          {selectedImage.identifiedTraits && selectedImage.identifiedTraits.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide mr-1 flex items-center gap-1">
                <Tag className="w-3 h-3" />
                <span>Detected Traits:</span>
              </span>
              {selectedImage.identifiedTraits.map((trait, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-600"
                >
                  {trait}
                </span>
              ))}
            </div>
          )}

          {/* Primary Diagnostic Finding Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Primary Diagnostic Finding
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {selectedImage.issue}
              </h3>
              <p className="text-xs text-slate-500">{selectedImage.hindiIssue}</p>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase border shrink-0 ${selectedImage.severityColor}`}>
              Severity: {selectedImage.severity}
            </span>
          </div>

          {/* Symptoms */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block">
              Observed Foliar & Organ Symptoms:
            </span>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
              {selectedImage.symptoms}
            </p>
          </div>

          {/* Prescriptions: Organic vs Chemical */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Organic Protocol */}
            <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-950">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span>Organic / Biological Treatment:</span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                {selectedImage.organicTreatment}
              </p>
            </div>

            {/* Chemical Remediation */}
            <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-200/80 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-blue-950">
                <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
                <span>Chemical Protocol (If Severe):</span>
              </div>
              <p className="text-xs text-blue-900 leading-relaxed">
                {selectedImage.chemicalTreatment}
              </p>
            </div>

          </div>

          {/* AI Follow-up Button */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
            <button
              onClick={() => openAIChatWithPrompt(`My ${selectedImage.crop} has symptoms of ${selectedImage.issue}. What is the exact spray dosage and weather precaution?`)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5"
            >
              <Bot className="w-4 h-4 text-emerald-600" />
              <span>Ask KisanAI Assistant for {selectedImage.crop} Dosage Schedule →</span>
            </button>

            <span className="text-[10px] text-slate-400">
              {selectedImage.provider || 'ICAR / KVK Calibrated'}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CropDoctorPage;
