import { Link } from 'react-router-dom';
import { POSTER_SIZES } from '../utils/posterSizes';
import { MAP_FOCUSES } from '../utils/mapFocuses';
import { PRINT_TYPES, FRAME_OPTIONS } from '../utils/pricing';
import LocationInput from './LocationInput';

const THEME_PREVIEWS = {
  vintage: { bg: '#f5e6c8', text: '#2c1810', accent: '#b8813a' },
  dark:    { bg: '#0d1117', text: '#f0e6d3', accent: '#d4af37' },
  minimal: { bg: '#ffffff', text: '#0a0a0a', accent: '#555555' },
};

const FRAME_SWATCH = {
  none:  null,
  black: '#1d1d1d',
  white: '#ede9e3',
  oak:   '#a87945',
};

export default function InputPanel({
  title, setTitle,
  subtitle, setSubtitle,
  yearFrom, setYearFrom,
  yearTo, setYearTo,
  yearMode, setYearMode,
  theme, setTheme,
  showLines, setShowLines,
  sizeId, setSizeId,
  orientation, setOrientation,
  focusId, setFocusId,
  printType, setPrintType,
  frameId, setFrameId,
  locations,
  onAddLocation,
  onRemoveLocation,
  onClear,
  onAddToCart,
  onExport,
  isExporting,
  error,
}) {
  const hasLocations = locations.length > 0;

  return (
    <aside className="w-80 h-full flex flex-col bg-[#111118] border-r border-white/[0.06] overflow-y-auto sidebar-scroll flex-shrink-0">
      {/* Logo */}
      <div className="px-5 pt-3 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center justify-between mb-2">
          <Link to="/" className="flex items-center gap-1.5 text-white/20 hover:text-white/45 transition-colors text-[10px] font-inter tracking-wide">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5m7-7-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Home
          </Link>
          {hasLocations && (
            <button onClick={onClear} className="text-[10px] text-white/25 hover:text-white/50 font-inter tracking-wide transition-colors">
              Clear all
            </button>
          )}
        </div>
        <div className="flex items-baseline gap-3">
          <span className="font-playfair text-xl font-semibold tracking-[0.12em] text-white">MERIDIAN</span>
          <span className="text-[10px] tracking-[0.25em] text-white/30 font-inter uppercase">Travel Map</span>
        </div>
      </div>

      <div className="flex-1 px-6 pt-3 pb-2 space-y-4 overflow-y-auto sidebar-scroll">

        {/* Resolved locations chips */}
        {hasLocations && (
          <section>
            <div className="flex items-center justify-between mb-2">
              <Label>Mapped Locations</Label>
              <span className="text-[10px] text-white/25 font-inter">{locations.length} place{locations.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {locations.map((loc, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/[0.06] border border-white/[0.08] text-white/70 text-[11px] font-inter group"
                >
                  <span className="text-white/40 mr-0.5 text-[9px]">{i + 1}</span>
                  {loc.shortName}
                  <button
                    onClick={() => onRemoveLocation(i)}
                    className="ml-0.5 text-white/20 hover:text-white/60 transition-colors leading-none"
                    title="Remove"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-3 h-px bg-white/[0.06]" />
          </section>
        )}

        {/* Poster Title */}
        <section>
          <Label className="mb-2">Poster Title</Label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="The Rodriguez Travels"
            maxLength={50}
            className="w-full bg-white/[0.04] border border-white/[0.1] rounded text-white/80 text-sm px-3 py-2 outline-none focus:border-white/30 placeholder:text-white/20 font-playfair transition-colors"
          />
        </section>

        {/* Subtitle */}
        <section>
          <Label className="mb-2">Subtitle</Label>
          <input
            type="text"
            value={subtitle}
            onChange={e => setSubtitle(e.target.value)}
            placeholder="Travel Journal"
            maxLength={40}
            className="w-full bg-white/[0.04] border border-white/[0.1] rounded text-white/80 text-sm px-3 py-2 outline-none focus:border-white/30 placeholder:text-white/20 font-inter transition-colors"
          />
        </section>

        {/* Year */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <Label>{yearMode === 'single' ? 'Year' : 'Year Range'}</Label>
            <div className="flex items-center gap-0.5 bg-white/[0.04] rounded p-0.5 border border-white/[0.07]">
              <button
                onClick={() => setYearMode('single')}
                className={`px-2 py-0.5 rounded text-[9px] font-inter tracking-wide transition-all ${
                  yearMode === 'single'
                    ? 'bg-white/[0.12] text-white/70'
                    : 'text-white/25 hover:text-white/45'
                }`}
              >
                Single
              </button>
              <button
                onClick={() => setYearMode('range')}
                className={`px-2 py-0.5 rounded text-[9px] font-inter tracking-wide transition-all ${
                  yearMode === 'range'
                    ? 'bg-white/[0.12] text-white/70'
                    : 'text-white/25 hover:text-white/45'
                }`}
              >
                Range
              </button>
            </div>
          </div>
          {yearMode === 'single' ? (
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={yearFrom}
              onChange={e => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 4);
                setYearFrom(v);
                setYearTo(v);
              }}
              placeholder="2024"
              className="w-full bg-white/[0.04] border border-white/[0.1] rounded text-white/80 text-sm px-3 py-2 outline-none focus:border-white/30 placeholder:text-white/20 font-inter transition-colors"
            />
          ) : (
            <div className="flex items-center gap-3">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={yearFrom}
                onChange={e => setYearFrom(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="2019"
                className="flex-1 bg-white/[0.04] border border-white/[0.1] rounded text-white/80 text-sm px-3 py-2 outline-none focus:border-white/30 placeholder:text-white/20 font-inter transition-colors"
              />
              <span className="text-white/20 text-sm font-inter">–</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={yearTo}
                onChange={e => setYearTo(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="2024"
                className="flex-1 bg-white/[0.04] border border-white/[0.1] rounded text-white/80 text-sm px-3 py-2 outline-none focus:border-white/30 placeholder:text-white/20 font-inter transition-colors"
              />
            </div>
          )}
        </section>

        {/* Places input */}
        <section>
          <Label className="mb-2">Add a Place</Label>
          <LocationInput onAddLocation={onAddLocation} />
          <p className="mt-1.5 text-[10px] text-white/20 font-inter">
            Search and select to pin locations on the map
          </p>
        </section>

        {/* Theme */}
        <section>
          <Label className="mb-2">Visual Style</Label>
          <div className="grid grid-cols-3 gap-2">
            {['vintage', 'dark', 'minimal'].map(t => {
              const p = THEME_PREVIEWS[t];
              const active = theme === t;
              return (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`relative flex flex-col items-center gap-1 py-2 px-2 rounded border transition-all ${
                    active
                      ? 'border-white/40 bg-white/[0.08]'
                      : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div
                    className="w-9 h-12 rounded-sm flex flex-col overflow-hidden"
                    style={{ backgroundColor: p.bg, border: `1px solid ${p.accent}40` }}
                  >
                    <div style={{ height: 3, backgroundColor: p.accent, opacity: 0.5 }} />
                    <div className="flex flex-col items-center mt-1.5 gap-0.5">
                      <div className="rounded-sm" style={{ width: 22, height: 2, backgroundColor: p.text, opacity: 0.7 }} />
                      <div className="rounded-sm" style={{ width: 14, height: 1.5, backgroundColor: p.accent, opacity: 0.5 }} />
                    </div>
                    <div className="mx-1 mt-1 flex-1 rounded-sm" style={{ backgroundColor: p.text, opacity: 0.08 }} />
                    <div className="flex-shrink-0 mx-1 mb-1.5 mt-1 flex justify-center gap-1">
                      {[1,2,3].map(i => (
                        <div key={i} className="rounded-sm" style={{ width: 7, height: 1.5, backgroundColor: p.accent, opacity: 0.5 }} />
                      ))}
                    </div>
                  </div>
                  <span className={`text-[10px] font-inter tracking-wide capitalize transition-colors ${active ? 'text-white/80' : 'text-white/35'}`}>
                    {t}
                  </span>
                  {active && (
                    <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-white/60" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Poster Size + Orientation */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <Label>Poster Size</Label>
            <div className="flex items-center gap-1">
              <OrientationButton active={orientation === 'portrait'} onClick={() => setOrientation('portrait')} portrait />
              <OrientationButton active={orientation === 'landscape'} onClick={() => setOrientation('landscape')} portrait={false} />
            </div>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {POSTER_SIZES.map(size => (
              <button
                key={size.id}
                onClick={() => setSizeId(size.id)}
                className={`px-2.5 py-1.5 rounded text-[11px] font-inter border transition-all ${
                  sizeId === size.id
                    ? 'border-white/40 bg-white/[0.1] text-white/90'
                    : 'border-white/[0.08] text-white/35 hover:border-white/20 hover:text-white/55'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </section>

        {/* Map Focus */}
        <section>
          <Label className="mb-2">Map Focus</Label>
          <div className="relative">
            <select
              value={focusId}
              onChange={e => setFocusId(e.target.value)}
              className="w-full appearance-none bg-white/[0.04] border border-white/[0.1] rounded text-white/70 text-sm px-3 py-2 pr-8 outline-none focus:border-white/30 font-inter transition-colors cursor-pointer"
            >
              {MAP_FOCUSES.map(f => (
                <option key={f.id} value={f.id} className="bg-[#1a1a24] text-white/80">
                  {f.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </section>

        {/* Route lines toggle */}
        <section>
          <button
            onClick={() => setShowLines(v => !v)}
            className="flex items-center justify-between w-full group"
          >
            <Label>Route Lines</Label>
            <div className={`relative w-8 h-4 rounded-full transition-colors flex-shrink-0 ${showLines ? 'bg-white/40' : 'bg-white/[0.08]'}`}>
              <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all`}
                style={{ left: showLines ? '18px' : '2px' }}
              />
            </div>
          </button>
          <p className="mt-1 text-[10px] text-white/20 font-inter leading-relaxed">
            {showLines ? 'Dashed lines connect locations in order entered' : 'Pins only — no connecting lines'}
          </p>
        </section>

        {/* Frame */}
        <section>
          <Label className="mb-2">Frame</Label>
          <div className="flex gap-1.5 flex-wrap">
            {FRAME_OPTIONS.map(f => (
              <button
                key={f.id}
                onClick={() => setFrameId(f.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[11px] font-inter border transition-all ${
                  frameId === f.id
                    ? 'border-white/40 bg-white/[0.1] text-white/90'
                    : 'border-white/[0.08] text-white/35 hover:border-white/20 hover:text-white/55'
                }`}
              >
                {f.id !== 'none' && (
                  <span
                    className="w-3 h-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: FRAME_SWATCH[f.id] }}
                  />
                )}
                {f.label}
                {f.price > 0 && (
                  <span className={`${frameId === f.id ? 'text-white/50' : 'text-white/20'}`}>
                    +${f.price}
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Print Type */}
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
                    : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                <span className={`text-[11px] font-inter font-medium ${printType === pt.id ? 'text-white/90' : 'text-white/50'}`}>
                  {pt.label}
                </span>
                <span className={`text-[10px] font-inter ${printType === pt.id ? 'text-white/50' : 'text-white/25'}`}>
                  ${pt.price}
                </span>
                <span className={`text-[9px] font-inter leading-tight ${printType === pt.id ? 'text-white/35' : 'text-white/18'}`}>
                  {pt.description}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded">
            <p className="text-xs text-red-400/80 font-inter leading-relaxed">{error}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 py-3 border-t border-white/[0.06] space-y-2">
        <button
          onClick={onAddToCart}
          disabled={!hasLocations}
          className={`w-full py-2.5 rounded text-sm font-inter font-medium tracking-wider transition-all ${
            !hasLocations
              ? 'bg-white/[0.05] text-white/25 cursor-not-allowed'
              : 'bg-white text-black hover:bg-white/90 active:scale-[0.98]'
          }`}
        >
          Add to Cart
        </button>

        <button
          onClick={onExport}
          disabled={isExporting || !hasLocations}
          className={`w-full py-2 rounded text-xs font-inter tracking-wider border transition-all ${
            isExporting || !hasLocations
              ? 'border-white/10 text-white/15 cursor-not-allowed'
              : 'border-white/[0.08] text-white/25 hover:border-white/20 hover:text-white/45 active:scale-[0.98]'
          }`}
        >
          {isExporting ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner />
              Exporting…
            </span>
          ) : (
            'Export PNG'
          )}
        </button>
      </div>
    </aside>
  );
}

function OrientationButton({ active, onClick, portrait }) {
  return (
    <button
      onClick={onClick}
      title={portrait ? 'Portrait' : 'Landscape'}
      className={`p-1.5 rounded border transition-all ${
        active ? 'border-white/40 bg-white/[0.1]' : 'border-white/[0.08] hover:border-white/20'
      }`}
    >
      <div className={`border rounded-sm transition-colors ${active ? 'border-white/70' : 'border-white/25'}`}
        style={portrait ? { width: 8, height: 11 } : { width: 11, height: 8 }}
      />
    </button>
  );
}

function Label({ children, className = '' }) {
  return (
    <label className={`block text-[10px] text-white/40 font-inter tracking-[0.15em] uppercase ${className}`}>
      {children}
    </label>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
