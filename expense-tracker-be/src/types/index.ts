import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
  file?: Express.Multer.File;
}

// ============================================
// Audit Fields Interface (mixin cho các tables)
// ============================================
export interface AuditFields {
  createduser: string;
  createddate: Date;
  updateduser: string | null;
  updateddate: Date | null;
  isdeleted: boolean;
  deleteduser: string | null;
  deleteddate: Date | null;
  deletednote: string | null;
  cdc_timestamp: Date;
  cdc_version: number;
}

// ============================================
// User
// ============================================
export interface User {
  id: string;
  email: string;
  password: string;
  full_name: string | null;
  avatar: string | null;
  email_verified: boolean;
  email_verified_at: Date | null;
  created_at: Date;
  updated_at: Date;
  // Audit fields
  createduser: string;
  createddate: Date;
  updateduser: string | null;
  updateddate: Date | null;
  isdeleted: boolean;
  deleteduser: string | null;
  deleteddate: Date | null;
  deletednote: string | null;
  cdc_timestamp: Date;
  cdc_version: number;
}

export interface NewUser {
  email: string;
  password: string;
  full_name?: string | null;
  avatar?: string | null;
}

export interface UpdateUser {
  full_name?: string | null;
  avatar?: string | null;
  updateduser?: string;
}

// ============================================
// Category
// ============================================
export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  type: "income" | "expense";
  created_at: Date;
  // Audit fields
  createduser: string;
  createddate: Date;
  updateduser: string | null;
  updateddate: Date | null;
  isdeleted: boolean;
  deleteduser: string | null;
  deleteddate: Date | null;
  deletednote: string | null;
  cdc_timestamp: Date;
  cdc_version: number;
}

export interface NewCategory {
  name: string;
  icon: string;
  color: string;
  type: "income" | "expense";
  createduser?: string;
}

export interface UpdateCategory {
  name?: string;
  icon?: string;
  color?: string;
  updateduser?: string;
}

// ============================================
// Transaction
// ============================================
export interface Transaction {
  id: string;
  user_id: string;
  category_id: number;
  title: string;
  amount: string;
  type: "income" | "expense";
  status: "completed" | "pending" | "cancelled";
  date: Date;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
  // Audit fields
  createduser: string;
  createddate: Date;
  updateduser: string | null;
  updateddate: Date | null;
  isdeleted: boolean;
  deleteduser: string | null;
  deleteddate: Date | null;
  deletednote: string | null;
  cdc_timestamp: Date;
  cdc_version: number;
}

export interface NewTransaction {
  user_id: string;
  category_id: number;
  title: string;
  amount: string;
  type: "income" | "expense";
  status?: "completed" | "pending" | "cancelled";
  date: Date;
  notes?: string | null;
  createduser?: string;
}

export interface UpdateTransaction {
  category_id?: number;
  title?: string;
  amount?: string;
  type?: "income" | "expense";
  status?: "completed" | "pending" | "cancelled";
  date?: Date;
  notes?: string | null;
  updateduser?: string;
}

// ============================================
// Budget
// ============================================
export interface Budget {
  id: string;
  user_id: string;
  category_id: number;
  amount: string;
  spent_amount: string;
  period: "daily" | "weekly" | "monthly";
  start_date: Date;
  end_date: Date | null;
  created_at: Date;
  updated_at: Date;
  // Audit fields
  createduser: string;
  createddate: Date;
  updateduser: string | null;
  updateddate: Date | null;
  isdeleted: boolean;
  deleteduser: string | null;
  deleteddate: Date | null;
  deletednote: string | null;
  cdc_timestamp: Date;
  cdc_version: number;
}

export interface NewBudget {
  user_id: string;
  category_id: number;
  amount: string;
  period: "daily" | "weekly" | "monthly";
  start_date: Date;
  end_date?: Date | null;
  createduser?: string;
}

export interface UpdateBudget {
  category_id?: number;
  amount?: string;
  period?: "daily" | "weekly" | "monthly";
  start_date?: Date;
  end_date?: Date | null;
  updateduser?: string;
}

// ============================================
// RecurringTransaction
// ============================================
export interface RecurringTransaction {
  id: string;
  user_id: string;
  category_id: number;
  title: string;
  amount: string;
  type: "income" | "expense";
  recurrence: "daily" | "weekly" | "monthly" | "yearly";
  next_due_date: Date;
  is_active: boolean;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
  // Audit fields
  createduser: string;
  createddate: Date;
  updateduser: string | null;
  updateddate: Date | null;
  isdeleted: boolean;
  deleteduser: string | null;
  deleteddate: Date | null;
  deletednote: string | null;
  cdc_timestamp: Date;
  cdc_version: number;
}

export interface NewRecurringTransaction {
  user_id: string;
  category_id: number;
  title: string;
  amount: string;
  type: "income" | "expense";
  recurrence: "daily" | "weekly" | "monthly" | "yearly";
  next_due_date: Date;
  is_active?: boolean;
  notes?: string | null;
  createduser?: string;
}

export interface UpdateRecurringTransaction {
  category_id?: number;
  title?: string;
  amount?: string;
  type?: "income" | "expense";
  recurrence?: "daily" | "weekly" | "monthly" | "yearly";
  next_due_date?: Date;
  is_active?: boolean;
  notes?: string | null;
  updateduser?: string;
}

// ============================================
// Settings
// ============================================
export interface Settings {
  id: string;
  user_id: string;
  currency: string;
  language: string;
  theme: string;
  default_category_expense: number | null;
  default_category_income: number | null;
  created_at: Date;
  updated_at: Date;
  // Audit fields
  createduser: string;
  createddate: Date;
  updateduser: string | null;
  updateddate: Date | null;
  isdeleted: boolean;
  deleteduser: string | null;
  deleteddate: Date | null;
  deletednote: string | null;
  cdc_timestamp: Date;
  cdc_version: number;
}

export interface NewSettings {
  user_id: string;
  currency?: string;
  language?: string;
  theme?: string;
  default_category_expense?: number | null;
  default_category_income?: number | null;
  createduser?: string;
}

export interface UpdateSettings {
  currency?: string;
  language?: string;
  theme?: string;
  default_category_expense?: number | null;
  default_category_income?: number | null;
  updateduser?: string;
}

// ============================================
// API Response Types
// ============================================
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: unknown;
  };
}

export interface PaginatedResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
