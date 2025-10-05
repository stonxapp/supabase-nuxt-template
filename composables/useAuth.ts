import type { AuthError, User } from '@supabase/supabase-js'

export interface AuthState {
  user: User | null
  loading: boolean
  error: AuthError | null
}

export const useAuth = () => {
  const supabase = useSupabase()
  const state = reactive<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  // Initialize auth state
  const initializeAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        state.error = error
      } else {
        state.user = session?.user ?? null
      }
    } catch (error) {
      state.error = error as AuthError
    } finally {
      state.loading = false
    }
  }

  // Sign up with email and password
  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    state.loading = true
    state.error = null

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })

      if (error) {
        state.error = error
        return { data: null, error }
      }

      state.user = data.user
      return { data, error: null }
    } catch (error) {
      state.error = error as AuthError
      return { data: null, error: error as AuthError }
    } finally {
      state.loading = false
    }
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    state.loading = true
    state.error = null

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        state.error = error
        return { data: null, error }
      }

      state.user = data.user
      return { data, error: null }
    } catch (error) {
      state.error = error as AuthError
      return { data: null, error: error as AuthError }
    } finally {
      state.loading = false
    }
  }

  // Sign in with OAuth provider
  const signInWithProvider = async (provider: 'google' | 'github' | 'discord') => {
    state.loading = true
    state.error = null

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        state.error = error
        return { data: null, error }
      }

      return { data, error: null }
    } catch (error) {
      state.error = error as AuthError
      return { data: null, error: error as AuthError }
    } finally {
      state.loading = false
    }
  }

  // Sign out
  const signOut = async () => {
    state.loading = true
    state.error = null

    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        state.error = error
        return { error }
      }

      state.user = null
      return { error: null }
    } catch (error) {
      state.error = error as AuthError
      return { error: error as AuthError }
    } finally {
      state.loading = false
    }
  }

  // Reset password
  const resetPassword = async (email: string) => {
    state.loading = true
    state.error = null

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        state.error = error
        return { error }
      }

      return { error: null }
    } catch (error) {
      state.error = error as AuthError
      return { error: error as AuthError }
    } finally {
      state.loading = false
    }
  }

  // Listen to auth state changes
  const { data: authListener } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      state.user = session?.user ?? null
      state.loading = false
    }
  )

  // Cleanup listener on unmount
  onUnmounted(() => {
    authListener.subscription.unsubscribe()
  })

  // Initialize auth on client-side
  if (process.client) {
    initializeAuth()
  }

  return {
    // State
    user: readonly(state).user,
    loading: readonly(state).loading,
    error: readonly(state).error,

    // Methods
    signUp,
    signIn,
    signInWithProvider,
    signOut,
    resetPassword,
    initializeAuth,
  }
}
