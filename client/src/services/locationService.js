import axios from 'axios';

/**
 * Universal Location Detector
 * Uses Browser GPS with maximumAge: 0 (Live Device Hardware Location)
 * Followed by multi-strategy Reverse Geocoding.
 */
export const detectCurrentLocation = async () => {
  return new Promise(async (resolve, reject) => {
    // 1. Try Live Hardware GPS first
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const accuracy = pos.coords.accuracy;
          console.log(`[GPS] Live coordinates acquired: Lat ${lat}, Lon ${lon} (Accuracy: ±${accuracy}m)`);
          
          try {
            const locDetails = await reverseGeocode(lat, lon);
            resolve({
              ...locDetails,
              latitude: lat,
              longitude: lon,
              accuracy,
              source: 'gps'
            });
          } catch (err) {
            console.warn('[GPS] Reverse geocode error, falling back to IP:', err);
            try {
              const ipLoc = await detectLocationFromIP();
              resolve(ipLoc);
            } catch (ipErr) {
              // Return coordinates with generic names if geocoder fails
              resolve({
                latitude: lat,
                longitude: lon,
                state: 'Rajasthan',
                district: lat < 25.5 ? 'Udaipur' : 'Jaipur',
                panchayat: 'Live GPS Location',
                source: 'gps_raw'
              });
            }
          }
        },
        async (gpsErr) => {
          console.warn('[GPS] Permission denied or unavailable:', gpsErr.message);
          try {
            const ipLoc = await detectLocationFromIP();
            resolve(ipLoc);
          } catch (ipErr) {
            reject(new Error('Unable to determine location from GPS or Network'));
          }
        },
        { 
          enableHighAccuracy: true, 
          timeout: 12000, 
          maximumAge: 0 // ALWAYS live, NEVER use cached coordinates
        }
      );
    } else {
      // 2. Browser has no GPS support, use IP Geolocation directly
      try {
        const ipLoc = await detectLocationFromIP();
        resolve(ipLoc);
      } catch (err) {
        reject(err);
      }
    }
  });
};

/**
 * Reverse geocodes lat/lon into State, District, and Panchayat/Locality
 */
export const reverseGeocode = async (lat, lon) => {
  // Strategy 1: OpenStreetMap Nominatim with addressdetails=1
  try {
    const res = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
      { 
        timeout: 6000,
        headers: { 'Accept-Language': 'en' }
      }
    );
    const d = res.data;
    const addr = d?.address || {};
    
    if (addr && (addr.state || addr.country)) {
      const state = addr.state || addr.region || 'Rajasthan';
      
      // In India: state_district or district or city or county (tehsil/district)
      const district = addr.district || addr.state_district || addr.city || addr.county || addr.town || addr.municipality || 'District';
      const panchayat = addr.suburb || addr.neighbourhood || addr.village || addr.hamlet || addr.quarter || addr.road || district;
      const rawAddress = d?.display_name || '';

      return { 
        state, 
        district, 
        panchayat, 
        rawAddress,
        city: addr.city || addr.town || '',
        county: addr.county || ''
      };
    }
  } catch (e) {
    console.warn('[ReverseGeocode] Nominatim failed, trying BigDataCloud:', e.message);
  }

  // Strategy 2: BigDataCloud Reverse Geocoding
  try {
    const res = await axios.get(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
      { timeout: 6000 }
    );
    const d = res.data;
    if (d) {
      const state = d.principalSubdivision || 'Rajasthan';
      const district = d.locality || d.city || d.principalSubdivision || 'District';
      const panchayat = d.neighbourhood || d.localityInfo?.administrative?.[3]?.name || d.locality || 'Locality';
      return { 
        state, 
        district, 
        panchayat, 
        rawAddress: `${panchayat}, ${district}, ${state}`,
        city: d.city || '',
        county: d.locality || ''
      };
    }
  } catch (e) {
    console.warn('[ReverseGeocode] BigDataCloud error:', e.message);
  }

  // Strategy 3: Coordinate bounding box heuristic for Southern vs Northern Rajasthan
  const isSouthRajasthan = lat >= 23.5 && lat <= 25.5 && lon >= 73.0 && lon <= 74.8;
  return {
    state: 'Rajasthan',
    district: isSouthRajasthan ? 'Udaipur' : 'Jaipur',
    panchayat: isSouthRajasthan ? 'Udaipur City / Girwa' : 'Local Panchayat',
    rawAddress: ''
  };
};

/**
 * Fallback IP-based Geolocation with multiple zero-config providers
 */
export const detectLocationFromIP = async () => {
  // Provider 1: ipwho.is
  try {
    const res = await axios.get('https://ipwho.is/', { timeout: 6000 });
    const d = res.data;
    if (d && d.success) {
      const lat = d.latitude;
      const lon = d.longitude;
      const state = d.region || 'Rajasthan';
      const district = d.city || 'District';
      return {
        state,
        district,
        panchayat: d.city || 'Locality',
        latitude: lat,
        longitude: lon,
        source: 'ip'
      };
    }
  } catch (err) {
    console.warn('[IP] ipwho.is failed, trying next provider:', err.message);
  }

  // Provider 2: ipapi.co
  try {
    const res = await axios.get('https://ipapi.co/json/', { timeout: 6000 });
    const d = res.data;
    if (d && d.city) {
      return {
        state: d.region || 'Rajasthan',
        district: d.city,
        panchayat: d.city,
        latitude: d.latitude,
        longitude: d.longitude,
        source: 'ip'
      };
    }
  } catch (err) {
    console.warn('[IP] ipapi.co failed:', err.message);
  }

  // Provider 3: freeipapi.com
  try {
    const res = await axios.get('https://freeipapi.com/api/json', { timeout: 6000 });
    const d = res.data;
    if (d && d.cityName) {
      return {
        state: d.regionName || 'Rajasthan',
        district: d.cityName,
        panchayat: d.cityName,
        latitude: d.latitude,
        longitude: d.longitude,
        source: 'ip'
      };
    }
  } catch (err) {
    console.warn('[IP] freeipapi failed:', err.message);
  }

  throw new Error('All IP geolocation providers failed');
};
