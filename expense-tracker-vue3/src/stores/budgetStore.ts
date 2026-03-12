import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { useCategoryStore } from "./categoryStore";
import { useTransactionStore } from "./transactionStore";

export interface BudgetLimit {
  categoryId: number;
  amount: number;
  period: "daily" | "weekly" | "monthly";
}

export interface BudgetStatus {
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  limit: number;
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
  period: "daily" | "weekly" | "monthly";
}

export const useBudgetStore = defineStore("budget", () => {
  // State
  const budgetLimits = ref<BudgetLimit[]>([]);

  // Getters - Get budget status for all categories
  const budgetStatus = computed<BudgetStatus[]>(() => {
    const categoryStore = useCategoryStore();
    const transactionStore = useTransactionStore();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return budgetLimits.value.map((budget) => {
      const category = categoryStore.getCategoryById(budget.categoryId);
      const categoryName = category?.name || "Unknown";
      const categoryIcon = category?.icon || "📦";
      const categoryColor = category?.color || "#999";

      // Calculate spent amount based on period
      let spent = 0;
      const startDate = new Date();
      const endDate = new Date();

      if (budget.period === "daily") {
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
      } else if (budget.period === "weekly") {
        const dayOfWeek = now.getDay();
        startDate.setDate(now.getDate() - dayOfWeek);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
      } else {
        // monthly
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0);
        endDate.setHours(23, 59, 59, 999);
      }

      // Get transactions for this category and period
      const transactions = transactionStore.transactions.filter((t) => {
        const tDate = new Date(t.date);
        return (
          t.category === budget.categoryId &&
          t.type === "expense" &&
          t.status === "completed" &&
          tDate >= startDate &&
          tDate <= endDate
        );
      });

      spent = transactions.reduce((sum, t) => sum + t.amount, 0);
      const remaining = Math.max(0, budget.amount - spent);
      const percentage = Math.min(100, (spent / budget.amount) * 100);
      const isOverBudget = spent > budget.amount;

      return {
        categoryId: budget.categoryId,
        categoryName,
        categoryIcon,
        categoryColor,
        limit: budget.amount,
        spent,
        remaining,
        percentage,
        isOverBudget,
        period: budget.period,
      };
    });
  });

  // Get total budget stats
  const totalBudgetStats = computed(() => {
    let totalLimit = 0;
    let totalSpent = 0;

    budgetStatus.value.forEach((status) => {
      totalLimit += status.limit;
      totalSpent += status.spent;
    });

    const totalRemaining = Math.max(0, totalLimit - totalSpent);
    const totalPercentage =
      totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

    return {
      totalLimit,
      totalSpent,
      totalRemaining,
      totalPercentage: Math.min(100, totalPercentage),
      isOverBudget: totalSpent > totalLimit,
    };
  });

  // Actions
  function setBudgetLimit(
    categoryId: number,
    amount: number,
    period: "daily" | "weekly" | "monthly" = "monthly",
  ): void {
    const existingIndex = budgetLimits.value.findIndex(
      (b) => b.categoryId === categoryId,
    );

    if (existingIndex !== -1) {
      if (amount <= 0) {
        // Remove budget if amount is 0 or negative
        budgetLimits.value.splice(existingIndex, 1);
      } else {
        // Update existing budget
        budgetLimits.value[existingIndex] = { categoryId, amount, period };
      }
    } else if (amount > 0) {
      // Add new budget
      budgetLimits.value.push({ categoryId, amount, period });
    }
  }

  function getBudgetByCategory(categoryId: number): BudgetLimit | undefined {
    return budgetLimits.value.find((b) => b.categoryId === categoryId);
  }

  function removeBudget(categoryId: number): void {
    budgetLimits.value = budgetLimits.value.filter(
      (b) => b.categoryId !== categoryId,
    );
  }

  function clearAllBudgets(): void {
    budgetLimits.value = [];
  }

  // LocalStorage persistence
  function loadFromStorage(): void {
    const saved = localStorage.getItem("budgets");
    if (saved) {
      const parsed = JSON.parse(saved);
      budgetLimits.value = parsed.budgetLimits || [];
    }
  }

  function saveToStorage(): void {
    localStorage.setItem(
      "budgets",
      JSON.stringify({
        budgetLimits: budgetLimits.value,
      }),
    );
  }

  // Watch for changes and save to localStorage
  watch(
    budgetLimits,
    () => {
      saveToStorage();
    },
    { deep: true },
  );

  // Initialize
  loadFromStorage();

  return {
    // State
    budgetLimits,
    // Getters
    budgetStatus,
    totalBudgetStats,
    // Methods
    getBudgetByCategory,
    // Actions
    setBudgetLimit,
    removeBudget,
    clearAllBudgets,
    loadFromStorage,
    saveToStorage,
  };
});
