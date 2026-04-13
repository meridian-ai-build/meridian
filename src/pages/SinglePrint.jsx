import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import SinglePrintPreview from '../components/SinglePrintPreview';
import CartDrawer from '../components/CartDrawer';
import { useCart } from '../context/CartContext';
import { FRAME_OPTIONS, FRAME_SHADOWS, SINGLE_PRINT_SIZES, calculateSinglePrintPrice } from '../utils/pricing';

const STYLES = [
  { id: 'vintage',   label: 'Vintage',   desc: 'Film grain · Serif · Warm tones' },
  { id: 'cinematic', label: 'Cinematic', desc: 'High contrast · Bold type · Dark' },
  { id: 'editorial', label: 'Editorial', desc: 'Clean · Oversized type · Cream' },
];

const STYLE_FONTS = {
  vintage:   ["'Cormorant Garamond', serif", "'Playfair Display', serif", "'DM Serif Display', serif"],
  cinematic: ["'Bebas Neue', sans-serif", "'Oswald', sans-serif"],
  editorial: ["'Space Grotesk', sans-serif", "'Cormorant Garamond', serif"],
};

const STYLE_FONT_LABELS = {
  vintage:   ['Cormorant', 'Playfair', 'DM Serif'],
  cinematic: ['Bebas Neue', 'Oswald'],
  editorial: ['Space Grotesk', 'Cormorant'],
};

const FILM_VARIANTS = [
  { id: '35mm', label: '35mm' },
  { id: '16mm', label: '16mm' },
];

const PRINT_TYPES = [
  { id: 'digital', label: 'Digital Download', desc: 'High-res PNG · Instant delivery' },
  { id: 'print',   label: 'Print & Ship',     desc: 'Pro print · Shipped to you' },
];

const FRAME_SWATCH = { none: null, black: '#1d1d1d', white: '#ede9e3', oak: '#a87945' };

const SQUARE_SIZES  = SINGLE_PRINT_SIZES.filter(s => s.shape === 'square');
const RECT_SIZES    = SINGLE_PRINT_SIZES.filter(s => s.shape === 'rectangle');

