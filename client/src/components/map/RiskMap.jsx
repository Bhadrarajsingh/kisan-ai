import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { BLOCK_POLYGONS, getBlockPolygon } from './GeoJsonData';
import { Layers, Sparkles, Sprout, ArrowRight, MapPin, Compass, Globe } from 'lucide-react';
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const RiskMap = ({ height = '520px', compact = false }) => {
  const { locations, selectedLocation, handleLocationChange, forecast, openAIChatWithPrompt } = useApp();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const [activeMetric, setActiveMetric] = useState('onset'); // 'onset', 'dry_spell', 'heavy_rain', 'anomaly'
  const [mapType, setMapType] = useState('terrain'); // 'terrain', 'roadmap', 'hybrid'
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  const mapRef = useRef(null);
  const googleMapInstance = useRef(null);
  const polygonInstances = useRef([]);
  const markerInstances = useRef([]);
  const infoWindowInstance = useRef(null);

  const metrics = [
    { key: 'onset', label: 'Onset Risk / Probability', color: '#16A34A' },
    { key: 'dry_spell', label: 'Dry Spell Risk', color: '#F59E0B' },
    { key: 'heavy_rain', label: 'Heavy Rain Risk', color: '#EF4444' },
    { key: 'anomaly', label: 'Rainfall Anomaly (%)', color: '#0EA5E9' }
  ];

  // Helper to get fill color and opacity for each block polygon
  const getRiskColor = (loc, metric) => {
    const isSelected = loc.locationId === selectedLocation.locationId;
    let val = 78;

    if (metric === 'dry_spell') val = isSelected ? forecast?.drySpellProbability || 24 : 28;
    else if (metric === 'heavy_rain') val = isSelected ? forecast?.heavyRainProbability || 38 : 32;
    else if (metric === 'anomaly') val = 12;
    else val = isSelected ? forecast?.onsetProbability || 78 : 72;

    let fillColor = '#10B981';
    if (metric === 'onset') {
      if (val >= 70) fillColor = '#16A34A'; // Green
      else if (val >= 50) fillColor = '#84CC16';
      else if (val >= 30) fillColor = '#EAB308'; // Yellow
      else fillColor = '#EF4444'; // Red
    } else {
      if (val >= 70) fillColor = '#DC2626'; // Red
      else if (val >= 50) fillColor = '#F97316'; // Orange
      else if (val >= 25) fillColor = '#EAB308'; // Yellow
      else fillColor = '#10B981'; // Green
    }

    return {
      fillColor,
      val,
      strokeColor: isSelected ? '#0F172A' : fillColor,
      strokeWeight: isSelected ? 3.5 : 1.5,
      fillOpacity: isSelected ? 0.65 : 0.45
    };
  };

  // 1. Dynamically Load Google Maps JS API script with the user's provided key
  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsGoogleLoaded(true);
      return;
    }

    const existingScript = document.getElementById('google-maps-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=weekly&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsGoogleLoaded(true);
      };
      script.onerror = () => {
        console.warn('Google Maps script failed to load, checking fallback.');
      };
      document.head.appendChild(script);
    } else {
      const checkLoaded = setInterval(() => {
        if (window.google && window.google.maps) {
          setIsGoogleLoaded(true);
          clearInterval(checkLoaded);
        }
      }, 200);
      return () => clearInterval(checkLoaded);
    }
  }, []);

  // 2. Initialize Google Map instance once API is ready
  useEffect(() => {
    if (!isGoogleLoaded || !mapRef.current || googleMapInstance.current) return;

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: selectedLocation.latitude, lng: selectedLocation.longitude },
        zoom: 9,
        mapTypeId: mapType,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      googleMapInstance.current = map;
      infoWindowInstance.current = new window.google.maps.InfoWindow();
    } catch (err) {
      console.error('Error creating Google Map:', err);
    }
  }, [isGoogleLoaded]);

  // 3. Update Map Type (Terrain, Roadmap, Hybrid)
  useEffect(() => {
    if (googleMapInstance.current) {
      googleMapInstance.current.setMapTypeId(mapType);
    }
  }, [mapType]);

  // 4. Center map when selectedLocation changes
  useEffect(() => {
    if (googleMapInstance.current && selectedLocation) {
      googleMapInstance.current.panTo({
        lat: selectedLocation.latitude,
        lng: selectedLocation.longitude
      });
    }
  }, [selectedLocation]);

  // 5. Draw and update Polygons & Markers whenever activeMetric or locations change
  useEffect(() => {
    if (!isGoogleLoaded || !googleMapInstance.current) return;

    const map = googleMapInstance.current;

    // Clear existing polygons and markers
    polygonInstances.current.forEach(p => p.setMap(null));
    polygonInstances.current = [];
    markerInstances.current.forEach(m => m.setMap(null));
    markerInstances.current = [];

    locations.forEach(loc => {
      const feature = getBlockPolygon(loc);
      if (!feature || !feature.geometry?.coordinates) return;

      // Extract coords: Leaflet GeoJSON is [lng, lat], Google Maps is {lat, lng}
      const path = feature.geometry.coordinates[0].map(([lng, lat]) => ({
        lat,
        lng
      }));

      const style = getRiskColor(loc, activeMetric);
      const isSelected = loc.locationId === selectedLocation.locationId;

      const polygon = new window.google.maps.Polygon({
        paths: path,
        strokeColor: style.strokeColor,
        strokeOpacity: 0.9,
        strokeWeight: style.strokeWeight,
        fillColor: style.fillColor,
        fillOpacity: style.fillOpacity,
        clickable: true,
        map
      });

      // Polygon Click Event
      polygon.addListener('click', (event) => {
        handleLocationChange(loc.locationId);
        showLocationInfoWindow(loc, event.latLng);
      });

      polygonInstances.current.push(polygon);

      // Marker at block center
      const marker = new window.google.maps.Marker({
        position: { lat: loc.latitude, lng: loc.longitude },
        map,
        title: `${loc.panchayat} (${loc.block})`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: isSelected ? 8 : 6,
          fillColor: style.fillColor,
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        }
      });

      marker.addListener('click', () => {
        handleLocationChange(loc.locationId);
        showLocationInfoWindow(loc, { lat: () => loc.latitude, lng: () => loc.longitude });
      });

      markerInstances.current.push(marker);
    });
  }, [isGoogleLoaded, activeMetric, selectedLocation, locations, forecast]);

  // InfoWindow popup on Google Map
  const showLocationInfoWindow = (loc, latLng) => {
    if (!infoWindowInstance.current || !googleMapInstance.current) return;

    const isCurrent = loc.locationId === selectedLocation.locationId;
    const onsetVal = isCurrent ? forecast?.onsetProbability || 78 : 74;
    const dryVal = isCurrent ? forecast?.drySpellProbability || 24 : 28;
    const heavyVal = isCurrent ? forecast?.heavyRainProbability || 38 : 34;
    const confVal = isCurrent ? forecast?.confidence || 72 : 70;

    const contentString = `
      <div style="padding: 6px 4px; font-family: Inter, sans-serif; min-width: 220px; font-size: 12px; color: #1e293b;">
        <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong style="font-size: 13px; color: #0f172a;">${loc.panchayat} Panchayat</strong>
            <span style="font-size: 10px; font-weight: 700; background: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 9999px;">
              ${loc.district}
            </span>
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
            Block: ${loc.block} • ${loc.state}
          </div>
        </div>

        <div style="display: grid; gap: 4px; font-size: 11px; margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #475569;">Monsoon Onset:</span>
            <strong style="color: #15803d; background: #f0fdf4; padding: 1px 6px; border-radius: 4px;">${onsetVal}%</strong>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #475569;">Dry Spell Risk:</span>
            <strong style="color: #b45309; background: #fffbeb; padding: 1px 6px; border-radius: 4px;">${dryVal}%</strong>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #475569;">Heavy Rain Risk:</span>
            <strong style="color: #b91c1c; background: #fef2f2; padding: 1px 6px; border-radius: 4px;">${heavyVal}%</strong>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: #475569;">Model Confidence:</span>
            <span style="color: #334155; font-weight: 600;">${confVal}%</span>
          </div>
        </div>

        <div style="display: flex; gap: 6px; border-top: 1px solid #f1f5f9; padding-top: 8px;">
          <a href="/farmer-advisory" style="flex: 1; text-align: center; background: #16a34a; color: #ffffff; text-decoration: none; padding: 6px; border-radius: 6px; font-weight: 700; font-size: 11px; display: inline-block;">
            🌱 View Advisory
          </a>
        </div>
      </div>
    `;

    infoWindowInstance.current.setContent(contentString);
    infoWindowInstance.current.setPosition(latLng);
    infoWindowInstance.current.open(googleMapInstance.current);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
      
      {/* Control Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-agri-600" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              Interactive Monsoon Risk GIS Map
            </h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
              Google Maps
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Click on any Block / Panchayat polygon to inspect localized probabilities & advisories
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Map Layer Type Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setMapType('terrain')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                mapType === 'terrain' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Terrain
            </button>
            <button
              onClick={() => setMapType('roadmap')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                mapType === 'roadmap' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Roadmap
            </button>
            <button
              onClick={() => setMapType('hybrid')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                mapType === 'hybrid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Satellite
            </button>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {metrics.map((m) => (
              <button
                key={m.key}
                onClick={() => setActiveMetric(m.key)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeMetric === m.key
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Container Element */}
      <div className="relative w-full" style={{ height }}>
        <div ref={mapRef} className="w-full h-full" />

        {/* Legend Overlay in Bottom-Left */}
        <div className="absolute bottom-6 left-4 z-10 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-md text-xs space-y-1.5 max-w-[210px]">
          <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
            Risk Color Key
          </span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600 text-[11px]">Low Risk / High Onset</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="text-slate-600 text-[11px]">Moderate Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span className="text-slate-600 text-[11px]">High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            <span className="text-slate-600 text-[11px]">Very High Risk</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default RiskMap;
