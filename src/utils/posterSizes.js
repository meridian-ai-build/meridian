const DPI = 150;

export const POSTER_SIZES = [
  { id: '8x10',  label: '8 × 10"',  w: 8,  h: 10 },
  { id: '11x14', label: '11 × 14"', w: 11, h: 14 },
  { id: '16x20', label: '16 × 20"', w: 16, h: 20 },
  { id: '18x24', label: '18 × 24"', w: 18, h: 24 },
  { id: '24x36', label: '24 × 36"', w: 24, h: 36 },
];

export const DEFAULT_SIZE_ID = '18x24';

export function getSizeById(id) {
  return POSTER_SIZES.find(s => s.id === id) ?? POSTER_SIZES.find(s => s.id === DEFAULT_SIZE_ID);
}

export function getExportDimensions(sizeId, orientation = 'portrait') {
  const size = getSizeById(sizeId);
  const pw = size.w * DPI;
  const ph = size.h * DPI;
  return orientation === 'landscape' ? { w: ph, h: pw } : { w: pw, h: ph };
}

export function getAspectRatio(sizeId, orientation = 'portrait') {
  const size = getSizeById(sizeId);
  return orientation === 'landscape' ? `${size.h}/${size.w}` : `${size.w}/${size.h}`;
}
