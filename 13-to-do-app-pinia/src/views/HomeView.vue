<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTodoStore } from '@/stores/useTodoStore'
import type { Priority } from '@/types/todo'
import TodoInput from '@/components/TodoInput.vue'
import TodoItem from '@/components/TodoItem.vue'
import TodoStats from '@/components/TodoStats.vue'
import TodoFilters from '@/components/TodoFilters.vue'
import TodoCategorySelector from '@/components/TodoCategorySelector.vue'

const store = useTodoStore()

const {
  filter,
  sort,
  search,
  selectedTags,
  filteredTodos,
  stats,
  allTags,
  categories,
  selectedCategory,
} = storeToRefs(store)

const {
  addTodo,
  toggleTodo,
  updateTodo,
  updatePriority,
  deleteTodo,
  clearDone,
  toggleTag,
  updateCategory,
} = store
</script>

<template>
  <div class="max-w-lg mx-auto py-8 px-4 space-y-5">
    <!-- Header -->
    <header class="flex items-start justify-between">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <div class="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          <span class="text-zinc-500 text-xs tracking-widest uppercase">Workspace</span>
        </div>
        <h1 class="text-3xl font-bold tracking-tight">
          My Tasks
          <span class="text-violet-500">.</span>
        </h1>
      </div>
      <div class="text-right">
        <div class="text-3xl font-bold text-zinc-700">{{ stats.active }}</div>
        <div class="text-zinc-600 text-xs">việc còn lại</div>
      </div>
    </header>

    <!-- Stats -->
    <TodoStats :stats="stats" />

    <!-- Input -->
    <TodoInput @add="addTodo" />

    <!-- Category selector -->
    <TodoCategorySelector
      :categories="categories"
      :selected-category="selectedCategory"
      @update:selected-category="store.selectedCategory = $event"
    />

    <!-- Filters -->
    <TodoFilters
      v-model:filter="filter"
      v-model:sort="sort"
      v-model:search="search"
      :all-tags="allTags"
      :selected-tags="selectedTags"
      :active-count="stats.active"
      :done-count="stats.done"
      :total-count="stats.total"
      @toggle-tag="toggleTag"
      @clear-done="clearDone"
    />

    <!-- List -->
    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <!-- Empty state -->
      <div
        v-if="filteredTodos.length === 0"
        class="flex flex-col items-center justify-center py-16 text-center"
      >
        <div class="text-4xl mb-3">
          {{ filter === 'done' ? '🎉' : search ? '🔍' : '✦' }}
        </div>
        <p class="text-zinc-600 text-sm">
          {{
            filter === 'done'
              ? 'Chưa có việc nào hoàn thành'
              : search
                ? `Không tìm thấy "${search}"`
                : 'Danh sách trống — thêm việc mới thôi!'
          }}
        </p>
      </div>

      <!-- Todo list with TransitionGroup -->
      <TransitionGroup name="list" tag="ul" class="divide-y divide-zinc-800/50">
        <TodoItem
          v-for="todo in filteredTodos"
          :key="todo.id"
          :todo="todo"
          @toggle="toggleTodo"
          @update="updateTodo"
          @delete="deleteTodo"
          @priority="(id, p) => updatePriority(id, p as Priority)"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<style>
.list-enter-active {
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.list-leave-active {
  transition: all 0.2s ease;
  position: absolute;
  width: 100%;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-16px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(16px);
}
.list-move {
  transition: transform 0.3s ease;
}
</style>
