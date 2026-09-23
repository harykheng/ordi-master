import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';

// Tanggal dalam rentang yang sudah tidak bisa dipesan sama sekali, sebagai Set
// berisi kunci 'YYYY-MM-DD'.
//
// Dihitung di Postgres (get_full_dates(), supabase-setup.sql §7), bukan di
// sini, karena jawabannya butuh semua produk dikali semua tanggal: langkah 1
// belum mengambil daftar produk dan tidak perlu mengambilnya cuma buat ini.
//
// Gagal fetch tidak memblokir apa pun: Set balik kosong dan semua tanggal tetap
// bisa dipilih. Yang menolak beneran tetap place_order() di server, jadi
// kegagalan di sini bikin customer baru tahu belakangan, bukan bikin oversell.
export function useFullDates(fromKey, toKey) {
  const [fullDates, setFullDates] = useState(() => new Set());
  const [loading, setLoading] = useState(Boolean(fromKey && toKey));

  const refetch = useCallback(async () => {
    if (!fromKey || !toKey) {
      setFullDates(new Set());
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_full_dates', { p_from: fromKey, p_to: toKey });
      if (error) throw error;
      setFullDates(new Set((data || []).map((row) => String(row.full_date).slice(0, 10))));
    } catch (err) {
      console.error('get_full_dates error:', err);
      setFullDates(new Set());
    } finally {
      setLoading(false);
    }
  }, [fromKey, toKey]);

  useEffect(() => { refetch(); }, [refetch]);

  return { fullDates, loading, refetch };
}
