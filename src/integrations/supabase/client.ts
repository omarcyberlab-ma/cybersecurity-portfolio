import { createClient } from '@supabase/supabase-js';

let _supabase: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!_supabase) {
    try {
      const url = import.meta.env.VITE_SUPABASE_URL || '';
      const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
      if (url && key) {
        _supabase = createClient(url, key);
      }
    } catch {
      // env not available
    }
  }
  return _supabase;
}

export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_, prop) {
    const s = getSupabase();
    if (!s) return undefined;
    return s[prop as keyof ReturnType<typeof createClient>];
  },
});
