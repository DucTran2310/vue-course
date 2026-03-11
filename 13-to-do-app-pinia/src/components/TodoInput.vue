<script setup lang="ts">
import { ref } from 'vue'
import type { Priority } from '@/types/todo'
import { vFocus } from '@/directives/vFocus'

const emit = defineEmits<{
  add: [text: string, priority: Priority, tags: string[]]
}>()

const text = ref('')
const priority = ref<Priority>('medium')
const tagInput = ref('')
const tags = ref<string[]>([])
const isExpanded = ref(false)

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  high: { label: 'Cao', color: 'text-rose-400' },
  medium: { label: 'TB', color: 'text-amber-400' },
  low: { label: 'Thấp', color: 'text-emerald-400' },
}

const addTag = () => {
  const t = tagInput.value.trim().toLowerCase()
  if (t && !tags.value.includes(t)) tags.value.push(t)
  tagInput.value = ''
}

const removeTag = (tag: string) => {
  tags.value = tags.value.filter((t) => t !== tag)
}

const handleSubmit = () => {
  if (!text.value.trim()) return
  emit('add', text.value, priority.value, [...tags.value])
  text.value = ''
  tags.value = []
  priority.value = 'medium'
  isExpanded.value = false
}
</script>

<template>
  <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
    <!-- Main input row -->
    <div class="flex gap-2">
      <input
        v-focus
        v-model="text"
        type="text"
        placeholder="Thêm việc mới... (⌘N)"
        class="flex-1 bg-zinc-800 text-zinc-100 placeholder-zinc-600 rounded-xl px-4 py-2.5 text-sm outline-none border border-transparent focus:border-violet-500 transition-colors"
        @keyup.enter="handleSubmit"
        @focus="isExpanded = true"
      />
      <button
        @click="handleSubmit"
        :disabled="!text.trim()"
        class="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition-all hover:scale-105 active:scale-95"
      >
        + Thêm
      </button>
    </div>

    <!-- Expanded options -->
    <Transition name="expand">
      <div v-if="isExpanded" class="space-y-3 pt-1">
        <!-- Priority selector -->
        <div class="flex gap-2 items-center">
          <span class="text-zinc-500 text-xs">Độ ưu tiên:</span>
          <button
            v-for="(cfg, key) in PRIORITY_CONFIG"
            :key="key"
            @click="priority = key"
            :class="[
              'px-3 py-1 rounded-lg text-xs font-semibold border transition-all',
              priority === key
                ? 'border-current bg-current/10 ' + cfg.color
                : 'border-zinc-700 text-zinc-500 hover:border-zinc-500',
            ]"
          >
            {{ cfg.label }}
          </button>
        </div>

        <!-- Tag input -->
        <div class="flex gap-2 flex-wrap items-center">
          <span class="text-zinc-500 text-xs">Tags:</span>
          <span
            v-for="tag in tags"
            :key="tag"
            class="flex items-center gap-1 bg-violet-500/20 text-violet-300 text-xs px-2 py-0.5 rounded-full"
          >
            #{{ tag }}
            <button @click="removeTag(tag)" class="hover:text-white">×</button>
          </span>
          <input
            v-model="tagInput"
            placeholder="Nhập tag..."
            class="bg-zinc-800 text-zinc-300 text-xs rounded-lg px-2 py-1 outline-none border border-zinc-700 focus:border-violet-500 w-28 transition-colors"
            @keyup.enter="addTag"
            @keyup.comma="addTag"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.expand-enter-to,
.expand-leave-from {
  max-height: 200px;
}
</style>
