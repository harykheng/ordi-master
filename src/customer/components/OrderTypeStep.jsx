import { useEffect, useState } from 'react';
import { useCart } from '../CartContext.jsx';
import { config } from '../../shared/lib/config.js';
import { buildDateChips } from '../../shared/lib/format.js';
import { waLink } from '../../shared/lib/whatsapp.js';

// Pickup-only tier — no pickup/delivery toggle since there's only one option.
export default function OrderTypeStep({ settings }) {
  const { state, dispatch } = useCart();
  const [dateChips] = useState(buildDateChips);

  const brandName = settings?.brand_name || config.storeName;
  const logoUrl = settings?.logo_url;
  const brandIcon = settings?.brand_icon || '☕';
  const instagramUrl = settings?.instagram_url || config.instagramUrl;
  const tiktokUrl = settings?.tiktok_url || config.tiktokUrl;

  useEffect(() => {
    document.title = brandName;
  }, [brandName]);

  // Only one order type exists in this tier — select it once on mount instead
  // of making the customer tap a single-option "choice".
  useEffect(() => {
    if (!state.orderType) dispatch({ type: 'SELECT_ORDER_TYPE', orderType: 'pickup' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const waHelpUrl = waLink(config.adminWhatsapp, `Halo ${brandName}, saya butuh bantuan untuk pemesanan!`);

  function selectDate(chip) {
    dispatch({ type: 'SET_DATE', value: chip.value, label: chip.label });
  }

  function goToStep2() {
    if (!state.selectedDate) return;
    dispatch({ type: 'SET_STEP', step: 2 });
    window.scrollTo(0, 0);
  }

  const canProceed = Boolean(state.selectedDate);

  return (
    <div className="step active">
      <div className="onboarding">

        <div className="ob-topbar">
          <div className="ob-brand">
            {logoUrl ? (
              <img className="ob-brand-icon brand-icon-logo" src={logoUrl} alt={brandName} />
            ) : (
              <span className="ob-brand-icon">{brandIcon}</span>
            )}
            <span className="ob-brand-name">{brandName}</span>
          </div>
          <a className="btn-wa-help" href={waHelpUrl} target="_blank" rel="noopener noreferrer">
            💬 Butuh bantuan?
          </a>
        </div>

        <h1 className="ob-headline">Mau pickup<br />kapan?</h1>
        <p className="ob-sub">Pilih tanggal, baru lihat menu 👇</p>

        <div className="pickup-address-card visible">
          <span className="pickup-pin">📍</span>
          <div>
            <div className="pickup-info-label">Lokasi Pickup</div>
            <div className="pickup-info-name">{brandName}</div>
            <div className="pickup-info-addr">{settings?.store_address || config.storeAddress}</div>
            <div className="pickup-info-hours">{settings?.store_hours || config.storeOpenHours}</div>
            <a
              className="pickup-maps-link"
              href={settings?.store_maps_url || config.storeMapsUrl}
              target="_blank"
              rel="noopener"
            >
              Buka di Google Maps →
            </a>
          </div>
        </div>

        <div className="date-section visible">
          <div className="date-section-label">Pilih Tanggal Pickup</div>
          <div className="date-chips-wrap">
            {dateChips.map((chip) => (
              <div
                key={chip.value}
                className={`date-chip${chip.isToday ? ' chip-today' : chip.isTomorrow ? ' chip-tomorrow' : ''}${state.selectedDate === chip.value ? ' selected' : ''}`}
                onClick={() => selectDate(chip)}
              >
                {chip.isToday || chip.isTomorrow ? (
                  <>
                    <span className="dc-label">{chip.isToday ? 'Hari ini' : 'Besok'}</span>
                    <span className="dc-sublabel">{chip.date} {chip.month}</span>
                  </>
                ) : (
                  <>
                    <span className="dc-day">{chip.day}</span>
                    <span className="dc-date">{chip.date}</span>
                    <span className="dc-month">{chip.month}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="ob-footer">
          <button className="btn-next" onClick={goToStep2} disabled={!canProceed}>
            Lihat Menu →
          </button>
        </div>

        <footer className="site-footer">
          <a className="footer-track-link" href="/tracking/">📦 Lacak Pesanan</a>
          <div className="footer-socials">
            <a className="footer-social-link" href={instagramUrl} target="_blank" rel="noopener noreferrer">
              <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              Instagram
            </a>
            <a className="footer-social-link" href={tiktokUrl} target="_blank" rel="noopener noreferrer">
              <svg className="footer-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.08a8.18 8.18 0 0 0 4.79 1.53V7.16a4.85 4.85 0 0 1-1.02-.47z" />
              </svg>
              TikTok
            </a>
          </div>
          <div className="footer-powered">Powered by <span className="footer-brand">Studio Harel</span></div>
        </footer>

      </div>
    </div>
  );
}
