"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useAuth } from '@/store/authStore'
import { UserRole } from '@/types/auth'
import { motion } from 'framer-motion'
import { Lock, User as UserIcon, Shield, GraduationCap, Github, AlertCircle, Sparkles } from 'lucide-react'

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

  const roleIcons = {
    STUDENT: GraduationCap,
    TEACHER: UserIcon,
    ADMIN: Shield,
    SUPERADMIN: Sparkles,
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row bg-bg-premium overflow-hidden">
      {/* Left Side - Branding & Info */}
      <div className="lg:w-1/2 relative overflow-hidden p-6 lg:p-8 flex flex-col justify-center">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 via-bg-premium to-accent-secondary/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(94,106,210,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(107,127,255,0.1),transparent_50%)]"></div>
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-lg mx-auto w-full z-10"
        >
          {/* Logo/Title */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-lg shadow-accent-primary/30">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"></div>
            </div>
            <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text  mb-2">
              School Management System
            </h1>
            <p className="text-fg-premium-muted text-base">
              Streamline your educational institution
            </p>
          </motion.div>

          {/* Demo Credentials - Only show in development */}
          {process.env.NODE_ENV === 'development' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="glass-panel rounded-xl p-4 mb-4 border border-white/10"
            >
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-4 h-4 text-accent-primary" />
                <h3 className="text-fg-premium font-semibold text-sm">Demo Credentials</h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-fg-premium-muted">Username:</span>
                  <code className="bg-bg-premium-secondary text-accent-primary px-2 py-1 rounded font-mono border border-white/10">
                    admin-demo
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-fg-premium-muted">Password:</span>
                  <code className="bg-bg-premium-secondary text-accent-primary px-2 py-1 rounded font-mono border border-white/10">
                    Admin!123
                  </code>
                </div>
              </div>
            </motion.div>
          )}

          {/* Server Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="glass-panel rounded-xl p-4 border border-yellow-500/20 bg-yellow-500/5"
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-semibold mb-1.5 text-yellow-400">Server Notice</p>
                <p className="text-fg-premium-muted mb-2 leading-relaxed">
                  Backend not deployed. Email{' '}
                  <a href="mailto:sabin.shrestha.er@gmail.com" className="text-accent-primary hover:text-accent-secondary underline transition-colors">
                    sabin.shrestha.er@gmail.com
                  </a>{' '}
                  or host locally.
                </p>
                <a 
                  href="https://github.com/masabinhok/sms-api" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-accent-primary hover:text-accent-secondary font-medium transition-colors group"
                >
                  <Github className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                  Backend Repo
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Login Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-8 bg-bg-premium-secondary relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md relative z-10"
        >
          <Card className="glass-panel border-white/10">
            <CardHeader className="space-y-2 text-center pb-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-lg shadow-accent-primary/30"
              >
                <Shield className="w-6 h-6 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-fg-premium">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-fg-premium-muted text-sm">
                Sign in to access your account
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-4">
              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel border-red-500/30 bg-red-500/10 px-3 py-2 rounded-lg text-xs flex items-start gap-2"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
                    <span className="text-red-400">{error}</span>
                  </motion.div>
                )}

                {/* Username */}
                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-fg-premium font-medium text-sm">
                    Username
                  </Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-premium-muted" />
                    <Input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="Enter your username"
                      required
                      className="w-full h-10 pl-9 bg-white/5 border-white/10 text-fg-premium placeholder:text-fg-premium-muted text-sm focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-fg-premium font-medium text-sm">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-premium-muted" />
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter your password"
                      required
                      minLength={6}
                      className="w-full h-10 pl-9 bg-white/5 border-white/10 text-fg-premium placeholder:text-fg-premium-muted text-sm focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-2">
                  <Label className="text-fg-premium font-medium text-sm">
                    Select Role
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['STUDENT', 'TEACHER', 'ADMIN', 'SUPERADMIN'] as UserRole[]).map((role) => {
                      const Icon = roleIcons[role]
                      return (
                        <motion.button
                          key={role}
                          type="button"
                          onClick={() => setFormData({ ...formData, role })}
                          disabled={loading}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`
                            relative px-3 py-2.5 text-xs font-medium rounded-lg border-2 transition-all overflow-hidden group
                            ${formData.role === role 
                              ? 'bg-gradient-to-br from-accent-primary to-accent-secondary text-white border-accent-primary shadow-lg shadow-accent-primary/30' 
                              : 'bg-white/5 text-fg-premium border-white/10 hover:border-accent-primary/50 hover:bg-white/10'
                            }
                            disabled:opacity-50 disabled:cursor-not-allowed
                          `}
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            <Icon className="w-3.5 h-3.5" />
                            <span>{role}</span>
                          </div>
                          {formData.role === role && (
                            <motion.div
                              layoutId="roleSelector"
                              className="absolute inset-0 -z-10"
                              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-accent-primary to-accent-secondary hover:from-accent-primary/90 hover:to-accent-secondary/90 text-white h-10 text-sm font-semibold rounded-lg shadow-lg shadow-accent-primary/30 hover:shadow-xl hover:shadow-accent-primary/40 transition-all relative overflow-hidden group"
                  disabled={loading}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Lock className="w-4 h-4" />
                        </motion.div>
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        <span>Sign In</span>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </Button>

                {/* Forgot Password Link */}
                <div className="text-center pt-1">
                  <Link 
                    href="/auth/forgot-password" 
                    className="text-xs text-fg-premium-muted hover:text-accent-primary font-medium transition-colors inline-flex items-center gap-1 group"
                  >
                    <span>Forgot password?</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-fg-premium-muted text-xs mt-3"
          >
            Protected by enterprise-grade security
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}