<template>
  <div class="todo-filter">
    <!-- Filter buttons -->
    <div class="filter-buttons">
      <button
        v-for="option in filterOptions"
        :key="option.value"
        @click="todoStore.setFilter(option.value)"
        :class="{ active: todoStore.filter === option.value }"
        class="filter-btn"
      >
        {{ option.label }}
        <span class="count" v-if="getCount(option.value) > 0">
          {{ getCount(option.value) }}
        </span>
      </button>
    </div>

    <!-- Sort options -->
    <div class="sort-options">
      <label class="sort-label">Sắp xếp theo:</label>
      <select v-model="sortBy" class="sort-select">
        <option value="date">🕐 Mới nhất</option>
        <option value="priority">🎯 Mức độ ưu tiên</option>
        <option value="dueDate">📅 Hạn hoàn thành</option>
        <option value="name">🔤 Tên</option>
      </select>
    </div>

    <!-- Stats -->
    <div class="todo-stats">
      <span class="stats-item"> 📝 Tổng: {{ todoStore.totalCount }} </span>
      <span class="stats-item">
        ✅ Hoàn thành: {{ todoStore.completedCount }}
      </span>
      <span class="stats-item">
        ⏳ Chưa xong: {{ todoStore.activeCount }}
      </span>
    </div>

    <!-- Action buttons -->
    <div class="filter-actions">
      <button
        v-if="todoStore.completedCount > 0"
        @click="handleClearCompleted"
        class="btn-clear"
      >
        🗑️ Xóa công việc đã hoàn thành
      </button>
      <button
        v-if="todoStore.totalCount > 0"
        @click="handleClearAll"
        class="btn-clear-all"
      >
        ⚠️ Xóa tất cả
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useTodoStore } from "../stores/todoStore";
import type { FilterType, SortType } from "../types/todo";

const todoStore = useTodoStore();

// Filter options
const filterOptions: { value: FilterType; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "active", label: "Chưa xong" },
  { value: "completed", label: "Đã xong" },
];

// Sort by computed
const sortBy = computed({
  get: () => todoStore.sortBy,
  set: (value: SortType) => todoStore.setSort(value),
});

// Helper function
const getCount = (filter: FilterType): number => {
  switch (filter) {
    case "all":
      return todoStore.totalCount;
    case "active":
      return todoStore.activeCount;
    case "completed":
      return todoStore.completedCount;
    default:
      return 0;
  }
};

const handleClearCompleted = () => {
  if (confirm("Bạn có chắc muốn xóa tất cả công việc đã hoàn thành?")) {
    todoStore.clearCompleted();
  }
};

const handleClearAll = () => {
  todoStore.clearAll();
};
</script>

<style scoped>
.todo-filter {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #e9ecef;
}

.filter-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 10px 20px;
  background: #f1f3f5;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.filter-btn:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.filter-btn.active {
  background: #667eea;
  color: white;
  box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
}

.count {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.sort-label {
  font-weight: 600;
  color: #495057;
  font-size: 14px;
}

.sort-select {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.sort-select:hover {
  border-color: #667eea;
}

.sort-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.todo-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 14px;
  flex-wrap: wrap;
}

.stats-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
  color: #495057;
}

.filter-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-clear,
.btn-clear-all {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  min-width: 200px;
}

.btn-clear {
  background: #dc3545;
  color: white;
}

.btn-clear:hover {
  background: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(220, 53, 69, 0.3);
}

.btn-clear-all {
  background: #868e96;
  color: white;
}

.btn-clear-all:hover {
  background: #495057;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(134, 142, 156, 0.3);
}

/* Dark mode styles */
:global(.dark) .todo-filter {
  border-top-color: #4a5568;
}

:global(.dark) .filter-btn {
  background: #2d3748;
  color: #e2e8f0;
}

:global(.dark) .filter-btn:hover {
  background: #4a5568;
}

:global(.dark) .filter-btn.active {
  background: #667eea;
  color: white;
}

:global(.dark) .sort-options,
:global(.dark) .todo-stats {
  background: #2d3748;
}

:global(.dark) .sort-label,
:global(.dark) .stats-item {
  color: #e2e8f0;
}

:global(.dark) .sort-select {
  background: #1a202c;
  border-color: #4a5568;
  color: #e2e8f0;
}

:global(.dark) .sort-select:hover,
:global(.dark) .sort-select:focus {
  border-color: #667eea;
}
</style>
