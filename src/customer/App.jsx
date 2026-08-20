import { useEffect, useState } from 'react';
import { CartProvider, useCart } from './CartContext.jsx';
import { useSettings } from '../shared/hooks/useSettings.js';
import { useToast } from '../shared/components/Toast.jsx';
import { config } from '../shared/lib/config.js';
import { trackVisit } from '../shared/lib/visits.js';
import { cartTotal, getDiscountAmount, cartFinalTotal, cartSnapshot, cartStockItems } from '../shared/lib/cart.js';
import { insertOrder } from '../shared/lib/orders.js';
import { buildOrderConfirmMessage, waLink } from '../shared/lib/whatsapp.js';
import OrderTypeStep from './components/OrderTypeStep.jsx';
import CatalogStep from './components/CatalogStep.jsx';
import CheckoutStep from './components/CheckoutStep.jsx';
import VariantSheet from './components/VariantSheet.jsx';
import ProfileModal from './components/ProfileModal.jsx';
import OrderSummaryModal from './components/OrderSummaryModal.jsx';

function AppShell() {
  const { state } = useCart();
  const { settings } = useSettings();
  const showToast = useToast();

  const [variantProduct, setVariantProduct] = useState(null);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);

  // Once per tab session, not once per render/refresh — a sessionStorage
  // flag survives React StrictMode's double-invoke in dev and keeps a
  // customer flipping between steps or refreshing from inflating the count.
  useEffect(() => {
    if (sessionStorage.getItem('ordi_visit_tracked_v1')) return;
    sessionStorage.setItem('ordi_visit_tracked_v1', '1');
    trackVisit();
  }, []);

  // No QRIS in this tier — checkout inserts the order straight away (still
  // through place_order() for atomic stock) and hands off to WhatsApp for
  // the admin to confirm/arrange payment, instead of generating a QR first.
  async function handleCheckout() {
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
    const snapshot = cartSnapshot(state.cart);

    setCheckingOut(true);
    try {
      await insertOrder({
        order_number: orderNum,
        customer_name: state.profile.name,
        customer_wa: state.profile.wa,
        order_type: state.orderType,
        order_date: state.selectedDate,
        order_date_label: state.selectedDateLabel,
        delivery_address: state.orderType === 'delivery' ? state.profile.address : null,
        note: state.note || null,
        items: snapshot,
        subtotal: rawTotal,
        promo_code: state.activePromo?.code || null,
        discount_amount: discount,
        shipping_cost: shippingCost || null,
        shipping_label: state.selectedShipping?.label || null,
        total: finalTotal,
        qris_string: null,
        status: 'pending',
      }, cartStockItems(state.cart));

      const waMessage = buildOrderConfirmMessage({
        storeName: config.storeName,
        orderNum, cartSnapshot: snapshot,
        rawTotal, discount, promoCode: state.activePromo?.code || null,
        shippingCost, shippingLabel: state.selectedShipping?.label || null, finalTotal,
        name: state.profile.name, wa: state.profile.wa, orderType: state.orderType,
        orderDateLabel: state.selectedDateLabel,
        address: state.profile.address, addressNote: state.profile.addressNote, note: state.note,
      });

      setConfirmedOrder({
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
        cartSnapshot: snapshot,
        waUrl: waLink(config.adminWhatsapp, waMessage),
      });
    } catch (err) {
      console.error('Checkout error:', err);
      const stokHabisMatch = /STOK_HABIS: (.+)/.exec(err.message || '');
      showToast(stokHabisMatch ? stokHabisMatch[1] : 'Gagal menyimpan pesanan. Coba lagi ya!', 'error');
    } finally {
      setCheckingOut(false);
    }
  }

  return (
    <>
      {state.step === 1 && <OrderTypeStep settings={settings} />}
      {state.step === 2 && <CatalogStep settings={settings} onPickVariant={setVariantProduct} />}
      {state.step === 3 && (
        <CheckoutStep
          settings={settings}
          onOpenProfile={() => setProfileOpen(true)}
          onCheckout={handleCheckout}
          checkingOut={checkingOut}
        />
      )}

      <VariantSheet product={variantProduct} onClose={() => setVariantProduct(null)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setProfileOpen(false)} />
      <OrderSummaryModal
        order={confirmedOrder}
        settings={settings}
        onClose={() => setConfirmedOrder(null)}
      />
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
