# 🌾 KisanAI
> **“Hyperlocal Agricultural & Weather Intelligence for Smarter Farming”**  
> *From global climate signals to local agricultural decisions.*

[![Smart India Hackathon Prototype](https://img.shields.io/badge/SIH-Hackathon%20MVP-success?style=for-the-badge)](https://github.com)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-Backend-black?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-%40google%2Fgenai-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Leaflet](https://img.shields.io/badge/Leaflet-GIS%20Maps-199900?style=for-the-badge&logo=leaflet)](https://leafletjs.com/)

---

## 1. Project Overview

**KisanAI** is an AI-powered hyperlocal agricultural weather intelligence and advisory platform designed specifically for Indian farmers and extension officers.

The platform bridges large-scale macro-meteorological physics (ENSO, IOD, MJO) with micro-agricultural field realities (Block and Panchayat soil moisture, crop water requirements, dry spell tolerances) to generate probabilistic **7–30 day monsoon outlooks** and actionable crop advisories.

> **Disclaimer**: *This is a Smart India Hackathon prototype/MVP. All outputs represent model-based probabilistic estimates rather than deterministic predictions, clearly communicating scientific uncertainty to protect farmer livelihoods.*

---

## 2. Problem Statement

Indian agriculture is deeply dependent on the South Asian summer monsoon, which provides over 70% of the country's annual rainfall. However:
1. **Regional Forecast Gaps**: Existing public weather reports are often broad (district or state level) and do not reflect block/panchayat micro-climates.
2. **False Onset & Dry Spell Vulnerability**: Early unseasonal showers often tempt farmers into premature sowing, only to suffer massive seed mortality when a 10–14 day dry spell occurs.
3. **Complex Scientific Language**: Raw meteorological jargon (ENSO anomalies, hectopascals, convective shear) is rarely translated into simple, crop-specific guidance in regional languages.

---

## 3. The KisanAI Solution

KisanAI introduces a multi-tier intelligence pipeline:
- **Global Ingestion**: Tracks equatorial teleconnections (ENSO index, IOD index, Wheeler-Hendon MJO phase & amplitude).
- **Hyperlocal Ingestion**: Aggregates IMD/Open-Meteo precipitation, humidity, soil moisture, and historical 30-year anomalies.
- **Probabilistic Risk Engine**: Computes transparent probabilities for sustained monsoon onset, prolonged dry spells, heavy rain bursts, and confidence scores.
- **Rule-Based Agronomic Engine**: Matches probabilities against crop biology (Soybean, Maize, Bajra, Rice, Cotton, Groundnut, Pulses).
- **Conversational Gemini AI**: Employs Google Gemini 2.5 Flash (`@google/genai`) to answer farmers' conversational questions in simple English and Hindi.

---

## 4. Key Features

- 📍 **Block & Panchayat Granularity**: Pre-calibrated across Rajasthan (Jaipur - Chomu, Phagi, Amber), Madhya Pradesh (Indore - Sanwer, Ujjain - Badnagar), Maharashtra (Amravati - Achalpur), and Punjab (Ludhiana - Jagraon).
- 📊 **Probabilistic Forecast Cards**: 4 top cards displaying Monsoon Onset, Dry Spell Risk, Heavy Rain Risk, and Forecast Confidence with progress gauges and one-click "Ask AI" triggers.
- 📈 **7–30 Day Forecast Timeline**: Interactive Recharts timeline with daily rainfall probability area charts, expected millimeter bars, temperature bands, and humidity ranges.
- 🗺️ **Interactive Monsoon Risk GIS Map**: Built with React Leaflet and GeoJSON block boundary polygons with color-coded risk toggles (Green = Low, Yellow = Moderate, Orange = High, Red = Very High).
- 🌾 **Crop-Specific Sowing & Water Matrix**: Complete agronomic guidance for 7 major kharif crops with minimum sowing rainfall thresholds and drainage sensitivities.
- 🤖 **Conversational AI Farm Assistant**: Floating and dedicated Gemini AI assistant with quick chips (*"Should I sow now?"*, *"Is a dry spell coming?"*, *"Explain in Hindi"*).
- 🇮🇳 **Bilingual English & Hindi Support**: Seamless toggle for rural accessibility.
- 🚨 **Real-Time Agro-Alert Center**: Multi-severity alert feed with simulated Kisan SMS broadcast preview.
- 🎛️ **Hackathon Demo Scenario Simulator**: Instant 5-scenario switch (Normal Monsoon, Delayed Onset, False Onset + Dry Spell, Heavy Rainfall, Monsoon Revival) for live judging demonstrations.

---

## 5. System Architecture

```
                                  ┌────────────────────────┐
                                  │ Global Climate Signals │
                                  │ (ENSO, IOD, MJO phase) │
                                  └───────────┬────────────┘
                                              │
┌───────────────────────────┐                 ▼                ┌──────────────────────────┐
│ Live Weather & IMD Grids  │ ──► [ Prediction Service ] ◄─── │ Local Soil & Terrain DB  │
│ (Precipitation, Temp, RH) │     [ Probabilistic Engine]      │ (Alluvial, Black Cotton) │
└───────────────────────────┘                 │                └──────────────────────────┘
                                              ▼
                                 ┌─────────────────────────┐
                                 │   Forecast & Risk Core  │
                                 │ (Onset%, Dry%, Flood%)  │
                                 └────────────┬────────────┘
                                              │
                     ┌────────────────────────┴────────────────────────┐
                     ▼                                                 ▼
        ┌─────────────────────────┐                       ┌─────────────────────────┐
        │   Crop Advisory Engine  │                       │   Google Gemini 2.5     │
        │ (Rule-Based Agronomics) │                       │ (Official @google/genai)│
        └────────────┬────────────┘                       └────────────┬────────────┘
                     │                                                 │
                     └────────────────────────┬────────────────────────┘
                                              ▼
                             ┌─────────────────────────────────┐
                             │ Express.js REST API Backend     │
                             │ (CORS, Rate Limiting, Mongoose) │
                             └────────────────┬────────────────┘
                                              ▼
                             ┌─────────────────────────────────┐
                             │ React 18 + Tailwind UI Client   │
                             │ (Recharts, Leaflet, Bilingual)  │
                             └─────────────────────────────────┘
```

---

## 6. Technology Stack

### Frontend
- **React.js 18** + **Vite 6** (Fast, modern modular client)
- **Tailwind CSS 3** (Custom agricultural color palette, glassmorphism & subtle animations)
- **React Router v6** (Client-side routing across 11 pages)
- **Recharts** (Interactive composed area, bar, and line timelines)
- **Leaflet & React Leaflet** (GIS polygon layers and interactive block popups)
- **Lucide React** (Clean modern UI icons)
- **Axios** (Robust API communication with automatic mock fallback)

### Backend
- **Node.js** + **Express.js** (REST API architecture)
- **@google/genai** (Official Google GenAI SDK for Gemini 2.5 Flash)
- **Mongoose / MongoDB** (Models for User, Location, Weather, ClimateIndex, Forecast, Crop, Advisory, Alert)
- **Morgan & CORS** (Structured logging and cross-origin communication)
- **Express Rate Limit** (Anti-abuse protection on AI and general endpoints)

---

## 7. Environment Variables

Create `.env` in `server/`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kisan_ai
GEMINI_API_KEY=your_google_gemini_api_key_here
WEATHER_API_KEY=your_weather_api_key_here
USE_DEMO_DATA=true
NODE_ENV=development
```

> **Security Note**: Never expose `GEMINI_API_KEY` or `MONGODB_URI` in client frontend code. All AI calls route through the Express `/api/ai/chat` endpoint.

---

## 8. Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (optional; system includes automatic in-memory mock store fallback)

### Step 1: Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
cd ..
```

---

## 9. Running the Application

### Option A: Run Both Concurrently (Recommended)
From the root directory:
```bash
npm run dev
```

### Option B: Run Individually
**Terminal 1 (Backend):**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
# Frontend runs on http://localhost:3000
```

---

## 10. Hackathon Demo Scenarios

In the **Admin / Demo Controller** (`/admin`), you can toggle 5 simulated monsoon scenarios to demonstrate system reactivity to judges:

1. **Normal Monsoon**: Onset 78%, Dry Spell 24%, Heavy Rain 38%. Advises standard sowing.
2. **Delayed Onset**: Onset 32%, Dry Spell 64%. Warns against rainfed sowing.
3. **False Onset + Dry Spell**: Onset 48%, Dry Spell 79%. Tests irrigation contingency logic.
4. **Heavy Rainfall / Excess**: Onset 88%, Heavy Rain 82%. Triggers drainage and waterlogging alerts.
5. **Monsoon Revival**: Onset 84%, Dry Spell 18%. Guidance for top-dressing and field revival.

---

## 11. API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/weather?locationId=raj-jai-chomu` | Fetch real-time micro-weather for block |
| `GET` | `/api/forecast/:locationId?horizon=14d` | Get 7-30 day probabilistic outlook |
| `GET` | `/api/risk-map?metric=onset` | Get GIS risk metrics for all monitored blocks |
| `GET` | `/api/climate-indices` | Fetch latest ENSO, IOD, and MJO status |
| `GET` | `/api/crops` | List supported crops and biological parameters |
| `GET` | `/api/advisory/:locationId/:crop` | Generate rule-based bilingual crop advisory |
| `POST` | `/api/ai/chat` | Contextual conversational Gemini AI query |
| `GET` | `/api/alerts` | Stream active agro-meteorological alerts |
| `POST` | `/api/alerts` | Broadcast custom emergency alert |
| `GET` | `/api/locations` | List available states, districts, and blocks |
| `POST` | `/api/scenario` | Switch active Hackathon demo scenario |
| `GET` | `/api/admin/stats` | System telemetry and monitored region stats |
| `GET` | `/api/products` | Browse farmer produce listings with filters |
| `POST` | `/api/products` | Publish produce listing with AI verification |
| `POST` | `/api/products/ai-verify` | AI quality indicator & description scanner |
| `GET` | `/api/buyers` | Verified APMC traders & food processors directory |
| `GET` | `/api/offers` | Active purchase requests and negotiations |
| `POST` | `/api/offers` | Submit purchase inquiry with offer price |
| `PUT` | `/api/offers/:id/respond` | Farmer response: Accept, Propose Counter-Offer, Reject |
| `GET` | `/api/orders` | Confirmed trade orders and fulfillment tracking |
| `PUT` | `/api/orders/:id/status` | Advance logistics (Confirmed → Bagging → Ready → Completed) |
| `GET` | `/api/market/prices` | Live APMC Mandi rates & Govt. MSP benchmarks |
| `GET` | `/api/market/trends` | 30-day interactive price and arrival volume trends |
| `GET` | `/api/market/stats` | Marketplace GMV, active listings and buyer telemetry |

---

## 12. Google Gemini AI Context Schema (Meteorology + Market)

When `/api/ai/chat` is invoked, the backend supplies enriched meteorological AND marketplace context to Gemini:

```json
{
  "location": "Morija Panchayat, Chomu Block, Jaipur",
  "crop": "Soybean",
  "onsetProbability": 78,
  "drySpellProbability": 24,
  "heavyRainProbability": 38,
  "confidence": 72,
  "recentRainfall": 52,
  "temperature": 29.5,
  "humidity": 74,
  "climateSignals": {
    "enso": "Neutral (-0.4)",
    "iod": "Positive (+0.5)",
    "mjo": "Phase 4, Amplitude 1.2"
  },
  "marketplace": {
    "cropMandiPrice": "₹44.80/kg",
    "mspBenchmark": "₹48.92/kg",
    "mandiTrend": "stable",
    "nearbyBuyersCount": 12,
    "topBuyerNames": ["Malwa Agro Processors", "ABC Grain Traders"],
    "totalListingsActive": 6
  }
}
```

---

## 13. End-to-End Farm-to-Market Lifecycle

```text
PREDICT (Monsoon Teleconnections & Forecast)
   ↓
PLAN (Biological Sowing Window & Moisture Assessment)
   ↓
GROW (Weather-Calibrated Agronomic Advisory)
   ↓
MONITOR (GIS Block Boundary Risk Maps & Real-time Alerts)
   ↓
HARVEST (Post-Harvest Mandi Intelligence & 30-day Trends)
   ↓
SELL (Direct Farmer Marketplace, AI Verification & Negotiation)
```

---

## 14. License

Distributed under the MIT License. Developed for the Smart India Hackathon.
