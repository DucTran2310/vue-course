<template>
  <form @submit.prevent="handleSubmit" class="todo-form">
    <input
      type="text"
      v-model="newTodo"
      placeholder="Thêm công việc mới..."
      class="todo-input"
      ref="inputRef"
    />
    <button type="submit" class="btn-add" :disabled="!newTodo.trim()">
      Thêm
    </button>
  </form>

  <!-- Additional options -->
  <div class="todo-options">
    <button
      @click="showOptions = !showOptions"
      class="btn-toggle-options"
      type="button"
    >
      {{ showOptions ? "▼ Thu gọn" : "▼ Tuỳ chọn thêm" }}
    </button>

    <div v-if="showOptions" class="options-content">
      <div class="option-group">
        <label>Mức độ ưu tiên:</label>
        <select v-model="priority" class="option-select">
          <option value="low">Thấp 🟢</option>
          <option value="medium">Trung bình 🟡</option>
          <option value="high">Cao 🔴</option>
        </select>
      </div>

      <div class="option-group">
        <label>Hạn hoàn thành:</label>
        <input type="datetime-local" v-model="dueDate" class="option-input" />
      </div>

      <div class="option-group">
        <label>Danh mục:</label>
        <select v-model="selectedCategory" class="option-select">
          <option :value="undefined">Không có</option>
          <option
            v-for="category in todoStore.categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="option-group">
        <label>Mô tả:</label>
        <textarea
          v-model="description"
          placeholder="Thêm mô tả chi tiết..."
          class="option-textarea"
          rows="2"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useTodoStore } from "../stores/todoStore";
import type { Priority } from "../types/todo";

// Sử dụng store
const todoStore = useTodoStore();

// Reactive data
const newTodo = ref("");
const priority = ref<Priority>("medium");
const dueDate = ref("");
const selectedCategory = ref<number | undefined>(undefined);
const description = ref("");
const showOptions = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

// Methods
const handleSubmit = () => {
  if (newTodo.value.trim()) {
    const dueDateObj = dueDate.value ? new Date(dueDate.value) : undefined;

    todoStore.addTodo(
      newTodo.value,
      priority.value,
      dueDateObj,
      selectedCategory.value,
      description.value || undefined,
    );

    // Reset form
    newTodo.value = "";
    description.value = "";
    priority.value = "medium";
    dueDate.value = "";
    selectedCategory.value = undefined;

    // Focus lại input sau khi thêm
    inputRef.value?.focus();
  }
};
</script>

<style scoped>
.todo-form {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.todo-input {
  flex: 1;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.todo-input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-add {
  padding: 12px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-add:hover:not(:disabled) {
  background: #5a67d8;
}

.btn-add:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
}

.todo-options {
  margin-bottom: 20px;
}

.btn-toggle-options {
  width: 100%;
  padding: 8px;
  background: #f1f3f5;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
  color: #495057;
}

.btn-toggle-options:hover {
  background: #e9ecef;
}

.options-content {
  margin-top: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 5px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.option-group {
  margin-bottom: 15px;
}

.option-group:last-child {
  margin-bottom: 0;
}

.option-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #495057;
  font-size: 14px;
}

.option-select,
.option-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  font-size: 14px;
  background: white;
}

.option-select:focus,
.option-input:focus {
  outline: none;
  border-color: #667eea;
}

.option-textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  background: white;
}

.option-textarea:focus {
  outline: none;
  border-color: #667eea;
}

/* Dark mode styles */
:global(.dark) .todo-input {
  background: #2d3748;
  border-color: #4a5568;
  color: #e2e8f0;
}

:global(.dark) .todo-input:focus {
  border-color: #667eea;
}

:global(.dark) .btn-toggle-options {
  background: #2d3748;
  color: #e2e8f0;
}

:global(.dark) .btn-toggle-options:hover {
  background: #4a5568;
}

:global(.dark) .options-content {
  background: #2d3748;
}

:global(.dark) .option-group label {
  color: #e2e8f0;
}

:global(.dark) .option-select,
:global(.dark) .option-input,
:global(.dark) .option-textarea {
  background: #1a202c;
  border-color: #4a5568;
  color: #e2e8f0;
}

:global(.dark) .option-select:focus,
:global(.dark) .option-input:focus,
:global(.dark) .option-textarea:focus {
  border-color: #667eea;
}
</style>
