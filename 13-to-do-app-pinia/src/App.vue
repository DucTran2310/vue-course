<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'
import { useTodoStore } from '@/stores/useTodoStore'
import { storeToRefs } from 'pinia'
import { watchEffect } from 'vue'

const store = useTodoStore()
const { theme } = storeToRefs(store)

useKeyboardShortcuts()

// Áp dụng theme khi thay đổi
watchEffect(() => {
  const html = document.documentElement
  // Remove old theme classes
  html.classList.remove('theme-light', 'theme-dark', 'theme-system')
  // Add new theme class
  html.classList.add(`theme-${theme.value}`)

  // Xử lý system theme
  if (theme.value === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    html.setAttribute('data-theme', systemTheme)
  } else {
    html.setAttribute('data-theme', theme.value)
  }
})

// Lắng nghe thay đổi system theme
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (store.theme === 'system') {
      const html = document.documentElement
      html.setAttribute('data-theme', e.matches ? 'dark' : 'light')
    }
  })
}
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <!-- Navigation -->
    <nav class="border-b border-border sticky top-0 bg-background/80 backdrop-blur-lg z-40">
      <div class="max-w-4xl mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <RouterLink to="/" class="text-xl font-bold tracking-tight text-foreground">
            My Tasks<span class="text-primary">.</span>
          </RouterLink>

          <div class="flex items-center gap-1">
            <RouterLink
              to="/"
              class="px-3 py-2 rounded-lg text-sm transition-colors text-muted hover:text-foreground"
              active-class="text-primary bg-primary/10"
            >
              <span class="hidden sm:inline">Tất cả</span>
              <span class="sm:hidden">🏠</span>
            </RouterLink>

            <RouterLink
              to="/stats"
              class="px-3 py-2 rounded-lg text-sm transition-colors text-muted hover:text-foreground"
              active-class="text-primary bg-primary/10"
            >
              <span class="hidden sm:inline">Thống kê</span>
              <span class="sm:hidden">📊</span>
            </RouterLink>

            <RouterLink
              to="/settings"
              class="px-3 py-2 rounded-lg text-sm transition-colors text-muted hover:text-foreground"
              active-class="text-primary bg-primary/10"
            >
              <span class="hidden sm:inline">Cài đặt</span>
              <span class="sm:hidden">⚙️</span>
            </RouterLink>
          </div>

          <!-- Keyboard shortcut hint -->
          <div class="text-xs text-muted hidden md:block">
            <kbd class="bg-muted/20 px-1.5 py-0.5 rounded border border-border">⌘K</kbd> tìm kiếm
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <RouterView />

    <!-- Footer -->
    <footer class="text-center text-muted text-xs py-6 border-t border-border mt-8">
      Vue 3 · TypeScript · Pinia · Router · Chart.js · Tailwind CSS
    </footer>
  </div>
</template>
