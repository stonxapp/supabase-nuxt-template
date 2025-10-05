import type { User } from '@supabase/supabase-js'

export interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
}

export const useAuthStore = defineStore('auth', () => {
  const supabase = useSupabase()

  // State
  const user = ref<User | null>(null)
  const loading = ref(true)
  const initialized = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const userId = computed(() => user.value?.id || null)
  const userEmail = computed(() => user.value?.email || null)

  // Actions
  const fetchUser = async () => {
    try {
      loading.value = true
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error('Error fetching user session:', error)
        return { error }
      }

      user.value = session?.user ?? null
      initialized.value = true
      return { error: null }
    } catch (error) {
      console.error('Error in fetchUser:', error)
      return { error }
    } finally {
      loading.value = false
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      loading.value = true
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { data: null, error }
      }

      user.value = data.user
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const signUp = async (email: string, password: string, metadata?: Record<string, unknown>) => {
    try {
      loading.value = true
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })

      if (error) {
        return { data: null, error }
      }

      user.value = data.user
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    try {
      loading.value = true
      const { error } = await supabase.auth.signOut()

      if (error) {
        return { error }
      }

      user.value = null
      return { error: null }
    } catch (error) {
      return { error }
    } finally {
      loading.value = false
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  // Listen to auth state changes
  const setupAuthListener = () => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      user.value = session?.user ?? null
      loading.value = false
      initialized.value = true
    })

    // Cleanup on store destruction
    onUnmounted(() => {
      subscription.unsubscribe()
    })
  }

  // Initialize auth state on client-side
  if (import.meta.client) {
    fetchUser()
    setupAuthListener()
  }

  return {
    // State
    user: readonly(user),
    loading: readonly(loading),
    initialized: readonly(initialized),

    // Getters
    isAuthenticated,
    userId,
    userEmail,

    // Actions
    fetchUser,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }
})
