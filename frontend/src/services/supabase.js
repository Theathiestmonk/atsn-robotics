import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const missingSupabaseError = new Error(
  'Supabase is not configured (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)'
)

const createSupabaseStub = () => {
  const noop = async () => ({ data: { session: null }, error: missingSupabaseError })

  const subscription = { unsubscribe: () => {} }

  return {
    auth: {
      getSession: noop,
      onAuthStateChange: () => ({ data: { subscription } }),
      signInWithPassword: noop,
      signUp: noop,
    },
    from: () => ({ insert: noop, select: noop, update: noop, delete: noop }),
    rpc: noop,
  }
}

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : createSupabaseStub()
