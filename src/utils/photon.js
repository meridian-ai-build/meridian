import { getContinent } from './continents';

// Photon (by Komoot) — free OpenStreetMap-powered geocoding, no API key required
const PHOTON_URL = 'https://photon.komoot.io/api/';

// Only surface meaningful place types — exclude raw addresses, streets, postcodes
const PLACE_TYPES = new Set([
  'city', 'town', 'village', 'hamlet', 'locality', 'suburb', 'district',
  'borough', 'county', 'state', 'country', 'island', 'bay', 'cape',
  'peak', 'park', 'airport', 'attraction',
]);

export async function searchPlaces(query) {
  if (!query || query.trim().length < 2) return [];

  const url = `${PHOTON_URL}?q=${encodeURIComponent(query)}&limit=7&lang=en`;
  const res = await fetch(url);
  if (!res.ok) return [];

  const data = await res.json();
  const seen = new Set();

  return data.features
    .filter(f => {
      const type = f.properties?.type;
      return !type || PLACE_TYPES.has(type);
    })
    .map(f => {
      const p = f.properties ?? {};
      const name = p.name || p.city || p.state || '';
      if (!name) return null;

      // Build a readable subtitle: "State, Country" or just "Country"
      const parts = [p.state || p.county, p.country].filter(Boolean);
      const subtitle = [...new Set(parts)].join(', ');
      const displayKey = `${name}|${subtitle}`;

      if (seen.has(displayKey)) return null;
      seen.add(displayKey);

      const country = p.country || null;

      return {
        input: name,
        shortName: name,
        subtitle,
        displayName: subtitle ? `${name}, ${subtitle}` : name,
        country,
        continent: getContinent(country),
        coordinates: f.geometry.coordinates, // [lng, lat]
      };
    })
    .filter(Boolean)
    .slice(0, 6);
}
