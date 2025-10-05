<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div class="max-w-md w-full space-y-8">
            <div class="text-center">
                <div v-if="loading" class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
                <div v-else-if="error" class="text-red-600 dark:text-red-400">
                    <p class="text-lg font-medium">Authentication Error</p>
                    <p class="mt-2 text-sm">{{ error.message }}</p>
                    <NuxtLink to="/"
                        class="mt-4 inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                        Go Home
                    </NuxtLink>
                </div>
                <div v-else class="text-green-600 dark:text-green-400">
                    <p class="text-lg font-medium">Authentication Successful!</p>
                    <p class="mt-2 text-sm">Redirecting...</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { loading, error } = useAuth()
const router = useRouter()

// Handle OAuth callback on client-side only
onMounted(async () => {
    if (import.meta.client) {
        try {
            const supabase = useSupabase()
            const { data, error } = await supabase.auth.getSession()

            if (error) {
                return
            }

            if (data.session) {
                // Successfully authenticated, redirect to home or dashboard
                await router.push('/')
            }
        } catch {
            // Error is handled by the error state in the template
        }
    }
})
</script>