export default function SinglePrint() {
  const [location, setLocation]       = useState('');
  const [region, setRegion]           = useState('');
  const [date, setDate]               = useState('');
  const [quote, setQuote]             = useState('');
  const [photoUrl, setPhotoUrl]       = useState(null);
  const [style, setStyle]             = useState('vintage');
  const [filmVariant, setFilmVariant] = useState('35mm');
  const [fontIndex, setFontIndex]     = useState(0);
  const [frameId, setFrameId]         = useState('none');
  const [printType, setPrintType]     = useState('digital');
  const [sizeId, setSizeId]           = useState('rc-8x10');
  const [textPosition, setTextPosition] = useState('below');

  const { cart, cartOpen, setCartOpen, addToCart, removeFromCart } = useCart();
  const fileRef = useRef(null);

  const font = STYLE_FONTS[style]?.[fontIndex] ?? STYLE_FONTS[style]?.[0];
  const isFramed = frameId !== 'none';
  const currentSize = SINGLE_PRINT_SIZES.find(s => s.id === sizeId) ?? SINGLE_PRINT_SIZES[0];
  const aspectRatio = `${currentSize.w}/${currentSize.h}`;
  const price = calculateSinglePrintPrice(sizeId, printType, frameId);

  const handleStyleChange = useCallback((s) => {
    setStyle(s);
    setFontIndex(0);
  }, []);

  const handlePhotoChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoUrl(ev.target.result);
    reader.readAsDataURL(file);
  }, []);

  const handleAddToCart = useCallback(() => {
    const styleColors = {
      vintage:   { bg: '#12101a', accent: '#c9a857' },
      cinematic: { bg: '#040408', accent: '#e53935' },
      editorial: { bg: '#f5f0e8', accent: '#1a1410' },
    };
    addToCart({
      type: 'single-print',
      title: location || 'Single Print',
      location, region, date, quote, photoUrl,
      style, filmVariant, font,
      frameId, printType,
      sizeId,
      sizeLabel: currentSize.label,
      textPosition,
      price,
      themeColors: {
        posterBg: styleColors[style].bg,
        posterBorder: `${styleColors[style].accent}40`,
        posterAccent: styleColors[style].accent,
        pinColor: styleColors[style].accent,
      },
    });
  }, [location, region, date, quote, photoUrl, style, filmVariant, font, frameId, printType, sizeId, currentSize, textPosition, price, addToCart]);

  const frameShadow = FRAME_SHADOWS[frameId];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0c0c12]">

      {/* ── Top bar ── */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] flex-shrink-0">
        <Link to="/" className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors text-sm font-inter">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5m7-7-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </Link>

        <div className="flex items-baseline gap-3">
          <span className="font-playfair text-base tracking-[0.15em] text-white/70">MERIDIAN</span>
          <span className="text-[9px] tracking-[0.25em] text-white/25 font-inter uppercase">Single Print</span>
        </div>

        <button
          onClick={() => setCartOpen(true)}
          className="relative p-2 rounded-full text-white/35 hover:text-white/65 hover:bg-white/[0.06] transition-all"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {cart.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-white text-black text-[9px] font-bold font-inter flex items-center justify-center leading-none">
              {cart.length}
            </span>
          )}
        </button>
      </header>

      {/* ── Main content ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Controls Panel ── */}
        <aside className="w-80 h-full flex flex-col bg-[#111118] border-r border-white/[0.06] flex-shrink-0">
          <div className="flex-1 overflow-y-auto sidebar-scroll px-6 pt-4 pb-2 space-y-5">

            {/* Location */}
            <section>
              <Label className="mb-2">Location Name</Label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Paris"
                maxLength={40}
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded text-white/80 text-sm px-3 py-2 outline-none focus:border-white/30 placeholder:text-white/20 font-playfair transition-colors"
              />
            </section>

            {/* Region */}
            <section>
              <Label className="mb-2">Region or Country</Label>
              <input
                type="text"
                value={region}
                onChange={e => setRegion(e.target.value)}
                placeholder="Île-de-France, France"
                maxLength={50}
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded text-white/80 text-sm px-3 py-2 outline-none focus:border-white/30 placeholder:text-white/20 font-inter transition-colors"
              />
            </section>

            {/* Date */}
            <section>
              <Label className="mb-2">Date Traveled</Label>
              <input
                type="text"
                value={date}
                onChange={e => setDate(e.target.value)}
                placeholder="June 2019"
                maxLength={30}
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded text-white/80 text-sm px-3 py-2 outline-none focus:border-white/30 placeholder:text-white/20 font-inter transition-colors"
              />
            </section>

            {/* Quote */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <Label>Quote or Memory</Label>
                <span className="text-[10px] text-white/20 font-inter">{quote.length}/120</span>
              </div>
              <textarea
                value={quote}
                onChange={e => setQuote(e.target.value.slice(0, 120))}
                placeholder="Optional — a memory, a feeling, a line..."
                rows={3}
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded text-white/70 text-sm px-3 py-2 outline-none focus:border-white/30 placeholder:text-white/15 font-inter leading-relaxed resize-none transition-colors"
              />
            </section>

            {/* Photo Upload */}
            <section>
              <Label className="mb-2">Photo</Label>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePhotoChange} />
              {photoUrl ? (
                <div className="relative group">
                  <img src={photoUrl} alt="Upload preview" className="w-full h-24 object-cover rounded border border-white/[0.08]" />
                  <button
                    onClick={() => setPhotoUrl(null)}
                    className="absolute top-1.5 right-1.5 bg-black/70 text-white/60 hover:text-white rounded text-xs px-2 py-0.5 font-inter opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full h-16 rounded border border-dashed border-white/[0.12] hover:border-white/25 text-white/25 hover:text-white/45 transition-all flex flex-col items-center justify-center gap-1"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span className="text-[10px] font-inter tracking-wide">Upload JPG or PNG</span>
                </button>
              )}
            </section>

            {/* Style */}
            <section>
              <Label className="mb-2">Visual Style</Label>
              <div className="space-y-1.5">
                {STYLES.map(s => (
                  <button
                    key={s.id}
                    onClick={() => handleStyleChange(s.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded border text-left transition-all ${
                      style === s.id
                        ? 'border-white/35 bg-white/[0.07]'
                        : 'border-white/[0.07] hover:border-white/18 hover:bg-white/[0.03]'
                    }`}
                  >
                    <div>
                      <div className={`text-xs font-inter font-medium ${style === s.id ? 'text-white/90' : 'text-white/45'}`}>{s.label}</div>
                      <div className={`text-[10px] font-inter ${style === s.id ? 'text-white/35' : 'text-white/18'}`}>{s.desc}</div>
                    </div>
                    {style === s.id && <div className="w-1.5 h-1.5 rounded-full bg-white/60 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </section>

            {/* Text Position */}
            <section>
              <Label className="mb-2">Text Position</Label>
              <div className="flex gap-2">
                {[
                  { id: 'below',   label: 'Below Photo',   icon: '▬\n─' },
                  { id: 'overlay', label: 'Over Photo',    icon: '─\n▬' },
                ].map(tp => (
                  <button
                    key={tp.id}
                    onClick={() => setTextPosition(tp.id)}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded border text-[10px] font-inter transition-all ${
                      textPosition === tp.id
                        ? 'border-white/35 bg-white/[0.08] text-white/80'
                        : 'border-white/[0.07] text-white/30 hover:border-white/18 hover:text-white/50'
                    }`}
                  >
                    {/* Mini poster diagram */}
                    <div className="flex flex-col gap-0.5 w-6">
                      {tp.id === 'below' ? (
                        <>
                          <div className={`h-3 rounded-sm ${textPosition === tp.id ? 'bg-white/30' : 'bg-white/10'}`} />
                          <div className={`h-1.5 rounded-sm ${textPosition === tp.id ? 'bg-white/50' : 'bg-white/20'}`} />
                          <div className={`h-1 w-3/4 rounded-sm ${textPosition === tp.id ? 'bg-white/30' : 'bg-white/12'}`} />
                        </>
                      ) : (
                        <>
                          <div className="relative h-5 rounded-sm overflow-hidden">
                            <div className={`absolute inset-0 ${textPosition === tp.id ? 'bg-white/20' : 'bg-white/08'}`} />
                            <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${textPosition === tp.id ? 'bg-white/50' : 'bg-white/20'}`} />
                          </div>
                          <div className={`h-1 w-3/4 rounded-sm ${textPosition === tp.id ? 'bg-white/30' : 'bg-white/12'}`} />
                        </>
                      )}
                    </div>
                    {tp.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Film Variant (vintage only) */}
            {style === 'vintage' && (
              <section>
                <Label className="mb-2">Film Grain</Label>
                <div className="flex gap-2">
                  {FILM_VARIANTS.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setFilmVariant(v.id)}
                      className={`flex-1 py-1.5 rounded border text-[11px] font-inter transition-all ${
                        filmVariant === v.id
                          ? 'border-white/35 bg-white/[0.08] text-white/80'
                          : 'border-white/[0.07] text-white/30 hover:border-white/18 hover:text-white/50'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Font */}
            <section>
              <Label className="mb-2">Typography</Label>
              <div className="flex flex-wrap gap-1.5">
                {(STYLE_FONT_LABELS[style] || []).map((label, i) => (
                  <button
                    key={i}
                    onClick={() => setFontIndex(i)}
                    className={`px-2.5 py-1.5 rounded border text-[11px] font-inter transition-all ${
                      fontIndex === i
                        ? 'border-white/35 bg-white/[0.08] text-white/80'
                        : 'border-white/[0.07] text-white/30 hover:border-white/18 hover:text-white/50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </section>

            {/* Print Size */}
            <section>
              <Label className="mb-3">Print Size</Label>

              {/* Square group */}
              <div className="mb-3">
                <div className="text-[9px] text-white/25 font-inter tracking-[0.2em] uppercase mb-1.5">Square</div>
                <div className="flex flex-wrap gap-1.5">
                  {SQUARE_SIZES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSizeId(s.id)}
                      className={`px-2.5 py-1.5 rounded border text-[11px] font-inter transition-all ${
                        sizeId === s.id
                          ? 'border-white/40 bg-white/[0.1] text-white/90'
                          : 'border-white/[0.08] text-white/35 hover:border-white/20 hover:text-white/55'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rectangle group */}
              <div>
                <div className="text-[9px] text-white/25 font-inter tracking-[0.2em] uppercase mb-1.5">Rectangle</div>
                <div className="flex flex-wrap gap-1.5">
                  {RECT_SIZES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSizeId(s.id)}
                      className={`px-2.5 py-1.5 rounded border text-[11px] font-inter transition-all ${
                        sizeId === s.id
                          ? 'border-white/40 bg-white/[0.1] text-white/90'
                          : 'border-white/[0.08] text-white/35 hover:border-white/20 hover:text-white/55'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Frame */}
            <section>
              <Label className="mb-2">Frame</Label>
              <div className="flex flex-wrap gap-1.5">
                {FRAME_OPTIONS.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFrameId(f.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-[11px] font-inter transition-all ${
                      frameId === f.id
                        ? 'border-white/40 bg-white/[0.1] text-white/90'
                        : 'border-white/[0.08] text-white/35 hover:border-white/20 hover:text-white/55'
                    }`}
                  >
                    {f.id !== 'none' && (
                      <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: FRAME_SWATCH[f.id] }} />
                    )}
                    {f.label}
                    {f.price > 0 && (
                      <span className={frameId === f.id ? 'text-white/50' : 'text-white/20'}>+${f.price}</span>
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Format */}
            <section>
              <Label className="mb-2">Format</Label>
              <div className="grid grid-cols-2 gap-2">
                {PRINT_TYPES.map(pt => (
                  <button
                    key={pt.id}
                    onClick={() => setPrintType(pt.id)}
                    className={`flex flex-col items-start gap-0.5 px-3 py-2.5 rounded border text-left transition-all ${
                      printType === pt.id
                        ? 'border-white/40 bg-white/[0.08]'
                        : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                    <span className={`text-[11px] font-inter font-medium ${printType === pt.id ? 'text-white/90' : 'text-white/50'}`}>
                      {pt.label}
                    </span>
                    <span className={`text-[9px] font-inter leading-tight ${printType === pt.id ? 'text-white/35' : 'text-white/18'}`}>
                      {pt.desc}
                    </span>
                  </button>
                ))}
              </div>
            </section>

          </div>

          {/* Action buttons */}
          <div className="px-6 py-3 border-t border-white/[0.06]">
            <button
              onClick={handleAddToCart}
              disabled={!location.trim()}
              className={`w-full py-2.5 rounded text-sm font-inter font-medium tracking-wider transition-all ${
                !location.trim()
                  ? 'bg-white/[0.05] text-white/25 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-white/90 active:scale-[0.98]'
              }`}
            >
              Add to Cart · ${price}
            </button>
            <p className="text-center text-white/15 text-[9px] font-inter mt-2">
              {currentSize.label} · {printType === 'print' ? 'Print & Ship' : 'Digital Download'}
            </p>
          </div>
        </aside>

        {/* ── Preview area ── */}
        <main className="flex-1 flex items-center justify-center overflow-hidden bg-[#171720] relative">
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div
            className="relative z-10 flex items-center justify-center w-full h-full transition-all duration-300"
            style={{ padding: isFramed ? '3.5rem' : '2.5rem' }}
          >
            <SinglePrintPreview
              location={location}
              region={region}
              date={date}
              quote={quote}
              photoUrl={photoUrl}
              style={style}
              filmVariant={filmVariant}
              font={font}
              frameShadow={frameShadow}
              textPosition={textPosition}
              aspectRatio={aspectRatio}
            />
          </div>
        </main>
      </div>

      {cartOpen && (
        <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onRemove={i => removeFromCart(i)} />
      )}
    </div>
  );
}

function Label({ children, className = '' }) {
  return (
    <label className={`block text-[10px] text-white/40 font-inter tracking-[0.15em] uppercase ${className}`}>
      {children}
    </label>
  );
}
