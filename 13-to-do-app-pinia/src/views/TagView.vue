<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTodoStore } from '@/stores/useTodoStore'
import TodoItem from '@/components/TodoItem.vue'
import type { Priority } from '@/types/todo'

const route = useRoute()
const router = useRouter()
const store = useTodoStore()

const tag = route.params.tag as string

const todosWithTag = computed(() => {
  return store.todos.filter((t) => t.tags.includes(tag))
})

if (todosWithTag.value.length === 0) {
  router.push('/')
}
</script>

<template>
  <div class="max-w-lg mx-auto py-8 px-4">
    <div class="flex items-center gap-3 mb-6">
      <button @click="router.back()" class="text-zinc-600 hover:text-zinc-400">← Quay lại</button>
      <h1 class="text-2xl font-bold">
        #{{ tag }}
        <span class="text-sm text-zinc-600 font-normal ml-2">
          ({{ todosWithTag.length }} tasks)
        </span>
      </h1>
    </div>

    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <TransitionGroup name="list" tag="ul" class="divide-y divide-zinc-800/50">
        <TodoItem
          v-for="todo in todosWithTag"
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
