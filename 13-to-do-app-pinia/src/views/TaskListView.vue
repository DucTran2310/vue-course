<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTodoStore } from '@/stores/useTodoStore'
import TodoItem from '@/components/TodoItem.vue'
import type { Priority } from '@/types/todo'

const store = useTodoStore()
const { filteredTodos } = storeToRefs(store)
</script>

<template>
  <div class="max-w-lg mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold mb-6">
      {{ store.filter === 'active' ? 'Đang làm' : 'Đã hoàn thành' }}
    </h1>

    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <div v-if="filteredTodos.length === 0" class="py-16 text-center">
        <p class="text-zinc-600">Không có task nào</p>
      </div>

      <TransitionGroup name="list" tag="ul" class="divide-y divide-zinc-800/50">
        <TodoItem
          v-for="todo in filteredTodos"
          :key="todo.id"
          :todo="todo"
          @toggle="store.toggleTodo"
          @update="store.updateTodo"
          @delete="store.deleteTodo"
          @priority="(id, p) => store.updatePriority(id, p as Priority)"
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
