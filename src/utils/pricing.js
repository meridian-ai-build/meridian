// ─── Single Print Sizes ──────────────────────────────────────────────────────
export const SINGLE_PRINT_SIZES = [
  // Square
  { id: 'sq-8x8',   label: '8×8"',   w: 8,  h: 8,  shape: 'square',    basePrice: 29 },
  { id: 'sq-12x12', label: '12×12"', w: 12, h: 12, shape: 'square',    basePrice: 39 },
  { id: 'sq-16x16', label: '16×16"', w: 16, h: 16, shape: 'square',    basePrice: 55 },
  { id: 'sq-24x24', label: '24×24"', w: 24, h: 24, shape: 'square',    basePrice: 79 },
  // Rectangle
  { id: 'rc-8x10',  label: '8×10"',  w: 8,  h: 10, shape: 'rectangle', basePrice: 29 },
  { id: 'rc-11x14', label: '11×14"', w: 11, h: 14, shape: 'rectangle', basePrice: 39 },
  { id: 'rc-16x20', label: '16×20"', w: 16, h: 20, shape: 'rectangle', basePrice: 55 },
  { id: 'rc-18x24', label: '18×24"', w: 18, h: 24, shape: 'rectangle', basePrice: 65 },
  { id: 'rc-24x36', label: '24×36"', w: 24, h: 36, shape: 'rectangle', basePrice: 85 },
];

// Print & Ship adds a flat production/shipping markup on top of base price
const PRINT_SHIP_MARKUP = 40;

export function calculateSinglePrintPrice(sizeId, printTypeId, frameId) {
  const size = SINGLE_PRINT_SIZES.find(s => s.id === sizeId) ?? SINGLE_PRINT_SIZES[0];
  const fr   = FRAME_OPTIONS.find(f => f.id === frameId)       ?? FRAME_OPTIONS[0];
  const printMarkup = printTypeId === 'print' ? PRINT_SHIP_MARKUP : 0;
  return size.basePrice + printMarkup + fr.price;
}

// ─── Travel Map Print Types ───────────────────────────────────────────────────
export const PRINT_TYPES = [
  { id: 'digital', label: 'Digital Download', description: 'High-res PNG, instant delivery', price: 29 },
  { id: 'print',   label: 'Print & Ship',     description: 'Professional print, shipped to you', price: 69 },
];

export const FRAME_OPTIONS = [
  { id: 'none',  label: 'No Frame', price: 0  },
  { id: 'black', label: 'Black',    price: 20 },
  { id: 'white', label: 'White',    price: 20 },
  { id: 'oak',   label: 'Oak',      price: 30 },
];

// Box-shadow CSS strings that create a picture-frame effect without affecting layout
export const FRAME_SHADOWS = {
  none:  undefined,
  black: '0 0 0 1px rgba(255,255,255,0.06), 0 0 0 26px #1d1d1d, 0 0 0 27px #0a0a0a, 0 24px 80px rgba(0,0,0,0.75)',
  white: '0 0 0 1px rgba(0,0,0,0.06), 0 0 0 26px #ede9e3, 0 0 0 27px rgba(0,0,0,0.12), 0 24px 80px rgba(0,0,0,0.4)',
  oak:   '0 0 0 1px rgba(200,150,70,0.25), 0 0 0 26px #a87945, 0 0 0 27px rgba(0,0,0,0.35), 0 24px 80px rgba(0,0,0,0.55)',
};

export function calculatePrice(printTypeId, frameId) {
  const pt = PRINT_TYPES.find(p => p.id === printTypeId) ?? PRINT_TYPES[0];
  const fr = FRAME_OPTIONS.find(f => f.id === frameId) ?? FRAME_OPTIONS[0];
  return pt.price + fr.price;
}
