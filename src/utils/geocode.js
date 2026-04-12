import { getContinent } from './continents';

const cache = new Map();

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function geocodeOne(query) {
  const key = query.toLowerCase().trim();
  if (cache.has(key)) return cache.get(key);

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&addressdetails=1&accept-language=en`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Meridian Travel Poster App (personal use)' },
  });
  if (!res.ok) throw new Error(`Geocoding failed for "${query}"`);
  const data = await res.json();

  if (!data || data.length === 0) return null;

  const feature = data[0];
  const lng = parseFloat(feature.lon);
  const lat = parseFloat(feature.lat);
  const addr = feature.address || {};

  const shortName =
    addr.city || addr.town || addr.village || addr.county ||
    addr.state || addr.country || feature.display_name.split(',')[0];

  const country = addr.country || null;

  const result = {
    input: query,
    displayName: feature.display_name,
    shortName,
    country,
    continent: getContinent(country),
    coordinates: [lng, lat],
  };

  cache.set(key, result);
  return result;
}

// onProgress(status) called with { current, total, place, duplicate, failed }
export async function geocodePlaces(placeList, onProgress) {
  const results = [];
  const seen = new Set();

  for (let i = 0; i < placeList.length; i++) {
    const place = placeList[i];
    onProgress?.({ current: i + 1, total: placeList.length, place, duplicate: false, failed: false });

    try {
      const result = await geocodeOne(place);
      if (!result) {
        onProgress?.({ current: i + 1, total: placeList.length, place, duplicate: false, failed: true });
      } else if (seen.has(result.displayName)) {
        onProgress?.({ current: i + 1, total: placeList.length, place, duplicate: true, failed: false });
      } else {
        seen.add(result.displayName);
        results.push(result);
      }
    } catch {
      onProgress?.({ current: i + 1, total: placeList.length, place, duplicate: false, failed: true });
    }

    if (i < placeList.length - 1) await sleep(300);
  }
  return results;
}
