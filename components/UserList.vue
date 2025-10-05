<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Users</h3>
      <button
class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        :disabled="loading" @click="refresh()">
        {{ loading ? 'Loading...' : 'Refresh' }}
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="loading && !data" class="space-y-3">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
        <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600 dark:text-red-400 mb-4">{{ error.message }}</p>
      <button class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors" @click="refresh()">
        Try Again
      </button>
    </div>

    <!-- Data display -->
    <div v-else-if="data?.users?.length" class="space-y-3">
      <div
v-for="user in data.users" :key="user.id"
        class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
            <span class="text-white font-medium text-sm">
              {{ user.fullName?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase() }}
            </span>
          </div>
          <div>
            <p class="font-medium text-gray-900 dark:text-white">
              {{ user.fullName || 'No name' }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ user.email }}</p>
          </div>
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400">
          {{ formatDate(user.createdAt) }}
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-8">
      <p class="text-gray-600 dark:text-gray-400">No users found</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// This component demonstrates SSR data fetching with useAsyncData
// It ensures server/client consistency and proper hydration

// Explicitly import Nuxt composables for better IDE support
import { useAsyncData } from 'nuxt/app'
import { createError } from 'h3'

interface User {
  id: string
  email: string
  fullName: string | null
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

interface UsersResponse {
  users: User[]
}

const {
  data,
  error,
  pending: loading,
  refresh,
} = await useAsyncData<UsersResponse>('users', async () => {
  // This will run on server for SSR, and on client for hydration
  try {
    const response = await $fetch<UsersResponse>('/api/users')
    return response
  } catch (err) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch users',
      cause: err,
    })
  }
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>
