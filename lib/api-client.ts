import { ApiUserResponse } from "@/types/auth"
import { getApiUrl } from './env';
import { logger, logError, authLogger } from './logger';

const API_BASE_URL = getApiUrl();

interface ApiOptions extends RequestInit {
  data?: unknown
}

interface ApiError {
  status: number
  message: string
  data?: unknown
}

class ApiClient {
  private baseUrl: string
  private isRefreshing = false
  private refreshPromise: Promise<boolean> | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: ApiOptions = {}
  ): Promise<T> {
    const { data, headers, ...restOptions } = options

    // Get token from localStorage for cross-domain scenarios
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

    const config: RequestInit = {
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...headers,
      },
      credentials: 'include', // Important for cookies
    }

    if (data) {
      config.body = JSON.stringify(data)
    }

    let response = await fetch(`${this.baseUrl}${endpoint}`, config)

    // Handle 401 - token expired
    if (response.status === 401 && endpoint !== '/auth/refresh' && endpoint !== '/auth/logout' && endpoint !== '/auth/login') {
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
      logger.warn('Failed to parse response JSON:', error)
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

  private createApiError(status: number, message: string, data?: unknown): ApiError {
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
        // Store not available, fall back to redirect to homepage
        if (typeof window !== 'undefined') {
          window.location.href = '/'
        }
      })
    } catch {
      // Fallback to direct redirect to homepage
      if (typeof window !== 'undefined') {
        window.location.href = '/'
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
        // Store new access token in localStorage for cross-domain requests
        if (typeof window !== 'undefined') {
          try {
            const data = await response.json()
            if (data.newAccessToken) {
              localStorage.setItem('access_token', data.newAccessToken)
            }
          } catch {
            // Response might not have JSON body, that's okay
          }
        }
        authLogger.tokenRefresh(true);
        return true
      } else {
        authLogger.tokenRefresh(false);
        return false
      }
    } catch (error) {
      logError(error, 'Token refresh');
      return false
    }
  }

  async get<T>(endpoint: string, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: unknown, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', data })
  }

  async put<T>(endpoint: string, data?: unknown, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', data })
  }

  async patch<T>(endpoint: string, data?: unknown, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', data })
  }

  async delete<T>(endpoint: string, options?: ApiOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

export const api = new ApiClient(API_BASE_URL)

// Auth API methods with improved error handling
export const authApi = {
  login: async (username: string, password: string, role: string) => {
    const response = await api.post<{message?: string, requiresPasswordChange?: boolean, passwordChangeCount?: number, access_token?: string, refresh_token?: string}>('/auth/login', { username, password, role });
    
    // Store tokens in localStorage for cross-domain scenarios
    if (typeof window !== 'undefined' && response.access_token) {
      localStorage.setItem('access_token', response.access_token);
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }
    }
    
    return response;
  },

  logout: async () => {
    // Use Next.js API route for logout to properly clear cookies
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error('Logout failed')
    }
    return response.json()
  },

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
        authLogger.tokenRefresh(true);
        return true
      } else {
        const errorText = await response.text().catch(() => '')
        logger.warn('Token refresh failed:', response.status, errorText)
        return false
      }
    } catch (error) {
      logError(error, 'Token refresh');
      return false
    }
  }
}

// Export ApiError type for better error handling in components
export type { ApiError }
