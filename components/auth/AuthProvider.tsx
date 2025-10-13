'use client'

import { useAuth } from '@/store/authStore'
import { useEffect, useRef } from 'react'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { fetchUser, isAuthenticated } = useAuth()
  const hasInitialized = useRef(false)

  // Initialize auth state on app start
  useEffect(() => {
    // Only run once on mount
    if (hasInitialized.current) return
    hasInitialized.current = true

    // Only fetch user if already authenticated or have cookies
    if (isAuthenticated) {
      console.log('Already authenticated from store')
      return
    }

    // Check if we have cookies that suggest we're logged in
    const hasTokenCookie = document.cookie.includes('access_token=') || 
                          document.cookie.includes('refresh_token=')
    
    if (hasTokenCookie) {
      console.log('Auth cookies detected, fetching user profile')
      fetchUser()
    } else {
      console.log('No auth cookies found, skipping initialization')
    }
  }, []) // Empty deps array - only run once on mount

  return <>{children}</>
}