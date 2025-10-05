<template>
    <div class="space-y-8">
        <div class="text-center">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome to Supabase Nuxt Starter
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                A full-stack starter template with Vue 3, Nuxt 3, Supabase, Tailwind CSS, Pinia, and TypeScript.
                Built for scalability and developer experience.
            </p>
        </div>

        <!-- Auth Status -->
        <div class="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-semibold mb-4 text-center">Authentication Demo</h2>

            <div v-if="authStore.loading" class="text-center py-4">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading...</p>
            </div>

            <div v-else-if="authStore.isAuthenticated" class="space-y-4">
                <div class="text-center">
                    <div class="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="text-white text-2xl font-bold">
                            {{ authStore.userEmail?.charAt(0).toUpperCase() }}
                        </span>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Signed in as</p>
                    <p class="font-medium">{{ authStore.userEmail }}</p>
                </div>

                <button @click="handleSignOut"
                    class="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    :disabled="signingOut">
                    {{ signingOut ? 'Signing out...' : 'Sign Out' }}
                </button>
            </div>

            <div v-else class="space-y-4">
                <form @submit.prevent="handleSignIn" class="space-y-4">
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email
                        </label>
                        <input id="email" v-model="email" type="email" required
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="your@email.com" />
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Password
                        </label>
                        <input id="password" v-model="password" type="password" required
                            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="••••••••" />
                    </div>

                    <button type="submit"
                        class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        :disabled="signingIn">
                        {{ signingIn ? 'Signing in...' : 'Sign In' }}
                    </button>
                </form>

                <div class="text-center">
                    <button @click="handleSignUp"
                        class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
                        :disabled="signingUp">
                        {{ signingUp ? 'Creating account...' : 'Create Account' }}
                    </button>
                </div>

                <div v-if="authError"
                    class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p class="text-sm text-red-600 dark:text-red-400">{{ authError.message }}</p>
                </div>
            </div>
        </div>

        <!-- User List Demo (SSR with useAsyncData) -->
        <div class="max-w-4xl mx-auto">
            <UserList />
        </div>

        <!-- Features Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">🔐 Authentication</h3>
                <p class="text-gray-600 dark:text-gray-300">
                    Secure user authentication with Supabase Auth, including email/password and OAuth providers.
                </p>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">🗄️ Database</h3>
                <p class="text-gray-600 dark:text-gray-300">
                    PostgreSQL database with Drizzle ORM and Zod validation for type-safe operations.
                </p>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">🎨 UI Framework</h3>
                <p class="text-gray-600 dark:text-gray-300">
                    Beautiful, responsive UI with Tailwind CSS and dark/light mode support.
                </p>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">📱 State Management</h3>
                <p class="text-gray-600 dark:text-gray-300">
                    Centralized state management with Pinia stores for predictable app state.
                </p>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">⚡ SSR Ready</h3>
                <p class="text-gray-600 dark:text-gray-300">
                    Server-side rendering with Nuxt 3 for optimal performance and SEO.
                </p>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">🔧 TypeScript</h3>
                <p class="text-gray-600 dark:text-gray-300">
                    Full TypeScript support for better developer experience and type safety.
                </p>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">⚡ Real-time Features</h3>
                <p class="text-gray-600 dark:text-gray-300">
                    Ready for Supabase Realtime subscriptions and live updates via plugins and composables.
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore()

// Form state
const email = ref('')
const password = ref('')
const authError = ref<string | null>(null)

// Action states
const signingIn = ref(false)
const signingUp = ref(false)
const signingOut = ref(false)

const handleSignIn = async () => {
    signingIn.value = true
    authError.value = null

    const { error } = await authStore.signIn(email.value, password.value)

    if (error) {
        authError.value = error.message
    } else {
        email.value = ''
        password.value = ''
    }

    signingIn.value = false
}

const handleSignUp = async () => {
    signingUp.value = true
    authError.value = null

    const { error } = await authStore.signUp(email.value, password.value)

    if (error) {
        authError.value = error.message
    } else {
        email.value = ''
        password.value = ''
    }

    signingUp.value = false
}

const handleSignOut = async () => {
    signingOut.value = true
    authError.value = null

    const { error } = await authStore.signOut()

    if (error) {
        authError.value = error.message
    }

    signingOut.value = false
}
</script>
