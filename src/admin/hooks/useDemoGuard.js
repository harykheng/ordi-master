import { useToast } from '../../shared/components/Toast.jsx';
import { config } from '../../shared/lib/config.js';

const DEMO_BLOCKED_MSG = 'Fitur ini dinonaktifkan di demo publik supaya data tetap konsisten buat pengunjung lain. Aktif penuh di akun admin toko kamu sendiri.';

// Blocks write actions (create/edit/delete/save) on the shared public demo
// login — many prospects can be logged into the same demo Supabase project
// at once, so letting them mutate Products/Promo/Settings breaks the demo
// for everyone else. Orders tab is intentionally NOT guarded (see CLAUDE.md).
export function useDemoGuard() {
  const showToast = useToast();
  return function guardDemoWrite() {
    if (!config.demoMode) return false;
    showToast(DEMO_BLOCKED_MSG, 'info');
    return true;
  };
}
