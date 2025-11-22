'use client'

import Link from 'next/link'
import { Users, GraduationCap, UserPlus, Settings, TrendingUp, Calendar, BookOpen, Award, Lightbulb, ArrowRight, Clock, LayoutDashboard, ChevronRight, AlertCircle, Loader2 } from 'lucide-react'
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
import { useQuery } from '@tanstack/react-query'
import { studentApi } from '@/lib/student-api'
import { teacherApi } from '@/lib/teacher-api'
import { activityApi } from '@/lib/activity-api'
import { getAllClasses } from '@/lib/academics-api'
import { formatDistanceToNow } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminDashboard() {
  const router = useRouter()
  const { user } = useAuth()

  // Fetch students stats
  const { data: studentStats, isLoading: isLoadingStudents, refetch: refetchStudents } = useQuery({
    queryKey: ['studentStats'],
    queryFn: () => studentApi.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Fetch teachers stats
  const { data: teacherStats, isLoading: isLoadingTeachers, refetch: refetchTeachers } = useQuery({
    queryKey: ['teacherStats'],
    queryFn: () => teacherApi.getStats(),
    staleTime: 5 * 60 * 1000,
  })

  // Fetch recent activities
  const { data: activitiesData, isLoading: isLoadingActivities, refetch: refetchActivities } = useQuery({
    queryKey: ['recentActivities'],
    queryFn: () => activityApi.getAll({ limit: 10, order: 'desc' }),
    staleTime: 1 * 60 * 1000, // 1 minute for activities
  })

  // Fetch active classes
  const { data: classesData, isLoading: isLoadingClasses, refetch: refetchClasses } = useQuery({
    queryKey: ['activeClasses'],
    queryFn: () => getAllClasses(undefined, true), // Get only active classes
    staleTime: 5 * 60 * 1000,
  })

  const fetchDashboardData = () => {
    refetchStudents()
    refetchTeachers()
    refetchActivities()
    refetchClasses()
  }

  // Get icon for activity type
  const getActivityIcon = (entityType: string, action: string) => {
    if (entityType === 'STUDENT') return GraduationCap
    if (entityType === 'TEACHER') return Users
    if (entityType === 'ADMIN') return UserPlus
    if (entityType === 'CLASS') return BookOpen
    if (action === 'LOGIN' || action === 'LOGOUT') return Activity
    return Clock
  }

  // Format activity description
  const formatActivityDescription = (activity: { action: string; entityType: string; description: string; username?: string }) => {
    const actionText = activity.action.toLowerCase()
    const entityText = activity.entityType.toLowerCase()
    return `${actionText} ${entityText}: ${activity.description}`
  }

  const stats = [
    {
      title: 'Total Students',
      value: isLoadingStudents ? '...' : studentStats?.total?.toString() || '0',
      change: '+12%',
      trend: 'up',
      icon: GraduationCap,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      isLoading: isLoadingStudents
    },
    {
      title: 'Total Teachers',
      value: isLoadingTeachers ? '...' : teacherStats?.total?.toString() || '0',
      change: '+3%',
      trend: 'up',
      icon: Users,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      isLoading: isLoadingTeachers
    },
    {
      title: 'Active Classes',
      value: isLoadingClasses ? '...' : classesData?.length?.toString() || '0',
      change: '+5%',
      trend: 'up',
      icon: BookOpen,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      isLoading: isLoadingClasses
    },
    {
      title: 'Total Activities',
      value: isLoadingActivities ? '...' : activitiesData?.meta?.total?.toString() || '0',
      change: '+15%',
      trend: 'up',
      icon: Activity,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      isLoading: isLoadingActivities
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
      label: 'View Students',
      description: 'Browse all students',
      href: '/admin/students',
      icon: GraduationCap,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      hover: 'group-hover:bg-purple-500/20'
    },
    {
      label: 'Activity Logs',
      description: 'View system activity',
      href: '/admin/logs',
      icon: Activity,
      color: 'text-gray-400',
      bg: 'bg-white/5',
      hover: 'group-hover:bg-white/10'
    },
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
                    {stat.isLoading ? (
                      <Loader2 className={`w-5 h-5 ${stat.color} animate-spin`} />
                    ) : (
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {stat.isLoading ? (
                    <Skeleton className="h-9 w-20 mb-1" />
                  ) : (
                    <div className="text-3xl font-bold text-fg-premium mb-1">{stat.value}</div>
                  )}
                  <p className="text-xs text-fg-premium-muted flex items-center gap-1">
                    <span className="text-green-400 font-medium flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {stat.change}
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
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-accent-primary hover:text-accent-primary hover:bg-accent-primary/10"
                    onClick={() => router.push('/admin/logs')}
                  >
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingActivities ? (
                  <div className="space-y-6">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                        <Skeleton className="h-3 w-20" />
                      </div>
                    ))}
                  </div>
                ) : activitiesData?.data && activitiesData.data.length > 0 ? (
                  <div className="space-y-6">
                    {activitiesData.data.slice(0, 8).map((activity) => {
                      const ActivityIcon = getActivityIcon(activity.entityType, activity.action)
                      return (
                        <div key={activity.id} className="flex items-start gap-4 group">
                          <div className="mt-1 p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-accent-primary/50 transition-colors">
                            <ActivityIcon className="w-4 h-4 text-accent-primary" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium text-fg-premium leading-none">
                              {activity.action.charAt(0) + activity.action.slice(1).toLowerCase()} {activity.entityType.toLowerCase()}
                            </p>
                            <p className="text-xs text-fg-premium-muted">
                              {activity.username && <span className="font-medium">{activity.username}: </span>}
                              {activity.description}
                            </p>
                          </div>
                          <div className="text-xs text-fg-premium-muted font-mono">
                            {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-fg-premium-muted mx-auto mb-3 opacity-50" />
                    <p className="text-fg-premium-muted text-sm">No recent activities</p>
                  </div>
                )}
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