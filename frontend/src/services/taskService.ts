import api from './api'
import { Task, TaskFilters, TaskFormData, TaskStats, PaginatedResponse } from '../types'

export const taskService = {
  async getTasks(filters: TaskFilters = {}): Promise<PaginatedResponse<Task>> {
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value))
      }
    })
    
    const response = await api.get(`/tasks/?${params.toString()}`)
    return response.data
  },

  async getTask(id: number): Promise<Task> {
    const response = await api.get(`/tasks/${id}/`)
    return response.data
  },

  async createTask(data: TaskFormData): Promise<Task> {
    const response = await api.post('/tasks/', data)
    return response.data
  },

  async updateTask(id: number, data: Partial<TaskFormData>): Promise<Task> {
    const response = await api.patch(`/tasks/${id}/`, data)
    return response.data
  },

  async deleteTask(id: number): Promise<void> {
    await api.delete(`/tasks/${id}/`)
  },

  async updateTaskStatus(id: number, status: Task['status']): Promise<Task> {
    const response = await api.patch(`/tasks/${id}/update_status/`, { status })
    return response.data
  },

  async getTaskStats(): Promise<TaskStats> {
    const response = await api.get('/tasks/stats/')
    return response.data
  },

  async bulkUpdateStatus(taskIds: number[], status: Task['status']): Promise<{ updated_count: number }> {
    const response = await api.post('/tasks/bulk_update_status/', {
      task_ids: taskIds,
      status
    })
    return response.data
  },

  async bulkDelete(taskIds: number[]): Promise<{ deleted_count: number }> {
    const response = await api.delete('/tasks/bulk_delete/', {
      data: { task_ids: taskIds }
    })
    return response.data
  }
} 