const COUNTRY_CONTINENT = {
  // North America
  'United States': 'North America', 'Canada': 'North America', 'Mexico': 'North America',
  'Guatemala': 'North America', 'Belize': 'North America', 'Honduras': 'North America',
  'El Salvador': 'North America', 'Nicaragua': 'North America', 'Costa Rica': 'North America',
  'Panama': 'North America', 'Cuba': 'North America', 'Jamaica': 'North America',
  'Haiti': 'North America', 'Dominican Republic': 'North America', 'Puerto Rico': 'North America',
  'Trinidad and Tobago': 'North America', 'Barbados': 'North America', 'Bahamas': 'North America',
  // South America
  'Brazil': 'South America', 'Argentina': 'South America', 'Chile': 'South America',
  'Colombia': 'South America', 'Venezuela': 'South America', 'Peru': 'South America',
  'Ecuador': 'South America', 'Bolivia': 'South America', 'Paraguay': 'South America',
  'Uruguay': 'South America', 'Guyana': 'South America', 'Suriname': 'South America',
  // Europe
  'United Kingdom': 'Europe', 'France': 'Europe', 'Germany': 'Europe', 'Italy': 'Europe',
  'Spain': 'Europe', 'Portugal': 'Europe', 'Netherlands': 'Europe', 'Belgium': 'Europe',
  'Switzerland': 'Europe', 'Austria': 'Europe', 'Sweden': 'Europe', 'Norway': 'Europe',
  'Denmark': 'Europe', 'Finland': 'Europe', 'Ireland': 'Europe', 'Greece': 'Europe',
  'Poland': 'Europe', 'Czech Republic': 'Europe', 'Czechia': 'Europe', 'Hungary': 'Europe',
  'Romania': 'Europe', 'Bulgaria': 'Europe', 'Croatia': 'Europe', 'Serbia': 'Europe',
  'Slovakia': 'Europe', 'Slovenia': 'Europe', 'Estonia': 'Europe', 'Latvia': 'Europe',
  'Lithuania': 'Europe', 'Luxembourg': 'Europe', 'Malta': 'Europe', 'Cyprus': 'Europe',
  'Iceland': 'Europe', 'Albania': 'Europe', 'North Macedonia': 'Europe', 'Bosnia and Herzegovina': 'Europe',
  'Montenegro': 'Europe', 'Kosovo': 'Europe', 'Moldova': 'Europe', 'Belarus': 'Europe',
  'Ukraine': 'Europe', 'Russia': 'Europe', 'Turkey': 'Europe', 'Georgia': 'Europe',
  'Armenia': 'Europe', 'Azerbaijan': 'Europe', 'Monaco': 'Europe', 'San Marino': 'Europe',
  'Liechtenstein': 'Europe', 'Andorra': 'Europe',
  // Asia
  'China': 'Asia', 'Japan': 'Asia', 'South Korea': 'Asia', 'North Korea': 'Asia',
  'India': 'Asia', 'Pakistan': 'Asia', 'Bangladesh': 'Asia', 'Sri Lanka': 'Asia',
  'Nepal': 'Asia', 'Bhutan': 'Asia', 'Maldives': 'Asia', 'Thailand': 'Asia',
  'Vietnam': 'Asia', 'Cambodia': 'Asia', 'Laos': 'Asia', 'Myanmar': 'Asia',
  'Malaysia': 'Asia', 'Singapore': 'Asia', 'Indonesia': 'Asia', 'Philippines': 'Asia',
  'Brunei': 'Asia', 'Timor-Leste': 'Asia', 'Mongolia': 'Asia', 'Taiwan': 'Asia',
  'Hong Kong': 'Asia', 'Macau': 'Asia', 'Kazakhstan': 'Asia', 'Uzbekistan': 'Asia',
  'Turkmenistan': 'Asia', 'Kyrgyzstan': 'Asia', 'Tajikistan': 'Asia', 'Afghanistan': 'Asia',
  'Iran': 'Asia', 'Iraq': 'Asia', 'Syria': 'Asia', 'Lebanon': 'Asia', 'Jordan': 'Asia',
  'Israel': 'Asia', 'Palestine': 'Asia', 'Saudi Arabia': 'Asia', 'Yemen': 'Asia',
  'Oman': 'Asia', 'United Arab Emirates': 'Asia', 'Qatar': 'Asia', 'Bahrain': 'Asia',
  'Kuwait': 'Asia',
  // Africa
  'Nigeria': 'Africa', 'Ethiopia': 'Africa', 'Egypt': 'Africa', 'South Africa': 'Africa',
  'Kenya': 'Africa', 'Tanzania': 'Africa', 'Uganda': 'Africa', 'Ghana': 'Africa',
  'Morocco': 'Africa', 'Algeria': 'Africa', 'Tunisia': 'Africa', 'Libya': 'Africa',
  'Sudan': 'Africa', 'South Sudan': 'Africa', 'Somalia': 'Africa', 'Mozambique': 'Africa',
  'Zambia': 'Africa', 'Zimbabwe': 'Africa', 'Namibia': 'Africa', 'Botswana': 'Africa',
  'Angola': 'Africa', 'Cameroon': 'Africa', 'Niger': 'Africa', 'Mali': 'Africa',
  'Burkina Faso': 'Africa', 'Senegal': 'Africa', 'Côte d\'Ivoire': 'Africa', 'Guinea': 'Africa',
  'Rwanda': 'Africa', 'Burundi': 'Africa', 'Malawi': 'Africa', 'Mauritius': 'Africa',
  'Seychelles': 'Africa', 'Madagascar': 'Africa', 'Reunion': 'Africa',
  // Oceania
  'Australia': 'Oceania', 'New Zealand': 'Oceania', 'Papua New Guinea': 'Oceania',
  'Fiji': 'Oceania', 'Samoa': 'Oceania', 'Tonga': 'Oceania', 'Vanuatu': 'Oceania',
  'Solomon Islands': 'Oceania', 'Kiribati': 'Oceania', 'Micronesia': 'Oceania',
  'Palau': 'Oceania', 'Marshall Islands': 'Oceania', 'Nauru': 'Oceania', 'Tuvalu': 'Oceania',
};

export function getContinent(countryName) {
  if (!countryName) return null;
  return COUNTRY_CONTINENT[countryName] || null;
}

export function getContinentsFromLocations(locations) {
  const continents = new Set();
  locations.forEach(loc => {
    const c = getContinent(loc.country);
    if (c) continents.add(c);
  });
  return [...continents];
}

export function getCountriesFromLocations(locations) {
  const countries = new Set();
  locations.forEach(loc => {
    if (loc.country) countries.add(loc.country);
  });
  return [...countries];
}
