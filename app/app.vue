<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
    <header class="bg-primary-600 dark:bg-primary-800 text-white p-4 shadow-lg">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">Supabase Nuxt Starter</h1>
        <button @click="toggleDarkMode"
          class="p-2 rounded-lg bg-primary-700 dark:bg-primary-900 hover:bg-primary-800 dark:hover:bg-primary-900 transition-colors">
          {{ isDark ? '☀️ Light' : '🌙 Dark' }}
        </button>
      </div>
    </header>

    <main class="container mx-auto p-4">
      <NuxtRouteAnnouncer />
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
const isDark = ref(false)

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Initialize dark mode from localStorage or system preference
onMounted(() => {
  const saved = localStorage.getItem('dark-mode')
  if (saved !== null) {
    isDark.value = JSON.parse(saved)
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  if (isDark.value) {
    document.documentElement.classList.add('dark')
  }
})

watch(isDark, (newValue) => {
  localStorage.setItem('dark-mode', JSON.stringify(newValue))
})
</script>
