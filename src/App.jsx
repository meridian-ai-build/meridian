import { useState, useRef, useCallback, useEffect } from 'react';
import InputPanel from './components/InputPanel';
import PosterPreview from './components/PosterPreview';
import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';
import { exportPoster } from './utils/exportPoster';
import { THEMES } from './utils/themes';
import { DEFAULT_SIZE_ID } from './utils/posterSizes';
import { DEFAULT_FOCUS_ID, getFocusById } from './utils/mapFocuses';
import { FRAME_SHADOWS, calculatePrice } from './utils/pricing';
import { supabase } from './utils/supabase';

export default function App() {
  const [title, setTitle] = useState('My Travels');
  const [subtitle, setSubtitle] = useState('Travel Journal');
  const [yearFrom, setYearFrom] = useState('2020');
  const [yearTo, setYearTo] = useState(String(new Date().getFullYear()));
  const [themeId, setThemeId] = useState('dark');
  const [sizeId, setSizeId] = useState(DEFAULT_SIZE_ID);
  const [orientation, setOrientation] = useState('portrait');
  const [focusId, setFocusId] = useState(DEFAULT_FOCUS_ID);
  const [locations, setLocations] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [showLines, setShowLines] = useState(true);
  const [printType, setPrintType] = useState('digital');
  const [frameId, setFrameId] = useState('none');
  const [error, setError] = useState('');

  // Cart & auth
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState(null);

  const mapRef = useRef(null);
  const theme = THEMES[themeId];
  const focus = getFocusById(focusId);
  const projectionConfig = { scale: focus.scale, center: focus.center };

  // Sync Supabase auth state
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleAddLocation = useCallback((location) => {
    setLocations(prev => {
      if (prev.some(l => l.displayName === location.displayName)) return prev;
      return [...prev, location];
    });
    setError('');
  }, []);

  const handleRemoveLocation = useCallback((index) => {
    setLocations(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleClear = useCallback(() => {
    setLocations([]);
    setError('');
    setTitle('My Travels');
    setSubtitle('Travel Journal');
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!locations.length) {
      setError('Add at least one location before adding to cart.');
      return;
    }
    const price = calculatePrice(printType, frameId);
    const item = {
      id: Date.now(),
      title,
      subtitle,
      sizeId,
      orientation,
      themeId,
      themeColors: {
        posterBg: theme.posterBg,
        posterBorder: theme.posterBorder,
        posterAccent: theme.posterAccent,
        pinColor: theme.pinColor,
      },
      focusId,
      locations: [...locations],
      printType,
      frameId,
      price,
    };
    setCart(prev => [...prev, item]);
    setCartOpen(true);
  }, [title, subtitle, sizeId, orientation, themeId, theme, focusId, locations, printType, frameId]);

  const handleRemoveFromCart = useCallback((index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      await exportPoster({ mapRef, theme, title, subtitle, locations, yearFrom, yearTo, sizeId, orientation });
    } catch (e) {
      setError('Export failed: ' + (e.message || 'Unknown error'));
    } finally {
      setIsExporting(false);
    }
  }, [theme, title, subtitle, locations, yearFrom, yearTo, sizeId, orientation]);

  const frameShadow = FRAME_SHADOWS[frameId];
  const isFramed = frameId !== 'none';

  return (
    <div className="flex h-screen overflow-hidden bg-[#0c0c12]">
      <InputPanel
        title={title} setTitle={setTitle}
        subtitle={subtitle} setSubtitle={setSubtitle}
        yearFrom={yearFrom} setYearFrom={setYearFrom}
        yearTo={yearTo} setYearTo={setYearTo}
        theme={themeId} setTheme={setThemeId}
        sizeId={sizeId} setSizeId={setSizeId}
        orientation={orientation} setOrientation={setOrientation}
        focusId={focusId} setFocusId={setFocusId}
        showLines={showLines} setShowLines={setShowLines}
        printType={printType} setPrintType={setPrintType}
        frameId={frameId} setFrameId={setFrameId}
        locations={locations}
        onAddLocation={handleAddLocation}
        onRemoveLocation={handleRemoveLocation}
        onClear={handleClear}
        onAddToCart={handleAddToCart}
        onExport={handleExport}
        isExporting={isExporting}
        error={error}
      />

      <main className="flex-1 flex items-center justify-center overflow-hidden bg-[#171720] relative">
        {/* Dot grid background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Account + Cart icons */}
        <div className="absolute top-0 right-0 z-20 flex items-center gap-1 p-3">
          <button
            onClick={() => setAuthOpen(true)}
            title={user ? 'My Account' : 'Sign In'}
            className="relative p-2 rounded-full text-white/35 hover:text-white/65 hover:bg-white/[0.06] transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            {user && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400" />
            )}
          </button>
          <button
            onClick={() => setCartOpen(true)}
            title="Cart"
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
        </div>

        {/* Poster preview */}
        <div
          className="relative z-10 flex items-center justify-center w-full h-full transition-all duration-300"
          style={{ padding: isFramed ? '3.5rem' : '2.5rem' }}
        >
          <PosterPreview
            mapRef={mapRef}
            locations={locations}
            theme={theme}
            title={title}
            subtitle={subtitle}
            yearFrom={yearFrom}
            yearTo={yearTo}
            showLines={showLines}
            sizeId={sizeId}
            orientation={orientation}
            projectionConfig={projectionConfig}
            focusId={focusId}
            frameShadow={frameShadow}
          />
        </div>
      </main>

      {authOpen && (
        <AuthModal user={user} onUserChange={setUser} onClose={() => setAuthOpen(false)} />
      )}
      {cartOpen && (
        <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onRemove={handleRemoveFromCart} />
      )}
    </div>
  );
}
