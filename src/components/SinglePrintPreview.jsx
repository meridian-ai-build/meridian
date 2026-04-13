// Single Print live poster preview — three distinct visual styles

const STYLE_DEFAULTS = {
  vintage:    { bg: '#12101a', text: '#e6dac8', accent: '#c9a857', sub: '#7a9ab5' },
  cinematic:  { bg: '#040408', text: '#ffffff', accent: '#e53935', sub: '#8888aa' },
  editorial:  { bg: '#f5f0e8', text: '#1a1410', accent: '#1a1410', sub: '#7a6f64' },
};

export default function SinglePrintPreview({
  location, region, date, quote, photoUrl,
  style, filmVariant, font, frameShadow,
  textPosition = 'below',
  aspectRatio = '2/3',
}) {
  const colors = STYLE_DEFAULTS[style] ?? STYLE_DEFAULTS.vintage;

  return (
    <div
      className="relative overflow-hidden flex-shrink-0"
      style={{
        aspectRatio,
        height: '100%',
        maxHeight: '100%',
        maxWidth: '100%',
        width: 'auto',
        containerType: 'inline-size',
        backgroundColor: colors.bg,
        fontFamily: font || defaultFont(style),
        boxShadow: frameShadow,
        transition: 'box-shadow 0.3s ease',
      }}
    >
      {style === 'vintage'   && <VintagePoster   {...{ location, region, date, quote, photoUrl, filmVariant, colors, font, textPosition }} />}
      {style === 'cinematic' && <CinematicPoster {...{ location, region, date, quote, photoUrl, colors, font, textPosition }} />}
      {style === 'editorial' && <EditorialPoster {...{ location, region, date, quote, photoUrl, colors, font, textPosition }} />}
    </div>
  );
}

function defaultFont(style) {
  if (style === 'cinematic') return "'Bebas Neue', sans-serif";
  if (style === 'editorial') return "'Space Grotesk', sans-serif";
  return "'Cormorant Garamond', serif";
}

// ─── Film Grain ──────────────────────────────────────────────────────────────
function FilmGrain({ id, intensity = 0.18, baseFrequency = '0.65' }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'overlay', opacity: intensity }}>
      <defs>
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency={baseFrequency} numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
      <rect width="100%" height="100%" filter={`url(#${id})`} />
    </svg>
  );
}

