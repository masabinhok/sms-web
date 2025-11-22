'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api-client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import MessageList from '@/components/MessageList'
import { motion } from 'framer-motion'
import { KeyRound, Mail, ArrowLeft, CheckCircle2, AlertCircle, Send, Sparkles } from 'lucide-react'

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
      }, 3000)
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || 'Failed to send reset link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-bg-premium px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-bg-premium to-accent-secondary/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(94,106,210,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(107,127,255,0.08),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      {/* Floating Elements */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-10 w-20 h-20 rounded-full bg-accent-primary/10 blur-2xl"
      />
      <motion.div
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-accent-secondary/10 blur-3xl"
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back to Login Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Link 
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm text-fg-premium-muted hover:text-accent-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to login</span>
          </Link>
        </motion.div>

        <Card className="glass-panel border-white/10 shadow-2xl">
          <CardHeader className="space-y-2 text-center pb-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-lg shadow-accent-primary/30 relative"
            >
              <KeyRound className="w-7 h-7 text-white" />
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 rounded-2xl bg-accent-primary/30 blur-xl"
              />
            </motion.div>
            
            <div>
              <CardTitle className="text-2xl font-bold text-fg-premium mb-1.5">
                Forgot Password?
              </CardTitle>
              <CardDescription className="text-fg-premium-muted text-sm">
                Enter your username or email to reset your password.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pb-4">
            <form onSubmit={handleForgotPassword} className="space-y-3.5">
              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-panel border-green-500/30 bg-green-500/10 px-4 py-3.5 rounded-lg flex items-start gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-400 mb-1">
                      Reset link sent!
                    </p>
                    <p className="text-xs text-green-300/80">
                      {success}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-panel border-red-500/30 bg-red-500/10 px-4 py-3.5 rounded-lg flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-400 mb-1">
                      Unable to process request
                    </p>
                    <p className="text-xs text-red-300/80">
                      {error}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Username/Email Input */}
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-fg-premium font-medium text-sm">
                  Username or Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-fg-premium-muted" />
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Enter your username or email"
                    disabled={loading || !!success}
                    autoFocus
                    className="w-full h-11 pl-11 bg-white/5 border-white/10 text-fg-premium placeholder:text-fg-premium-muted focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all"
                  />
                </div>
                <p className="text-xs text-fg-premium-muted">
                  We&apos;ll send reset instructions to your email.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-accent-primary to-accent-secondary hover:from-accent-primary/90 hover:to-accent-secondary/90 text-white h-11 text-sm font-semibold rounded-lg shadow-lg shadow-accent-primary/30 hover:shadow-xl hover:shadow-accent-primary/40 transition-all relative overflow-hidden group disabled:opacity-60"
                disabled={loading || !!success}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-4 h-4" />
                      </motion.div>
                      <span>Sending reset link...</span>
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Reset link sent</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Reset Link</span>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </Button>

              {/* Additional Help */}
              <div className="glass-panel border-white/10 bg-white/5 rounded-lg p-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-accent-primary/10 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-3.5 h-3.5 text-accent-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-fg-premium mb-0.5">
                      Need help?
                    </h4>
                    <p className="text-xs text-fg-premium-muted leading-relaxed">
                      Check your spam folder or contact your system administrator.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-4"
        >
          <p className="text-xs text-fg-premium-muted">
            Remember your password?{' '}
            <Link 
              href="/auth/login" 
              className="text-accent-primary hover:text-accent-secondary font-medium transition-colors inline-flex items-center gap-1 group"
            >
              <span>Sign in here</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </p>
        </motion.div>
      </motion.div>
      
      <MessageList />
    </div>
  )
}

export default ForgotPasswordPage