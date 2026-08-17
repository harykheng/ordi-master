import { useState } from 'react';

const TIER_INFO = {
  antar: { label: '🚚 Antar', text: 'Fitur ini ada di paket Ordi Antar ke atas.' },
  bayar: { label: '💳 Bayar', text: 'Fitur ini ada di paket Ordi Bayar.' },
};

// Sales-demo-only chip — click to reveal which package tier a feature
// belongs to, with a link into the full comparison table. Only ever
// rendered when config.demoMode is true (gated by callers), so this
// never reaches a real client build.
export default function TierBadge({ tier, onCompare, style, align = 'left' }) {
  const [open, setOpen] = useState(false);
  const info = TIER_INFO[tier];
  if (!info) return null;

  return (
    <span className="tier-badge-wrap" style={style}>
      <button
        type="button"
        className="tier-badge"
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
      >
        {info.label}
      </button>
      {open && (
        <div
          className="tier-badge-tooltip"
          style={align === 'right' ? { left: 'auto', right: 0 } : undefined}
          onClick={(e) => e.stopPropagation()}
        >
          <p>{info.text}</p>
          <button
            type="button"
            className="tier-badge-compare-link"
            onClick={() => { setOpen(false); onCompare?.(); }}
          >
            Lihat semua paket →
          </button>
        </div>
      )}
    </span>
  );
}
