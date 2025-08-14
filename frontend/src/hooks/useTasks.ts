import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskService } from '../services/taskService'
import { TaskFilters, TaskFormData, Task } from '../types'
import toast from 'react-hot-toast'

export const useTasks = (filters: TaskFilters = {}) => {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => taskService.getTasks(filters),
  })
}

export const useTask = (id: number) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => taskService.getTask(id),
    enabled: !!id,
  })
}

export const useTaskStats = () => {
  return useQuery({
    queryKey: ['taskStats'],
    queryFn: taskService.getTaskStats,
  })
}

export const useCreateTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: TaskFormData) => taskService.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['taskStats'] })
      toast.success('Task created successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to create task'
      toast.error(message)
    },
  })
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TaskFormData> }) => 
      taskService.updateTask(id, data),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['task', updatedTask.id] })
      queryClient.invalidateQueries({ queryKey: ['taskStats'] })
      toast.success('Task updated successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to update task'
      toast.error(message)
    },
  })
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['taskStats'] })
      toast.success('Task deleted successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to delete task'
      toast.error(message)
    },
  })
}

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: Task['status'] }) => 
      taskService.updateTaskStatus(id, status),
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['task', updatedTask.id] })
      queryClient.invalidateQueries({ queryKey: ['taskStats'] })
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to update task status'
      toast.error(message)
    },
  })
}

export const useBulkUpdateStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ taskIds, status }: { taskIds: number[]; status: Task['status'] }) => 
      taskService.bulkUpdateStatus(taskIds, status),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['taskStats'] })
      toast.success(`${result.updated_count} tasks updated successfully!`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to update tasks'
      toast.error(message)
    },
  })
}

export const useBulkDelete = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (taskIds: number[]) => taskService.bulkDelete(taskIds),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['taskStats'] })
      toast.success(`${result.deleted_count} tasks deleted successfully!`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to delete tasks'
      toast.error(message)
    },
  })
} 