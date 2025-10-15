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

  // Listen for logout events from other tabs or parts of the app and clear state
  useEffect(() => {
    const onLoggedOut = () => {
      console.log('Received auth:logged-out event, clearing local auth state')
      try {
        // Reset store state directly
        const store = useAuth.getState()
        if (store && store.logout) {
          // Ensure the store is cleared (logout handles persist cleanup)
          store.logout()
        } else {
          // Fallback: set state manually
          useAuth.setState({ user: null, isAuthenticated: false, loading: false, error: null } as any)
        }
      } catch (err) {
        console.warn('Failed to handle logged-out event', err)
      }
      // Redirect to home to avoid stale protected routes
      window.location.href = '/'
    }

    window.addEventListener('auth:logged-out', onLoggedOut)
    return () => window.removeEventListener('auth:logged-out', onLoggedOut)
  }, [])

  return <>{children}</>
}