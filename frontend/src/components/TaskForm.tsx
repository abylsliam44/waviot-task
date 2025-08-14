import React, { useEffect, useState } from 'react'
import { Task, TaskFormData } from '../types'
import Button from './ui/Button'
import Input from './ui/Input'

interface TaskFormProps {
  task?: Task
  onSubmit: (data: TaskFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    status: 'pending',
    due_date: ''
  })
  const [errors, setErrors] = useState<Partial<TaskFormData>>({})

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        due_date: task.due_date ? task.due_date.split('T')[0] : ''
      })
    }
  }, [task])

  const validateForm = (): boolean => {
    const newErrors: Partial<TaskFormData> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof TaskFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    onSubmit({
      ...formData,
      due_date: formData.due_date || undefined
    })
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <Input
        label="Title"
        type="text"
        required
        value={formData.title}
        onChange={(e) => handleInputChange('title', e.target.value)}
        error={errors.title}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          className="textarea w-full"
          rows={3}
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
        {errors.description && (
          <p className="text-sm text-red-600 mt-1">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          className="input w-full"
          value={formData.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="done">Done</option>
          <option value="archived">Archived</option>
        </select>
        {errors.status && (
          <p className="text-sm text-red-600 mt-1">{errors.status}</p>
        )}
      </div>

      <Input
        label="Due Date (optional)"
        type="date"
        value={formData.due_date}
        onChange={(e) => handleInputChange('due_date', e.target.value)}
        error={errors.due_date}
      />

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isLoading}
        >
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  )
}

export default TaskForm 