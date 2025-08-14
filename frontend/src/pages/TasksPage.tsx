import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTasks, useTaskStats, useCreateTask, useUpdateTask, useDeleteTask, useUpdateTaskStatus, useBulkUpdateStatus, useBulkDelete } from '../hooks/useTasks'
import { Task, TaskFilters } from '../types'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { Plus, Search, Filter, BarChart3, User, LogOut, CheckSquare, Archive, Trash2, RefreshCw } from 'lucide-react'

const TasksPage: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filters, setFilters] = useState<TaskFilters>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTasks, setSelectedTasks] = useState<number[]>([])

  const { data: tasksData, isLoading: tasksLoading } = useTasks(filters)
  const { data: stats } = useTaskStats()
  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()
  const updateStatusMutation = useUpdateTaskStatus()
  const bulkUpdateMutation = useBulkUpdateStatus()
  const bulkDeleteMutation = useBulkDelete()

  const handleCreateTask = async (data: any) => {
    await createTaskMutation.mutateAsync(data)
    setShowCreateModal(false)
  }

  const handleUpdateTask = async (data: any) => {
    if (editingTask) {
      await updateTaskMutation.mutateAsync({ id: editingTask.id, ...data })
      setEditingTask(null)
    }
  }

  const handleDeleteTask = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTaskMutation.mutateAsync(taskId)
    }
  }

  const handleStatusUpdate = async (taskId: number, status: string) => {
    await updateStatusMutation.mutateAsync({ id: taskId, status })
  }

  const handleBulkAction = async (action: 'done' | 'archived' | 'delete') => {
    if (selectedTasks.length === 0) return

    if (action === 'delete') {
      if (window.confirm(`Are you sure you want to delete ${selectedTasks.length} tasks?`)) {
        await bulkDeleteMutation.mutateAsync(selectedTasks)
        setSelectedTasks([])
      }
    } else {
      await bulkUpdateMutation.mutateAsync({ ids: selectedTasks, status: action })
      setSelectedTasks([])
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const filteredTasks = tasksData?.results || []
  const totalTasks = tasksData?.count || 0

  if (tasksLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Task Manager
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/profile')}
                variant="secondary"
                className="flex items-center space-x-2 hover:bg-blue-50 transition-colors duration-200"
              >
                <User className="w-4 h-4" />
                <span>{user?.first_name}</span>
              </Button>
              
              <Button
                onClick={handleLogout}
                variant="secondary"
                className="flex items-center space-x-2 hover:bg-red-50 text-red-600 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fade-in">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <CheckSquare className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.pending || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckSquare className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.done || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Archive className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Archived</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.archived || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 animate-slide-up">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value || undefined }))}
                className="input w-full sm:w-40"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="done">Done</option>
                <option value="archived">Archived</option>
              </select>
              
              <select
                value={filters.overdue || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, overdue: e.target.value || undefined }))}
                className="input w-full sm:w-40"
              >
                <option value="">All Tasks</option>
                <option value="true">Overdue</option>
                <option value="false">Not Overdue</option>
              </select>
            </div>
            
            <div className="flex space-x-3">
              {selectedTasks.length > 0 && (
                <>
                  <Button
                    onClick={() => handleBulkAction('done')}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Mark Done ({selectedTasks.length})
                  </Button>
                  <Button
                    onClick={() => handleBulkAction('archived')}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    Archive ({selectedTasks.length})
                  </Button>
                  <Button
                    onClick={() => handleBulkAction('delete')}
                    variant="danger"
                    className="px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete ({selectedTasks.length})
                  </Button>
                </>
              )}
              
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4 animate-fade-in-delayed">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first task!</p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => setEditingTask(task)}
                onDelete={() => handleDeleteTask(task.id)}
                onStatusChange={(status) => handleStatusUpdate(task.id, status)}
                onSelect={(selected) => {
                  if (selected) {
                    setSelectedTasks(prev => [...prev, task.id])
                  } else {
                    setSelectedTasks(prev => prev.filter(id => id !== task.id))
                  }
                }}
                isSelected={selectedTasks.includes(task.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Task"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowCreateModal(false)}
          isLoading={createTaskMutation.isPending}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleUpdateTask}
          onCancel={() => setEditingTask(null)}
          isLoading={updateTaskMutation.isPending}
        />
      </Modal>
    </div>
  )
}

export default TasksPage 