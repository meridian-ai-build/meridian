// Projection configs for react-simple-maps (naturalEarth1 projection)
// center: [longitude, latitude] of map center
// scale: zoom level (default world view = 147)

export const MAP_FOCUSES = [
  { id: 'world',           label: 'World',                   center: [10, 15],    scale: 165 },

  // Americas
  { id: 'north-america',   label: 'North America',            center: [-100, 48],  scale: 340 },
  { id: 'usa',             label: 'United States',            center: [-97, 38],   scale: 700 },
  { id: 'canada',          label: 'Canada',                   center: [-96, 58],   scale: 520 },
  { id: 'mexico',          label: 'Mexico & Central America', center: [-88, 18],   scale: 900 },
  { id: 'south-america',   label: 'South America',            center: [-60, -15],  scale: 360 },
  { id: 'caribbean',       label: 'Caribbean',                center: [-72, 18],   scale: 1400 },

  // Europe
  { id: 'europe',          label: 'Europe',                   center: [15, 54],    scale: 560 },
  { id: 'western-europe',  label: 'Western Europe',           center: [5, 48],     scale: 900 },
  { id: 'uk-ireland',      label: 'UK & Ireland',             center: [-3, 54],    scale: 1800 },
  { id: 'scandinavia',     label: 'Scandinavia',              center: [18, 65],    scale: 900 },
  { id: 'mediterranean',   label: 'Mediterranean',            center: [18, 38],    scale: 800 },

  // Asia & Middle East
  { id: 'asia',            label: 'Asia',                     center: [95, 38],    scale: 310 },
  { id: 'east-asia',       label: 'East Asia',                center: [118, 35],   scale: 620 },
  { id: 'southeast-asia',  label: 'Southeast Asia',           center: [115, 5],    scale: 620 },
  { id: 'south-asia',      label: 'South Asia',               center: [80, 22],    scale: 720 },
  { id: 'middle-east',     label: 'Middle East',              center: [44, 28],    scale: 700 },
  { id: 'central-asia',    label: 'Central Asia',             center: [65, 42],    scale: 640 },

  // Africa
  { id: 'africa',          label: 'Africa',                   center: [20, 2],     scale: 360 },
  { id: 'north-africa',    label: 'North Africa',             center: [18, 28],    scale: 640 },
  { id: 'sub-saharan',     label: 'Sub-Saharan Africa',       center: [22, -5],    scale: 460 },

  // Oceania
  { id: 'oceania',         label: 'Oceania & Australia',      center: [140, -25],  scale: 520 },
  { id: 'australia',       label: 'Australia',                center: [134, -27],  scale: 700 },
  { id: 'pacific',         label: 'Pacific Islands',          center: [175, -15],  scale: 560 },
];

export const DEFAULT_FOCUS_ID = 'world';

export function getFocusById(id) {
  return MAP_FOCUSES.find(f => f.id === id) ?? MAP_FOCUSES[0];
}
