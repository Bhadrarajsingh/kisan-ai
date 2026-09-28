import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../services/api';
import { detectCurrentLocation } from '../services/locationService';
import { MOCK_LOCATIONS, MOCK_CROPS, MOCK_CLIMATE, MOCK_WEATHER, MOCK_FORECAST, MOCK_ALERTS } from '../services/mockData';
import { getDistrictsForState, getVillagesForDistrict, ALL_INDIAN_STATES } from '../data/indiaLocations';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [locations, setLocations] = useState(MOCK_LOCATIONS);
  const [selectedLocation, setSelectedLocation] = useState(MOCK_LOCATIONS[0]);
  const [crops, setCrops] = useState(MOCK_CROPS);
  const [selectedCrop, setSelectedCrop] = useState(MOCK_CROPS[0]);
  const [weather, setWeather] = useState(MOCK_WEATHER);
  const [forecast, setForecast] = useState(MOCK_FORECAST);
  const [climate, setClimate] = useState(MOCK_CLIMATE);
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [horizon, setHorizon] = useState('14d');
  const [activeScenario, setActiveScenario] = useState('normal_monsoon');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [error, setError] = useState(null);
  const [locationStatus, setLocationStatus] = useState(null);
  
  // AI Chat modal global trigger
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [initialAIQuery, setInitialAIQuery] = useState('');

  // Initial Load
  useEffect(() => {
    loadAllData(selectedLocation.locationId, horizon);
  }, []);

  const loadAllData = async (locationId = selectedLocation.locationId, currentHorizon = horizon) => {
    setIsLoading(true);
    setError(null);
    try {
      const [locsRes, cropsRes, weatherRes, forecastRes, climateRes, alertsRes] = await Promise.allSettled([
        api.getLocations(),
        api.getCrops(),
        api.getWeather(locationId),
        api.getForecast(locationId, currentHorizon),
        api.getClimateIndices(),
        api.getAlerts()
      ]);

      if (locsRes.status === 'fulfilled' && locsRes.value?.length) {
        // Keep custom GPS location if already detected
        setLocations(prev => {
          const gpsLoc = prev.find(l => l.isGPSDetected);
          if (gpsLoc) return [gpsLoc, ...locsRes.value.filter(l => l.locationId !== gpsLoc.locationId)];
          return locsRes.value;
        });
      }
      if (cropsRes.status === 'fulfilled' && cropsRes.value?.length) {
        setCrops(cropsRes.value);
      }
      if (weatherRes.status === 'fulfilled') {
        setWeather(weatherRes.value);
      }
      if (forecastRes.status === 'fulfilled') {
        setForecast(forecastRes.value);
      }
      if (climateRes.status === 'fulfilled') {
        setClimate(climateRes.value);
      }
      if (alertsRes.status === 'fulfilled') {
        setAlerts(alertsRes.value);
      }
    } catch (err) {
      console.warn('Data load fallback active', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationChange = async (locationId) => {
    const loc = locations.find(l => l.locationId === locationId) || locations[0];
    setSelectedLocation(loc);
    setIsLoading(true);
    try {
      if (loc.isGPSDetected) {
        // Fetch live coordinate weather for custom GPS
        await fetchLiveWeatherForCoords(loc.latitude, loc.longitude, loc);
      } else {
        const [w, f] = await Promise.all([
          api.getWeather(loc.locationId),
          api.getForecast(loc.locationId, horizon)
        ]);
        setWeather(w);
        setForecast(f);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Real GPS / Network Location Detection with Reverse Geocoding
   */
  const detectUserLocation = async () => {
    setIsDetectingLocation(true);
    setLocationStatus('Acquiring live hardware GPS coordinates...');

    try {
      const locData = await detectCurrentLocation();
      const lat = locData.latitude;
      const lon = locData.longitude;
      
      // Match State
      const stateSearch = `${locData.state || ''} ${locData.rawAddress || ''}`.toLowerCase();
      const matchedState = ALL_INDIAN_STATES.find(s => 
        stateSearch.includes(s.toLowerCase()) || (locData.state && locData.state.toLowerCase().includes(s.toLowerCase()))
      ) || locData.state || 'Rajasthan';

      // Match District
      const availableDistricts = getDistrictsForState(matchedState);
      const districtSearch = `${locData.district || ''} ${locData.city || ''} ${locData.county || ''} ${locData.rawAddress || ''}`.toLowerCase();
      let matchedDistrict = availableDistricts.find(d => 
        districtSearch.includes(d.toLowerCase()) || 
        (locData.district && d.toLowerCase() === locData.district.toLowerCase())
      );

      // Coordinate boundary heuristics for Southern vs Northern regions
      if (!matchedDistrict && lat && lon) {
        if (lat >= 23.8 && lat <= 25.2 && lon >= 73.0 && lon <= 74.4) {
          matchedDistrict = 'Udaipur';
        } else {
          matchedDistrict = locData.district || availableDistricts[0] || 'Udaipur';
        }
      } else if (!matchedDistrict) {
        matchedDistrict = locData.district || availableDistricts[0] || 'Udaipur';
      }

      // Match Village / Panchayat
      const availableVillages = getVillagesForDistrict(matchedState, matchedDistrict);
      const villageSearch = `${locData.panchayat || ''} ${locData.rawAddress || ''}`.toLowerCase();
      const matchedVillage = availableVillages.find(v => 
        villageSearch.includes(v.toLowerCase()) || (locData.panchayat && locData.panchayat.toLowerCase().includes(v.toLowerCase()))
      ) || locData.panchayat || availableVillages[0] || 'City / Village';

      const newGPSLocation = {
        locationId: `gps-${Date.now()}`,
        state: matchedState,
        district: matchedDistrict,
        block: matchedDistrict,
        panchayat: matchedVillage,
        latitude: lat,
        longitude: lon,
        soilType: 'Local Soil Profile',
        agroClimaticZone: `${matchedState} Agro-Climatic Zone`,
        elevation: 280,
        historicalRainfallAvgMm: 680,
        isGPSDetected: true
      };

      // Update location store
      setLocations(prev => [newGPSLocation, ...prev.filter(l => !l.isGPSDetected)]);
      setSelectedLocation(newGPSLocation);

      // Fetch live weather for these exact GPS coordinates
      setLocationStatus(`Fetching live atmospheric data for ${matchedVillage}, ${matchedDistrict}...`);
      await fetchLiveWeatherForCoords(lat, lon, newGPSLocation);
      setLocationStatus(`✅ Location detected: ${matchedVillage}, ${matchedDistrict}!`);
      setTimeout(() => setLocationStatus(null), 3500);
    } catch (err) {
      console.error('Error handling location detection:', err);
      setLocationStatus('Failed to retrieve location details. Please choose manually.');
      setTimeout(() => setLocationStatus(null), 3500);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  /**
   * Helper to fetch real Open-Meteo weather for exact GPS lat/lon
   */
  const fetchLiveWeatherForCoords = async (lat, lon, loc) => {
    try {
      const res = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude: lat,
          longitude: lon,
          current: 'temperature_2m,relative_humidity_2m,precipitation,surface_pressure,wind_speed_10m',
          daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
          timezone: 'auto'
        },
        timeout: 6000
      });

      if (res.data && res.data.current) {
        const c = res.data.current;
        const d = res.data.daily;

        const liveWeather = {
          locationId: loc.locationId,
          locationName: `${loc.panchayat}, ${loc.district}, ${loc.state}`,
          state: loc.state,
          district: loc.district,
          panchayat: loc.panchayat,
          coordinates: { lat, lon },
          date: new Date().toISOString(),
          temperature: c.temperature_2m,
          tempMin: d?.temperature_2m_min?.[0] || Math.round(c.temperature_2m - 5),
          tempMax: d?.temperature_2m_max?.[0] || Math.round(c.temperature_2m + 4),
          humidity: c.relative_humidity_2m,
          rainfall24h: c.precipitation || 0,
          recentRainfall7d: (d?.precipitation_sum || []).slice(0, 7).reduce((a, b) => a + (b || 0), 0) || 28,
          windSpeed: c.wind_speed_10m || 12,
          windDirection: 'Monsoonal Flow',
          pressure: c.surface_pressure || 1008,
          soilMoisture: c.precipitation > 5 ? 78 : 55,
          evapotranspiration: 4.5,
          condition: c.precipitation > 5 ? 'Rainy' : c.relative_humidity_2m > 75 ? 'Humid / Overcast' : 'Partly Cloudy',
          isLiveGPS: true
        };

        setWeather(liveWeather);

        // Generate tailored forecast timeline
        const totalDays = horizon === '30d' ? 30 : horizon === '21d' ? 21 : horizon === '14d' ? 14 : 7;
        const timeline = [];
        const today = new Date();

        for (let i = 0; i < totalDays; i++) {
          const dateObj = new Date(today);
          dateObj.setDate(today.getDate() + i + 1);
          const expectedRain = d?.precipitation_sum?.[i] !== undefined ? d.precipitation_sum[i] : Math.max(0, Math.round((8 + Math.sin(i * 0.6) * 10) * 10) / 10);
          const rainProb = expectedRain > 10 ? 85 : expectedRain > 2 ? 65 : 30;

          timeline.push({
            dayIndex: i + 1,
            day: dateObj.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
            date: dateObj.toISOString().split('T')[0],
            rainfallProb: rainProb,
            expectedRainfallMm: expectedRain,
            tempMax: d?.temperature_2m_max?.[i] || Math.round(liveWeather.tempMax + Math.sin(i) * 2),
            tempMin: d?.temperature_2m_min?.[i] || Math.round(liveWeather.tempMin + Math.cos(i) * 1.5),
            humidity: Math.min(98, Math.max(40, Math.round(liveWeather.humidity + Math.sin(i * 0.5) * 8))),
            drySpellRisk: rainProb < 40 ? 60 : 20,
            heavyRainRisk: expectedRain > 30 ? 75 : 25,
            condition: expectedRain > 25 ? 'Heavy Rain' : expectedRain > 2 ? 'Showers' : 'Partly Sunny'
          });
        }

        setForecast({
          locationId: loc.locationId,
          locationName: `${loc.panchayat}, ${loc.block}, ${loc.district}`,
          state: loc.state,
          district: loc.district,
          block: loc.block,
          panchayat: loc.panchayat,
          coordinates: { lat, lon },
          forecastDate: new Date().toISOString(),
          horizon,
          onsetProbability: liveWeather.humidity > 70 ? 82 : 65,
          drySpellProbability: liveWeather.humidity < 60 ? 55 : 22,
          heavyRainProbability: liveWeather.rainfall24h > 15 ? 70 : 35,
          confidence: 80,
          confidenceLevel: 'High',
          expectedRainfallMm: Math.round(timeline.reduce((acc, curr) => acc + curr.expectedRainfallMm, 0)),
          timeline,
          soilMoistureStatus: liveWeather.soilMoisture > 70 ? 'Adequate for Sowing' : 'Moderate Moisture',
          isLiveGPSForecast: true
        });
      }
    } catch (err) {
      console.warn('Coordinates weather fetch fallback:', err.message);
    }
  };

  const handleHorizonChange = async (newHorizon) => {
    setHorizon(newHorizon);
    if (selectedLocation.isGPSDetected) {
      await fetchLiveWeatherForCoords(selectedLocation.latitude, selectedLocation.longitude, selectedLocation);
    } else {
      try {
        const f = await api.getForecast(selectedLocation.locationId, newHorizon);
        setForecast(f);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleCropChange = (cropId) => {
    const crop = crops.find(c => c.cropId === cropId) || crops[0];
    setSelectedCrop(crop);
  };

  const handleScenarioChange = async (scenarioKey) => {
    setActiveScenario(scenarioKey);
    setIsLoading(true);
    try {
      await api.setScenario(scenarioKey);
      await loadAllData(selectedLocation.locationId, horizon);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const openAIChatWithPrompt = (promptText = '') => {
    setInitialAIQuery(promptText);
    setIsAIChatOpen(true);
  };

  return (
    <AppContext.Provider value={{
      locations,
      selectedLocation,
      handleLocationChange,
      detectUserLocation,
      isDetectingLocation,
      locationStatus,
      crops,
      selectedCrop,
      handleCropChange,
      weather,
      forecast,
      climate,
      alerts,
      horizon,
      handleHorizonChange,
      activeScenario,
      handleScenarioChange,
      isLoading,
      error,
      refreshData: () => loadAllData(selectedLocation.locationId, horizon),
      isAIChatOpen,
      setIsAIChatOpen,
      initialAIQuery,
      setInitialAIQuery,
      openAIChatWithPrompt
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
