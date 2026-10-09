import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Vite bakes these in at build time. On Vercel they must be set under
// Project → Settings → Environment Variables, then the project redeployed.
export const supabaseConfigured = Boolean(url && key)

if (!supabaseConfigured) {
  console.error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.')
}

export const supabase = createClient(url || 'http://missing', key || 'missing')
