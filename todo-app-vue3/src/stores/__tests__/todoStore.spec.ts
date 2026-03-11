import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTodoStore } from "../todoStore";

describe("TodoStore", () => {
  beforeEach(() => {
    // Create a fresh pinia instance for each test
    setActivePinia(createPinia());
    // Clear localStorage
    localStorage.clear();
  });

  describe("Initial State", () => {
    it("should initialize with empty todos", () => {
      const store = useTodoStore();
      expect(store.todos).toEqual([]);
      expect(store.totalCount).toBe(0);
    });

    it("should initialize with default filter", () => {
      const store = useTodoStore();
      expect(store.filter).toBe("all");
    });

    it("should initialize with default sort by date", () => {
      const store = useTodoStore();
      expect(store.sortBy).toBe("date");
    });

    it("should initialize with default categories", () => {
      const store = useTodoStore();
      expect(store.categories).toHaveLength(4);
      expect(store.categories[0]?.name).toBe("Công việc");
    });
  });

  describe("Add Todo", () => {
    it("should add a new todo", () => {
      const store = useTodoStore();
      store.addTodo("Test task");

      expect(store.todos).toHaveLength(1);
      expect(store.todos.at(0)?.text).toBe("Test task");
      expect(store.todos.at(0)?.completed).toBe(false);
    });

    it("should not add empty todo", () => {
      const store = useTodoStore();
      store.addTodo("");

      expect(store.todos).toHaveLength(0);
    });

    it("should not add todo with only whitespace", () => {
      const store = useTodoStore();
      store.addTodo("   ");

      expect(store.todos).toHaveLength(0);
    });

    it("should add todo with high priority", () => {
      const store = useTodoStore();
      store.addTodo("Important task", "high");

      expect(store.todos.at(0)?.priority).toBe("high");
    });

    it("should add todo with due date", () => {
      const store = useTodoStore();
      const dueDate = new Date("2024-12-31");
      store.addTodo("Task with deadline", "medium", dueDate);

      expect(store.todos.at(0)?.dueDate).toEqual(dueDate);
    });

    it("should add todo with description", () => {
      const store = useTodoStore();
      store.addTodo(
        "Task with description",
        "medium",
        undefined,
        undefined,
        "Description text",
      );

      expect(store.todos.at(0)?.description).toBe("Description text");
    });

    it("should add todo with category", () => {
      const store = useTodoStore();
      const categoryId = store.categories.at(0)!.id;
      store.addTodo("Categorized task", "medium", undefined, categoryId);

      expect(store.todos.at(0)?.category).toBe(categoryId);
    });
  });

  describe("Toggle Todo", () => {
    it("should toggle todo completion status", () => {
      const store = useTodoStore();
      store.addTodo("Test task");
      const todoId = store.todos.at(0)!.id;

      store.toggleTodo(todoId);

      expect(store.todos.at(0)!.completed).toBe(true);

      store.toggleTodo(todoId);
      expect(store.todos.at(0)!.completed).toBe(false);
    });
  });

  describe("Delete Todo", () => {
    it("should delete a todo", () => {
      const store = useTodoStore();
      store.addTodo("Task 1");
      store.addTodo("Task 2");
      const todoId = store.todos.at(0)!.id;

      store.deleteTodo(todoId);

      expect(store.todos).toHaveLength(1);
      expect(store.todos.at(0)!.text).toBe("Task 2");
    });
  });

  describe("Update Todo Text", () => {
    it("should update todo text", () => {
      const store = useTodoStore();
      store.addTodo("Original text");
      const todoId = store.todos.at(0)!.id;

      store.updateTodoText(todoId, "Updated text");

      expect(store.todos.at(0)!.text).toBe("Updated text");
    });

    it("should not update to empty text", () => {
      const store = useTodoStore();
      store.addTodo("Original text");
      const todoId = store.todos.at(0)!.id;

      store.updateTodoText(todoId, "");

      expect(store.todos.at(0)!.text).toBe("Original text");
    });
  });

  describe("Update Todo Priority", () => {
    it("should update todo priority", () => {
      const store = useTodoStore();
      store.addTodo("Task");
      const todoId = store.todos.at(0)!.id;

      store.updateTodoPriority(todoId, "high");

      expect(store.todos.at(0)!.priority).toBe("high");
    });
  });

  describe("Update Todo Due Date", () => {
    it("should update todo due date", () => {
      const store = useTodoStore();
      store.addTodo("Task");
      const todoId = store.todos.at(0)!.id;
      const newDueDate = new Date("2024-12-31");

      store.updateTodoDueDate(todoId, newDueDate);

      expect(store.todos.at(0)!.dueDate).toEqual(newDueDate);
    });

    it("should remove due date", () => {
      const store = useTodoStore();
      const dueDate = new Date("2024-12-31");
      store.addTodo("Task", "medium", dueDate);
      const todoId = store.todos.at(0)!.id;

      store.updateTodoDueDate(todoId, undefined);

      expect(store.todos.at(0)!.dueDate).toBeUndefined();
    });
  });

  describe("Update Todo Category", () => {
    it("should update todo category", () => {
      const store = useTodoStore();
      store.addTodo("Task");
      const todoId = store.todos.at(0)!.id;
      const categoryId = store.categories.at(1)!.id;

      store.updateTodoCategory(todoId, categoryId);

      expect(store.todos.at(0)!.category).toBe(categoryId);
    });
  });

  describe("Filter Todos", () => {
    it("should filter by all todos", () => {
      const store = useTodoStore();
      store.addTodo("Task 1");
      store.addTodo("Task 2");
      store.todos.at(0)!.completed = true;

      store.setFilter("all");

      expect(store.filteredTodos).toHaveLength(2);
    });

    it("should filter by active todos", () => {
      const store = useTodoStore();
      store.addTodo("Task 1");
      store.addTodo("Task 2");
      store.todos.at(0)!.completed = true;

      store.setFilter("active");

      expect(store.filteredTodos).toHaveLength(1);
      expect(store.filteredTodos.at(0)!.completed).toBe(false);
    });

    it("should filter by completed todos", () => {
      const store = useTodoStore();
      store.addTodo("Task 1");
      store.addTodo("Task 2");
      store.todos.at(0)!.completed = true;

      store.setFilter("completed");

      expect(store.filteredTodos).toHaveLength(1);
      expect(store.filteredTodos.at(0)!.completed).toBe(true);
    });
  });

  describe("Search Todos", () => {
    it("should search by text", () => {
      const store = useTodoStore();
      store.addTodo("Buy groceries");
      store.addTodo("Clean house");
      store.addTodo("Buy medication");

      store.setSearch("buy");

      expect(store.filteredTodos).toHaveLength(2);
      expect(
        store.filteredTodos.every((t) => t.text.toLowerCase().includes("buy")),
      ).toBe(true);
    });

    it("should be case insensitive", () => {
      const store = useTodoStore();
      store.addTodo("Buy groceries");

      store.setSearch("BUY");

      expect(store.filteredTodos).toHaveLength(1);
    });
  });

  describe("Sort Todos", () => {
    it("should sort by date (newest first)", () => {
      const store = useTodoStore();
      store.addTodo("First");
      store.addTodo("Second");

      store.setSort("date");

      expect(store.filteredTodos.at(0)!.id).toBeGreaterThan(
        store.filteredTodos.at(1)!.id,
      );
    });

    it("should sort by priority", () => {
      const store = useTodoStore();
      store.addTodo("Low priority", "low");
      store.addTodo("High priority", "high");
      store.addTodo("Medium priority", "medium");

      store.setSort("priority");

      expect(store.filteredTodos.at(0)!.priority).toBe("high");
      expect(store.filteredTodos.at(1)!.priority).toBe("medium");
      expect(store.filteredTodos.at(2)!.priority).toBe("low");
    });

    it("should sort by due date", () => {
      const store = useTodoStore();
      const now = new Date();
      store.addTodo("Far task", "medium", new Date(now.getTime() + 100000));
      store.addTodo("Near task", "medium", new Date(now.getTime() + 10000));

      store.setSort("dueDate");

      expect(store.filteredTodos.at(0)!.text).toBe("Near task");
    });

    it("should sort by name", () => {
      const store = useTodoStore();
      store.addTodo("Zebra");
      store.addTodo("Apple");

      store.setSort("name");

      expect(store.filteredTodos.at(0)!.text).toBe("Apple");
      expect(store.filteredTodos.at(1)!.text).toBe("Zebra");
    });
  });

  describe("Computed Properties", () => {
    it("should calculate active count correctly", () => {
      const store = useTodoStore();
      store.addTodo("Task 1");
      store.addTodo("Task 2");
      store.addTodo("Task 3");
      store.todos.at(0)!.completed = true;

      expect(store.activeCount).toBe(2);
    });

    it("should calculate completed count correctly", () => {
      const store = useTodoStore();
      store.addTodo("Task 1");
      store.addTodo("Task 2");
      store.todos.at(0)!.completed = true;

      expect(store.completedCount).toBe(1);
    });

    it("should calculate total count correctly", () => {
      const store = useTodoStore();
      store.addTodo("Task 1");
      store.addTodo("Task 2");

      expect(store.totalCount).toBe(2);
    });

    it("should calculate progress percentage", () => {
      const store = useTodoStore();
      store.addTodo("Task 1");
      store.addTodo("Task 2");
      store.addTodo("Task 3");
      store.addTodo("Task 4");
      store.todos.at(0)!.completed = true;
      store.todos.at(1)!.completed = true;

      expect(store.progressPercentage).toBe(50);
    });

    it("should return 0% when no todos", () => {
      const store = useTodoStore();

      expect(store.progressPercentage).toBe(0);
    });
  });

  describe("Overdue Todos", () => {
    it("should identify overdue todos", () => {
      const store = useTodoStore();
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      store.addTodo("Overdue task", "medium", pastDate);

      expect(store.overdueTodos).toHaveLength(1);
    });

    it("should not count completed todos as overdue", () => {
      const store = useTodoStore();
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      store.addTodo("Overdue task", "medium", pastDate);
      store.todos.at(0)!.completed = true;

      expect(store.overdueTodos).toHaveLength(0);
    });

    it("should not count future due dates as overdue", () => {
      const store = useTodoStore();
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      store.addTodo("Future task", "medium", futureDate);

      expect(store.overdueTodos).toHaveLength(0);
    });
  });

  describe("Clear Completed", () => {
    it("should clear completed todos", () => {
      const store = useTodoStore();
      store.addTodo("Task 1");
      store.addTodo("Task 2");
      store.addTodo("Task 3");
      store.todos.at(0)!.completed = true;
      store.todos.at(1)!.completed = true;

      store.clearCompleted();

      expect(store.todos).toHaveLength(1);
      expect(store.todos.at(0)!.completed).toBe(false);
    });
  });

  describe("Clear All", () => {
    it("should clear all todos", () => {
      const store = useTodoStore();
      store.addTodo("Task 1");
      store.addTodo("Task 2");

      // Mock confirm dialog
      globalThis.confirm = vi.fn(() => true);

      store.clearAll();

      expect(store.todos).toHaveLength(0);
    });
  });

  describe("Dark Mode", () => {
    it("should toggle dark mode", () => {
      const store = useTodoStore();
      expect(store.darkMode).toBe(false);

      store.toggleDarkMode();
      expect(store.darkMode).toBe(true);

      store.toggleDarkMode();
      expect(store.darkMode).toBe(false);
    });
  });

  describe("Categories", () => {
    it("should add a new category", () => {
      const store = useTodoStore();
      const initialLength = store.categories.length;

      store.addCategory("Testing", "#ff0000");

      expect(store.categories).toHaveLength(initialLength + 1);
      expect(store.categories.at(-1)?.name).toBe("Testing");
    });

    it("should delete a category", () => {
      const store = useTodoStore();
      const categoryId = store.categories.at(0)!.id;

      store.deleteCategory(categoryId);

      expect(store.categories.find((c) => c.id === categoryId)).toBeUndefined();
    });

    it("should remove category from todos when category is deleted", () => {
      const store = useTodoStore();
      const categoryId = store.categories.at(0)!.id;
      store.addTodo("Task", "medium", undefined, categoryId);

      store.deleteCategory(categoryId);

      expect(store.todos.at(0)!.category).toBeUndefined();
    });
  });

  describe("Export/Import", () => {
    it("should export todos", () => {
      const store = useTodoStore();
      store.addTodo("Test task");

      // Mock createElement
      const mockElement = {
        click: vi.fn(),
        href: "",
        download: "",
      };
      vi.spyOn(document, "createElement").mockReturnValue(mockElement as any);
      vi.spyOn(document.body, "appendChild").mockImplementation(
        () => mockElement as any,
      );
      vi.spyOn(document.body, "removeChild").mockImplementation(
        () => mockElement as any,
      );
      vi.spyOn(URL, "createObjectURL").mockReturnValue("mock-url");
      vi.spyOn(URL, "revokeObjectURL");

      store.exportTodos();

      expect(document.createElement).toHaveBeenCalledWith("a");
      expect(mockElement.download).toMatch(/todos-\d{4}-\d{2}-\d{2}\.json/);
    });

    it("should import todos", async () => {
      const store = useTodoStore();
      const importData = {
        todos: [
          {
            id: 1,
            text: "Imported task",
            completed: false,
            priority: "high",
            createdAt: new Date().toISOString(),
          },
        ],
        categories: store.categories,
      };

      const file = new File([JSON.stringify(importData)], "test.json", {
        type: "application/json",
      });

      await store.importTodos(file);

      expect(store.todos).toHaveLength(1);
      expect(store.todos.at(0)!.text).toBe("Imported task");
    });
  });
});
