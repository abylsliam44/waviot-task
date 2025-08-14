import React from 'react'
import { Task } from '../types'
import Button from './ui/Button'
import { Edit3, Trash2, CheckSquare, Clock, Calendar, Archive, CheckCircle, AlertCircle } from 'lucide-react'

interface TaskCardProps {
  task: Task
  onEdit: () => void
  onDelete: () => void
  onStatusChange: (status: string) => void
  onSelect?: (selected: boolean) => void
  isSelected?: boolean
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  onSelect,
  isSelected = false
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'done':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'archived':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'done':
        return <CheckCircle className="w-4 h-4" />
      case 'archived':
        return <Archive className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'

  return (
    <div className={`
      bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1
      ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}
      ${isOverdue ? 'border-red-200 bg-red-50' : ''}
    `}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {onSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelect(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-200"
              />
            )}
            
            <div className="flex-1">
              <h3 className={`text-lg font-semibold text-gray-900 mb-1 ${task.status === 'done' ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-gray-600 text-sm line-clamp-2">{task.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`
              inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
              ${getStatusColor(task.status)}
            `}>
              {getStatusIcon(task.status)}
              <span className="ml-1 capitalize">{task.status}</span>
            </span>
          </div>
        </div>

        {/* Meta Information */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Created: {formatDate(task.created_at)}</span>
            </div>
            
            {task.due_date && (
              <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-600' : ''}`}>
                <Clock className="w-4 h-4" />
                <span>Due: {formatDate(task.due_date)}</span>
                {isOverdue && <AlertCircle className="w-4 h-4 ml-1" />}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            {task.status !== 'done' && (
              <Button
                onClick={() => onStatusChange('done')}
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <CheckSquare className="w-4 h-4 mr-1" />
                Mark Done
              </Button>
            )}
            
            {task.status !== 'archived' && (
              <Button
                onClick={() => onStatusChange('archived')}
                variant="secondary"
                size="sm"
                className="px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-purple-50 hover:text-purple-700"
              >
                <Archive className="w-4 h-4 mr-1" />
                Archive
              </Button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={onEdit}
              variant="secondary"
              size="sm"
              className="px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Edit
            </Button>
            
            <Button
              onClick={onDelete}
              variant="danger"
              size="sm"
              className="px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskCard 