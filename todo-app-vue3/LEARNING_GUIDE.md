# Vue 3, Pinia, TypeScript & Unit Test - Học từ ReactJS

> Hướng dẫn học tập dựa trên source code todo-app-vue3 thực tế
>
> Cho người đã biết ReactJS đang chuyển sang Vue 3

---

## 📚 Mục lục

1. [Vue 3 Core Concepts](#vue-3-core-concepts)
2. [Composition API](#composition-api)
3. [Directives](#directives)
4. [Pinia State Management](#pinia-state-management)
5. [TypeScript với Vue](#typescript-với-vue)
6. [Unit Testing với Vitest](#unit-testing-với-vitest)
7. [So sánh React vs Vue](#so-sánh-react-vs-vue)
8. [Checklist học tập](#checklist-học-tập)

---

## Vue 3 Core Concepts

### 1. Lifecycle Hooks

**React:**

```jsx
useEffect(() => {
  // componentDidMount
  console.log('Component mounted')
  
  return () => {
    // componentWillUnmount
    console.log('Component will unmount')
  }
}, [])

useEffect(() => {
  // componentDidUpdate
  console.log('Prop changed')
}, [someProp])
```

**Vue 3:**

```typescript
import { onMounted, onUnmounted, watch } from 'vue'

onMounted(() => {
  console.log('Component mounted')
})

onUnmounted(() => {
  console.log('Component will unmount')
})

watch(() => props.someProp, (newVal, oldVal) => {
  console.log('Prop changed from', oldVal, 'to', newVal)
})
```

**Trong todo-app-vue3:**

```typescript
// src/stores/todoStore.ts
watch(
  () => todos.value,
  (newTodos) => {
    localStorage.setItem('todos', JSON.stringify(newTodos))
  },
  { deep: true }
)
```

---

### 2. Reactive State

**React:**

```jsx
const [count, setCount] = useState(0)
const [todo, setTodo] = useState({ text: '', completed: false })

// Cập nhật object
setTodo(prev => ({ ...prev, completed: true }))
```

**Vue 3:**

```typescript
import { ref, reactive } from 'vue'

// ref cho primitve values
const count = ref(0)
console.log(count.value) // .value để truy cập trong script

// reactive cho objects
const todo = reactive({ text: '', completed: false })
console.log(todo.completed) // Không cần .value cho reactive
todo.completed = true // Direct assignment
```

**Trong todo-app-vue3:**

```typescript
// src/stores/todoStore.ts
const todos = ref<Todo[]>([])
const filter = ref<FilterType>('all')
const darkMode = ref(false)

// Trong component
const store = useTodoStore()
console.log(store.todos.value)
```

---

### 3. Computed Properties

**React:**

```jsx
const [todos, setTodos] = useState([])

const completedCount = useMemo(() => {
  return todos.filter(t => t.completed).length
}, [todos])

const progressPercentage = useMemo(() => {
  if (todos.length === 0) return 0
  return Math.round((completedCount / todos.length) * 100)
}, [todos.length, completedCount])
```

**Vue 3:**

```typescript
import { computed, ref } from 'vue'

const todos = ref<Todo[]>([])

const completedCount = computed(() => {
  return todos.value.filter(t => t.completed).length
})

const progressPercentage = computed(() => {
  if (todos.value.length === 0) return 0
  return Math.round((completedCount.value / todos.value.length) * 100)
})
```

**Trong todo-app-vue3:**

```typescript
// src/stores/todoStore.ts
const completedCount = computed(() => {
  return todos.value.filter((t) => t.completed).length
})

const progressPercentage = computed(() => {
  if (totalCount.value === 0) return 0
  return Math.round((completedCount.value / totalCount.value) * 100)
})
```

---

## Composition API

### 1. Setup Function

**Vue 3 Options API (Cũ):**

```vue
<script>
export default {
  data() {
    return { count: 0 }
  },
  methods: {
    increment() { this.count++ }
  }
}
</script>
```

**Vue 3 Composition API (Mới - khuyến nghị):**

```vue
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

const increment = () => {
  count.value++
}
</script>
```

**Trong todo-app-vue3:**

```vue
<!-- src/components/TodoForm.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTodoStore } from '@/stores/todoStore'

const store = useTodoStore()
const showOptions = ref(false)
const newTodo = ref('')
const priority = ref('medium')
const dueDate = ref()
const category = ref()
const description = ref('')

const handleSubmit = () => {
  if (newTodo.value.trim()) {
    store.addTodo(
      newTodo.value,
      priority.value,
      dueDate.value,
      category.value,
      description.value
    )
    // Reset form
    newTodo.value = ''
    priority.value = 'medium'
    dueDate.value = undefined
    category.value = undefined
    description.value = ''
    showOptions.value = false
  }
}
</script>
```

---

### 2. Props & Emits

**React:**

```jsx
function TodoItem({ todo, onComplete, onDelete }) {
  return (
    <div>
      <input 
        type="checkbox" 
        checked={todo.completed}
        onChange={() => onComplete(todo.id)}
      />
      <span>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  )
}
```

**Vue 3:**

```vue
<script setup lang="ts">
interface Props {
  todo: Todo
  isEditing?: boolean
}

// Define props with TypeScript
const props = defineProps<Props>()

// Define emits
const emit = defineEmits<{
  complete: [id: number]
  delete: [id: number]
  edit: [id: number]
}>()

const handleComplete = () => {
  emit('complete', props.todo.id)
}

const handleDelete = () => {
  emit('delete', props.todo.id)
}
</script>

<template>
  <div>
    <input 
      type="checkbox" 
      :checked="todo.completed" 
      @change="handleComplete"
    />
    <span>{{ todo.text }}</span>
    <button @click="handleDelete">Delete</button>
  </div>
</template>
```

**Trong todo-app-vue3:**

```vue
<!-- src/components/TodoItem.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Todo } from '@/types/todo'
import { formatDateTime } from '@/utils/dateUtils'

interface Props {
  todo: Todo
}

const props = defineProps<Props>()

const isEditing = ref(false)
const editedText = ref(props.todo.text)

const emit = defineEmits<{
  toggle: [id: number]
  delete: [id: number]
  update: [id: number, text: string]
  updatePriority: [id: number, priority: string]
  updateDueDate: [id: number, date: Date | undefined]
}>()

const handleToggle = () => {
  emit('toggle', props.todo.id)
}

const handleDelete = () => {
  emit('delete', props.todo.id)
}
</script>
```

---

## Directives

### 1. v-model (Two-way binding)

**React:**

```jsx
const [text, setText] = useState('')

<input 
  value={text} 
  onChange={(e) => setText(e.target.value)} 
/>
```

**Vue 3:**

```vue
<script setup>
import { ref } from 'vue'

const text = ref('')
</script>

<template>
  <input v-model="text" />
</template>
```

**Trong todo-app-vue3:**

```vue
<!-- src/components/TodoForm.vue -->
<input
  v-model="newTodo"
  type="text"
  placeholder="Nhập công việc mới..."
  @keyup.enter="handleSubmit"
/>

<select v-model="priority">
  <option value="low">Thấp</option>
  <option value="medium">Trung bình</option>
  <option value="high">Cao</option>
</select>
```

---

### 2. v-for (Loop)

**React:**

```jsx
{todos.map(todo => (
  <div key={todo.id}>
    {todo.text}
  </div>
))}
```

**Vue 3:**

```vue
<template>
  <div v-for="todo in todos" :key="todo.id">
    {{ todo.text }}
  </div>
</template>
```

**Trong todo-app-vue3:**

```vue
<!-- src/components/TodoItem.vue -->
<div class="categories">
  <span 
    v-for="category in store.categories" 
    :key="category.id"
    :style="{ backgroundColor: category.color }"
    @click="selectCategory(category.id)"
  >
    {{ category.name }}
  </span>
</div>
```

---

### 3. v-if / v-else / v-show

**React:**

```jsx
{showModal && <Modal />}
{isAdmin ? <AdminPanel /> : <UserPanel />}
```

**Vue 3:**

```vue
<Modal v-if="showModal" />
<AdminPanel v-if="isAdmin" />
<UserPanel v-else />

<!-- v-show chỉ ẩn bằng CSS (display: none) -->
<div v-show="isVisible">Content</div>
```

**Trong todo-app-vue3:**

```vue
<!-- src/components/TodoItem.vue -->
<div v-if="isEditing">
  <input
    v-model="editedText"
    @blur="saveEdit"
    @keyup.enter="saveEdit"
    @keyup.esc="cancelEdit"
  />
</div>
<div v-else>
  {{ todo.text }}
</div>
```

---

### 4. Event Listeners

**React:**

```jsx
<button onClick={handleClick}>Click</button>
<input onChange={handleChange} />
<form onSubmit={handleSubmit}>
```

**Vue 3:**

```vue
<button @click="handleClick">Click</button>
<input @change="handleChange" />
<form @submit.prevent="handleSubmit">
<!-- .prevent = event.preventDefault() -->
```

**Trong todo-app-vue3:**

```vue
<button @click="showOptions = !showOptions">
  {{ showOptions ? '▲ Thu gọn' : '▼ Tuỳ chọn thêm' }}
</button>

<button @click="deleteTodo(todo.id)" class="delete-btn">
  🗑️
</button>

<input
  v-model="searchText"
  placeholder="Tìm kiếm..."
  @input="handleSearch"
/>
```

---

### 5. Class & Style Binding

**React:**

```jsx
<div 
  className={`todo-item ${completed ? 'completed' : ''}`}
  style={{ color: priorityColor, fontSize: '14px' }}
>
```

**Vue 3 - Object Syntax:**

```vue
<div 
  :class="{ 
    'completed': todo.completed, 
    'high-priority': todo.priority === 'high' 
  }"
  :style="{ 
    color: priorityColor,
    fontSize: '14px'
  }"
>
```

**Vue 3 - Array Syntax:**

```vue
<div 
  :class="[
    'todo-item',
    { completed: todo.completed },
    priorityClass
  ]"
>
```

**Trong todo-app-vue3:**

```vue
<!-- src/App.vue -->
<div :class="{ dark: darkMode }">

<!-- src/components/TodoItem.vue -->
<div 
  class="todo-item" 
  :class="{ 
    'completed': todo.completed,
    'overdue': isOverdue 
  }"
  :style="{
    borderTopColor: getPriorityColor(todo.priority)
  }"
>
```

---

## Pinia State Management

### 1. So sánh Redux vs Pinia

**Redux (React):**

```jsx
// store.js
import { createStore } from 'redux'
import todoReducer from './todoReducer'

const store = createStore(todoReducer)

// component
import { useSelector, useDispatch } from 'react-redux'
import { addTodo, toggleTodo } from './todoActions'

function TodoList() {
  const todos = useSelector(state => state.todos)
  const dispatch = useDispatch()

  const handleAdd = (text) => {
    dispatch(addTodo(text))
  }

  const handleToggle = (id) => {
    dispatch(toggleTodo(id))
  }

  return <div>{/* render todos */}</div>
}
```

**Pinia (Vue 3):**

```typescript
// store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTodoStore = defineStore('todo', () => {
  // State (như useState trong React)
  const todos = ref<Todo[]>([])
  
  // Getters (như useSelector)
  const completedCount = computed(() => {
    return todos.value.filter(t => t.completed).length
  })
  
  // Actions
  const addTodo = (text: string) => {
    todos.value.push({
      id: Date.now(),
      text,
      completed: false
    })
  }
  
  const toggleTodo = (id: number) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo) todo.completed = !todo.completed
  }
  
  return {
    todos,
    completedCount,
    addTodo,
    toggleTodo
  }
})
```

---

### 2. Store structure trong todo-app-vue3

```typescript
// src/stores/todoStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Todo, Priority, FilterType } from '../types/todo'

export const useTodoStore = defineStore('todo', () => {
  // ===== STATE =====
  const todos = ref<Todo[]>([])
  const filter = ref<FilterType>('all')
  const sortBy = ref<SortType>('date')
  const search = ref('')
  const darkMode = ref(false)
  const categories = ref<Category[]>([
    { id: 1, name: 'Công việc', color: '#4CAF50' },
    { id: 2, name: 'Học tập', color: '#2196F3' },
    { id: 3, name: 'Cá nhân', color: '#FF9800' },
    { id: 4, name: 'Sức khỏe', color: '#E91E63' },
  ])

  // ===== GETTERS (Computed) =====
  const filteredTodos = computed(() => {
    let result = [...todos.value]
    
    // Filter by status
    if (filter.value === 'active') {
      result = result.filter(t => !t.completed)
    } else if (filter.value === 'completed') {
      result = result.filter(t => t.completed)
    }
    
    // Search
    if (search.value) {
      result = result.filter(t => 
        t.text.toLowerCase().includes(search.value.toLowerCase())
      )
    }
    
    // Sort
    result.sort((a, b) => {
      if (sortBy.value === 'date') return b.id - a.id
      if (sortBy.value === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 }
        return priorityOrder[a.priority] - priorityOrder[b.priority]
      }
      if (sortBy.value === 'name') {
        return a.text.localeCompare(b.text)
      }
      return 0
    })
    
    return result
  })

  const activeCount = computed(() => {
    return todos.value.filter(t => !t.completed).length
  })

  const completedCount = computed(() => {
    return todos.value.filter(t => t.completed).length
  })

  const totalCount = computed(() => todos.value.length)

  const progressPercentage = computed(() => {
    if (totalCount.value === 0) return 0
    return Math.round((completedCount.value / totalCount.value) * 100)
  })

  const overdueTodos = computed(() => {
    const now = new Date()
    return todos.value.filter(t => {
      if (!t.dueDate || t.completed) return false
      return new Date(t.dueDate) < now
    })
  })

  // ===== ACTIONS =====
  const addTodo = (
    text: string,
    priority: Priority = 'medium',
    dueDate?: Date,
    category?: number,
    description?: string
  ) => {
    if (!text.trim()) return
    
    todos.value.push({
      id: Date.now(),
      text: text.trim(),
      completed: false,
      priority,
      dueDate,
      category,
      description,
      createdAt: new Date(),
    })
  }

  const toggleTodo = (id: number) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }

  const deleteTodo = (id: number) => {
    const index = todos.value.findIndex(t => t.id === id)
    if (index > -1) {
      todos.value.splice(index, 1)
    }
  }

  const updateTodoText = (id: number, text: string) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo && text.trim()) {
      todo.text = text.trim()
    }
  }

  const clearCompleted = () => {
    todos.value = todos.value.filter(t => !t.completed)
  }

  const clearAll = () => {
    if (confirm('Bạn có chắc muốn xóa tất cả công việc?')) {
      todos.value = []
    }
  }

  // ===== PERSISTENCE =====
  watch(
    () => todos.value,
    (newTodos) => {
      localStorage.setItem('todos', JSON.stringify(newTodos))
    },
    { deep: true }
  )

  return {
    // State
    todos,
    filter,
    sortBy,
    search,
    darkMode,
    categories,
    
    // Getters
    filteredTodos,
    activeCount,
    completedCount,
    totalCount,
    progressPercentage,
    overdueTodos,
    
    // Actions
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodoText,
    clearCompleted,
    clearAll,
  }
})
```

---

### 3. Sử dụng Store trong Components

```vue
<!-- src/App.vue -->
<script setup lang="ts">
import { useTodoStore } from '@/stores/todoStore'

const store = useTodoStore()

// Truy cập state
console.log(store.todos)

// Gọi actions
const handleAddTodo = () => {
  store.addTodo('New task')
}

// Watch state changes
watch(() => store.darkMode, (newVal) => {
  document.documentElement.classList.toggle('dark', newVal)
})
</script>

<template>
  <!-- Truy cập getters trong template -->
  <div>Total: {{ store.totalCount }}</div>
  <div>Completed: {{ store.completedCount }}</div>
  <div>Progress: {{ store.progressPercentage }}%</div>
  
  <!-- Sử dụng actions -->
  <button @click="store.toggleTodo(todo.id)">
    Toggle
  </button>
</template>
```

---

## TypeScript với Vue

### 1. Define Props với TypeScript

```typescript
// Method 1: Generic Type
interface Props {
  todo: Todo
  isEditing?: boolean
}

const props = defineProps<Props>()

// Method 2: Runtime declaration (khi không có <script setup>)
export default defineComponent({
  props: {
    todo: {
      type: Object as PropType<Todo>,
      required: true
    },
    isEditing: Boolean
  }
})
```

**Trong todo-app-vue3:**

```typescript
// src/types/todo.ts
export interface Todo {
  id: number
  text: string
  description?: string
  completed: boolean
  createdAt: Date
  dueDate?: Date
  priority: Priority
  category?: number
}

export type Priority = 'low' | 'medium' | 'high'
export type FilterType = 'all' | 'active' | 'completed'
export type SortType = 'date' | 'priority' | 'dueDate' | 'name'

export interface Category {
  id: number
  name: string
  color: string
}

// src/components/TodoItem.vue
<script setup lang="ts">
import type { Todo } from '@/types/todo'

interface Props {
  todo: Todo
}

const props = defineProps<Props>()

// Optional prop với default value
interface OptionalTodoProps {
  todo: Todo
  showDueDate?: boolean
}

const propsWithDefaults = defineProps<OptionalTodoProps>()
propsWithDefaults.showDueDate = propsWithDefaults.showDueDate ?? true
</script>
```

---

### 2. Define Emits với TypeScript

```typescript
// Simple emit
const emit = defineEmits(['update', 'delete'])

// Typed emit (TypeScript checked)
const emit = defineEmits<{
  (e: 'update', value: string): void
  (e: 'delete', id: number): void
  (e: 'change', payload: { id: number, value: string }): void
}>()

// Sử dụng
const handleUpdate = (value: string) => {
  emit('update', value) // TypeScript sẽ check type
}

const handleDelete = (id: number) => {
  emit('delete', id)
}
```

**Trong todo-app-vue3:**

```typescript
// src/components/TodoItem.vue
const emit = defineEmits<{
  toggle: [id: number]
  delete: [id: number]
  update: [id: number, text: string]
  updatePriority: [id: number, priority: Priority]
  updateDueDate: [id: number, date: Date | undefined]
  updateCategory: [id: number, categoryId: number | undefined]
}>()

const handleToggle = () => {
  emit('toggle', props.todo.id)
}
```

---

### 3. Ref và Reactive với TypeScript

```typescript
import { ref, reactive, computed } from 'vue'

// Primitives với ref
const count = ref<number>(0)
const message = ref<string>('Hello')
const todos = ref<Todo[]>([])

// Object với reactive
const user = reactive<User>({
  name: 'John',
  age: 30,
  email: 'john@example.com'
})

// Computed với return type
const doubleCount = computed<number>(() => count.value * 2)

// Ref với generic type
const todo = ref<Todo | null>(null)

// Array ref
const items = ref<string[]>([])
items.value.push('item1')

// Ref với union type
const status = ref<'loading' | 'success' | 'error'>('loading')
```

**Trong todo-app-vue3:**

```typescript
const todos = ref<Todo[]>([])
const filter = ref<FilterType>('all')
const sortBy = ref<SortType>('date')
const priority = ref<Priority>('medium')
const dueDate = ref<Date | undefined>()
const category = ref<number | undefined>()
const description = ref<string>('')

const overdueTodos = computed<Todo[]>(() => {
  const now = new Date()
  return todos.value.filter(t => {
    if (!t.dueDate || t.completed) return false
    return new Date(t.dueDate) < now
  })
})
```

---

### 4. Type Guards và Utility Types

```typescript
// Type guard function
function isTodo(value: unknown): value is Todo {
  return typeof value === 'object' && 
         value !== null && 
         'id' in value && 
         'text' in value
}

// Utility types
const todoInput: Partial<Todo> = {
  text: 'New task',
  priority: 'medium'
  // tất cả properties đều optional
}

const todoUpdate: Required<Pick<Todo, 'id' | 'text'>> = {
  id: 1,
  text: 'Updated'
  // chỉ id và text là required
}

// Record type
const categoryColors: Record<Priority, string> = {
  low: '#4CAF50',
  medium: '#FF9800',
  high: '#f44336'
}
```

---

### 5. Generic Components

```vue
<script setup lang="ts" generic="T">
interface Props {
  items: T[]
  onSelect: (item: T) => void
}

const props = defineProps<Props>()

const handleSelect = (item: T) => {
  props.onSelect(item)
}
</script>
```

---

## Unit Testing với Vitest

### 1. So sánh Jest vs Vitest

**Jest (React):**

```javascript
// TodoList.test.js
import { render, screen, fireEvent } from '@testing-library/react'
import TodoList from './TodoList'

describe('TodoList', () => {
  test('renders todos', () => {
    render(<TodoList todos={[{ id: 1, text: 'Test', completed: false }]} />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  test('handles add todo', () => {
    const onAdd = jest.fn()
    render(<TodoList onAdd={onAdd} />)
    
    fireEvent.change(screen.getByPlaceholderText('Add todo'), {
      target: { value: 'New todo' }
    })
    fireEvent.click(screen.getByText('Add'))
    
    expect(onAdd).toHaveBeenCalledWith('New todo')
  })
})
```

**Vitest (Vue 3):**

```typescript
// TodoList.spec.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoList from './TodoList.vue'

describe('TodoList', () => {
  it('renders todos', () => {
    const wrapper = mount(TodoList, {
      props: {
        todos: [{ id: 1, text: 'Test', completed: false }]
      }
    })
    
    expect(wrapper.text()).toContain('Test')
  })

  it('handles add todo', async () => {
    const wrapper = mount(TodoList, {
      props: { onAdd: vi.fn() }
    })
    
    const input = wrapper.find('input[placeholder="Add todo"]')
    await input.setValue('New todo')
    
    const button = wrapper.find('button')
    await button.trigger('click')
    
    expect(wrapper.emitted('add')).toBeTruthy()
    expect(wrapper.emitted('add')?.[0]).toEqual(['New todo'])
  })
})
```

---

### 2. Testing Pinia Stores

```typescript
// todoStore.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTodoStore } from '../todoStore'

describe('TodoStore', () => {
  beforeEach(() => {
    // Reset store trước mỗi test
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should add a todo', () => {
    const store = useTodoStore()
    store.addTodo('Test task')

    expect(store.todos).toHaveLength(1)
    expect(store.todos[0]?.text).toBe('Test task')
  })

  it('should toggle todo completion', () => {
    const store = useTodoStore()
    store.addTodo('Test task')
    const todoId = store.todos[0]?.id

    store.toggleTodo(todoId)
    expect(store.todos[0]?.completed).toBe(true)
  })

  it('should calculate progress percentage', () => {
    const store = useTodoStore()
    store.addTodo('Task 1')
    store.addTodo('Task 2')
    store.addTodo('Task 3')
    store.addTodo('Task 4')
    store.todos[0]!.completed = true
    store.todos[1]!.completed = true

    expect(store.progressPercentage).toBe(50)
  })

  it('should filter todos by status', () => {
    const store = useTodoStore()
    store.addTodo('Task 1')
    store.addTodo('Task 2')
    store.todos[0]!.completed = true

    store.setFilter('active')
    expect(store.filteredTodos).toHaveLength(1)
    expect(store.filteredTodos[0]?.completed).toBe(false)

    store.setFilter('completed')
    expect(store.filteredTodos).toHaveLength(1)
    expect(store.filteredTodos[0]?.completed).toBe(true)
  })
})
```

**Trong todo-app-vue3:**

```typescript
// src/stores/__tests__/todoStore.spec.ts - 44 tests
describe("TodoStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  // Test all actions, getters, computed properties
  // Total: 44 test cases
})
```

---

### 3. Testing Vue Components

```typescript
// TodoItem.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoItem from '../TodoItem.vue'

describe('TodoItem', () => {
  it('renders todo text', () => {
    const wrapper = mount(TodoItem, {
      props: {
        todo: {
          id: 1,
          text: 'Test todo',
          completed: false,
          createdAt: new Date(),
          priority: 'medium'
        }
      }
    })

    expect(wrapper.text()).toContain('Test todo')
  })

  it('emits toggle event when checkbox clicked', async () => {
    const wrapper = mount(TodoItem, {
      props: {
        todo: {
          id: 1,
          text: 'Test todo',
          completed: false,
          createdAt: new Date(),
          priority: 'medium'
        }
      }
    })

    const checkbox = wrapper.find('input[type="checkbox"]')
    await checkbox.setChecked(true)

    expect(wrapper.emitted('toggle')).toBeTruthy()
    expect(wrapper.emitted('toggle')?.[0]).toEqual([1])
  })

  it('applies completed class when todo is completed', () => {
    const wrapper = mount(TodoItem, {
      props: {
        todo: {
          id: 1,
          text: 'Test todo',
          completed: true,
          createdAt: new Date(),
          priority: 'medium'
        }
      }
    })

    expect(wrapper.find('.todo-item').classes()).toContain('completed')
  })
})
```

---

### 4. Mocking trong Tests

```typescript
// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Mock browser API
it('should export todos', () => {
  const store = useTodoStore()
  store.addTodo('Test task')

  const mockElement = {
    click: vi.fn(),
    href: '',
    download: '',
  }
  vi.spyOn(document, 'createElement').mockReturnValue(mockElement as any)
  vi.spyOn(document.body, 'appendChild').mockImplementation(
    () => mockElement as any,
  )
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('mock-url')

  store.exportTodos()

  expect(document.createElement).toHaveBeenCalledWith('a')
  expect(mockElement.download).toMatch(/todos-\d{4}-\d{2}-\d{2}\.json/)
})

// Mock console
vi.spyOn(console, 'log')

// Mock async function
const mockAsyncFn = vi.fn().mockResolvedValue({ data: 'test' })
```

---

## So sánh React vs Vue

### 1. Component Structure

| React | Vue 3 |
|-------|-------|
| Functional Components + Hooks | Composition API ([script setup](https://)) |
| `useState`, `useEffect`, `useMemo` | `ref`, `reactive`, `computed`, `watch` |
| Props là object parameter | Props với `defineProps<>()` |
| Events qua props callback | Events với `defineEmits<>()` |
| JSX | Template HTML |

---

### 2. State Management

| React | Vue 3 |
|-------|-------|
| Redux Toolkit | Pinia |
| Context API | Provide/Inject |
| Zustand | Pinia |
| Jotai | Ref/Reactive |

---

### 3. Routing

| React | Vue 3 |
|-------|-------|
| React Router | Vue Router |
| `useNavigate()`, `useLocation()` | `router.push()`, `route.params` |
| `<Route path="/about" element={<About />} />` | `<router-view />` + routes config |

---

### 4. Styling

| React | Vue 3 |
|-------|-------|
| CSS Modules, Styled Components, Tailwind | Scoped CSS, CSS Modules, Tailwind |
| `className` prop | `:class` binding |
| `style={{ color: 'red' }}` | `:style="{ color: 'red' }"` |

---

### 5. Forms

| React | Vue 3 |
|-------|-------|
| Controlled components (state) | `v-model` (two-way binding) |
| `onChange`, `value` | `@input`, `v-model` |
| React Hook Form | VeeValidate, vuelidate |

---

## Checklist Học Tập

### ✅ Vue 3 Core

- [ ] Composition API (`<script setup>`)
- [ ] Lifecycle hooks (`onMounted`, `onUnmounted`, etc.)
- [ ] Reactive state (`ref`, `reactive`)
- [ ] Computed properties
- [ ] Watchers (`watch`, `watchEffect`)
- [ ] Props & Emits với TypeScript
- [ ] Directives (`v-if`, `v-for`, `v-model`, etc.)
- [ ] Event handlers
- [ ] Class & Style binding

### ✅ Pinia State Management

- [ ] Define stores với `defineStore()`
- [ ] State (ref, reactive)
- [ ] Getters (computed)
- [ ] Actions
- [ ] Store composition
- [ ] Persistence với watchers
- [ ] TypeScript trong stores

### ✅ TypeScript với Vue

- [ ] Define props với interfaces/types
- [ ] Define emits với TypeScript
- [ ] Generic types cho components
- [ ] Type guards
- [ ] Utility types (`Partial`, `Pick`, etc.)
- [ ] Ref/Reactive với generics

### ✅ Unit Testing

- [ ] Vitest setup và configuration
- [ ] Testing Pinia stores
- [ ] Testing Vue components
- [ ] Mocking (localStorage, browser APIs)
- [ ] Async testing
- [ ] Type-safe tests

### ✅ Best Practices

- [ ] Component composition
- [ ] Code organization
- [ ] Type safety
- [ ] Testing coverage
- [ ] Performance optimization
- [ ] Accessibility

---

## Resources Học Tập

### Official Documentation

- [Vue 3 Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vitest Documentation](https://vitest.dev/)

### Từ React sang Vue

- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
- [React to Vue Cheatsheet](https://learnvue.co/topics/vue-cheatsheet-for-react-developers)

### Testing

- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Best Practices](https://vuejs.org/guide/scaling-up/testing.html)

---

## 💡 Tips cho React Developer

1. **Mental Model Shift:**
   - React: Re-render based on state changes
   - Vue: Reactive system automatically tracks dependencies

2. **Syntax Differences:**
   - `className` → `:class`
   - `style={{}}` → `:style="{}"`
   - `onChange` → `@change` hoặc `v-model`
   - `onClick` → `@click`

3. **Hooks → Composition API:**
   - `useState` → `ref`
   - `useEffect` → `watch`, `onMounted`, etc.
   - `useMemo` → `computed`
   - `useCallback` → tự động với Vue

4. **State Management:**
   - Redux → Pinia (đơn giản hơn, không cần reducers)
   - Context → Provide/Inject
   - Zustand → Pinia

5. **TypeScript:**
   - Props types với interfaces
   - Emits types với generic types
   - Better type inference with `<script setup>`

---

Made with ❤️ from todo-app-vue3 source code
