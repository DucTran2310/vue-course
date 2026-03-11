// Định nghĩa mức độ ưu tiên
export type Priority = "low" | "medium" | "high";

// Định nghĩa loại danh mục
export interface Category {
  id: number;
  name: string;
  color: string;
}

// Định nghĩa kiểu dữ liệu cho Todo
export interface Todo {
  id: number;
  text: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  priority: Priority;
  category?: number;
}

// Định nghĩa kiểu filter
export type FilterType = "all" | "active" | "completed";

// Định nghĩa kiểu sort
export type SortType = "date" | "priority" | "dueDate" | "name";
