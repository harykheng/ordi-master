import { useEffect, useRef, useState } from 'react';
import { config } from '../../shared/lib/config.js';

async function fetchSuggestions(q) {
  try {
    const url = `https://api.locationiq.com/v1/autocomplete?key=${config.locationIqKey}&q=${encodeURIComponent(q)}&limit=5&dedupe=1&accept-language=id&countrycodes=id`;
    const res = await fetch(url);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return []; // silent — user can still type manually
  }
}

// Controlled address input with LocationIQ autocomplete. Reports resolved
// coordinates via onCoordsChange, but never triggers a shipping check itself —
// that only happens once, from ProfileModal's save handler. Coordinates (and
// therefore the map preview) only ever get set by an explicit tap on a
// suggestion — no blur-time auto-geocode — so the map never pops in
// unannounced while the customer is still typing/reading suggestions.
export default function AddressAutocomplete({ value, onChange, onCoordsChange }) {
  const [results, setResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const timerRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (!wrapRef.current?.contains(e.target)) setShowSuggestions(false);
    }
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  function scrollSuggestionsIntoView() {
    const wrap = wrapRef.current;
    const scrollParent = wrap?.closest('.profile-sheet');
    if (!wrap) return;
    if (!scrollParent) { wrap.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    // Compute the exact scroll delta from current bounding boxes (post-keyboard
    // layout) instead of relying on the browser's own scrollIntoView, which on
    // mobile Safari/Chrome doesn't reliably account for the on-screen keyboard
    // eating the bottom of the visual viewport.
    requestAnimationFrame(() => {
      const wrapRect = wrap.getBoundingClientRect();
      const parentRect = scrollParent.getBoundingClientRect();
      const delta = wrapRect.top - parentRect.top - 12;
      scrollParent.scrollBy({ top: delta, behavior: 'smooth' });
    });
  }

  function handleInput(e) {
    const q = e.target.value;
    onChange(q);
    onCoordsChange(null, null);

    clearTimeout(timerRef.current);
    if (q.length < 3) { setShowSuggestions(false); return; }
    timerRef.current = setTimeout(async () => {
      const data = await fetchSuggestions(q);
      setResults(data);
      setShowSuggestions(data.length > 0);
      if (data.length > 0) scrollSuggestionsIntoView();
    }, 350);
  }

  function selectSuggestion(index) {
    const r = results[index];
    if (!r) return;
    const label = r.display_name || r.display_place || '';
    onChange(label);
    onCoordsChange(parseFloat(r.lat), parseFloat(r.lon));
    setShowSuggestions(false);
  }

  return (
    <div className="address-autocomplete-wrap" ref={wrapRef}>
      <textarea
        id="customerAddress"
        placeholder="Tulis alamat lengkap + patokan..."
        rows={3}
        autoComplete="off"
        value={value}
        onInput={handleInput}
        onFocus={() => setShowSuggestions(results.length > 0)}
      />
      {showSuggestions && (
        <div className="address-suggestions" style={{ display: 'block' }}>
          {results.map((r, i) => (
            <div key={i} className="address-suggestion-item" onMouseDown={() => selectSuggestion(i)}>
              {r.display_name || r.display_place || ''}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
