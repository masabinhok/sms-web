export type UserRole = 'SUPERADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT'

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
  profileId?: string
  profileEmail?: string
  email?: string
  name?: string
  createdAt?: string
  updatedAt?: string
}

export interface ApiUserResponse {
  success: boolean
  message: string
  user: User
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (credentials: LoginCredentials, role: UserRole) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}
