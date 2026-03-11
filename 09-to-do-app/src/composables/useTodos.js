import { computed, ref } from 'vue'

// Đặt ngoài function → state tồn tại xuyên suốt app (shared state)
const todos = ref([
  { id: 1, text: 'Học Vue 3 Composition API', done: true, priority: 'high' },
  { id: 2, text: 'Xây dựng Todo App đẹp', done: false, priority: 'high' },
  { id: 3, text: 'Tìm hiểu Pinia state management', done: false, priority: 'medium' },
  { id: 4, text: 'Đọc tài liệu Vue Router', done: false, priority: 'low' },
])

const filter = ref('all')
let nextId = 5

export function useTodos() {
  // ─── Computed ──────────────────────────────────────
  const filteredTodos = computed(() => {
    if (filter.value === 'active') return todos.value.filter(t => !t.done)
    if (filter.value === 'done') return todos.value.filter(t => t.done)
    return todos.value
  })

  const stats = computed(() => ({
    total: todos.value.length,
    done: todos.value.filter(t => t.done).length,
    active: todos.value.filter(t => !t.done).length,
    percent: todos.value.length
      ? Math.round((todos.value.filter(t => t.done).length / todos.value.length) * 100)
      : 0,
  }))

  // ─── Methods ───────────────────────────────────────
  const addTodo = (text) => {
    if (!text.trim()) return
    todos.value.push({ id: nextId++, text: text.trim(), done: false, priority: 'medium' })
  }

  const toggleTodo = (id) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo) todo.done = !todo.done
  }

  const deleteTodo = (id) => {
    todos.value = todos.value.filter(t => t.id !== id)
  }

  const updateTodo = (id, text) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo && text.trim()) todo.text = text.trim()
  }

  const clearDone = () => {
    todos.value = todos.value.filter(t => !t.done)
  }

  return {
    // state
    todos,
    filter,
    // computed
    filteredTodos,
    stats,
    // methods
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearDone,
  }
}