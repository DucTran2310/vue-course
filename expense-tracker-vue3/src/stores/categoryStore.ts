import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { Category } from "../types";

export const useCategoryStore = defineStore("category", () => {
  // State
  const categories = ref<Category[]>([
    // Expense categories
    { id: 1, name: "Ăn uống", icon: "🍔", color: "#FF6B6B", type: "expense" },
    { id: 2, name: "Đi lại", icon: "🚗", color: "#4ECDC4", type: "expense" },
    { id: 3, name: "Mua sắm", icon: "🛒", color: "#45B7D1", type: "expense" },
    { id: 4, name: "Giải trí", icon: "🎬", color: "#96CEB4", type: "expense" },
    { id: 5, name: "Hóa đơn", icon: "📄", color: "#FFEAA7", type: "expense" },
    { id: 6, name: "Y tế", icon: "🏥", color: "#DDA0DD", type: "expense" },
    { id: 7, name: "Học tập", icon: "📚", color: "#98D8C8", type: "expense" },
    { id: 8, name: "Khác", icon: "📦", color: "#A8A8A8", type: "expense" },
    // Income categories
    { id: 9, name: "Lương", icon: "💰", color: "#2ECC71", type: "income" },
    { id: 10, name: "Thưởng", icon: "🎁", color: "#27AE60", type: "income" },
    { id: 11, name: "Đầu tư", icon: "📈", color: "#1ABC9C", type: "income" },
    { id: 12, name: "Khác", icon: "💵", color: "#16A085", type: "income" },
  ]);

  const nextId = ref(13);

  // Getters
  const expenseCategories = computed(() =>
    categories.value.filter((c) => c.type === "expense"),
  );

  const incomeCategories = computed(() =>
    categories.value.filter((c) => c.type === "income"),
  );

  const getCategoryById = computed(() => (id: number | undefined) => {
    return categories.value.find((c) => c.id === id);
  });

  // Actions
  function addCategory(category: Omit<Category, "id">): Category {
    const newCategory: Category = {
      ...category,
      id: nextId.value++,
    };
    categories.value.push(newCategory);
    return newCategory;
  }

  function updateCategory(id: number, updates: Partial<Category>): void {
    const category = categories.value.find((c) => c.id === id);
    if (category) {
      Object.assign(category, updates);
    }
  }

  function deleteCategory(id: number): void {
    categories.value = categories.value.filter((c) => c.id !== id);
  }

  function loadFromStorage(): void {
    const saved = localStorage.getItem("categories");
    if (saved) {
      const parsed = JSON.parse(saved);
      categories.value = parsed.categories.map((c: Category) => ({
        ...c,
      }));
      nextId.value = parsed.nextId;
    }
  }

  function saveToStorage(): void {
    localStorage.setItem(
      "categories",
      JSON.stringify({
        categories: categories.value,
        nextId: nextId.value,
      }),
    );
  }

  // Load on init
  loadFromStorage();

  return {
    // State
    categories,
    nextId,
    // Getters
    expenseCategories,
    incomeCategories,
    getCategoryById,
    // Actions
    addCategory,
    updateCategory,
    deleteCategory,
    loadFromStorage,
    saveToStorage,
  };
});
