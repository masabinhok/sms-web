'use client'

import { useAuth } from '@/store/authStore'
import { useEffect } from 'react'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { fetchUser, isAuthenticated } = useAuth()

  // Initialize auth state on app start
  useEffect(() => {
    // Only fetch user if we think we might be authenticated
    // (this prevents unnecessary API calls on public pages)
    if (!isAuthenticated) {
      // Check if we have cookies that suggest we're logged in
      const hasTokenCookie = document.cookie.includes('access_token=')
      if (hasTokenCookie) {
        fetchUser()
      }
    }
  }, [fetchUser, isAuthenticated])

  return <>{children}</>
}