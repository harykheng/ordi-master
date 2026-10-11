import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { expireStaleOrders } from '../lib/orders.js';

// Sama dengan batas 24 jam di supabase-setup.sql §7 (active_order_item_qty()
// dan expire_stale_orders()). Ubah satu, ubah semuanya.
const PENDING_EXPIRE_MS = 24 * 60 * 60 * 1000;

// Admin-only, customer never reads this table (RLS insert-only).
//
// Sweep dulu, baru baca: pending yang lewat 24 jam dibatalkan di server dan
// stoknya kembali, jadi muncul di filter Dibatalkan alih-alih menghilang.
// Filter PENDING_EXPIRE_MS di bawah tetap dipertahankan sebagai cadangan buat
// instance yang belum menjalankan ulang supabase-setup.sql, di mana sweep-nya
// gagal diam-diam dan perilaku lama (disembunyikan) yang berlaku.
export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await expireStaleOrders();
      const { data, error: err } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) {
        setError(err);
        return;
      }

      const now = Date.now();
      setOrders((data || []).filter((o) => {
        if (o.status !== 'pending') return true;
        return now - new Date(o.created_at).getTime() < PENDING_EXPIRE_MS;
      }));
    } catch (err) {
      // Network/CORS failures reject instead of resolving with { error }.
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  return { orders, loading, error, refetch };
}
