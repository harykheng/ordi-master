import { useEffect, useState } from 'react';
import { useCart } from '../CartContext.jsx';
import { useToast } from '../../shared/components/Toast.jsx';
import { useBodyScrollLock } from '../../shared/hooks/useBodyScrollLock.js';

// Basic tier — delivery is still available, but there's no autocomplete/map
// preview/ongkir calculation (those are Antar+ features). Address is just a
// plain typed field; ongkir gets confirmed manually by the admin over WA
// after the order comes in, not computed here.
export default function ProfileModal({ isOpen, onClose }) {
  const { state, dispatch } = useCart();
  const showToast = useToast();
  useBodyScrollLock(isOpen);

  const [name, setName] = useState(state.profile.name);
  const [wa, setWa] = useState(state.profile.wa);
  const [address, setAddress] = useState(state.profile.address);
  const [addressNote, setAddressNote] = useState(state.profile.addressNote);

  // Re-sync local form state whenever the modal opens (so re-opening after save
  // shows the previously saved values, and reset after order completion clears it).
  useEffect(() => {
    if (isOpen) {
      setName(state.profile.name);
      setWa(state.profile.wa);
      setAddress(state.profile.address);
      setAddressNote(state.profile.addressNote);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function handleSave() {
    if (!name.trim()) { showToast('Nama wajib diisi!', 'error'); return; }
    if (!wa.trim())   { showToast('Nomor WhatsApp wajib diisi!', 'error'); return; }
    if (state.orderType === 'delivery' && !address.trim()) {
      showToast('Alamat pengiriman wajib diisi!', 'error');
      return;
    }

    dispatch({
      type: 'SET_PROFILE',
      profile: {
        name: name.trim(), wa: wa.trim(), address: address.trim(), addressNote: addressNote.trim(),
        lat: null, lng: null,
      },
    });
    onClose();
  }

  return (
    <div className="profile-overlay" style={{ display: isOpen ? 'flex' : 'none' }} onClick={onClose}>
      <div className="profile-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="profile-sheet-drag"></div>
        <div className="profile-sheet-inner">
          <div className="profile-sheet-header">
            <span className="profile-sheet-title">Detail Pemesan</span>
            <button className="profile-sheet-close" onClick={onClose} aria-label="Tutup">✕</button>
          </div>

          <div className="form-group">
            <label htmlFor="customerName">Nama *</label>
            <input type="text" id="customerName" placeholder="Nama kamu..." autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="customerWA">Nomor WhatsApp *</label>
            <input type="tel" id="customerWA" placeholder="08xxxxxxxxxx" autoComplete="tel" value={wa} onChange={(e) => setWa(e.target.value)} />
          </div>

          {state.orderType === 'delivery' && (
            <div>
              <div className="form-group">
                <label htmlFor="customerAddress">Alamat Pengiriman *</label>
                <textarea
                  id="customerAddress"
                  placeholder="Tulis alamat lengkap + patokan..."
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <p className="form-hint">Ongkir belum dihitung otomatis — admin akan infoin ongkirnya lewat WhatsApp setelah pesanan masuk.</p>
              </div>
              <div className="form-group">
                <label htmlFor="customerAddressNote">Catatan Alamat <span className="label-opt">(opsional)</span></label>
                <input
                  type="text"
                  id="customerAddressNote"
                  placeholder="No. unit, lantai, patokan, kode gate..."
                  value={addressNote}
                  onChange={(e) => setAddressNote(e.target.value)}
                />
              </div>
            </div>
          )}

          <button className="btn-profile-save" id="btnSaveProfile" onClick={handleSave} style={{ marginBottom: 8 }}>
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
