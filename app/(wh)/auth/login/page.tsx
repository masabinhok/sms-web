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
      const from = searchParams.get('from')
      if (from && from !== '/auth/login') {
        router.push(from)
      } else {
        router.push(`/${formData.role.toLowerCase()}`)
      }
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

      const from = searchParams.get('from')
      if (from && from !== '/auth/login') {
        router.push(from)
      } else {
        router.push(`/${formData.role.toLowerCase()}`)
      }
    } catch (err) {
      console.error('Login error:', err)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Left Side - Branding & Info */}
      <div className="lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 lg:p-12 flex flex-col justify-center">
        <div className="max-w-lg mx-auto w-full">
          {/* Logo/Title */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              School Management System
            </h1>
            <p className="text-gray-400 text-lg">
              Streamline your educational institution
            </p>
          </div>

          {/* Demo Credentials - Only show in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 mb-6">
              <h3 className="text-white font-semibold mb-3 text-lg">Demo Credentials</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Username:</span>
                  <code className="bg-black/30 text-white px-3 py-1 rounded font-mono">
                    admin-demo
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Password:</span>
                  <code className="bg-black/30 text-white px-3 py-1 rounded font-mono">
                    Admin!123
                  </code>
                </div>
              </div>
            </div>
          )}

          {/* Server Notice */}
          <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="text-sm text-yellow-100">
                <p className="font-semibold mb-1">Server Status Notice</p>
                <p className="text-yellow-200/90 mb-2">
                  The backend server is currently not deployed. To test the demo, please email{' '}
                  <a href="mailto:sabin.shrestha.er@gmail.com" className="underline hover:text-white">
                    sabin.shrestha.er@gmail.com
                  </a>{' '}
                  or host the server locally.
                </p>
                <a 
                  href="https://github.com/masabinhok/sms-api" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-yellow-100 hover:text-white font-medium"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  View Backend Repository
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Sign in to access your account
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter your username"
                required
                className="w-full h-11"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full h-11"
                disabled={loading}
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['STUDENT', 'TEACHER', 'ADMIN', 'SUPERADMIN'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role })}
                    disabled={loading}
                    className={`
                      px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all
                      ${formData.role === role 
                        ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-900 hover:shadow-sm'
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
              className="w-full bg-gray-900 text-white hover:bg-gray-800 h-12 text-base font-medium rounded-lg shadow-lg hover:shadow-xl transition-all"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Forgot Password Link */}
          <div className="text-center mt-6">
            <Link 
              href="/auth/forgot-password" 
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}