import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, LoginData, RegisterData } from '../types'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (data: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getProfile()
          setUser(userData)
        } catch (error) {
          // Token might be invalid, clear it
          authService.logout()
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (data: LoginData) => {
    try {
      const result = await authService.login(data)
      setUser(result.user)
      toast.success('Successfully logged in!')
    } catch (error: any) {
      const message = error.response?.data?.non_field_errors?.[0] || 
                     error.response?.data?.detail || 
                     'Login failed'
      toast.error(message)
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    try {
      await authService.register(data)
      toast.success('Registration successful! Please log in.')
    } catch (error: any) {
      const errors = error.response?.data
      if (errors) {
        Object.values(errors).forEach((messages: any) => {
          if (Array.isArray(messages)) {
            messages.forEach((message: string) => toast.error(message))
          } else {
            toast.error(String(messages))
          }
        })
      } else {
        toast.error('Registration failed')
      }
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    toast.success('Successfully logged out!')
  }

  const updateUser = async (data: Partial<User>) => {
    try {
      const updatedUser = await authService.updateProfile(data)
      setUser(updatedUser)
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Update failed'
      toast.error(message)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 