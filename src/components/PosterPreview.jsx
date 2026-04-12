import WorldMap from './WorldMap';
import { getAspectRatio } from '../utils/posterSizes';

function PosterPreview({ locations, theme, title, subtitle, yearFrom, yearTo, mapRef, showLines, sizeId, orientation, projectionConfig, focusId, frameShadow }) {
  const uniqueCountries = new Set(locations.map(l => l.country).filter(Boolean)).size;
  const uniqueContinents = new Set(locations.map(l => l.continent).filter(Boolean)).size;
  const hasData = locations.length > 0;

  const isMinimal = theme.id === 'minimal';
  const titleFont = isMinimal ? 'Inter, sans-serif' : '"Playfair Display", Georgia, serif';
  const bodyFont = isMinimal ? 'Inter, sans-serif' : '"Cormorant Garamond", Georgia, serif';
  const aspectRatio = getAspectRatio(sizeId, orientation);

  const isLandscape = orientation === 'landscape';

  return (
    <div
      className="poster-shadow relative flex flex-col"
      style={{
        aspectRatio,
        height: isLandscape ? 'auto' : '100%',
        width: isLandscape ? '100%' : 'auto',
        maxHeight: '100%',
        maxWidth: '100%',
        backgroundColor: theme.posterBg,
        fontFamily: bodyFont,
        overflow: 'hidden',
        flexShrink: 0,
        boxShadow: frameShadow,
        transition: 'box-shadow 0.3s ease',
      }}
    >
      {/* Outer border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ border: `2px solid ${theme.posterBorder}`, margin: 18, zIndex: 10 }}
      />
      {/* Inner border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ border: `1px solid ${theme.posterDivider}`, margin: 24, zIndex: 10 }}
      />

      <div className="flex flex-col h-full px-10 py-8" style={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="flex flex-col items-center" style={{ paddingTop: 10 }}>
          <DecorativeLine theme={theme} />

          <div
            className="mt-3 text-center leading-tight tracking-widest"
            style={{
              fontFamily: titleFont,
              fontSize: title.length > 22 ? 20 : 24,
              fontWeight: 700,
              color: theme.posterText,
              letterSpacing: '0.12em',
              lineHeight: 1.2,
            }}
          >
            {title.toUpperCase() || 'MY TRAVELS'}
          </div>

          <div
            className="mt-1.5 tracking-[0.25em]"
            style={{
              fontFamily: bodyFont,
              fontSize: 9,
              fontWeight: 400,
              color: theme.posterAccent,
              textTransform: 'uppercase',
            }}
          >
            {subtitle || 'Travel Journal'}
          </div>

          <DecorativeLine theme={theme} className="mt-3" />
        </div>

        {/* Map */}
        <div
          className="relative flex-1 mt-4"
          style={{ border: `1px solid ${theme.posterBorder}`, overflow: 'hidden', minHeight: 0 }}
        >
          <WorldMap ref={mapRef} locations={locations} theme={theme} showLines={showLines} projectionConfig={projectionConfig} focusId={focusId} />
        </div>

        {/* Location names */}
        {hasData && (
          <div className="mt-3">
            <div style={{ height: 1, backgroundColor: theme.posterDivider, marginBottom: 8 }} />
            <p
              className="text-center leading-relaxed"
              style={{
                fontFamily: bodyFont,
                fontSize: 8.5,
                color: theme.posterSubtext,
                fontWeight: 300,
                letterSpacing: '0.05em',
              }}
            >
              {locations.map(l => l.shortName).join(`  ${theme.separator}  `)}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-3">
          <div style={{ height: 1, backgroundColor: theme.posterDivider, marginBottom: 8 }} />
          <div className="flex items-center justify-around">
            <StatBlock value={hasData ? uniqueCountries : '—'} label="Countries" theme={theme} titleFont={titleFont} bodyFont={bodyFont} />
            <div style={{ width: 1, height: 32, backgroundColor: theme.posterDivider }} />
            <StatBlock value={hasData ? uniqueContinents : '—'} label="Continents" theme={theme} titleFont={titleFont} bodyFont={bodyFont} />
            <div style={{ width: 1, height: 32, backgroundColor: theme.posterDivider }} />
            <StatBlock value={yearFrom && yearTo ? `${yearFrom}–${yearTo}` : '—'} label="Years" theme={theme} titleFont={titleFont} bodyFont={bodyFont} />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 flex flex-col items-center pb-1">
          <div style={{ height: 1, backgroundColor: theme.posterDivider, width: '100%', marginBottom: 7 }} />
          <span
            style={{
              fontFamily: bodyFont,
              fontSize: 7.5,
              letterSpacing: '0.4em',
              color: theme.posterSubtext,
              fontWeight: 300,
            }}
          >
            MERIDIAN
          </span>
        </div>
      </div>
    </div>
  );
}

function DecorativeLine({ theme, className = '' }) {
  return (
    <div className={`flex items-center w-full ${className}`}>
      <div style={{ flex: 1, height: 1, backgroundColor: theme.posterAccent, opacity: 0.6 }} />
      <div style={{ width: 6, height: 6, backgroundColor: theme.posterAccent, transform: 'rotate(45deg)', margin: '0 8px', flexShrink: 0 }} />
      <div style={{ flex: 1, height: 1, backgroundColor: theme.posterAccent, opacity: 0.6 }} />
    </div>
  );
}

function StatBlock({ value, label, theme, titleFont, bodyFont }) {
  return (
    <div className="flex flex-col items-center">
      <span style={{ fontFamily: titleFont, fontSize: 18, fontWeight: 700, color: theme.posterText, lineHeight: 1 }}>
        {value}
      </span>
      <span style={{ fontFamily: bodyFont, fontSize: 7.5, letterSpacing: '0.15em', color: theme.posterSubtext, marginTop: 3, textTransform: 'uppercase', fontWeight: 400 }}>
        {label}
      </span>
    </div>
  );
}

export default PosterPreview;
