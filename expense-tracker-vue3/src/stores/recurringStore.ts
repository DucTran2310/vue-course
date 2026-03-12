import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type {
  RecurrenceType,
  RecurringTransaction,
  Transaction,
} from "../types";
import { useTransactionStore } from "./transactionStore";

export const useRecurringStore = defineStore("recurring", () => {
  // State
  const recurringTransactions = ref<RecurringTransaction[]>([]);
  const lastCheckDate = ref<Date | null>(null);

  // Load from localStorage
  function loadFromStorage(): void {
    const saved = localStorage.getItem("recurringTransactions");
    if (saved) {
      const parsed = JSON.parse(saved);
      recurringTransactions.value = parsed.map((item: any) => ({
        ...item,
        nextDueDate: new Date(item.nextDueDate),
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      }));
    }
    const lastCheck = localStorage.getItem("lastCheckDate");
    if (lastCheck) {
      lastCheckDate.value = new Date(lastCheck);
    }
  }

  // Save to localStorage
  function saveToStorage(): void {
    localStorage.setItem(
      "recurringTransactions",
      JSON.stringify(recurringTransactions.value),
    );
    if (lastCheckDate.value) {
      localStorage.setItem("lastCheckDate", lastCheckDate.value.toISOString());
    }
  }

  // Getters
  const activeRecurringTransactions = computed(() =>
    recurringTransactions.value.filter((r) => r.isActive),
  );

  const inactiveRecurringTransactions = computed(() =>
    recurringTransactions.value.filter((r) => !r.isActive),
  );

  const dueSoonTransactions = computed(() => {
    const now = new Date();
    const threeDaysFromNow = new Date(now);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    return activeRecurringTransactions.value.filter(
      (r) => r.nextDueDate <= threeDaysFromNow,
    );
  });

  // Count upcoming transactions for each recurrence type
  const upcomingCounts = computed(() => {
    const counts: Record<RecurrenceType, number> = {
      none: 0,
      daily: 0,
      weekly: 0,
      monthly: 0,
      yearly: 0,
    };

    now: for (const recur of activeRecurringTransactions.value) {
      const nextDate = calculateNextDueDate(recur);
      if (nextDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) {
        counts[recur.recurrence]++;
      }
    }

    return counts;
  });

  // Actions
  function addRecurringTransaction(
    data: Omit<RecurringTransaction, "id" | "createdAt" | "updatedAt">,
  ): void {
    const id = Date.now();
    const now = new Date();
    const newRecurring: RecurringTransaction = {
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    recurringTransactions.value.push(newRecurring);
    saveToStorage();
  }

  function updateRecurringTransaction(
    id: number,
    updates: Partial<RecurringTransaction>,
  ): void {
    const index = recurringTransactions.value.findIndex((r) => r.id === id);
    if (index !== -1) {
      recurringTransactions.value[index] = {
        ...recurringTransactions.value[index],
        ...updates,
        updatedAt: new Date(),
      };
      saveToStorage();
    }
  }

  function deleteRecurringTransaction(id: number): void {
    recurringTransactions.value = recurringTransactions.value.filter(
      (r) => r.id !== id,
    );
    saveToStorage();
  }

  function toggleRecurringTransaction(id: number): void {
    const item = recurringTransactions.value.find((r) => r.id === id);
    if (item) {
      item.isActive = !item.isActive;
      item.updatedAt = new Date();
      saveToStorage();
    }
  }

  // Calculate next due date based on recurrence type
  function calculateNextDueDate(recurring: RecurringTransaction): Date {
    const nextDate = new Date(recurring.nextDueDate);

    switch (recurring.recurrence) {
      case "daily":
        nextDate.setDate(nextDate.getDate() + 1);
        break;
      case "weekly":
        nextDate.setDate(nextDate.getDate() + 7);
        break;
      case "monthly":
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case "yearly":
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
      default:
        break;
    }

    return nextDate;
  }

  // Process recurring transactions and create actual transactions
  function processRecurringTransactions(): Transaction[] {
    const now = new Date();
    const createdTransactions: Transaction[] = [];
    const transactionStore = useTransactionStore();

    activeRecurringTransactions.value.forEach((recurring) => {
      while (recurring.nextDueDate <= now) {
        // Create actual transaction
        const newTransaction: Transaction = {
          id: Date.now() + Math.random(),
          title: recurring.title,
          amount: recurring.amount,
          type: recurring.type,
          category: recurring.category,
          date: new Date(recurring.nextDueDate),
          status: "pending",
          notes: recurring.notes,
          recurrence: "none",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        transactionStore.addTransaction(
          newTransaction.title,
          newTransaction.amount,
          newTransaction.type,
          newTransaction.category,
          newTransaction.date,
          newTransaction.status,
          newTransaction.notes,
        );
        createdTransactions.push(newTransaction);

        // Update next due date
        const nextDate = calculateNextDueDate(recurring);
        recurring.nextDueDate = nextDate;
        recurring.updatedAt = new Date();
      }
    });

    if (createdTransactions.length > 0) {
      saveToStorage();
    }

    lastCheckDate.value = now;
    localStorage.setItem("lastCheckDate", now.toISOString());

    return createdTransactions;
  }

  // Check if we need to process recurring transactions
  function checkAndProcessRecurring(): Transaction[] {
    const now = new Date();

    // Check if we've already processed recently (last 24 hours)
    if (lastCheckDate.value) {
      const hoursSinceLastCheck =
        (now.getTime() - lastCheckDate.value.getTime()) / (1000 * 60 * 60);

      // Only check every 24 hours
      if (hoursSinceLastCheck < 24) {
        return [];
      }
    }

    return processRecurringTransactions();
  }

  // Get recurring transaction by ID
  function getRecurringById(id: number): RecurringTransaction | undefined {
    return recurringTransactions.value.find((r) => r.id === id);
  }

  // Initialize
  loadFromStorage();

  return {
    recurringTransactions,
    activeRecurringTransactions,
    inactiveRecurringTransactions,
    dueSoonTransactions,
    upcomingCounts,
    addRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
    toggleRecurringTransaction,
    calculateNextDueDate,
    processRecurringTransactions,
    checkAndProcessRecurring,
    getRecurringById,
    loadFromStorage,
    saveToStorage,
  };
});
