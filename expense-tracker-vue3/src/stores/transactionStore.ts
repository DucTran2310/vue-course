import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import type {
  ChartDataPoint,
  MonthlyStats,
  RecurrenceType,
  SortOption,
  SortOrder,
  Transaction,
  TransactionFilter,
  TransactionStatus,
  TransactionType,
} from "../types";
import { useCategoryStore } from "./categoryStore";

export const useTransactionStore = defineStore("transaction", () => {
  // State
  const transactions = ref<Transaction[]>([]);
  const filter = ref<TransactionFilter>({
    type: "all",
    category: "all",
    status: "all",
    searchQuery: "",
    dateRange: "all",
  });
  const sortBy = ref<SortOption>("date");
  const sortOrder = ref<SortOrder>("desc");
  const nextId = ref(1);

  // Getters - Filtered transactions
  const filteredTransactions = computed(() => {
    let result = [...transactions.value];

    // Filter by type
    if (filter.value.type !== "all") {
      result = result.filter((t) => t.type === filter.value.type);
    }

    // Filter by category
    if (filter.value.category !== "all") {
      result = result.filter((t) => t.category === filter.value.category);
    }

    // Filter by status
    if (filter.value.status !== "all") {
      result = result.filter((t) => t.status === filter.value.status);
    }

    // Filter by search query
    if (filter.value.searchQuery.trim()) {
      const query = filter.value.searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          (t.notes && t.notes.toLowerCase().includes(query)),
      );
    }

    // Filter by date range
    if (filter.value.dateRange !== "all") {
      const { startDate, endDate } = filter.value.dateRange;
      result = result.filter((t) => t.date >= startDate && t.date <= endDate);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy.value) {
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "category":
          const categoryStore = useCategoryStore();
          const catA = categoryStore.getCategoryById(a.category)?.name || "";
          const catB = categoryStore.getCategoryById(b.category)?.name || "";
          comparison = catA.localeCompare(catB);
          break;
        case "date":
        default:
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
      }
      return sortOrder.value === "desc" ? -comparison : comparison;
    });

    return result;
  });

  // Monthly stats (current month)
  const monthlyStats = computed<MonthlyStats>(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return getMonthlyStatsInternal(currentYear, currentMonth);
  });

  // Get stats for a specific month (for comparison)
  function getMonthlyStats(year: number, month: number): MonthlyStats {
    return getMonthlyStatsInternal(year, month);
  }

  // Internal function to calculate monthly stats
  function getMonthlyStatsInternal(year: number, month: number): MonthlyStats {
    const monthTransactions = transactions.value.filter((t) => {
      const date = new Date(t.date);
      return (
        date.getMonth() === month &&
        date.getFullYear() === year &&
        t.status === "completed"
      );
    });

    const totalIncome = monthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    // Find top category
    const categoryStore = useCategoryStore();
    const expensesByCategory = new Map<number, number>();
    monthTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        if (t.category) {
          expensesByCategory.set(
            t.category,
            (expensesByCategory.get(t.category) || 0) + t.amount,
          );
        }
      });

    let topCategoryId = 0;
    let topCategoryAmount = 0;
    expensesByCategory.forEach((amount, categoryId) => {
      if (amount > topCategoryAmount) {
        topCategoryId = categoryId;
        topCategoryAmount = amount;
      }
    });

    const topCategory =
      categoryStore.getCategoryById(topCategoryId)?.name || "N/A";

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount: monthTransactions.length,
      topCategory,
      topCategoryAmount,
    };
  }

  // Chart data for expenses by category
  const expensesByCategoryChart = computed<ChartDataPoint[]>(() => {
    const categoryStore = useCategoryStore();
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const expensesByCategory = new Map<number, number>();

    transactions.value
      .filter((t) => {
        const date = new Date(t.date);
        return (
          t.type === "expense" &&
          t.status === "completed" &&
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );
      })
      .forEach((t) => {
        if (t.category) {
          expensesByCategory.set(
            t.category,
            (expensesByCategory.get(t.category) || 0) + t.amount,
          );
        }
      });

    const chartData: ChartDataPoint[] = [];
    expensesByCategory.forEach((amount, categoryId) => {
      const category = categoryStore.getCategoryById(categoryId);
      if (category) {
        chartData.push({
          label: category.name,
          value: amount,
          color: category.color,
        });
      }
    });

    return chartData.sort((a, b) => b.value - a.value);
  });

  // Last 7 days chart
  const last7DaysChart = computed<ChartDataPoint[]>(() => {
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const today = new Date();
    const result: ChartDataPoint[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const dayTransactions = transactions.value.filter((t) => {
        const tDate = new Date(t.date);
        return (
          tDate.getDate() === date.getDate() &&
          tDate.getMonth() === date.getMonth() &&
          tDate.getFullYear() === date.getFullYear() &&
          t.type === "expense" &&
          t.status === "completed"
        );
      });

      const total = dayTransactions.reduce((sum, t) => sum + t.amount, 0);
      result.push({
        label: days[date.getDay()],
        value: total,
        color: total > 0 ? "#FF6B6B" : "#e0e0e0",
      });
    }

    return result;
  });

  // Actions
  function addTransaction(
    title: string,
    amount: number,
    type: TransactionType,
    category: number | undefined,
    date: Date,
    status: TransactionStatus = "completed",
    notes?: string,
    recurrence: RecurrenceType = "none",
  ): Transaction {
    const newTransaction: Transaction = {
      id: nextId.value++,
      title: title.trim(),
      amount,
      type,
      category,
      date,
      status,
      notes,
      recurrence,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    transactions.value.push(newTransaction);
    return newTransaction;
  }

  function updateTransaction(id: number, updates: Partial<Transaction>): void {
    const transaction = transactions.value.find((t) => t.id === id);
    if (transaction) {
      Object.assign(transaction, updates, { updatedAt: new Date() });
    }
  }

  function deleteTransaction(id: number): void {
    transactions.value = transactions.value.filter((t) => t.id !== id);
  }

  function toggleStatus(id: number): void {
    const transaction = transactions.value.find((t) => t.id === id);
    if (transaction) {
      transaction.status =
        transaction.status === "completed" ? "pending" : "completed";
      transaction.updatedAt = new Date();
    }
  }

  function setFilter(newFilter: Partial<TransactionFilter>): void {
    filter.value = { ...filter.value, ...newFilter };
  }

  function resetFilter(): void {
    filter.value = {
      type: "all",
      category: "all",
      status: "all",
      searchQuery: "",
      dateRange: "all",
    };
  }

  function setSort(option: SortOption, order: SortOrder): void {
    sortBy.value = option;
    sortOrder.value = order;
  }

  function clearAll(): void {
    if (confirm("Bạn có chắc muốn xóa tất cả giao dịch?")) {
      transactions.value = [];
    }
  }

  // LocalStorage persistence
  function loadFromStorage(): void {
    const saved = localStorage.getItem("transactions");
    if (saved) {
      const parsed = JSON.parse(saved);
      transactions.value = parsed.transactions.map((t: Transaction) => ({
        ...t,
        date: new Date(t.date),
        dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt),
      }));
      nextId.value = parsed.nextId;
    }
  }

  function saveToStorage(): void {
    localStorage.setItem(
      "transactions",
      JSON.stringify({
        transactions: transactions.value,
        nextId: nextId.value,
      }),
    );
  }

  // Watch for changes and save to localStorage
  watch(
    transactions,
    () => {
      saveToStorage();
    },
    { deep: true },
  );

  // Initialize
  loadFromStorage();

  return {
    // State
    transactions,
    filter,
    sortBy,
    sortOrder,
    nextId,
    // Getters
    filteredTransactions,
    monthlyStats,
    expensesByCategoryChart,
    last7DaysChart,
    // Methods
    getMonthlyStats,
    // Actions
    addTransaction,
    updateTransaction,
    deleteTransaction,
    toggleStatus,
    setFilter,
    resetFilter,
    setSort,
    clearAll,
    loadFromStorage,
    saveToStorage,
  };
});
