'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api-client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import MessageList from '@/components/MessageList'

const ForgotPasswordPage = () => {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess('')
    setError('')
    if (!username.trim()) {
      setError('Please enter your username or email.')
      return
    }
    setLoading(true)
    try {
      await api.post('/auth/forgot-password', { username })
      setSuccess('If an account exists, a password reset link has been sent to your email.')
      setUsername('')
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to send reset link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 space-y-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 text-center">Forgot Password</h2>
        <p className="text-gray-600 text-center text-sm mb-4">
          Enter your username or email and we'll send you a link to reset your password.
        </p>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 text-sm rounded">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div>
            <Input
              value={username}
              onChange={e => setUsername(e.target.value)}
              type="text"
              placeholder="Enter your username or email..."
              disabled={loading}
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Reset Password'}
          </Button>
        </form>
      </div>
      <MessageList />
    </div>
  )
}

export default ForgotPasswordPage