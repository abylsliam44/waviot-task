export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: number
  title: string
  description?: string
  status: 'pending' | 'done' | 'archived'
  user: string
  due_date?: string
  is_overdue: boolean
  created_at: string
  updated_at: string
}

export interface TaskFilters {
  status?: Task['status']
  created_date?: string
  created_date_gte?: string
  created_date_lte?: string
  due_date?: string
  due_date_gte?: string
  due_date_lte?: string
  overdue?: boolean
  search?: string
  ordering?: string
  page?: number
}

export interface TaskStats {
  total: number
  pending: number
  done: number
  archived: number
  overdue: number
}

export interface LoginData {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  password_confirm: string
  first_name?: string
  last_name?: string
}

export interface TaskFormData {
  title: string
  description?: string
  status: Task['status']
  due_date?: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
} 