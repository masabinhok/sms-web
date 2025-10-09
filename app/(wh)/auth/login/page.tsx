"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useAuth } from '@/store/authStore'
import { UserRole } from '@/types/auth'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, loading, error, clearError, isAuthenticated } = useAuth()
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'ADMIN' as UserRole
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = searchParams.get('from') || `/${formData.role.toLowerCase()}`
      router.push(from)
    }
  }, [isAuthenticated, router, searchParams, formData.role])

  // Clear error when component mounts
  useEffect(() => {
    clearError()
  }, [clearError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    try {
      await login(
        { username: formData.username, password: formData.password },
        formData.role
      )

      // Redirect will be handled by the useEffect above
    } catch (err) {
      // Error is already handled by the store
      console.error('Login error:', err)
    }
  }

  return (
    <div className="min-h-screen flex justify-center  pt-10 bg-gray-50">
      <div className="w-full max-w-md px-6">
        
        {/* Header */}
        <div className="text-center mb-10">
          <p className=" font-bold text-2xl">
            <b>SMS - AUTHENTICATION</b>
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-900 mb-2">
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Enter your username"
              required
              className="w-full border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              required
              minLength={6}
              className="w-full border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
              disabled={loading}
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Role
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['STUDENT', 'TEACHER', 'ADMIN'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData({ ...formData, role })}
                  disabled={loading}
                  className={`
                    px-4 py-3 text-sm font-medium border transition-colors
                    ${formData.role === role 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-black text-white hover:bg-gray-800 py-6 text-base font-medium"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          {/* Forgot Password Link */}
          <div className="text-center">
            <Link 
              href="/auth/forgot-password" 
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}