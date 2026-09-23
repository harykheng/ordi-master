import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';

// Berapa slot yang sudah terpakai per produk untuk satu tanggal. Di-fetch ulang
// tiap tanggalnya berubah, bukan tiap keranjang berubah: yang ini soal pesanan
// orang lain yang sudah masuk, bukan isi keranjang sendiri (itu dihitung
// terpisah lewat getProductCartQty()).
//
// Gagal fetch sengaja tidak memblokir katalog. Kalau RPC-nya error, usage balik
// kosong dan produk tampil tanpa batas kuota; yang menolak kelebihan pesanan
// tetap place_order() di server, jadi kegagalan di sini bikin customer baru
// tahu belakangan, bukan bikin oversell.
export function useCapacity(dateKey) {
  const [usage, setUsage] = useState(() => new Map());
  const [loading, setLoading] = useState(Boolean(dateKey));
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!dateKey) {
      setUsage(new Map());
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Lewat rpc(), bukan SELECT biasa, karena `orders` sengaja tanpa policy
      // SELECT untuk anon. Function-nya cuma balikin (product_id, used) untuk
      // satu tanggal, dan cuma buat produk yang kuotanya memang diisi.
      const { data, error: err } = await supabase.rpc('get_capacity_usage', { p_date: dateKey });
      if (err) throw err;
      const next = new Map();
      (data || []).forEach((row) => next.set(row.product_id, Number(row.used) || 0));
      setUsage(next);
    } catch (err) {
      console.error('get_capacity_usage error:', err);
      setError(err);
      setUsage(new Map());
    } finally {
      setLoading(false);
    }
  }, [dateKey]);

  useEffect(() => { refetch(); }, [refetch]);

  return { usage, loading, error, refetch };
}
