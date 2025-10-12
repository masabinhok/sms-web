import { ApiUserResponse } from "@/types/auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

interface ApiOptions extends RequestInit {
  data?: any
}

interface ApiError {
  status: number
  message: string
  data?: any
}

class ApiClient {
  private baseUrl: string
  private isRefreshing = false
  private refreshPromise: Promise<any> | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: ApiOptions = {}
  ): Promise<T> {
    const { data, headers, ...restOptions } = options

    const config: RequestInit = {
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      credentials: 'include', // Important for cookies
    }

    if (data) {
      config.body = JSON.stringify(data)
    }

    let response = await fetch(`${this.baseUrl}${endpoint}`, config)

    // Handle 401 - token expired
    if (response.status === 401 && endpoint !== '/auth/refresh') {
      // Try to refresh token
      const refreshed = await this.refreshToken()
      
      if (refreshed) {
        // Retry original request
        response = await fetch(`${this.baseUrl}${endpoint}`, config)
      } else {
        // Refresh failed, emit auth failure event
        this.handleAuthFailure()
        throw this.createApiError(401, 'Session expired. Please log in again.')
      }
    }

    // Handle JSON parsing safely
    let responseData = null
    try {
      const text = await response.text()
      responseData = text ? JSON.parse(text) : null
    } catch (error) {
      console.warn('Failed to parse response JSON:', error)
      responseData = null
    }

    if (!response.ok) {
      throw this.createApiError(
        response.status,
        responseData?.message || `Request failed with status ${response.status}`,
        responseData
      )
    }

    return responseData
  }

  private createApiError(status: number, message: string, data?: any): ApiError {
    return { status, message, data }
  }

  private handleAuthFailure(): void {
    // Option 1: Emit custom event for auth failure
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('auth:failure'))
    }

    // Option 2: Use Zustand store to reset auth (if available)
    try {
      // Import dynamically to avoid issues in SSR
      import('@/store/authStore').then(({ useAuth }) => {
        const store = useAuth.getState()
        if (store.logout) {
          store.logout()
        }
      }).catch(() => {
        // Store not available, fall back to redirect
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login'
        }
      })
    } catch {
      // Fallback to direct redirect
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login'
      }
    }
  }

  private async refreshToken(): Promise<boolean> {
    // Prevent multiple refresh attempts
    if (this.isRefreshing) {
      return this.refreshPromise || Promise.resolve(false)
    }

    this.isRefreshing = true
    this.refreshPromise = this.performRefresh()

    try {
      const result = await this.refreshPromise
      return result
    } finally {
      this.isRefreshing = false
      this.refreshPromise = null
    }
  }

  private async performRefresh(): Promise<boolean> {
    try {
      // Use Next.js API route for refresh
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        // Parse response to get token info if available
        try {
          const data = await response.text()
          const result = data ? JSON.parse(data) : {}
          console.log('Token refreshed successfully:', result)
          return true
        } catch {
          // Even if JSON parsing fails, if response is ok, consider it success
          console.log('Token refreshed successfully')
          return true
        }
      } else {
        console.log('Token refresh failed with status:', response.status)
        return false
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      return false
    }
  }

  async get<T>(endpoint: string, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', data })
  }

  async put<T>(endpoint: string, data?: any, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', data })
  }

  async delete<T>(endpoint: string, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

export const api = new ApiClient(API_BASE_URL)

// Auth API methods with improved error handling
export const authApi = {
  login: (username: string, password: string, role: string) =>
    api.post<{message?: string}>('/auth/login', { username, password, role }),

  logout: () =>
    api.post<{message?: string}>('/auth/logout'),

  refresh: () =>
    api.post<{message?: string}>('/auth/refresh'),

  changePassword: (oldPassword: string, newPassword: string) =>
    api.post<{message?: string}>('/auth/change-password', { oldPassword, newPassword }),

  getProfile: async () => {
    const response = await api.get<ApiUserResponse>('/auth/me')
    return response.user // Extract just the user object
  },

  // Enhanced method to check and refresh token via Next.js API route
  checkAndRefreshToken: async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        console.log('Token refreshed successfully via API route')
        return true
      } else {
        const errorText = await response.text().catch(() => '')
        console.log('Token refresh failed:', response.status, errorText)
        return false
      }
    } catch (error) {
      console.error('Token refresh error:', error)
      return false
    }
  }
}

// Export ApiError type for better error handling in components
export type { ApiError }
