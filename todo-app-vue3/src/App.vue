<template>
  <div class="container">
    <!-- Header with title and dark mode toggle -->
    <div class="app-header">
      <h1>📝 Todo App với Vue 3 + TypeScript + Pinia</h1>
      <DarkModeToggle />
    </div>

    <!-- Progress bar -->
    <ProgressBar />

    <!-- Search -->
    <TodoSearch />

    <!-- Form thêm todo -->
    <TodoForm />

    <!-- Overdue warning -->
    <div v-if="todoStore.overdueTodos.length > 0" class="overdue-warning">
      ⚠️ Bạn có {{ todoStore.overdueTodos.length }} công việc quá hạn!
    </div>

    <!-- Danh sách todo -->
    <div v-if="todoStore.filteredTodos.length > 0" class="todo-list">
      <transition-group name="list">
        <TodoItem
          v-for="todo in todoStore.filteredTodos"
          :key="todo.id"
          :todo="todo"
        />
      </transition-group>
    </div>

    <!-- Thông báo khi không có todo -->
    <div v-else class="empty-state">
      <p>Không có công việc nào!</p>
      <p class="empty-sub">
        {{
          todoStore.searchQuery
            ? "Thử tìm kiếm với từ khóa khác."
            : "Hãy thêm công việc mới để bắt đầu."
        }}
      </p>
    </div>

    <!-- Import/Export -->
    <div class="import-export-section">
      <ImportExport />
    </div>

    <!-- Filter component -->
    <TodoFilter />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import TodoForm from "./components/TodoForm.vue";
import TodoItem from "./components/TodoItem.vue";
import TodoFilter from "./components/TodoFilter.vue";
import TodoSearch from "./components/TodoSearch.vue";
import ProgressBar from "./components/ProgressBar.vue";
import DarkModeToggle from "./components/DarkModeToggle.vue";
import ImportExport from "./components/ImportExport.vue";
import { useTodoStore } from "./stores/todoStore";

// Sử dụng store
const todoStore = useTodoStore();

// Lifecycle hook
onMounted(() => {
  // Thêm dữ liệu mẫu khi khởi tạo (chỉ khi chưa có dữ liệu)
  if (todoStore.todos.length === 0) {
    const categories = todoStore.categories;
    const workCategory = categories.find((c) => c.name === "Công việc");
    const studyCategory = categories.find((c) => c.name === "Học tập");

    // Tạo công việc mẫu với các tính năng mới
    const now = new Date();

    todoStore.addTodo(
      "Học Vue 3 cơ bản",
      "high",
      new Date(now.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
      workCategory?.id,
      "Học về Composition API, Reactivity và Lifecycle Hooks",
    );

    todoStore.addTodo(
      "Tìm hiểu về TypeScript",
      "medium",
      new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // Day after
      studyCategory?.id,
      "Kiểu dữ liệu, Interfaces, Generics",
    );

    todoStore.addTodo(
      "Thực hành với Pinia",
      "low",
      new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      studyCategory?.id,
    );

    // Một công việc đã hoàn thành
    const firstTodo = todoStore.todos[0];
    if (firstTodo) {
      todoStore.toggleTodo(firstTodo.id);
    }

    // Một công việc quá hạn
    todoStore.addTodo(
      "Đã quá hạn: Làm bài tập cũ",
      "medium",
      new Date(now.getTime() - 24 * 60 * 60 * 1000), // Yesterday
      workCategory?.id,
      "Bài tập này đã quá hạn rồi!",
    );
  }
});
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

h1 {
  margin: 0;
  font-size: 24px;
  color: #2d3748;
}

.todo-list {
  margin-top: 20px;
  min-height: 200px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 5px;
}

.todo-list::-webkit-scrollbar {
  width: 6px;
}

.todo-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.todo-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.todo-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.overdue-warning {
  padding: 12px 16px;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  color: #856404;
  font-weight: 500;
  margin-bottom: 15px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #868e96;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 20px;
}

.empty-state p {
  font-size: 18px;
  margin-bottom: 10px;
}

.empty-sub {
  font-size: 14px;
  opacity: 0.7;
}

.import-export-section {
  margin: 30px 0;
  display: flex;
  justify-content: center;
}

/* Animation cho list transition */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-active {
  position: absolute;
  width: 100%;
}

.list-move {
  transition: transform 0.5s;
}

/* Dark mode styles */
:global(.dark) h1 {
  color: #e2e8f0;
}

:global(.dark) .todo-list::-webkit-scrollbar-track {
  background: #2d3748;
}

:global(.dark) .todo-list::-webkit-scrollbar-thumb {
  background: #4a5568;
}

:global(.dark) .overdue-warning {
  background: #744210;
  border-color: #b7791f;
  color: #fef3c7;
}

:global(.dark) .empty-state {
  background: #2d3748;
}

:global(.dark) .empty-state p,
:global(.dark) .empty-sub {
  color: #a0aec0;
}
</style>
