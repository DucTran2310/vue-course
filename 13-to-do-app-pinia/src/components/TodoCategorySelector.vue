<script setup lang="ts">
import type { TodoCategory } from '@/stores/useTodoStore'

defineProps<{
  categories: TodoCategory[]
  selectedCategory: string | null
}>()

const emit = defineEmits<{
  'update:selectedCategory': [value: string | null]
}>()
</script>

<template>
  <div class="flex gap-1.5 flex-wrap">
    <button
      @click="emit('update:selectedCategory', null)"
      :class="[
        'text-xs px-3 py-1.5 rounded-lg border transition-all',
        selectedCategory === null
          ? 'border-violet-500 text-violet-300 bg-violet-500/10'
          : 'border-zinc-700 text-zinc-500 hover:border-zinc-600',
      ]"
    >
      Tất cả
    </button>
    <button
      v-for="cat in categories"
      :key="cat.id"
      @click="emit('update:selectedCategory', cat.id)"
      :class="[
        'text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1',
        selectedCategory === cat.id
          ? 'border-violet-500 text-violet-300 bg-violet-500/10'
          : 'border-zinc-700 text-zinc-500 hover:border-zinc-600',
      ]"
    >
      <span>{{ cat.icon }}</span>
      {{ cat.name }}
    </button>
  </div>
</template>
