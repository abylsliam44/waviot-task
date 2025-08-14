import api from './api'
import { User, LoginData, RegisterData } from '../types'

export const authService = {
  async login(data: LoginData) {
    const response = await api.post('/auth/login/', data)
    const { access, refresh, user } = response.data
    
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
    
    return { user, tokens: { access, refresh } }
  },

  async register(data: RegisterData) {
    const response = await api.post('/auth/register/', data)
    return response.data
  },

  async logout() {
    const refreshToken = localStorage.getItem('refresh_token')
    
    if (refreshToken) {
      try {
        await api.post('/auth/logout/', { refresh: refreshToken })
      } catch (error) {
        // Even if logout fails on server, clear local tokens
        console.error('Logout error:', error)
      }
    }
    
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile/')
    return response.data
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put('/auth/profile/', data)
    return response.data
  },

  async changePassword(data: {
    old_password: string
    new_password: string
    new_password_confirm: string
  }) {
    const response = await api.post('/auth/change-password/', data)
    return response.data
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token')
  },

  getAccessToken(): string | null {
    return localStorage.getItem('access_token')
  },

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token')
  }
} 