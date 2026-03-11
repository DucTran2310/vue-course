<template>
  <div class="todo-search">
    <div class="search-input-wrapper">
      <span class="search-icon">🔍</span>
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Tìm kiếm công việc..."
        class="search-input"
      />
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="clear-search"
        title="Xóa tìm kiếm"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useTodoStore } from "../stores/todoStore";

const todoStore = useTodoStore();

const searchQuery = computed({
  get: () => todoStore.searchQuery,
  set: (value) => todoStore.setSearch(value),
});

const clearSearch = () => {
  searchQuery.value = "";
};
</script>

<style scoped>
.todo-search {
  margin-bottom: 20px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #868e96;
  font-size: 18px;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 40px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s;
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.clear-search {
  position: absolute;
  right: 12px;
  padding: 4px 8px;
  background: #e9ecef;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  color: #495057;
  transition: all 0.2s;
}

.clear-search:hover {
  background: #dee2e6;
  color: #212529;
}

/* Dark mode styles */
:global(.dark) .search-input {
  background: #2d3748;
  border-color: #4a5568;
  color: #e2e8f0;
}

:global(.dark) .search-input:focus {
  border-color: #667eea;
}

:global(.dark) .clear-search {
  background: #4a5568;
  color: #cbd5e0;
}

:global(.dark) .clear-search:hover {
  background: #2d3748;
  color: #e2e8f0;
}
</style>
