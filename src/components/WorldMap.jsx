import { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from 'react-simple-maps';

const GEO_URL =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const WorldMap = forwardRef(function WorldMap({ locations, theme, showLines, projectionConfig, focusId }, ref) {
  const containerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getSvgElement: () => containerRef.current?.querySelector('svg'),
  }));

  const proj = projectionConfig ?? { scale: 147, center: [10, 10] };
  const isWorld = !focusId || focusId === 'world';

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <ComposableMap
        style={{ width: '100%', height: '100%', backgroundColor: theme.mapWater }}
        projectionConfig={proj}
        preserveAspectRatio={isWorld ? 'xMidYMid meet' : 'xMidYMid slice'}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={theme.mapLand}
                stroke={theme.mapBorder}
                strokeWidth={0.5}
                style={{
                  default: { outline: 'none' },
                  hover: { outline: 'none' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>

        {showLines && locations.length > 1 &&
          locations.slice(0, -1).map((loc, i) => (
            <Line
              key={`line-${i}`}
              from={loc.coordinates}
              to={locations[i + 1].coordinates}
              stroke={theme.lineColor}
              strokeWidth={1.5}
              strokeDasharray="6 4"
              strokeLinecap="round"
              strokeOpacity={0.8}
            />
          ))}

        {locations.map((loc, i) => (
          <Marker key={`pin-${i}`} coordinates={loc.coordinates}>
            <circle r={8} fill={theme.pinColor} fillOpacity={0.15} />
            <circle
              r={4}
              fill={theme.pinColor}
              stroke={theme.pinBorder}
              strokeWidth={1.5}
            />
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
});

export default WorldMap;
