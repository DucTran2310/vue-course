<template>
  <li
    class="todo-item"
    :class="{
      completed: todo.completed,
      overdue: isOverdue,
      ['priority-' + todo.priority]: true,
    }"
  >
    <div class="todo-content">
      <input
        type="checkbox"
        :checked="todo.completed"
        @change="handleToggle"
        class="todo-checkbox"
      />

      <div class="todo-main-info">
        <!-- Priority badge -->
        <span class="priority-badge" :class="todo.priority">
          {{ priorityLabel }}
        </span>

        <!-- Category badge -->
        <span
          v-if="category"
          class="category-badge"
          :style="{ backgroundColor: category.color }"
        >
          {{ category.name }}
        </span>

        <!-- Todo text -->
        <div v-if="!isEditing" class="todo-text" @dblclick="startEditing">
          {{ todo.text }}
        </div>

        <input
          v-else
          type="text"
          v-model="editText"
          @blur="saveEdit"
          @keyup.enter="saveEdit"
          @keyup.esc="cancelEdit"
          ref="editInput"
          class="todo-edit-input"
        />
      </div>

      <!-- Due date -->
      <div v-if="todo.dueDate" class="todo-due-date">
        <span :class="{ 'date-overdue': isOverdue }">
          📅 {{ formatDate(todo.dueDate) }}
          <span v-if="isOverdue" class="overdue-badge">(Quá hạn)</span>
        </span>
      </div>

      <!-- Description -->
      <div v-if="todo.description && !isEditing" class="todo-description">
        {{ todo.description }}
      </div>
    </div>

    <div class="todo-actions">
      <button
        v-if="!isEditing"
        @click="startEditing"
        class="btn-edit"
        title="Sửa"
      >
        ✏️
      </button>
      <button @click="handleDelete" class="btn-delete" title="Xóa">🗑️</button>
    </div>
  </li>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import type { Todo, Priority } from "../types/todo";
import { useTodoStore } from "../stores/todoStore";

// Props
const props = defineProps<{
  todo: Todo;
}>();

// Store
const todoStore = useTodoStore();

// State
const isEditing = ref(false);
const editText = ref(props.todo.text);
const editInput = ref<HTMLInputElement | null>(null);

// Computed
const category = computed(() => {
  return props.todo.category
    ? todoStore.categories.find((c) => c.id === props.todo.category)
    : null;
});

const priorityLabel = computed(() => {
  const labels: Record<Priority, string> = {
    high: "Cao",
    medium: "TB",
    low: "Thấp",
  };
  return labels[props.todo.priority];
});

const isOverdue = computed(() => {
  if (!props.todo.dueDate || props.todo.completed) return false;
  return new Date(props.todo.dueDate) < new Date();
});

// Methods
const handleToggle = () => {
  todoStore.toggleTodo(props.todo.id);
};

const handleDelete = () => {
  if (confirm("Bạn có chắc muốn xóa công việc này?")) {
    todoStore.deleteTodo(props.todo.id);
  }
};

const startEditing = async () => {
  isEditing.value = true;
  editText.value = props.todo.text;

  // Đợi DOM cập nhật rồi focus vào input
  await nextTick();
  editInput.value?.focus();
};

const saveEdit = () => {
  if (editText.value.trim() && editText.value !== props.todo.text) {
    todoStore.updateTodoText(props.todo.id, editText.value);
  }
  isEditing.value = false;
};

const cancelEdit = () => {
  isEditing.value = false;
  editText.value = props.todo.text;
};

const formatDate = (date: Date) => {
  const d = new Date(date);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style scoped>
.todo-item {
  display: flex;
  flex-direction: column;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: all 0.3s;
  animation: slideIn 0.3s ease;
  border-left: 4px solid transparent;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.todo-item:hover {
  background: #f1f3f5;
  transform: translateX(5px);
}

.todo-item.completed {
  opacity: 0.7;
  background: #e9ecef;
}

.todo-item.overdue {
  border-left-color: #dc3545;
}

.todo-item.completed.overdue {
  border-left-color: #28a745;
}

/* Priority colors */
.todo-item.priority-high {
  border-left-color: #dc3545;
}

.todo-item.priority-medium {
  border-left-color: #ffc107;
}

.todo-item.priority-low {
  border-left-color: #28a745;
}

.todo-item.completed.priority-high,
.todo-item.completed.priority-medium,
.todo-item.completed.priority-low {
  border-left-color: #6c757d;
}

.todo-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.todo-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-right: 10px;
}

.todo-main-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.priority-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
}

.priority-badge.high {
  background: #dc3545;
  color: white;
}

.priority-badge.medium {
  background: #ffc107;
  color: #333;
}

.priority-badge.low {
  background: #28a745;
  color: white;
}

.category-badge {
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  white-space: nowrap;
}

.todo-text {
  font-size: 16px;
  color: #333;
  cursor: pointer;
  word-break: break-word;
  flex: 1;
  min-width: 0;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: #868e96;
}

.todo-edit-input {
  flex: 1;
  padding: 8px;
  border: 2px solid #667eea;
  border-radius: 3px;
  font-size: 16px;
  background: white;
  min-width: 200px;
}

.todo-edit-input:focus {
  outline: none;
}

.todo-due-date {
  font-size: 13px;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 5px;
  padding-left: 30px;
}

.todo-due-date .date-overdue {
  color: #dc3545;
  font-weight: 600;
}

.overdue-badge {
  background: #dc3545;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
}

.todo-description {
  font-size: 14px;
  color: #6c757d;
  padding-left: 30px;
  font-style: italic;
}

.todo-actions {
  display: flex;
  gap: 5px;
  margin-top: 10px;
  align-self: flex-end;
}

.btn-edit,
.btn-delete {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-edit {
  background: #ffd43b;
  color: #333;
}

.btn-edit:hover {
  background: #fcc419;
  transform: scale(1.05);
}

.btn-delete {
  background: #ff6b6b;
  color: white;
}

.btn-delete:hover {
  background: #fa5252;
  transform: scale(1.05);
}

/* Dark mode styles */
:global(.dark) .todo-item {
  background: #2d3748;
}

:global(.dark) .todo-item:hover {
  background: #4a5568;
}

:global(.dark) .todo-item.completed {
  background: #1a202c;
}

:global(.dark) .todo-text {
  color: #e2e8f0;
}

:global(.dark) .todo-item.completed .todo-text {
  color: #a0aec0;
}

:global(.dark) .todo-edit-input {
  background: #1a202c;
  color: #e2e8f0;
  border-color: #667eea;
}

:global(.dark) .todo-due-date {
  color: #cbd5e0;
}

:global(.dark) .todo-description {
  color: #a0aec0;
}
</style>
