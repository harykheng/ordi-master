import { supabase } from './supabaseClient.js';

// Goes through place_order() (a Postgres function), not a plain insert —
// it decrements each item's stock_qty and inserts the order in one atomic
// transaction, so two customers can't both succeed ordering the last unit
// of something. See supabase-setup.sql §6 for the function itself.
// stockItems: [{ product_id, qty }] — see cartStockItems() in cart.js.
export async function insertOrder(payload, stockItems) {
  const { error } = await supabase.rpc('place_order', { order_data: payload, stock_items: stockItems });
  if (error) throw error;
}

export async function updateOrderStatus(orderId, newStatus) {
  const { error } = await supabase
    .from('orders')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', orderId);
  if (error) throw error;
}
