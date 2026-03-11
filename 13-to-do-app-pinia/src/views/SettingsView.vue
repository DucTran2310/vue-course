<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTodoStore } from '@/stores/useTodoStore'

const store = useTodoStore()

const settings = ref({
  theme: store.theme,
  compactMode: store.compactMode,
  autoSave: store.autoSave,
  notifications: Notification.permission === 'granted',
})

watch(
  settings,
  (newVal) => {
    store.theme = newVal.theme
    store.compactMode = newVal.compactMode
    store.autoSave = newVal.autoSave
  },
  { deep: true },
)

const requestNotification = async () => {
  const permission = await Notification.requestPermission()
  settings.value.notifications = permission === 'granted'
}

const exportData = (format: 'json' | 'csv' | 'markdown') => {
  const data = store.exportData(format)
  const blob = new Blob([data], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `todos-export.${format}`
  a.click()
  URL.revokeObjectURL(url)
}

const importData = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        if (store.importData(content)) {
          alert('Import thành công!')
        } else {
          alert('Import thất bại!')
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}
</script>

<template>
  <div class="max-w-2xl mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-8">Cài đặt</h1>

    <div class="space-y-6">
      <!-- Appearance -->
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 class="text-lg font-semibold mb-4">Giao diện</h2>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-zinc-400">Theme</span>
            <select
              v-model="settings.theme"
              class="bg-zinc-800 text-zinc-100 rounded-lg px-3 py-1.5 text-sm outline-none border border-zinc-700"
            >
              <option value="dark">Tối</option>
              <option value="light">Sáng</option>
              <option value="system">Theo hệ thống</option>
            </select>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-zinc-400">Chế độ thu gọn</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.compactMode" class="sr-only peer" />
              <div
                class="w-11 h-6 bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"
              ></div>
            </label>
          </div>
        </div>
      </div>

      <!-- Notifications -->
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 class="text-lg font-semibold mb-4">Thông báo</h2>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-zinc-400">Cho phép thông báo</span>
            <button
              @click="requestNotification"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-semibold transition',
                settings.notifications
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700',
              ]"
            >
              {{ settings.notifications ? 'Đã bật' : 'Bật thông báo' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Data management -->
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 class="text-lg font-semibold mb-4">Dữ liệu</h2>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-zinc-400">Tự động lưu</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="settings.autoSave" class="sr-only peer" />
              <div
                class="w-11 h-6 bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"
              ></div>
            </label>
          </div>

          <div class="flex gap-2">
            <button
              @click="exportData('json')"
              class="flex-1 bg-violet-600 hover:bg-violet-500 text-white rounded-lg px-4 py-2 text-sm font-semibold transition"
            >
              Export JSON
            </button>
            <button
              @click="exportData('csv')"
              class="flex-1 bg-violet-600 hover:bg-violet-500 text-white rounded-lg px-4 py-2 text-sm font-semibold transition"
            >
              Export CSV
            </button>
            <button
              @click="exportData('markdown')"
              class="flex-1 bg-violet-600 hover:bg-violet-500 text-white rounded-lg px-4 py-2 text-sm font-semibold transition"
            >
              Export MD
            </button>
          </div>

          <button
            @click="importData"
            class="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg px-4 py-2 text-sm font-semibold transition"
          >
            Import JSON
          </button>

          <div class="flex gap-2">
            <button
              @click="store.undo"
              :disabled="store.historyIndex <= 0"
              class="flex-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-300 rounded-lg px-4 py-2 text-sm font-semibold transition"
            >
              Undo (⌘Z)
            </button>
            <button
              @click="store.redo"
              :disabled="store.historyIndex >= store.history.length - 1"
              class="flex-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-300 rounded-lg px-4 py-2 text-sm font-semibold transition"
            >
              Redo (⌘⇧Z)
            </button>
          </div>
        </div>
      </div>

      <!-- Keyboard shortcuts -->
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 class="text-lg font-semibold mb-4">Phím tắt</h2>

        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-zinc-400">Tìm kiếm</span>
            <kbd class="bg-zinc-800 px-2 py-0.5 rounded">⌘K</kbd>
          </div>
          <div class="flex justify-between">
            <span class="text-zinc-400">Thêm task mới</span>
            <kbd class="bg-zinc-800 px-2 py-0.5 rounded">⌘N</kbd>
          </div>
          <div class="flex justify-between">
            <span class="text-zinc-400">Undo</span>
            <kbd class="bg-zinc-800 px-2 py-0.5 rounded">⌘Z</kbd>
          </div>
          <div class="flex justify-between">
            <span class="text-zinc-400">Redo</span>
            <kbd class="bg-zinc-800 px-2 py-0.5 rounded">⌘⇧Z</kbd>
          </div>
          <div class="flex justify-between">
            <span class="text-zinc-400">Filter 1-3</span>
            <kbd class="bg-zinc-800 px-2 py-0.5 rounded">1-3</kbd>
          </div>
          <div class="flex justify-between">
            <span class="text-zinc-400">Đến thống kê</span>
            <kbd class="bg-zinc-800 px-2 py-0.5 rounded">G</kbd>
          </div>
          <div class="flex justify-between">
            <span class="text-zinc-400">Đến cài đặt</span>
            <kbd class="bg-zinc-800 px-2 py-0.5 rounded">S</kbd>
          </div>
          <div class="flex justify-between">
            <span class="text-zinc-400">Trợ giúp</span>
            <kbd class="bg-zinc-800 px-2 py-0.5 rounded">?</kbd>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
