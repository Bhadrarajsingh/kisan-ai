/**
 * GeoJSON polygon outlines for key agro-climatic panchayats/blocks across India
 */
export const BLOCK_POLYGONS = {
  'raj-jai-chomu': {
    type: 'Feature',
    properties: {
      locationId: 'raj-jai-chomu',
      name: 'Morija (Chomu Block)',
      district: 'Jaipur',
      state: 'Rajasthan'
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [75.660, 27.220],
        [75.780, 27.210],
        [75.800, 27.130],
        [75.690, 27.110],
        [75.660, 27.220]
      ]]
    }
  },
  'raj-jai-phagi': {
    type: 'Feature',
    properties: {
      locationId: 'raj-jai-phagi',
      name: 'Nimera (Phagi Block)',
      district: 'Jaipur',
      state: 'Rajasthan'
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [75.500, 26.630],
        [75.630, 26.620],
        [75.640, 26.530],
        [75.520, 26.520],
        [75.500, 26.630]
      ]]
    }
  },
  'raj-jai-amber': {
    type: 'Feature',
    properties: {
      locationId: 'raj-jai-amber',
      name: 'Kukas (Amber Block)',
      district: 'Jaipur',
      state: 'Rajasthan'
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [75.840, 27.110],
        [75.950, 27.100],
        [75.960, 27.010],
        [75.850, 27.000],
        [75.840, 27.110]
      ]]
    }
  },
  'mp-ind-sanwer': {
    type: 'Feature',
    properties: {
      locationId: 'mp-ind-sanwer',
      name: 'Kshipra (Sanwer Block)',
      district: 'Indore',
      state: 'Madhya Pradesh'
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [75.760, 23.040],
        [75.890, 23.030],
        [75.900, 22.920],
        [75.780, 22.910],
        [75.760, 23.040]
      ]]
    }
  },
  'mp-ujj-badnagar': {
    type: 'Feature',
    properties: {
      locationId: 'mp-ujj-badnagar',
      name: 'Runija (Badnagar Block)',
      district: 'Ujjain',
      state: 'Madhya Pradesh'
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [75.310, 23.130],
        [75.450, 23.120],
        [75.460, 23.010],
        [75.320, 23.000],
        [75.310, 23.130]
      ]]
    }
  },
  'mah-amr-achlapur': {
    type: 'Feature',
    properties: {
      locationId: 'mah-amr-achlapur',
      name: 'Paratwada (Achalpur)',
      district: 'Amravati',
      state: 'Maharashtra'
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [77.440, 21.320],
        [77.580, 21.310],
        [77.590, 21.200],
        [77.450, 21.190],
        [77.440, 21.320]
      ]]
    }
  },
  'pun-lud-jagraon': {
    type: 'Feature',
    properties: {
      locationId: 'pun-lud-jagraon',
      name: 'Sidhwan Bet (Jagraon)',
      district: 'Ludhiana',
      state: 'Punjab'
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [75.400, 30.850],
        [75.550, 30.840],
        [75.560, 30.730],
        [75.420, 30.720],
        [75.400, 30.850]
      ]]
    }
  }
};

/**
 * Returns a polygon for any location (including dynamically GPS detected locations)
 */
export const getBlockPolygon = (location) => {
  if (!location) return null;
  if (BLOCK_POLYGONS[location.locationId]) {
    return BLOCK_POLYGONS[location.locationId];
  }

  // Generate a dynamic bounding polygon around detected GPS coordinates (~6-8km block radius)
  const lat = location.latitude;
  const lon = location.longitude;
  const deltaLat = 0.045;
  const deltaLon = 0.055;

  return {
    type: 'Feature',
    properties: {
      locationId: location.locationId,
      name: `${location.panchayat || location.block} (Current Location)`,
      district: location.district,
      state: location.state
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [lon - deltaLon, lat + deltaLat],
        [lon + deltaLon, lat + deltaLat * 0.9],
        [lon + deltaLon * 1.1, lat - deltaLat],
        [lon - deltaLon * 0.9, lat - deltaLat * 1.1],
        [lon - deltaLon, lat + deltaLat]
      ]]
    }
  };
};
