'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import Link from 'next/link'
import { Users, GraduationCap, UserPlus, Settings, TrendingUp, Calendar, BookOpen, Award, Lightbulb, ArrowRight, Clock, LayoutDashboard, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Activity, RefreshCcw, Download, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/authStore'

export default function AdminDashboard() {
  const router = useRouter()
  const { user } = useAuth()

  const fetchDashboardData = () => {
    // Refresh logic here
    console.log('Refreshing dashboard data...')
  }

  // Mock data - replace with real data from API
  const stats = [
    {
      title: 'Total Students',
      value: '1,234',
      change: '+12%',
      trend: 'up',
      icon: GraduationCap,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    {
      title: 'Total Teachers',
      value: '89',
      change: '+3%',
      trend: 'up',
      icon: Users,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    {
      title: 'Active Classes',
      value: '42',
      change: '+5%',
      trend: 'up',
      icon: BookOpen,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    },
    {
      title: 'Attendance Rate',
      value: '94.5%',
      change: '+2.1%',
      trend: 'up',
      icon: Award,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    },
  ]

  const quickActions = [
    {
      label: 'Create Student',
      description: 'Add a new student to the system',
      href: '/admin/add-student',
      icon: GraduationCap,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      hover: 'group-hover:bg-blue-500/20'
    },
    {
      label: 'Create Teacher',
      description: 'Register a new teacher',
      href: '/admin/add-teacher',
      icon: Users,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      hover: 'group-hover:bg-emerald-500/20'
    },
    {
      label: 'Create Admin',
      description: 'Add a new administrator',
      href: '/supersuperadmin/add-admin',
      icon: UserPlus,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      hover: 'group-hover:bg-purple-500/20'
    },
    {
      label: 'System Settings',
      description: 'Configure system preferences',
      href: '/admin/settings',
      icon: Settings,
      color: 'text-gray-400',
      bg: 'bg-white/5',
      hover: 'group-hover:bg-white/10'
    },
  ]

  const recentActivities = [
    { id: 1, title: 'New student enrolled', description: 'John Doe', time: '2 minutes ago', type: 'student', icon: Users },
    { id: 2, title: 'Teacher profile updated', description: 'Jane Smith', time: '15 minutes ago', type: 'teacher', icon: Users },
    { id: 3, title: 'Class schedule modified', description: 'Math 101', time: '1 hour ago', type: 'class', icon: Clock },
    { id: 4, title: 'Admin created', description: 'Alice Johnson', time: '2 hours ago', type: 'admin', icon: UserPlus },
  ]

  return (
    <div className="min-h-screen bg-bg-premium p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text flex items-center gap-3">
              <LayoutDashboard className="w-10 h-10 text-accent-primary" />
              Admin Dashboard
            </h1>
            <p className="text-fg-premium-muted mt-2 text-lg">
              Welcome back, {user?.username || 'Admin'}. Here&apos;s what&apos;s happening today.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={fetchDashboardData}
              className="border-white/10 bg-white/5 text-fg-premium hover:bg-white/10 hover:text-white"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            <Button className="bg-gradient-to-r from-accent-primary to-accent-secondary hover:opacity-90 text-white border-0 shadow-lg shadow-accent-primary/20">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border-white/10 bg-white/5 glass-panel hover:bg-white/10 transition-all duration-300 group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-fg-premium-muted group-hover:text-fg-premium transition-colors">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bg} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-fg-premium mb-1">{stat.value}</div>
                  <p className="text-xs text-fg-premium-muted flex items-center gap-1">
                    <span className="text-green-400 font-medium flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.trend}
                    </span>
                    from last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="border-white/10 bg-white/5 glass-panel h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-fg-premium flex items-center gap-2">
                      <Activity className="w-5 h-5 text-accent-primary" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription className="text-fg-premium-muted">
                      Latest actions across the system
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="text-accent-primary hover:text-accent-primary hover:bg-accent-primary/10">
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentActivities.map((activity, index) => (
                    <div key={activity.id} className="flex items-start gap-4 group">
                      <div className={`mt-1 p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-accent-primary/50 transition-colors`}>
                        <activity.icon className="w-4 h-4 text-accent-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-fg-premium leading-none">
                          {activity.title}
                        </p>
                        <p className="text-xs text-fg-premium-muted">
                          {activity.description}
                        </p>
                      </div>
                      <div className="text-xs text-fg-premium-muted font-mono">
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="border-white/10 bg-white/5 glass-panel h-full">
              <CardHeader>
                <CardTitle className="text-fg-premium flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-fg-premium-muted">
                  Commonly used administrative tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start h-auto py-4 border-white/10 bg-white/5 text-fg-premium hover:bg-white/10 hover:text-white hover:border-accent-primary/50 group transition-all"
                    onClick={() => router.push(action.href)}
                  >
                    <div className={`p-2 rounded-lg ${action.color} bg-opacity-10 mr-4 group-hover:scale-110 transition-transform`}>
                      <action.icon className={`w-5 h-5 ${action.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold group-hover:text-accent-primary transition-colors">
                        {action.label}
                      </div>
                      <div className="text-xs text-fg-premium-muted font-normal">
                        {action.description}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-accent-primary" />
                  </Button>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}