import axios from 'axios'
import toast from 'react-hot-toast'

// Универсальная конфигурация API
const getApiUrl = () => {
  // Для production используем VITE_API_URL
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // Для development используем localhost
  if (import.meta.env.DEV) {
    return 'http://localhost:8000/api'
  }
  
  // Fallback для production
  return 'https://your-backend.onrender.com/api'
}

const api = axios.create({
  baseURL: getApiUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor для добавления JWT токена
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor для обработки ошибок и обновления токенов
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Если ошибка 401 и это не повторный запрос
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          const response = await axios.post(`${getApiUrl()}/auth/refresh/`, {
            refresh: refreshToken
          })
          
          const { access } = response.data
          localStorage.setItem('access_token', access)
          
          // Повторяем оригинальный запрос с новым токеном
          originalRequest.headers.Authorization = `Bearer ${access}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Если refresh токен недействителен, очищаем localStorage
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Обработка других ошибок
    if (error.response?.data?.message) {
      toast.error(error.response.data.message)
    } else if (error.response?.data) {
      // Если есть детали ошибки, показываем первое сообщение
      const errorMessages = Object.values(error.response.data)
      if (Array.isArray(errorMessages) && errorMessages.length > 0) {
        toast.error(String(errorMessages[0]))
      } else {
        toast.error('An error occurred')
      }
    } else if (error.message) {
      toast.error(error.message)
    } else {
      toast.error('An unexpected error occurred')
    }

    return Promise.reject(error)
  }
)

export default api 