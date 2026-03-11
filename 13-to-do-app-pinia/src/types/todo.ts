export type Priority = 'high' | 'medium' | 'low'
export type FilterType = 'all' | 'active' | 'done'
export type SortType = 'created' | 'priority' | 'alpha'

export interface Todo {
  id: string
  text: string
  done: boolean
  priority: Priority
  createdAt: number
  tags: string[]
  category?: string
  description?: string
  dueDate?: number
}

export interface TodoStats {
  total: number
  done: number
  active: number
  percent: number
  byPriority: Record<Priority, number>
}
