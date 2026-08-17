const FEATURES = [
  { label: 'Katalog produk & varian', basic: true, antar: true, bayar: true },
  { label: 'Lacak status pesanan', basic: true, antar: true, bayar: true },
  { label: 'Pickup di toko', basic: true, antar: true, bayar: true },
  { label: 'Konfirmasi pesanan via WhatsApp', basic: true, antar: true, bayar: true },
  { label: 'Delivery + cek ongkir otomatis', basic: false, antar: true, bayar: true },
  { label: 'Pembayaran QRIS otomatis (QR dinamis)', basic: false, antar: false, bayar: true },
];

// Sales-demo-only — rendered next to TierBadge chips so a client can see
// the full picture of what each package includes, not just the one
// feature they clicked on. Gated by config.demoMode at the call sites.
export default function TierCompareModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="tier-compare-overlay" onClick={onClose}>
      <div className="tier-compare-card" onClick={(e) => e.stopPropagation()}>
        <div className="tier-compare-header">
          <span>Perbandingan Paket Ordi</span>
          <button className="tier-compare-close" onClick={onClose} aria-label="Tutup">✕</button>
        </div>
        <div className="tier-compare-table-wrap">
          <table className="tier-compare-table">
            <thead>
              <tr>
                <th></th>
                <th>Basic</th>
                <th>Antar</th>
                <th>Bayar</th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((f) => (
                <tr key={f.label}>
                  <td>{f.label}</td>
                  <td>{f.basic ? '✅' : '—'}</td>
                  <td>{f.antar ? '✅' : '—'}</td>
                  <td>{f.bayar ? '✅' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
