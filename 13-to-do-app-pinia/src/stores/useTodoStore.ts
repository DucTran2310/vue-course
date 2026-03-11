import type { FilterType, Priority, SortType, Todo, TodoStats } from '@/types/todo'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

const STORAGE_KEY = 'vue3-todos'

const loadFromStorage = (): Todo[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const saveToStorage = (todos: Todo[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

export interface TodoCategory {
  id: string
  name: string
  color: string
  icon?: string
}

export interface TodoReminder {
  id: string
  todoId: string
  time: Date
  repeat: 'none' | 'daily' | 'weekly' | 'monthly'
}

export const useTodoStore = defineStore('todos', () => {
  // ─── State ─────────────────────────────────────────────
  const todos = ref<Todo[]>(loadFromStorage())
  const filter = ref<FilterType>('all')
  const sort = ref<SortType>('created')
  const search = ref('')
  const selectedTags = ref<string[]>([])

  // ─── State mở rộng ────────────────────────────────────
  const categories = ref<TodoCategory[]>([
    { id: 'personal', name: 'Cá nhân', color: '#8b5cf6', icon: '👤' },
    { id: 'work', name: 'Công việc', color: '#10b981', icon: '💼' },
    { id: 'study', name: 'Học tập', color: '#f59e0b', icon: '📚' },
    { id: 'shopping', name: 'Mua sắm', color: '#ef4444', icon: '🛒' },
  ])

  const reminders = ref<TodoReminder[]>([])
  const selectedCategory = ref<string | null>(null)

  // Undo/Redo stack
  const history = ref<Todo[][]>([])
  const historyIndex = ref(-1)
  const maxHistorySize = 20

  // Theme & preferences
  const theme = ref<'light' | 'dark' | 'system'>('dark')
  const compactMode = ref(false)
  const autoSave = ref(true)

  // ─── Getters ───────────────────────────────────────────
  const allTags = computed<string[]>(() => {
    const tagSet = new Set<string>()
    todos.value.forEach((t) => t.tags.forEach((tag) => tagSet.add(tag)))
    return Array.from(tagSet)
  })

  const filteredTodos = computed<Todo[]>(() => {
    let result = todos.value

    if (filter.value === 'active') result = result.filter((t) => !t.done)
    if (filter.value === 'done') result = result.filter((t) => t.done)

    if (selectedCategory.value) {
      result = result.filter((t) => t.category === selectedCategory.value)
    }

    if (search.value.trim()) {
      const q = search.value.toLowerCase()
      result = result.filter((t) => t.text.toLowerCase().includes(q))
    }

    if (selectedTags.value.length > 0) {
      result = result.filter((t) => selectedTags.value.every((tag) => t.tags.includes(tag)))
    }

    return [...result].sort((a, b) => {
      if (sort.value === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      if (sort.value === 'alpha') return a.text.localeCompare(b.text)
      return b.createdAt - a.createdAt
    })
  })

  const stats = computed<TodoStats>(() => {
    const total = todos.value.length
    const done = todos.value.filter((t) => t.done).length
    return {
      total,
      done,
      active: total - done,
      percent: total ? Math.round((done / total) * 100) : 0,
      byPriority: {
        high: todos.value.filter((t) => !t.done && t.priority === 'high').length,
        medium: todos.value.filter((t) => !t.done && t.priority === 'medium').length,
        low: todos.value.filter((t) => !t.done && t.priority === 'low').length,
      },
    }
  })

  const todosByCategory = computed(() => {
    const result: Record<string, Todo[]> = {}
    categories.value.forEach((cat) => {
      result[cat.id] = todos.value.filter((t) => t.category === cat.id)
    })
    return result
  })

  const upcomingReminders = computed(() => {
    const now = Date.now()
    const next24h = now + 24 * 60 * 60 * 1000
    return reminders.value
      .filter((r) => r.time.getTime() > now && r.time.getTime() < next24h)
      .sort((a, b) => a.time.getTime() - b.time.getTime())
  })

  // ─── Actions ───────────────────────────────────────────
  const persist = () => saveToStorage(todos.value)

  const saveToHistory = () => {
    if (!autoSave.value) return

    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1)
    }

    history.value.push(JSON.parse(JSON.stringify(todos.value)))
    if (history.value.length > maxHistorySize) {
      history.value.shift()
    } else {
      historyIndex.value++
    }
  }

  const undo = () => {
    if (historyIndex.value > 0) {
      historyIndex.value--
      todos.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
      persist()
    }
  }

  const redo = () => {
    if (historyIndex.value < history.value.length - 1) {
      historyIndex.value++
      todos.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
      persist()
    }
  }

  const addTodo = (text: string, priority: Priority = 'medium', tags: string[] = []) => {
    if (!text.trim()) return
    saveToHistory()
    todos.value.unshift({
      id: crypto.randomUUID(),
      text: text.trim(),
      done: false,
      priority,
      createdAt: Date.now(),
      tags,
    })
    persist()
  }

  const toggleTodo = (id: string) => {
    const todo = todos.value.find((t) => t.id === id)
    if (todo) {
      saveToHistory()
      todo.done = !todo.done
      persist()
    }
  }

  const updateTodo = (id: string, text: string) => {
    const todo = todos.value.find((t) => t.id === id)
    if (todo && text.trim()) {
      saveToHistory()
      todo.text = text.trim()
      persist()
    }
  }

  const updatePriority = (id: string, priority: Priority) => {
    const todo = todos.value.find((t) => t.id === id)
    if (todo) {
      saveToHistory()
      todo.priority = priority
      persist()
    }
  }

  const deleteTodo = (id: string) => {
    saveToHistory()
    todos.value = todos.value.filter((t) => t.id !== id)
    persist()
  }

  const clearDone = () => {
    saveToHistory()
    todos.value = todos.value.filter((t) => !t.done)
    persist()
  }

  const toggleTag = (tag: string) => {
    const idx = selectedTags.value.indexOf(tag)
    if (idx === -1) selectedTags.value.push(tag)
    else selectedTags.value.splice(idx, 1)
  }

  const updateCategory = (id: string, categoryId: string) => {
    const todo = todos.value.find((t) => t.id === id)
    if (todo) {
      saveToHistory()
      todo.category = categoryId
      persist()
    }
  }

  // Batch operations
  const batchDelete = (ids: string[]) => {
    saveToHistory()
    todos.value = todos.value.filter((t) => !ids.includes(t.id))
    persist()
  }

  const batchUpdatePriority = (ids: string[], priority: Priority) => {
    saveToHistory()
    todos.value = todos.value.map((t) => (ids.includes(t.id) ? { ...t, priority } : t))
    persist()
  }

  const batchUpdateCategory = (ids: string[], categoryId: string) => {
    saveToHistory()
    todos.value = todos.value.map((t) => (ids.includes(t.id) ? { ...t, category: categoryId } : t))
    persist()
  }

  // Export/Import
  const exportData = (format: 'json' | 'csv' | 'markdown' = 'json') => {
    const data = {
      todos: todos.value,
      categories: categories.value,
      tags: allTags.value,
      stats: stats.value,
      exportedAt: new Date().toISOString(),
    }

    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2)

      case 'csv': {
        const headers = ['ID', 'Text', 'Done', 'Priority', 'Created', 'Tags', 'Category']
        const rows = todos.value.map((t) => [
          t.id,
          `"${t.text}"`,
          t.done,
          t.priority,
          new Date(t.createdAt).toLocaleDateString(),
          t.tags.join(';'),
          t.category || '',
        ])
        return [headers, ...rows].map((row) => row.join(',')).join('\n')
      }

      case 'markdown': {
        let md = '# Todo List\n\n'
        md += `## Summary\n- Total: ${stats.value.total}\n- Done: ${stats.value.done}\n- Active: ${stats.value.active}\n\n`
        md += '## Tasks\n'
        todos.value.forEach((t) => {
          md += `- [${t.done ? 'x' : ' '}] ${t.text} (${t.priority})`
          if (t.tags.length) md += ` #${t.tags.join(' #')}`
          if (t.category) md += ` [${categories.value.find((c) => c.id === t.category)?.name}]`
          md += '\n'
        })
        return md
      }
    }
  }

  const importData = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString)
      if (data.todos && Array.isArray(data.todos)) {
        saveToHistory()
        todos.value = data.todos
        if (data.categories) categories.value = data.categories
        persist()
        return true
      }
    } catch (e) {
      console.error('Import failed:', e)
      return false
    }
  }

  // Reminders
  const addReminder = (todoId: string, time: Date, repeat: TodoReminder['repeat'] = 'none') => {
    reminders.value.push({
      id: crypto.randomUUID(),
      todoId,
      time,
      repeat,
    })

    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  const checkReminders = () => {
    const now = new Date()
    reminders.value.forEach((reminder) => {
      if (reminder.time <= now) {
        const todo = todos.value.find((t) => t.id === reminder.todoId)
        if (todo && Notification.permission === 'granted') {
          new Notification('Todo Reminder', {
            body: todo.text,
            icon: '/icon.png',
          })
        }

        if (reminder.repeat !== 'none') {
          const newTime = new Date(reminder.time)
          switch (reminder.repeat) {
            case 'daily':
              newTime.setDate(newTime.getDate() + 1)
              break
            case 'weekly':
              newTime.setDate(newTime.getDate() + 7)
              break
            case 'monthly':
              newTime.setMonth(newTime.getMonth() + 1)
              break
          }
          reminder.time = newTime
        }
      }
    })

    reminders.value = reminders.value.filter((r) => r.repeat !== 'none' || r.time > now)
  }

  // Auto-save watcher
  watch(
    todos,
    () => {
      if (autoSave.value) {
        persist()
      }
    },
    { deep: true },
  )

  return {
    // State
    todos,
    filter,
    sort,
    search,
    selectedTags,
    categories,
    reminders,
    selectedCategory,
    theme,
    compactMode,
    autoSave,
    history,
    historyIndex,

    // Getters
    filteredTodos,
    stats,
    allTags,
    todosByCategory,
    upcomingReminders,

    // Actions
    addTodo,
    toggleTodo,
    updateTodo,
    updatePriority,
    deleteTodo,
    clearDone,
    toggleTag,
    updateCategory,
    undo,
    redo,
    batchDelete,
    batchUpdatePriority,
    batchUpdateCategory,
    exportData,
    importData,
    addReminder,
    checkReminders,
    saveToHistory,
    persist,
  }
})
