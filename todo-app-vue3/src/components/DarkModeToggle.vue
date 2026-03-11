<template>
  <button
    @click="toggleDarkMode"
    class="dark-mode-toggle"
    :title="darkMode ? 'Chế độ sáng' : 'Chế độ tối'"
  >
    <span class="toggle-icon">{{ darkMode ? "☀️" : "🌙" }}</span>
    <span class="toggle-text">{{ darkMode ? "Sáng" : "Tối" }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useTodoStore } from "../stores/todoStore";

const todoStore = useTodoStore();

const darkMode = computed(() => todoStore.darkMode);

const toggleDarkMode = () => {
  todoStore.toggleDarkMode();
};
</script>

<style scoped>
.dark-mode-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #f1f3f5;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  color: #495057;
}

.dark-mode-toggle:hover {
  background: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.toggle-icon {
  font-size: 20px;
  line-height: 1;
}

.toggle-text {
  font-weight: 500;
}

/* Dark mode styles */
:global(.dark) .dark-mode-toggle {
  background: #2d3748;
  border-color: #4a5568;
  color: #e2e8f0;
}

:global(.dark) .dark-mode-toggle:hover {
  background: #4a5568;
}
</style>
