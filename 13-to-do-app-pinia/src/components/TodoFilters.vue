<script setup lang="ts">
import type { FilterType, SortType } from '@/types/todo'

defineProps<{
  filter: FilterType
  sort: SortType
  search: string
  allTags: string[]
  selectedTags: string[]
  activeCount: number
  doneCount: number
  totalCount: number
}>()

const emit = defineEmits<{
  'update:filter': [value: FilterType]
  'update:sort': [value: SortType]
  'update:search': [value: string]
  'toggle-tag': [tag: string]
  'clear-done': []
}>()

const filters: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'active', label: 'Đang làm' },
  { key: 'done', label: 'Xong' },
]

const sorts: { key: SortType; label: string }[] = [
  { key: 'created', label: 'Mới nhất' },
  { key: 'priority', label: 'Ưu tiên' },
  { key: 'alpha', label: 'A → Z' },
]
</script>

<template>
  <div class="space-y-3">
    <!-- Search -->
    <div class="relative">
      <svg
        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        :value="search"
        @input="emit('update:search', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="Tìm kiếm... (⌘K)"
        class="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 placeholder-zinc-600 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-violet-500 transition-colors"
      />
    </div>

    <!-- Filter tabs + Sort -->
    <div class="flex items-center justify-between gap-2">
      <!-- Filter tabs -->
      <div class="flex bg-zinc-900 rounded-xl p-0.5 gap-0.5 border border-zinc-800">
        <button
          v-for="f in filters"
          :key="f.key"
          @click="emit('update:filter', f.key)"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
            filter === f.key ? 'bg-violet-600 text-white' : 'text-zinc-500 hover:text-zinc-300',
          ]"
        >
          {{ f.label }}
          <span v-if="f.key === 'active' && activeCount" class="ml-1 opacity-70">{{
            activeCount
          }}</span>
          <span v-if="f.key === 'done' && doneCount" class="ml-1 opacity-70">{{ doneCount }}</span>
          <span v-if="f.key === 'all' && totalCount" class="ml-1 opacity-70">{{ totalCount }}</span>
        </button>
      </div>

      <!-- Sort select -->
      <select
        :value="sort"
        @change="emit('update:sort', ($event.target as HTMLSelectElement).value as SortType)"
        class="bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs rounded-xl px-3 py-2 outline-none focus:border-violet-500 transition-colors cursor-pointer"
      >
        <option v-for="s in sorts" :key="s.key" :value="s.key">
          {{ s.label }}
        </option>
      </select>
    </div>

    <!-- Tag filters -->
    <div v-if="allTags.length" class="flex gap-1.5 flex-wrap">
      <button
        v-for="tag in allTags"
        :key="tag"
        @click="emit('toggle-tag', tag)"
        :class="[
          'text-xs px-2.5 py-1 rounded-full border transition-all',
          selectedTags.includes(tag)
            ? 'border-violet-500 text-violet-300 bg-violet-500/10'
            : 'border-zinc-700 text-zinc-500 hover:border-zinc-600',
        ]"
      >
        #{{ tag }}
      </button>
    </div>

    <!-- Clear done -->
    <button
      v-if="doneCount > 0"
      @click="emit('clear-done')"
      class="text-xs text-zinc-600 hover:text-rose-400 transition-colors cursor-pointer"
    >
      Xóa {{ doneCount }} việc đã xong
    </button>
  </div>
</template>
