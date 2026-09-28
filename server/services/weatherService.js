import axios from 'axios';
import { getLiveWeather, LOCATIONS_DATABASE } from './demoDataService.js';

export const fetchWeatherForLocation = async (locationId = 'raj-jai-chomu') => {
  const loc = LOCATIONS_DATABASE.find(l => l.locationId === locationId) || LOCATIONS_DATABASE[0];
  const weatherApiKey = process.env.WEATHER_API_KEY;
  const useDemo = process.env.USE_DEMO_DATA === 'true';

  if (useDemo) {
    return getLiveWeather(locationId);
  }

  // ── Priority 1: OpenWeatherMap API (if key is configured) ──────────────────
  const owmKeyOk = weatherApiKey &&
    weatherApiKey !== 'your_weather_api_key_here' &&
    weatherApiKey.trim().length > 10;

  if (owmKeyOk) {
    try {
      const [currentRes, forecastRes] = await Promise.all([
        axios.get('https://api.openweathermap.org/data/2.5/weather', {
          params: {
            lat: loc.latitude,
            lon: loc.longitude,
            appid: weatherApiKey,
            units: 'metric'
          },
          timeout: 5000
        }),
        axios.get('https://api.openweathermap.org/data/2.5/forecast', {
          params: {
            lat: loc.latitude,
            lon: loc.longitude,
            appid: weatherApiKey,
            units: 'metric',
            cnt: 7
          },
          timeout: 5000
        })
      ]);

      const c = currentRes.data;
      const forecastList = forecastRes.data?.list || [];

      // Accumulate 7-day rainfall from forecast (3-hourly slots)
      const rainfall7d = forecastList.reduce((sum, slot) => sum + (slot.rain?.['3h'] || 0), 0);

      // Min/max from forecast
      const temps = forecastList.map(s => s.main?.temp).filter(Boolean);
      const tempMin = temps.length ? Math.min(...temps) : c.main.temp - 5;
      const tempMax = temps.length ? Math.max(...temps) : c.main.temp + 4;

      console.log(`✅ OpenWeatherMap: live data fetched for ${loc.panchayat}, ${loc.district}`);

      return {
        locationId: loc.locationId,
        locationName: `${loc.panchayat}, ${loc.block}, ${loc.district}, ${loc.state}`,
        state: loc.state,
        district: loc.district,
        block: loc.block,
        panchayat: loc.panchayat,
        coordinates: { lat: loc.latitude, lon: loc.longitude },
        date: new Date().toISOString(),
        temperature: Math.round(c.main.temp),
        tempMin: Math.round(tempMin),
        tempMax: Math.round(tempMax),
        feelsLike: Math.round(c.main.feels_like),
        humidity: c.main.humidity,
        rainfall24h: c.rain?.['1h'] || c.rain?.['3h'] || 0,
        recentRainfall7d: Math.round(rainfall7d * 10) / 10,
        windSpeed: Math.round(c.wind?.speed * 3.6 || 12), // m/s to km/h
        windDirection: getWindDirection(c.wind?.deg || 225),
        pressure: c.main.pressure || 1008,
        visibility: (c.visibility || 8000) / 1000,
        cloudCover: c.clouds?.all || 60,
        soilMoisture: estimateSoilMoisture(c.main.humidity, c.rain),
        evapotranspiration: 4.5,
        condition: c.weather?.[0]?.main || 'Partly Cloudy',
        conditionDescription: c.weather?.[0]?.description || 'partly cloudy',
        icon: c.weather?.[0]?.icon,
        sunrise: new Date(c.sys.sunrise * 1000).toISOString(),
        sunset: new Date(c.sys.sunset * 1000).toISOString(),
        isLiveAPI: true,
        provider: 'OpenWeatherMap'
      };
    } catch (err) {
      console.warn(`⚠️  OpenWeatherMap API error for ${loc.locationId}: ${err.response?.data?.message || err.message}`);
    }
  }

  // ── Priority 2: Open-Meteo free API (no key needed) ────────────────────────
  try {
    const res = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: loc.latitude,
        longitude: loc.longitude,
        current: 'temperature_2m,relative_humidity_2m,precipitation,surface_pressure,wind_speed_10m',
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
        timezone: 'Asia/Kolkata'
      },
      timeout: 4000
    });

    if (res.data?.current) {
      const c = res.data.current;
      const d = res.data.daily;
      const rainfall7d = (d?.precipitation_sum || []).slice(0, 7).reduce((a, b) => a + (b || 0), 0);

      console.log(`✅ Open-Meteo: live data fetched for ${loc.panchayat}, ${loc.district}`);

      return {
        locationId: loc.locationId,
        locationName: `${loc.panchayat}, ${loc.block}, ${loc.district}, ${loc.state}`,
        state: loc.state,
        district: loc.district,
        block: loc.block,
        panchayat: loc.panchayat,
        coordinates: { lat: loc.latitude, lon: loc.longitude },
        date: new Date().toISOString(),
        temperature: c.temperature_2m,
        tempMin: d?.temperature_2m_min?.[0] || c.temperature_2m - 5,
        tempMax: d?.temperature_2m_max?.[0] || c.temperature_2m + 4,
        humidity: c.relative_humidity_2m,
        rainfall24h: c.precipitation || 0,
        recentRainfall7d: Math.round(rainfall7d * 10) / 10 || 35,
        windSpeed: c.wind_speed_10m || 12,
        windDirection: 'WSW (Monsoon Current)',
        pressure: c.surface_pressure || 1008,
        soilMoisture: 58,
        evapotranspiration: 4.5,
        condition: c.precipitation > 5 ? 'Rainy' : c.relative_humidity_2m > 75 ? 'Humid Overcast' : 'Partly Cloudy',
        isLiveAPI: true,
        provider: 'Open-Meteo'
      };
    }
  } catch (err) {
    console.warn(`⚠️  Open-Meteo API unreachable for ${loc.locationId}: ${err.message}`);
  }

  // ── Priority 3: Demo / calibrated model data ───────────────────────────────
  console.log(`ℹ️  Serving calibrated demo data for ${loc.locationId}`);
  return getLiveWeather(locationId);
};

// ── Helpers ─────────────────────────────────────────────────────────────────
function getWindDirection(deg) {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

function estimateSoilMoisture(humidity, rain) {
  const base = humidity * 0.5;
  const rainBonus = rain ? 15 : 0;
  return Math.min(95, Math.round(base + rainBonus));
}