// ─── Vintage ─────────────────────────────────────────────────────────────────
function VintagePoster({ location, region, date, quote, photoUrl, filmVariant, colors, font, textPosition }) {
  const serif = font || "'Cormorant Garamond', serif";
  const freq  = filmVariant === '16mm' ? '0.85' : '0.55';
  const isOverlay = textPosition === 'overlay';

  return (
    <>
      <FilmGrain id="vg-grain" intensity={0.22} baseFrequency={freq} />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.72) 100%)', zIndex: 2 }} />

      {/* Inner border frame */}
      <div className="absolute pointer-events-none"
        style={{ inset: '5%', border: `1px solid ${colors.accent}22`, zIndex: 3 }} />

      {isOverlay ? (
        /* ── Overlay layout: photo fills poster, text on top ── */
        <div className="absolute inset-0" style={{ zIndex: 4 }}>
          {/* Full-bleed photo */}
          {photoUrl ? (
            <>
              <img src={photoUrl} alt="" className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'sepia(0.30) brightness(0.72) contrast(1.12) saturate(0.85)' }} />
              <div className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.6) 100%)' }} />
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ backgroundColor: `${colors.accent}08` }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"
                style={{ color: `${colors.accent}40` }}>
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="m21 15-5-5L5 21"/>
              </svg>
            </div>
          )}

          {/* Top rule */}
          <div className="absolute top-0 left-0 right-0 flex items-center gap-2"
            style={{ padding: '9% 8% 0', opacity: 0.5 }}>
            <div className="flex-1 h-px" style={{ backgroundColor: colors.accent }} />
            <span style={{ fontSize: '6cqw', color: colors.accent, letterSpacing: '0.35em', fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>◆</span>
            <div className="flex-1 h-px" style={{ backgroundColor: colors.accent }} />
          </div>

          {/* Gradient fade at bottom */}
          <div className="absolute bottom-0 left-0 right-0"
            style={{ height: '55%', background: `linear-gradient(to top, ${colors.bg}f0 0%, ${colors.bg}99 45%, transparent 100%)` }} />

          {/* Text overlaid at bottom */}
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center text-center"
            style={{ padding: '0 8% 8%' }}>
            <div className="w-full flex items-center gap-2 mb-3" style={{ opacity: 0.35 }}>
              <div className="flex-1 h-px" style={{ backgroundColor: colors.accent }} />
              <span style={{ fontSize: '5cqw', color: colors.accent }}>◆</span>
              <div className="flex-1 h-px" style={{ backgroundColor: colors.accent }} />
            </div>
            <div style={{ fontSize: '10cqw', fontFamily: serif, fontWeight: 400, color: colors.text, letterSpacing: '0.06em', lineHeight: 1.05 }}>
              {location || 'LOCATION'}
            </div>
            {region && (
              <div style={{ fontSize: '4.5cqw', fontFamily: serif, fontWeight: 300, color: colors.accent, letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: '0.5cqw' }}>
                {region}
              </div>
            )}
            {date && (
              <div style={{ fontSize: '3.8cqw', fontFamily: "'Inter', sans-serif", fontWeight: 300, color: `${colors.text}60`, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '1cqw' }}>
                {date}
              </div>
            )}
            {quote && (
              <div style={{ fontSize: '4cqw', fontFamily: serif, fontStyle: 'italic', fontWeight: 300, color: `${colors.text}70`, lineHeight: 1.5, marginTop: '1.5cqw', maxWidth: '82%' }}>
                &ldquo;{quote}&rdquo;
              </div>
            )}
            <div className="flex items-center gap-2 w-full mt-3" style={{ opacity: 0.2 }}>
              <div className="flex-1 h-px" style={{ backgroundColor: colors.accent }} />
              <span style={{ fontSize: '3.5cqw', color: colors.accent, letterSpacing: '0.3em', fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>MERIDIAN</span>
              <div className="flex-1 h-px" style={{ backgroundColor: colors.accent }} />
            </div>
          </div>
        </div>
      ) : (
        /* ── Below layout: photo on top, text below (original) ── */
        <div className="absolute inset-0 flex flex-col" style={{ padding: '9% 8%', zIndex: 4 }}>

          {/* Top rule + badge */}
          <div className="flex items-center gap-2 mb-4" style={{ opacity: 0.5 }}>
            <div className="flex-1 h-px" style={{ backgroundColor: colors.accent }} />
            <span style={{ fontSize: '6cqw', color: colors.accent, letterSpacing: '0.35em', fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>◆</span>
            <div className="flex-1 h-px" style={{ backgroundColor: colors.accent }} />
          </div>

          {/* Photo area */}
          <div className="relative flex-1 min-h-0 overflow-hidden mb-5"
            style={{ border: `1px solid ${colors.accent}18` }}>
            {photoUrl ? (
              <>
                <img src={photoUrl} alt="" className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: 'sepia(0.30) brightness(0.82) contrast(1.12) saturate(0.85)' }} />
                <div className="absolute inset-0"
                  style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)' }} />
                <div className="absolute bottom-0 left-0 right-0 h-1/3"
                  style={{ background: `linear-gradient(to top, ${colors.bg}cc, transparent)` }} />
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                style={{ backgroundColor: `${colors.accent}08` }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"
                  style={{ color: `${colors.accent}40`, opacity: 0.6 }}>
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="m21 15-5-5L5 21"/>
                </svg>
                <span style={{ fontSize: '5cqw', color: `${colors.accent}30`, letterSpacing: '0.2em', fontFamily: "'Inter', sans-serif'" }}>PHOTO</span>
              </div>
            )}
          </div>

          {/* Bottom text block */}
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-full flex items-center gap-2 mb-1" style={{ opacity: 0.35 }}>
              <div className="flex-1 h-px" style={{ backgroundColor: colors.accent }} />
              <span style={{ fontSize: '5cqw', color: colors.accent }}>◆</span>
              <div className="flex-1 h-px" style={{ backgroundColor: colors.accent }} />
            </div>
            <div style={{ fontSize: '9.5cqw', fontFamily: serif, fontWeight: 400, color: colors.text, letterSpacing: '0.06em', lineHeight: 1.05 }}>
              {location || 'LOCATION'}
            </div>
            {region && (
              <div style={{ fontSize: '4.5cqw', fontFamily: serif, fontWeight: 300, color: colors.accent, letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: '0.5cqw' }}>
                {region}
              </div>
            )}
            {date && (
              <div style={{ fontSize: '3.8cqw', fontFamily: "'Inter', sans-serif", fontWeight: 300, color: `${colors.text}60`, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '1cqw' }}>
                {date}
              </div>
            )}
            {quote && (
              <div style={{ fontSize: '4cqw', fontFamily: serif, fontStyle: 'italic', fontWeight: 300, color: `${colors.text}70`, lineHeight: 1.5, marginTop: '2cqw', maxWidth: '80%' }}>
                &ldquo;{quote}&rdquo;
              </div>
            )}
            <div className="mt-auto pt-3 flex items-center gap-2 w-full" style={{ opacity: 0.2 }}>
              <div className="flex-1 h-px" style={{ backgroundColor: colors.accent }} />
              <span style={{ fontSize: '3.5cqw', color: colors.accent, letterSpacing: '0.3em', fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>MERIDIAN</span>
              <div className="flex-1 h-px" style={{ backgroundColor: colors.accent }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Cinematic ───────────────────────────────────────────────────────────────
function CinematicPoster({ location, region, date, quote, photoUrl, colors, font, textPosition }) {
  const sans = font || "'Bebas Neue', sans-serif";
  const isOverlay = textPosition === 'overlay';

  return (
    <>
      {/* Scan-line texture */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)',
          zIndex: 2,
        }} />

      {isOverlay ? (
        /* ── Overlay layout ── */
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {/* Full-bleed photo */}
          {photoUrl ? (
            <>
              <img src={photoUrl} alt="" className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'contrast(1.55) brightness(0.62) saturate(0.65)' }} />
              {/* Thin letterbox bars */}
              <div className="absolute top-0 left-0 right-0" style={{ height: '5%', backgroundColor: colors.bg }} />
              <div className="absolute bottom-0 left-0 right-0" style={{ height: '5%', backgroundColor: colors.bg }} />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0a0a12, #15151f)' }}>
              <div style={{ opacity: 0.15, textAlign: 'center' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="0.8">
                  <rect x="2" y="2" width="20" height="20" rx="2.18"/>
                  <path d="M10 10v.01M14 10v.01M10 14v.01M14 14v.01"/>
                </svg>
              </div>
            </div>
          )}

          {/* Gradient fade from bottom */}
          <div className="absolute bottom-0 left-0 right-0"
            style={{ height: '60%', background: `linear-gradient(to top, ${colors.bg} 0%, ${colors.bg}cc 30%, transparent 100%)` }} />

          {/* Text overlaid at bottom */}
          <div className="absolute bottom-0 left-0 right-0" style={{ padding: '0 7% 7%' }}>
            <div style={{ width: '14%', height: '2px', backgroundColor: colors.accent, marginBottom: '3cqw' }} />
            <div style={{ fontSize: '17cqw', fontFamily: sans, fontWeight: 400, color: colors.text, letterSpacing: '0.03em', lineHeight: 0.9, textTransform: 'uppercase' }}>
              {location || 'PLACE'}
            </div>
            {region && (
              <div style={{ fontSize: '4.2cqw', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, color: `${colors.text}55`, letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: '2cqw' }}>
                {region}
              </div>
            )}
            <div className="flex items-center gap-3" style={{ marginTop: '1.5cqw' }}>
              {date && (
                <span style={{ fontSize: '3.5cqw', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 300, color: `${colors.text}40`, letterSpacing: '0.15em' }}>
                  {date}
                </span>
              )}
            </div>
            {quote && (
              <div style={{ fontSize: '3.8cqw', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 300, color: `${colors.text}40`, lineHeight: 1.5, fontStyle: 'italic', marginTop: '1cqw' }}>
                {quote}
              </div>
            )}
            <div className="flex items-center justify-between" style={{ borderTop: `1px solid ${colors.text}10`, marginTop: '3cqw', paddingTop: '2cqw' }}>
              <span style={{ fontSize: '3cqw', fontFamily: "'Inter', sans-serif", fontWeight: 300, color: `${colors.text}20`, letterSpacing: '0.3em' }}>MERIDIAN</span>
              <div style={{ width: '5%', height: '1px', backgroundColor: colors.accent, opacity: 0.4 }} />
            </div>
          </div>
        </div>
      ) : (
        /* ── Below layout (original) ── */
        <div className="absolute inset-0 flex flex-col" style={{ zIndex: 3 }}>
          {/* Photo — top 58% */}
          <div className="relative overflow-hidden flex-shrink-0" style={{ height: '58%' }}>
            {photoUrl ? (
              <>
                <img src={photoUrl} alt="" className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: 'contrast(1.45) brightness(0.72) saturate(0.75)' }} />
                <div className="absolute top-0 left-0 right-0 h-[6%]" style={{ backgroundColor: colors.bg }} />
                <div className="absolute bottom-0 left-0 right-0"
                  style={{ height: '35%', background: `linear-gradient(to top, ${colors.bg}, ${colors.bg}99, transparent)` }} />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #0a0a12, #15151f)' }}>
                <div style={{ textAlign: 'center', opacity: 0.2 }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="0.8">
                    <rect x="2" y="2" width="20" height="20" rx="2.18"/>
                    <path d="M10 10v.01M14 10v.01M10 14v.01M14 14v.01"/>
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Text block — bottom 42% */}
          <div className="flex flex-col justify-between" style={{ padding: '4% 7% 7%', flex: 1 }}>
            <div>
              <div style={{ width: '14%', height: '2px', backgroundColor: colors.accent, marginBottom: '3cqw' }} />
              <div style={{ fontSize: '17cqw', fontFamily: sans, fontWeight: 400, color: colors.text, letterSpacing: '0.03em', lineHeight: 0.9, textTransform: 'uppercase' }}>
                {location || 'PLACE'}
              </div>
            </div>
            <div>
              {region && (
                <div style={{ fontSize: '4.2cqw', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 500, color: `${colors.text}55`, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '1.5cqw' }}>
                  {region}
                </div>
              )}
              <div className="flex items-center gap-3" style={{ marginBottom: quote ? '2cqw' : 0 }}>
                {date && (
                  <span style={{ fontSize: '3.5cqw', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 300, color: `${colors.text}40`, letterSpacing: '0.15em' }}>
                    {date}
                  </span>
                )}
                {date && quote && <span style={{ fontSize: '3cqw', color: colors.accent, opacity: 0.7 }}>—</span>}
              </div>
              {quote && (
                <div style={{ fontSize: '3.8cqw', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 300, color: `${colors.text}40`, lineHeight: 1.5, fontStyle: 'italic' }}>
                  {quote}
                </div>
              )}
              <div className="flex items-center justify-between mt-auto pt-3"
                style={{ borderTop: `1px solid ${colors.text}10`, marginTop: '3cqw' }}>
                <span style={{ fontSize: '3cqw', fontFamily: "'Inter', sans-serif", fontWeight: 300, color: `${colors.text}20`, letterSpacing: '0.3em' }}>MERIDIAN</span>
                <div style={{ width: '5%', height: '1px', backgroundColor: colors.accent, opacity: 0.4 }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Editorial ───────────────────────────────────────────────────────────────
function EditorialPoster({ location, region, date, quote, photoUrl, colors, font, textPosition }) {
  const sans   = font || "'Space Grotesk', sans-serif";
  const nChars = Math.max(3, (location || 'PLACE').length);
  const wmSize = `${Math.min(32, Math.max(10, Math.round(130 / nChars)))}cqw`;
  const isOverlay = textPosition === 'overlay';

  return (
    <div className="absolute inset-0 flex flex-col" style={{ padding: isOverlay ? 0 : '8% 7%' }}>

      {/* Watermark location — absolutely positioned behind content */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div style={{ fontSize: wmSize, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, color: colors.text, opacity: 0.055, whiteSpace: 'nowrap', letterSpacing: '-0.02em', textTransform: 'uppercase', lineHeight: 1, userSelect: 'none' }}>
          {(location || 'PLACE').toUpperCase()}
        </div>
      </div>

      {isOverlay ? (
        /* ── Overlay layout ── */
        <div className="absolute inset-0 flex flex-col" style={{ zIndex: 1 }}>
          {/* Header strip */}
          <div className="flex items-center justify-between flex-shrink-0" style={{ padding: '6% 7% 3%' }}>
            <span style={{ fontSize: '3cqw', fontFamily: sans, letterSpacing: '0.35em', color: `${colors.text}35`, textTransform: 'uppercase' }}>Meridian</span>
            <div style={{ width: '4cqw', height: '1px', backgroundColor: colors.text, opacity: 0.2 }} />
          </div>

          {/* Photo fills remaining space */}
          <div className="relative overflow-hidden flex-1 min-h-0" style={{ margin: '0 7%' }}>
            {photoUrl ? (
              <img src={photoUrl} alt="" className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'contrast(1.05) brightness(0.98) saturate(0.92)' }} />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                style={{ backgroundColor: `${colors.text}05`, border: `1px solid ${colors.text}10` }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"
                  style={{ color: `${colors.text}25` }}>
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="m21 15-5-5L5 21"/>
                </svg>
                <span style={{ fontSize: '3.5cqw', color: `${colors.text}20`, letterSpacing: '0.2em', fontFamily: sans }}>UPLOAD PHOTO</span>
              </div>
            )}

            {/* Gradient fade from bottom */}
            <div className="absolute bottom-0 left-0 right-0"
              style={{ height: '55%', background: `linear-gradient(to top, ${colors.bg}f0 0%, ${colors.bg}88 40%, transparent 100%)` }} />

            {/* Text overlaid at bottom of photo */}
            <div className="absolute bottom-0 left-0 right-0" style={{ padding: '0 6% 5%' }}>
              <div style={{ width: '100%', height: '1px', backgroundColor: colors.text, opacity: 0.15, marginBottom: '2.5cqw' }} />
              <div style={{ fontSize: '9cqw', fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, color: colors.text, lineHeight: 1, letterSpacing: '-0.01em' }}>
                {location || 'Location'}
              </div>
              {region && (
                <div style={{ fontSize: '3.5cqw', fontFamily: sans, fontWeight: 400, color: colors.sub, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '1cqw' }}>
                  {region}
                </div>
              )}
              {date && (
                <div style={{ fontSize: '3.5cqw', fontFamily: sans, fontWeight: 400, color: colors.sub, letterSpacing: '0.1em', marginTop: '1cqw' }}>
                  {date}
                </div>
              )}
              {quote && (
                <div style={{ fontSize: '3.8cqw', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 400, color: `${colors.text}70`, lineHeight: 1.55, marginTop: '1.5cqw' }}>
                  &ldquo;{quote}&rdquo;
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 flex items-center justify-end" style={{ padding: '3% 7%' }}>
            <span style={{ fontSize: '2.8cqw', fontFamily: sans, letterSpacing: '0.3em', color: `${colors.text}20`, textTransform: 'uppercase' }}>Print</span>
          </div>
        </div>
      ) : (
        /* ── Below layout (original) ── */
        <div className="relative flex flex-col h-full" style={{ zIndex: 1 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-shrink-0">
            <span style={{ fontSize: '3cqw', fontFamily: sans, letterSpacing: '0.35em', color: `${colors.text}35`, textTransform: 'uppercase' }}>Meridian</span>
            <div className="flex gap-1">
              <div style={{ width: '4cqw', height: '1px', backgroundColor: colors.text, opacity: 0.2 }} />
            </div>
          </div>

          {/* Location name */}
          <div style={{ fontSize: '8.5cqw', fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, color: colors.text, lineHeight: 1, letterSpacing: '-0.01em', marginBottom: '1.5cqw' }}>
            {location || 'Location'}
          </div>

          {region && (
            <div style={{ fontSize: '3.5cqw', fontFamily: sans, fontWeight: 400, color: colors.sub, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '4cqw' }}>
              {region}
            </div>
          )}

          {/* Photo */}
          <div className="relative overflow-hidden flex-1 min-h-0" style={{ border: `1px solid ${colors.text}10` }}>
            {photoUrl ? (
              <img src={photoUrl} alt="" className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'contrast(1.05) brightness(0.98) saturate(0.92)' }} />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                style={{ backgroundColor: `${colors.text}05` }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"
                  style={{ color: `${colors.text}25` }}>
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="m21 15-5-5L5 21"/>
                </svg>
                <span style={{ fontSize: '3.5cqw', color: `${colors.text}20`, letterSpacing: '0.2em', fontFamily: sans }}>UPLOAD PHOTO</span>
              </div>
            )}
          </div>

          {/* Bottom text */}
          <div className="flex-shrink-0 mt-4">
            <div style={{ width: '100%', height: '1px', backgroundColor: colors.text, opacity: 0.12, marginBottom: '3cqw' }} />
            <div className="flex items-start justify-between gap-4">
              <div style={{ flex: 1 }}>
                {date && (
                  <div style={{ fontSize: '3.5cqw', fontFamily: sans, fontWeight: 400, color: colors.sub, letterSpacing: '0.1em', marginBottom: '1.5cqw' }}>
                    {date}
                  </div>
                )}
                {quote && (
                  <div style={{ fontSize: '3.8cqw', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 400, color: `${colors.text}70`, lineHeight: 1.55 }}>
                    &ldquo;{quote}&rdquo;
                  </div>
                )}
              </div>
              <div style={{ fontSize: '2.8cqw', fontFamily: sans, letterSpacing: '0.3em', color: `${colors.text}20`, textTransform: 'uppercase', flexShrink: 0, paddingTop: '0.5cqw' }}>
                Print
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
