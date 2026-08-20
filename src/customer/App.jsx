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

  // Basic tier — no QRIS, no ongkir calculation. Delivery is still an
  // option, but shipping_cost/shipping_label always stay null — the admin
  // quotes ongkir manually over WA after the order comes in. Checkout just
  // inserts the order (still through place_order() for atomic stock) and
  // hands off to WhatsApp for the admin to confirm.
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

    const rawTotal = cartTotal(state.cart);
    const discount = getDiscountAmount(state.cart, state.activePromo);
    const finalTotal = cartFinalTotal(state.cart, state.activePromo, null);
    const orderNum = `${config.orderPrefix}-${Date.now().toString(36).toUpperCase().slice(-5)}`;
    const snapshot = cartSnapshot(state.cart);
    const deliveryAddress = state.orderType === 'delivery' ? state.profile.address : null;

    setCheckingOut(true);
    try {
      await insertOrder({
        order_number: orderNum,
        customer_name: state.profile.name,
        customer_wa: state.profile.wa,
        order_type: state.orderType,
        order_date: state.selectedDate,
        order_date_label: state.selectedDateLabel,
        delivery_address: deliveryAddress,
        note: state.note || null,
        items: snapshot,
        subtotal: rawTotal,
        promo_code: state.activePromo?.code || null,
        discount_amount: discount,
        shipping_cost: null,
        shipping_label: null,
        total: finalTotal,
        qris_string: null,
        status: 'pending',
      }, cartStockItems(state.cart));

      const waMessage = buildOrderConfirmMessage({
        storeName: config.storeName,
        orderNum, cartSnapshot: snapshot,
        rawTotal, discount, promoCode: state.activePromo?.code || null,
        shippingCost: 0, shippingLabel: null, finalTotal,
        name: state.profile.name, wa: state.profile.wa, orderType: state.orderType,
        orderDateLabel: state.selectedDateLabel,
        address: deliveryAddress, addressNote: state.profile.addressNote, note: state.note,
      });

      setConfirmedOrder({
        orderNum,
        name: state.profile.name,
        wa: state.profile.wa,
        note: state.note,
        address: deliveryAddress,
        addressNote: state.profile.addressNote,
        orderType: state.orderType,
        selectedDate: state.selectedDate,
        orderDateLabel: state.selectedDateLabel,
        rawTotal,
        discount,
        shippingCost: 0,
        shippingLabel: null,
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
