import { useState, useEffect, useRef, useCallback } from 'react';
import { searchPlaces } from '../utils/photon';

export default function LocationInput({ onAddLocation }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const search = useCallback(async (q) => {
    if (q.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    setIsLoading(true);
    try {
      const results = await searchPlaces(q);
      setSuggestions(results);
      setIsOpen(results.length > 0);
      setHighlightedIndex(-1);
    } catch {
      setSuggestions([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 400);
    return () => clearTimeout(debounceRef.current);
  }, [query, search]);

  const handleSelect = useCallback((suggestion) => {
    onAddLocation(suggestion);
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  }, [onAddLocation]);

  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  }, [isOpen, suggestions, highlightedIndex, handleSelect]);

  useEffect(() => {
    function onClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder="Search a city or place…"
          autoComplete="off"
          className="w-full bg-white/[0.04] border border-white/[0.1] rounded text-white/80 text-sm px-3 py-2 pr-8 outline-none focus:border-white/30 placeholder:text-white/20 font-inter transition-colors"
        />
        {isLoading ? (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="animate-spin w-3.5 h-3.5 text-white/30" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : query ? (
          <button
            onMouseDown={e => { e.preventDefault(); setQuery(''); setSuggestions([]); setIsOpen(false); inputRef.current?.focus(); }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors text-base leading-none"
          >
            ×
          </button>
        ) : (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-[#1a1a26] border border-white/[0.12] rounded shadow-2xl z-50 overflow-hidden">
          {suggestions.map((s, i) => (
            <button
              key={`${s.displayName}-${i}`}
              onMouseDown={e => { e.preventDefault(); handleSelect(s); }}
              onMouseEnter={() => setHighlightedIndex(i)}
              className={`w-full text-left px-3 py-2.5 flex flex-col gap-0.5 transition-colors border-b border-white/[0.04] last:border-0 ${
                i === highlightedIndex ? 'bg-white/[0.08]' : 'hover:bg-white/[0.04]'
              }`}
            >
              <span className="text-white/80 text-sm font-inter leading-tight">{s.shortName}</span>
              {s.subtitle && (
                <span className="text-white/35 text-[11px] font-inter">{s.subtitle}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
