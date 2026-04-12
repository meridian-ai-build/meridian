import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();

  const leftW  = hovered === 'left'  ? '55%' : hovered === 'right' ? '45%' : '50%';
  const rightW = hovered === 'right' ? '55%' : hovered === 'left'  ? '45%' : '50%';

  return (
    <div className="flex h-screen overflow-hidden font-inter select-none">

      {/* ── MERIDIAN wordmark — top left ── */}
      <div className="absolute top-0 left-0 z-30 flex items-center pt-6 pl-7 pointer-events-none">
        <div className="flex items-baseline gap-2">
          <span className="font-playfair text-sm tracking-[0.25em] text-white/80 mix-blend-difference">
            Meridian.ai
          </span>
          <span className="text-[9px] tracking-[0.2em] text-white/40 uppercase mix-blend-difference font-inter">
            Travel Poster Studio
          </span>
        </div>
      </div>

      {/* ── LEFT — Travel Map ── */}
      <button
        style={{ width: leftW, transition: 'width 0.55s cubic-bezier(0.4,0,0.2,1)' }}
        className="relative h-full flex items-center justify-center overflow-hidden cursor-pointer group"
        onMouseEnter={() => setHovered('left')}
        onMouseLeave={() => setHovered(null)}
        onClick={() => navigate('/travel-map')}
        aria-label="Travel Map — start mapping your journeys"
      >
        {/* Navy base */}
        <div className="absolute inset-0" style={{ backgroundColor: '#0b1120' }} />

        {/* Map coordinate grid */}
        <div
          className="absolute inset-0 opacity-100"
          style={{
            backgroundImage: `
              linear-gradient(rgba(100,140,220,0.07) 1px, transparent 1px),
              linear-gradient(90deg, rgba(100,140,220,0.07) 1px, transparent 1px),
              linear-gradient(rgba(100,140,220,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(100,140,220,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px, 80px 80px, 20px 20px, 20px 20px',
          }}
        />

        {/* Diagonal meridian lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" preserveAspectRatio="none">
          {[-4,-3,-2,-1,0,1,2,3,4].map(i => (
            <ellipse key={i} cx="50%" cy="50%" rx={`${30 + i * 12}%`} ry="90%"
              fill="none" stroke="rgba(100,160,255,1)" strokeWidth="0.8" />
          ))}
          {[10,20,30,40,50,60,70,80,90].map(y => (
            <line key={y} x1="0%" y1={`${y}%`} x2="100%" y2={`${y}%`}
              stroke="rgba(100,160,255,0.5)" strokeWidth="0.4" />
          ))}
        </svg>

        {/* Vignette */}
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.65) 100%)' }} />

        {/* Hover brightening */}
        <div className="absolute inset-0 bg-blue-400/0 group-hover:bg-blue-400/[0.03] transition-colors duration-700" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-5 px-10">
          {/* Icon — pin cluster */}
          <div className="flex gap-1.5 mb-2 opacity-50">
            {[0,1,2].map(i => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-300" style={{ opacity: 0.5 + i * 0.2 }} />
                <div className="w-px h-2 bg-blue-300/30" />
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="text-[9px] tracking-[0.4em] text-blue-300/50 uppercase mb-3 font-inter">
              Path One
            </div>
            <h2 className="font-playfair text-white leading-none mb-4"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 500 }}>
              Travel<br />Map
            </h2>
            <div className="w-8 h-px bg-blue-300/30 mx-auto mb-4" />
            <p className="text-blue-100/40 font-inter leading-relaxed"
              style={{ fontSize: 'clamp(0.65rem, 1.1vw, 0.8rem)', letterSpacing: '0.12em', textTransform: 'uppercase', maxWidth: '18ch' }}>
              Every place you've ever been, beautifully mapped.
            </p>
          </div>

          <div className="mt-4">
            <span
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-blue-300/20 text-blue-100/60 group-hover:border-blue-300/50 group-hover:text-blue-100/90 transition-all duration-500 rounded-full"
              style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}
            >
              Start Mapping
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14m-7-7 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>

        {/* Bottom coordinates */}
        <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-6 opacity-20">
          <span className="text-[8px] text-blue-200 tracking-widest font-mono">48°52'N</span>
          <span className="text-[8px] text-blue-200 tracking-widest font-mono">2°21'E</span>
        </div>
      </button>

      {/* ── DIVIDER ── */}
      <div className="relative z-20 w-px bg-white/[0.08] flex-shrink-0" />

      {/* ── RIGHT — Single Print ── */}
      <button
        style={{ width: rightW, transition: 'width 0.55s cubic-bezier(0.4,0,0.2,1)' }}
        className="relative h-full flex items-center justify-center overflow-hidden cursor-pointer group"
        onMouseEnter={() => setHovered('right')}
        onMouseLeave={() => setHovered(null)}
        onClick={() => navigate('/single-print')}
        aria-label="Single Print — commemorate one place"
      >
        {/* Warm cream base */}
        <div className="absolute inset-0" style={{ backgroundColor: '#f0e8d8' }} />

        {/* Film grain via SVG data-URL tile */}
        <div
          className="absolute inset-0 opacity-[0.45]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Subtle warm gradient */}
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 60% 40%, rgba(220,180,120,0.15) 0%, transparent 70%)' }} />

        {/* Vignette */}
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(100,70,30,0.25) 100%)' }} />

        {/* Hover darkening */}
        <div className="absolute inset-0 bg-amber-900/0 group-hover:bg-amber-900/[0.04] transition-colors duration-700" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-5 px-10">
          {/* Icon — single frame */}
          <div className="mb-2 opacity-40">
            <div className="w-8 h-10 border border-amber-900/40 rounded-sm relative">
              <div className="absolute inset-1 border border-amber-900/20 rounded-sm" />
            </div>
          </div>

          <div className="text-center">
            <div className="text-[9px] tracking-[0.4em] text-amber-900/40 uppercase mb-3 font-inter">
              Path Two
            </div>
            <h2 className="font-playfair text-amber-950 leading-none mb-4"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 500 }}>
              Single<br />Print
            </h2>
            <div className="w-8 h-px bg-amber-900/25 mx-auto mb-4" />
            <p className="text-amber-900/50 font-inter leading-relaxed"
              style={{ fontSize: 'clamp(0.65rem, 1.1vw, 0.8rem)', letterSpacing: '0.12em', textTransform: 'uppercase', maxWidth: '18ch' }}>
              One place. One memory. One print.
            </p>
          </div>

          <div className="mt-4">
            <span
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-amber-900/20 text-amber-900/50 group-hover:border-amber-900/40 group-hover:text-amber-900/80 transition-all duration-500 rounded-full"
              style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}
            >
              Create Your Print
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14m-7-7 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>

        {/* Bottom film strip marks */}
        <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-1.5 opacity-15">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-3 h-2 border border-amber-900 rounded-sm" />
          ))}
        </div>
      </button>

      {/* Mobile: stack vertically */}
      <style>{`
        @media (max-width: 640px) {
          .flex.h-screen { flex-direction: column; }
          .flex.h-screen > button { width: 100% !important; height: 100vh; }
          .flex.h-screen > .w-px { width: 100%; height: 1px; }
        }
      `}</style>
    </div>
  );
}
