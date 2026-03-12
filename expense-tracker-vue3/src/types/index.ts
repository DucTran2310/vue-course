// Types cho Expense Tracker

export type TransactionType = "expense" | "income";

export type TransactionStatus = "pending" | "completed" | "cancelled";

export type RecurrenceType = "none" | "daily" | "weekly" | "monthly" | "yearly";

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: TransactionType;
  category: number | undefined;
  date: Date;
  dueDate?: Date;
  status: TransactionStatus;
  notes?: string;
  recurrence: RecurrenceType;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecurringTransaction {
  id: number;
  title: string;
  amount: number;
  type: TransactionType;
  category: number | undefined;
  nextDueDate: Date;
  recurrence: RecurrenceType;
  dayOfWeek?: number; // 0-6 (Sunday-Saturday) for weekly
  dayOfMonth?: number; // 1-31 for monthly
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  budget?: number;
}

export interface Budget {
  categoryId: number;
  amount: number;
  period: "daily" | "weekly" | "monthly";
  spent: number;
  startDate: Date;
  endDate: Date;
}

export type Locale = "vi" | "en";

export interface Settings {
  currency: string;
  locale: Locale;
  defaultCategoryExpense: number | undefined;
  defaultCategoryIncome: number | undefined;
  defaultView: "dashboard" | "transactions" | "budget";
  showCompletedTransactions: boolean;
  enableDarkMode: boolean;
  enableNotifications: boolean;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color: string;
}

export interface MonthlyStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  topCategory: string;
  topCategoryAmount: number;
}

export interface DateRangeFilter {
  startDate: Date;
  endDate: Date;
}

export type TransactionFilter = {
  type: TransactionType | "all";
  category: number | "all";
  status: TransactionStatus | "all";
  searchQuery: string;
  dateRange: DateRangeFilter | "all";
};

export type SortOption = "date" | "amount" | "title" | "category";
export type SortOrder = "asc" | "desc";
