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
