import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import type {
  Category,
  FilterType,
  Priority,
  SortType,
  Todo,
} from "../types/todo";

export const useTodoStore = defineStore("todo", () => {
  // State - sử dụng ref để tạo reactive data
  const todos = ref<Todo[]>([]);
  const filter = ref<FilterType>("all");
  const sortBy = ref<SortType>("date");
  const searchQuery = ref("");
  const categories = ref<Category[]>([
    { id: 1, name: "Công việc", color: "#667eea" },
    { id: 2, name: "Học tập", color: "#51cf66" },
    { id: 3, name: "Cá nhân", color: "#ff6b6b" },
    { id: 4, name: "Sức khỏe", color: "#339af0" },
  ]);
  const darkMode = ref(false);
  const nextId = ref(1);
  const nextCategoryId = ref(5);

  // Load data from localStorage
  const loadFromLocalStorage = () => {
    const savedTodos = localStorage.getItem("todos");
    const savedCategories = localStorage.getItem("categories");
    const savedDarkMode = localStorage.getItem("darkMode");

    if (savedTodos) {
      todos.value = JSON.parse(savedTodos, (key, value) => {
        if (key === "createdAt" || key === "dueDate") {
          return new Date(value);
        }
        return value;
      });
      // Update nextId based on loaded todos
      if (todos.value.length > 0) {
        nextId.value = Math.max(...todos.value.map((t) => t.id)) + 1;
      }
    }

    if (savedCategories) {
      categories.value = JSON.parse(savedCategories);
      if (categories.value.length > 0) {
        nextCategoryId.value =
          Math.max(...categories.value.map((c) => c.id)) + 1;
      }
    }

    if (savedDarkMode) {
      darkMode.value = JSON.parse(savedDarkMode);
      applyDarkMode();
    }
  };

  // Save data to localStorage whenever it changes
  watch(
    todos,
    (newTodos) => {
      localStorage.setItem("todos", JSON.stringify(newTodos));
    },
    { deep: true },
  );

  watch(
    categories,
    (newCategories) => {
      localStorage.setItem("categories", JSON.stringify(newCategories));
    },
    { deep: true },
  );

  watch(darkMode, (newDarkMode) => {
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
    applyDarkMode();
  });

  const applyDarkMode = () => {
    if (darkMode.value) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Getters - sử dụng computed
  const filteredTodos = computed(() => {
    let result = todos.value;

    // Apply search filter
    if (searchQuery.value.trim()) {
      result = result.filter((todo) =>
        todo.text.toLowerCase().includes(searchQuery.value.toLowerCase()),
      );
    }

    // Apply status filter
    switch (filter.value) {
      case "active":
        result = result.filter((todo) => !todo.completed);
        break;
      case "completed":
        result = result.filter((todo) => todo.completed);
        break;
    }

    // Apply sorting
    switch (sortBy.value) {
      case "priority":
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        result = result.sort(
          (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
        );
        break;
      case "dueDate":
        result = result.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        break;
      case "name":
        result = result.sort((a, b) => a.text.localeCompare(b.text));
        break;
      case "date":
      default:
        result = result.sort((a, b) => b.id - a.id);
        break;
    }

    return result;
  });

  const activeCount = computed(() => {
    return todos.value.filter((todo) => !todo.completed).length;
  });

  const completedCount = computed(() => {
    return todos.value.filter((todo) => todo.completed).length;
  });

  const totalCount = computed(() => todos.value.length);

  const progressPercentage = computed(() => {
    if (totalCount.value === 0) return 0;
    return Math.round((completedCount.value / totalCount.value) * 100);
  });

  const overdueTodos = computed(() => {
    const now = new Date();
    return todos.value.filter((todo) => {
      if (!todo.dueDate || todo.completed) return false;
      return new Date(todo.dueDate) < now;
    });
  });

  // Actions
  function addTodo(
    text: string,
    priority: Priority = "medium",
    dueDate?: Date,
    categoryId?: number,
    description?: string,
  ) {
    if (!text.trim()) return;

    const newTodo: Todo = {
      id: nextId.value++,
      text: text.trim(),
      description,
      completed: false,
      createdAt: new Date(),
      priority,
      dueDate,
      category: categoryId,
    };

    todos.value.push(newTodo);
  }

  function toggleTodo(id: number) {
    const todo = todos.value.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  }

  function deleteTodo(id: number) {
    const index = todos.value.findIndex((t) => t.id === id);
    if (index !== -1) {
      todos.value.splice(index, 1);
    }
  }

  function updateTodoText(id: number, newText: string) {
    const todo = todos.value.find((t) => t.id === id);
    if (todo && newText.trim()) {
      todo.text = newText.trim();
    }
  }

  function updateTodoPriority(id: number, priority: Priority) {
    const todo = todos.value.find((t) => t.id === id);
    if (todo) {
      todo.priority = priority;
    }
  }

  function updateTodoDueDate(id: number, dueDate?: Date) {
    const todo = todos.value.find((t) => t.id === id);
    if (todo) {
      todo.dueDate = dueDate;
    }
  }

  function updateTodoCategory(id: number, categoryId?: number) {
    const todo = todos.value.find((t) => t.id === id);
    if (todo) {
      todo.category = categoryId;
    }
  }

  function setFilter(newFilter: FilterType) {
    filter.value = newFilter;
  }

  function setSort(newSort: SortType) {
    sortBy.value = newSort;
  }

  function setSearch(query: string) {
    searchQuery.value = query;
  }

  function toggleDarkMode() {
    darkMode.value = !darkMode.value;
  }

  function addCategory(name: string, color: string) {
    const newCategory: Category = {
      id: nextCategoryId.value++,
      name: name.trim(),
      color,
    };
    categories.value.push(newCategory);
    return newCategory;
  }

  function deleteCategory(id: number) {
    categories.value = categories.value.filter((c) => c.id !== id);
    // Remove category from todos
    todos.value.forEach((todo) => {
      if (todo.category === id) {
        todo.category = undefined;
      }
    });
  }

  function clearCompleted() {
    todos.value = todos.value.filter((todo) => !todo.completed);
  }

  function exportTodos() {
    const data = {
      todos: todos.value,
      categories: categories.value,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `todos-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importTodos(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.todos && Array.isArray(data.todos)) {
            todos.value = data.todos.map((todo: any) => ({
              ...todo,
              createdAt: new Date(todo.createdAt),
              dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
            }));
            // Update nextId
            if (todos.value.length > 0) {
              nextId.value = Math.max(...todos.value.map((t) => t.id)) + 1;
            }
          }
          if (data.categories && Array.isArray(data.categories)) {
            categories.value = data.categories;
            if (categories.value.length > 0) {
              nextCategoryId.value =
                Math.max(...categories.value.map((c) => c.id)) + 1;
            }
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  function clearAll() {
    if (confirm("Bạn có chắc muốn xóa tất cả công việc?")) {
      todos.value = [];
    }
  }

  // Initialize on load
  loadFromLocalStorage();

  // Return tất cả state, getters và actions
  return {
    // State
    todos,
    filter,
    sortBy,
    searchQuery,
    categories,
    darkMode,
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
    updateTodoPriority,
    updateTodoDueDate,
    updateTodoCategory,
    setFilter,
    setSort,
    setSearch,
    toggleDarkMode,
    addCategory,
    deleteCategory,
    clearCompleted,
    clearAll,
    exportTodos,
    importTodos,
  };
});
