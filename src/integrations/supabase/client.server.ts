import { createClient } from '@supabase/supabase-js';

export const createServerClient = (env: any) => createClient(
  env.SUPABASE_URL || (typeof import.meta !== 'undefined' ? import.meta.env.SUPABASE_URL : '') || '',
  env.SUPABASE_SERVICE_ROLE_KEY || (typeof import.meta !== 'undefined' ? import.meta.env.SUPABASE_SERVICE_ROLE_KEY : '') || ''
);
