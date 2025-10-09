import { ApiUserResponse } from "@/types/auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

interface ApiOptions extends RequestInit {
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
        // Refresh failed, redirect to login
        window.location.href = '/auth/login'
        throw new Error('Session expired. Please log in again.')
      }
    }

    const responseData = await response.json()

    if (!response.ok) {
      throw new Error(responseData.message || 'API request failed')
    }

    return responseData
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
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      })

      return response.ok
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

// Auth API methods
export const authApi = {
  login: (username: string, password: string, role: string) =>
    api.post('/auth/login', { username, password, role }),

  logout: () =>
    api.post('/auth/logout'),

  refresh: () =>
    api.post('/auth/refresh'),

  changePassword: (oldPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { oldPassword, newPassword }),

  getProfile: async () => {
    const response = await api.get<ApiUserResponse>('/auth/me')
    return response.user // Extract just the user object
  }
}
