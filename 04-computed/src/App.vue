<template>
  <div class="todo-app">
    <h3>Todo List</h3>

    <div class="bulk-actions">
      <label>
        <input type="checkbox" v-model="allTodosCompleted" />
        Chọn/Bỏ chọn tất cả
      </label>

      <div>
        <span>Tiến độ: {{ completionProgress }}%</span>
        <input type="range" v-model="completionProgress" min="0" max="100" step="5" />
      </div>
    </div>

    <div v-for="todo in todos" :key="todo.id" class="todo-item">
      <input type="checkbox" v-model="todo.completed" />
      <input type="text" v-model="todo.text" :class="{ completed: todo.completed }" />
      <button @click="removeTodo(todo.id)">Xóa</button>
    </div>

    <div class="add-todo">
      <input v-model="newTodoText" @keyup.enter="addTodo" placeholder="Thêm công việc mới..." />
      <button @click="addTodo">Thêm</button>
    </div>

    <div class="stats">
      <p>Tổng số: {{ todos.length }}</p>
      <p>Đã hoàn thành: {{ completedCount }}</p>
      <p>Chưa hoàn thành: {{ pendingCount }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const todos = ref([
  { id: 1, text: 'Học Vue 3', completed: false },
  { id: 2, text: 'Làm bài tập', completed: true },
  { id: 3, text: 'Đọc sách', completed: false },
])

const newTodoText = ref('')

// Writable computed cho "Chọn tất cả"
const allTodosCompleted = computed({
  get() {
    return todos.value.length > 0 && todos.value.every((todo) => todo.completed)
  },
  set(newValue) {
    // Khi checkbox "Chọn tất cả" thay đổi
    todos.value.forEach((todo) => {
      todo.completed = newValue
    })
  },
})

// Writable computed cho tiến độ hoàn thành
const completionProgress = computed({
  get() {
    if (todos.value.length === 0) return 0
    const completed = todos.value.filter((todo) => todo.completed).length
    return Math.round((completed / todos.value.length) * 100)
  },
  set(newProgress) {
    // Khi kéo thanh progress, tự động đánh dấu hoàn thành cho đủ số lượng
    const targetCompleted = Math.round((newProgress / 100) * todos.value.length)
    let completed = 0

    // Sắp xếp todos: những todo chưa hoàn thành lên trước
    const sortedTodos = [...todos.value].sort((a, b) => {
      if (a.completed === b.completed) return 0
      return a.completed ? 1 : -1
    })

    sortedTodos.forEach((todo) => {
      todo.completed = completed < targetCompleted
      if (todo.completed) completed++
    })
  },
})

// Read-only computed properties
const completedCount = computed(() => {
  return todos.value.filter((todo) => todo.completed).length
})

const pendingCount = computed(() => {
  return todos.value.filter((todo) => !todo.completed).length
})

// Methods
const addTodo = () => {
  if (newTodoText.value.trim()) {
    todos.value.push({
      id: Date.now(),
      text: newTodoText.value,
      completed: false,
    })
    newTodoText.value = ''
  }
}

const removeTodo = (id) => {
  const index = todos.value.findIndex((todo) => todo.id === id)
  if (index !== -1) {
    todos.value.splice(index, 1)
  }
}
</script>

<style scoped>
.todo-app {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.bulk-actions {
  background: #f0f0f0;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  padding: 8px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.todo-item input[type='text'] {
  flex: 1;
  padding: 5px;
  border: 1px solid transparent;
}

.todo-item input[type='text']:hover,
.todo-item input[type='text']:focus {
  border-color: #ddd;
}

.todo-item input[type='text'].completed {
  text-decoration: line-through;
  color: #999;
}

.add-todo {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

.add-todo input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.stats {
  display: flex;
  justify-content: space-around;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 4px;
}

button {
  padding: 5px 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}
</style>
