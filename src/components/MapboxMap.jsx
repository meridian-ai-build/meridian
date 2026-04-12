import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import mapboxgl from 'mapbox-gl';

const MapboxMap = forwardRef(function MapboxMap({ token, locations, theme }, ref) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getCanvas: () => mapRef.current?.getCanvas(),
    getMap: () => mapRef.current,
  }));

  // Initialize map (re-runs when token or style changes)
  useEffect(() => {
    if (!token || !containerRef.current) return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: theme.mapStyle,
      center: [10, 20],
      zoom: 1.2,
      interactive: false,
      preserveDrawingBuffer: true,
      attributionControl: false,
      logoPosition: 'bottom-right',
      fadeDuration: 0,
    });

    mapRef.current = map;

    map.on('load', () => {
      applyMapData(map, locations, theme);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, theme.mapStyle]);

  // Update pins/lines when locations or theme colors change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (map.isStyleLoaded()) {
      applyMapData(map, locations, theme);
    } else {
      map.once('style.load', () => applyMapData(map, locations, theme));
    }
  }, [locations, theme]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ position: 'absolute', inset: 0 }}
    />
  );
});

function applyMapData(map, locations, theme) {
  // Clean up existing layers/sources
  ['m-line', 'm-points-glow', 'm-points'].forEach(id => {
    if (map.getLayer(id)) map.removeLayer(id);
  });
  ['m-line-src', 'm-points-src'].forEach(id => {
    if (map.getSource(id)) map.removeSource(id);
  });

  if (!locations || locations.length === 0) return;

  const coords = locations.map(l => l.coordinates);

  // Line source
  map.addSource('m-line-src', {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: coords },
    },
  });

  // Points source
  map.addSource('m-points-src', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: locations.map(l => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: l.coordinates },
        properties: { name: l.shortName },
      })),
    },
  });

  // Dashed line layer
  map.addLayer({
    id: 'm-line',
    type: 'line',
    source: 'm-line-src',
    paint: {
      'line-color': theme.lineColor,
      'line-width': 2,
      'line-dasharray': [5, 5],
      'line-opacity': 0.85,
    },
  });

  // Glow effect (wider, transparent circle)
  map.addLayer({
    id: 'm-points-glow',
    type: 'circle',
    source: 'm-points-src',
    paint: {
      'circle-radius': 12,
      'circle-color': theme.pinColor,
      'circle-opacity': 0.18,
      'circle-blur': 0.5,
    },
  });

  // Pin circles
  map.addLayer({
    id: 'm-points',
    type: 'circle',
    source: 'm-points-src',
    paint: {
      'circle-radius': 5,
      'circle-color': theme.pinColor,
      'circle-stroke-width': 2.5,
      'circle-stroke-color': theme.pinBorder,
      'circle-stroke-opacity': 0.9,
    },
  });

  // Fit view to all points
  if (coords.length === 1) {
    map.easeTo({ center: coords[0], zoom: 5, duration: 800 });
  } else {
    const bounds = coords.reduce(
      (b, c) => b.extend(c),
      new mapboxgl.LngLatBounds(coords[0], coords[0])
    );
    map.fitBounds(bounds, { padding: 80, maxZoom: 8, duration: 800 });
  }
}

export default MapboxMap;
