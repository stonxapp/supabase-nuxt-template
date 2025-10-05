import { createClient } from '@supabase/supabase-js'

let supabaseClient: ReturnType<typeof createClient>

export const useSupabase = () => {
  const config = useRuntimeConfig()

  if (!supabaseClient) {
    supabaseClient = createClient(
      config.supabase.url as string,
      config.supabase.anonKey as string,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      }
    )
  }

  return supabaseClient
}
