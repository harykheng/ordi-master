import { supabase } from './supabaseClient.js';

// Goes through place_order() (a Postgres function), not a plain insert ,
// it decrements each item's stock_qty and inserts the order in one atomic
// transaction, so two customers can't both succeed ordering the last unit
// of something. See supabase-setup.sql §6 for the function itself.
// stockItems: [{ product_id, qty }], see cartStockItems() in cart.js.
export async function insertOrder(payload, stockItems) {
  const { error } = await supabase.rpc('place_order', { order_data: payload, stock_items: stockItems });
  if (error) throw error;
}

// Pembatalan lewat cancel_order(), status lain lewat update biasa.
//
// Bukan karena rapi, tapi karena membatalkan pesanan harus MENGEMBALIKAN
// products.stock_qty yang sudah dikurangi place_order(). Update kolom status
// dari browser tidak bisa melakukannya (anon maupun admin tidak pernah
// menyentuh stock_qty langsung), dan sebelum ini stok memang hangus permanen
// tiap ada pembatalan. Function-nya idempoten, jadi klik dua kali tidak
// menambah stok dua kali. Lihat supabase-setup.sql §7.
export async function updateOrderStatus(orderId, newStatus) {
  if (newStatus === 'cancelled') {
    const { error } = await supabase.rpc('cancel_order', { p_order_id: orderId });
    if (error) throw error;
    return;
  }

  // `.neq('cancelled')` menutup balapan dengan expire_stale_orders(): pesanan
  // pending yang masih tampil di layar admin bisa keburu dibatalkan otomatis
  // (dan stoknya dikembalikan) sebelum tombol Konfirmasi ditekan. Tanpa syarat
  // ini, pesanan yang stoknya sudah dilepas bisa hidup lagi jadi Diproses, dan
  // stok yang sama terjual dua kali. UI memang tidak pernah menawarkan jalan
  // keluar dari Dibatalkan, jadi syarat ini tidak menutup apa pun yang sah.
  const { data, error } = await supabase
    .from('orders')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', orderId)
    .neq('status', 'cancelled')
    .select('id');
  if (error) throw error;
  if (!data || data.length === 0) {
    const err = new Error('Pesanan ini sudah dibatalkan, otomatis karena lewat 24 jam tanpa konfirmasi atau oleh admin lain.');
    err.code = 'ORDER_ALREADY_CANCELLED';
    throw err;
  }
}

// Membatalkan pesanan pending yang lewat 24 jam dan mengembalikan stoknya,
// lewat expire_stale_orders() (supabase-setup.sql §7). Dipanggil tiap katalog
// dibuka dan tiap daftar pesanan admin dimuat, jadi stok yang dipegang orang
// yang tidak pernah membayar balik sendiri tanpa jadwal di server.
//
// Tidak pernah melempar: kalau function-nya belum ada (instance yang belum
// menjalankan ulang supabase-setup.sql) atau jaringan gagal, katalog dan
// dashboard tetap harus jalan. Balikan true = ada pesanan yang dibatalkan,
// tanda angka stok yang sudah di-fetch sebelumnya basi.
export async function expireStaleOrders() {
  try {
    const { data, error } = await supabase.rpc('expire_stale_orders');
    if (error) throw error;
    return data === true;
  } catch (e) {
    console.error('expireStaleOrders error:', e);
    return false;
  }
}

// Used by /tracking/, orders has no anon SELECT policy (see CLAUDE.md), so
// this goes through lookup_order() instead of a plain query: it only ever
// returns a row when BOTH order_number and customer_wa match, closing off
// scanning the table for other customers' orders. See supabase-setup.sql §7.
export async function lookupOrder(orderNumber, customerWa) {
  const { data, error } = await supabase.rpc('lookup_order', {
    p_order_number: orderNumber,
    p_customer_wa: customerWa,
  });
  if (error) throw error;
  return data?.[0] || null;
}
