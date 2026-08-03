import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your_supabase_project_url')
);

// Use actual credentials if configured, otherwise use valid dummy values to prevent runtime import crashes
const urlToUse = isConfigured ? supabaseUrl : 'https://xyzcompany.supabase.co';
const keyToUse = isConfigured ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9.dummy';

export const supabase = createClient(urlToUse, keyToUse);
export const isSupabaseConfigured = isConfigured;
