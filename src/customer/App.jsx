import { useState } from 'react';
import { CartProvider, useCart } from './CartContext.jsx';
import { useSettings } from '../shared/hooks/useSettings.js';
import { useToast } from '../shared/components/Toast.jsx';
import { config } from '../shared/lib/config.js';
import { cartTotal, getDiscountAmount, cartFinalTotal, cartSnapshot, cartStockItems } from '../shared/lib/cart.js';
import { qrisToDynamic } from '../shared/lib/qris.js';
import OrderTypeStep from './components/OrderTypeStep.jsx';
import CatalogStep from './components/CatalogStep.jsx';
import CheckoutStep from './components/CheckoutStep.jsx';
import VariantSheet from './components/VariantSheet.jsx';
import ProfileModal from './components/ProfileModal.jsx';
import QrisModal from './components/QrisModal.jsx';
import OrderSummaryModal from './components/OrderSummaryModal.jsx';
import TierCompareModal from './components/TierCompareModal.jsx';

function AppShell() {
  const { state } = useCart();
  const { settings } = useSettings();
  const showToast = useToast();

  const [variantProduct, setVariantProduct] = useState(null);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [isCompareOpen, setCompareOpen] = useState(false);

  function handleSubmitQris() {
    if (!state.isProfileFilled) {
      showToast('Isi detail pemesan dulu ya!', 'error');
      setProfileOpen(true);
      return;
    }
    if (state.orderType === 'delivery' && !state.profile.address) {
      showToast('Masukkan alamat pengiriman dulu ya!', 'error');
      setProfileOpen(true);
      return;
    }
    if (state.orderType === 'delivery' && state.shippingStatus === 'unavailable') {
      showToast('Alamat kamu di luar jangkauan delivery. Ongkir tidak tersedia.', 'error');
      return;
    }
    if (state.orderType === 'delivery' && !state.selectedShipping) {
      showToast('Pilih opsi ongkir dulu ya!', 'error');
      return;
    }

    const rawTotal = cartTotal(state.cart);
    const discount = getDiscountAmount(state.cart, state.activePromo);
    const shippingCost = state.selectedShipping?.price || 0;
    const finalTotal = cartFinalTotal(state.cart, state.activePromo, state.selectedShipping);
    const orderNum = `${config.orderPrefix}-${Date.now().toString(36).toUpperCase().slice(-5)}`;

    let qrisString;
    try {
      qrisString = qrisToDynamic(config.qrisStatic, finalTotal);
    } catch (e) {
      console.error('QRIS generate error:', e);
      showToast('Gagal generate QR code', 'error');
      return;
    }

    setPendingOrder({
      orderNum,
      name: state.profile.name,
      wa: state.profile.wa,
      note: state.note,
      address: state.profile.address,
      addressNote: state.profile.addressNote,
      orderType: state.orderType,
      selectedDate: state.selectedDate,
      orderDateLabel: state.selectedDateLabel,
      rawTotal,
      discount,
      shippingCost,
      shippingLabel: state.selectedShipping?.label || null,
      finalTotal,
      promoCode: state.activePromo?.code || null,
      qrisString,
      cartSnapshot: cartSnapshot(state.cart),
      stockItems: cartStockItems(state.cart),
    });
  }

  function handleConfirmed(confirmed) {
    setPendingOrder(null);
    setConfirmedOrder(confirmed);
  }

  return (
    <>
      {state.step === 1 && (
        <OrderTypeStep settings={settings} onCompareTiers={() => setCompareOpen(true)} />
      )}
      {state.step === 2 && <CatalogStep settings={settings} onPickVariant={setVariantProduct} />}
      {state.step === 3 && (
        <CheckoutStep
          settings={settings}
          onOpenProfile={() => setProfileOpen(true)}
          onSubmitQris={handleSubmitQris}
          onCompareTiers={() => setCompareOpen(true)}
        />
      )}

      <VariantSheet product={variantProduct} onClose={() => setVariantProduct(null)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setProfileOpen(false)} />
      <QrisModal
        pendingOrder={pendingOrder}
        onClose={() => setPendingOrder(null)}
        onConfirmed={handleConfirmed}
      />
      <OrderSummaryModal
        order={confirmedOrder}
        settings={settings}
        onClose={() => setConfirmedOrder(null)}
      />
      <TierCompareModal isOpen={isCompareOpen} onClose={() => setCompareOpen(false)} />
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppShell />
    </CartProvider>
  );
}
