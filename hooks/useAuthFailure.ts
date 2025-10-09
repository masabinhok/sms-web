'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/authStore'

/**
 * Hook to handle global auth failure events
 * Listens for custom 'auth:failure' events and handles logout/redirect
 */
export function useAuthFailureHandler() {
  const router = useRouter()
  const { logout, clearError } = useAuth()

  useEffect(() => {
    const handleAuthFailure = async () => {
      console.log('Auth failure detected, logging out...')
      
      try {
        await logout()
      } catch (error) {
        console.error('Logout failed:', error)
      }
      
      clearError()
      router.replace('/auth/login')
    }

    // Listen for auth failure events from API client
    window.addEventListener('auth:failure', handleAuthFailure)

    return () => {
      window.removeEventListener('auth:failure', handleAuthFailure)
    }
  }, [router, logout, clearError])
}

/**
 * Component to handle auth failures globally
 * Add this to your root layout or app component
 */
export function AuthFailureHandler() {
  useAuthFailureHandler()
  return null
}