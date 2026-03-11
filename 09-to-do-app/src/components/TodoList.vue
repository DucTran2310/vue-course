<script setup>
import TodoItem from './TodoItem.vue'

defineProps({
  todos: { type: Array, required: true },
  filter: { type: String, required: true },
})

const emit = defineEmits(['toggle', 'delete', 'update'])
</script>

<template>
  <!-- TransitionGroup animate add/remove -->
  <TransitionGroup name="list" tag="ul" class="todo-list">
    <TodoItem
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @toggle="emit('toggle', $event)"
      @delete="emit('delete', $event)"
      @update="(id, text) => emit('update', id, text)"
    />
  </TransitionGroup>

  <!-- Empty state -->
  <div v-if="todos.length === 0" class="empty">
    <div class="empty-icon">{{ filter === 'done' ? '🎉' : '✦' }}</div>
    <p>
      {{
        filter === 'done'
          ? 'Chưa hoàn thành việc nào'
          : filter === 'active'
            ? 'Không có việc đang làm'
            : 'Danh sách trống'
      }}
    </p>
  </div>
</template>

<style scoped>
.todo-list {
  list-style: none;
  padding: 8px 0;
  min-height: 60px;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 40px 28px;
  color: #b8ad9e;
  font-size: 14px;
}
.empty-icon {
  font-size: 28px;
}

/* TransitionGroup */
.list-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.list-leave-active {
  transition: all 0.2s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.97);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.list-move {
  transition: transform 0.3s ease;
}
</style>
