export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT'

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  message: string
  accessToken?: string
  refreshToken?: string
}

export interface User {
  id: string
  username: string
  role: UserRole
  email?: string
  name?: string
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (credentials: LoginCredentials, role: UserRole) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}
