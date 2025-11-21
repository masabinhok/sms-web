import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import Link from 'next/link'
import { Users, GraduationCap, UserPlus, Settings, TrendingUp, Calendar, BookOpen, Award, Lightbulb, ArrowRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminDashboard() {
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
      title: 'Create Student',
      description: 'Add a new student to the system',
      href: '/admin/add-student',
      icon: GraduationCap,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      hover: 'group-hover:bg-blue-500/20'
    },
    {
      title: 'Create Teacher',
      description: 'Register a new teacher',
      href: '/admin/add-teacher',
      icon: Users,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      hover: 'group-hover:bg-emerald-500/20'
    },
    {
      title: 'Create Admin',
      description: 'Add a new administrator',
      href: '/supersuperadmin/add-admin',
      icon: UserPlus,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      hover: 'group-hover:bg-purple-500/20'
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences',
      href: '/admin/settings',
      icon: Settings,
      color: 'text-gray-400',
      bg: 'bg-white/5',
      hover: 'group-hover:bg-white/10'
    },
  ]

  const recentActivities = [
    { action: 'New student enrolled', time: '2 minutes ago', type: 'student' },
    { action: 'Teacher profile updated', time: '15 minutes ago', type: 'teacher' },
    { action: 'Class schedule modified', time: '1 hour ago', type: 'class' },
    { action: 'Admin created', time: '2 hours ago', type: 'admin' },
  ]

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="space-y-8 mx-auto max-w-7xl p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-fg-premium tracking-tight">Admin Dashboard</h1>
            <p className="mt-2 text-fg-premium-muted">Welcome back! Here's what's happening in your school today.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right hidden md:block">
                <div className="text-sm font-medium text-fg-premium">Academic Year</div>
                <div className="text-xs text-fg-premium-muted">2024-2025</div>
             </div>
             <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <Calendar className="h-5 w-5 text-accent-primary" />
             </div>
          </div>
        </div>

        {/* Setup Guidelines Banner */}
        <Link 
          href="/admin/guidelines"
          className="block group relative overflow-hidden rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 via-orange-500/5 to-transparent p-1 transition-all hover:border-yellow-500/50"
        >
          <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative p-6 flex items-start gap-5">
            <div className="rounded-xl bg-yellow-500/20 p-3 group-hover:scale-110 transition-transform border border-yellow-500/20">
              <Lightbulb className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-fg-premium mb-1 flex items-center gap-2">
                New to the system? View Setup Guidelines
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-yellow-400" />
              </h3>
              <p className="text-sm text-fg-premium-muted max-w-3xl">
                Follow our step-by-step guide to properly configure your school: Setup school info → Create classes & subjects → Add teachers → Enroll students
              </p>
            </div>
          </div>
        </Link>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className={`relative overflow-hidden rounded-2xl border ${stat.border} ${stat.bg} p-6 transition-all hover:scale-[1.02] hover:shadow-lg`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`rounded-lg p-2.5 ${stat.bg} border ${stat.border}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20">
                    <TrendingUp className="h-3 w-3" />
                    {stat.change}
                </div>
              </div>
              <div>
                  <p className="text-sm font-medium text-fg-premium-muted">{stat.title}</p>
                  <p className="mt-1 text-3xl font-bold text-fg-premium">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="mb-5 text-xl font-bold text-fg-premium flex items-center gap-2">
            <span className="w-1 h-6 bg-accent-primary rounded-full"></span>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group relative flex flex-col rounded-2xl border border-white/5 bg-bg-premium-secondary p-6 transition-all hover:border-accent-primary/30 hover:shadow-lg hover:shadow-accent-primary/5"
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${action.bg} ${action.color} border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold text-fg-premium group-hover:text-accent-primary transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-fg-premium-muted mb-4 line-clamp-2">{action.description}</p>
                <div className="mt-auto flex items-center text-xs font-medium text-accent-primary opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                  <span>Get started</span>
                  <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Grid - Recent Activity & Upcoming Events */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-fg-premium flex items-center gap-2">
                <Clock className="h-5 w-5 text-accent-primary" />
                Recent Activity
              </h2>
              <Button variant="ghost" size="sm" className="text-xs text-fg-premium-muted hover:text-white hover:bg-white/5">
                View all
              </Button>
            </div>
            <div className="space-y-1">
              {recentActivities.map((activity, index) => (
                <div key={index} className="group flex items-start gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-accent-primary shadow-[0_0_8px_rgba(94,106,210,0.6)]" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-fg-premium group-hover:text-white transition-colors">{activity.action}</p>
                    <p className="text-xs text-fg-premium-muted">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-fg-premium flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-400" />
                Upcoming Events
              </h2>
              <Button variant="ghost" size="sm" className="text-xs text-fg-premium-muted hover:text-white hover:bg-white/5">
                View calendar
              </Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-4 rounded-xl bg-white/5 p-4 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/20">
                  <span className="text-[10px] font-bold uppercase">Oct</span>
                  <span className="text-lg font-bold leading-none">15</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-fg-premium text-sm">Parent-Teacher Meeting</h3>
                  <p className="text-xs text-fg-premium-muted">10:00 AM - Main Hall</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl bg-white/5 p-4 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                  <span className="text-[10px] font-bold uppercase">Oct</span>
                  <span className="text-lg font-bold leading-none">20</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-fg-premium text-sm">Annual Sports Day</h3>
                  <p className="text-xs text-fg-premium-muted">9:00 AM - Sports Ground</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl bg-white/5 p-4 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/20">
                  <span className="text-[10px] font-bold uppercase">Oct</span>
                  <span className="text-lg font-bold leading-none">25</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-fg-premium text-sm">Exam Week Begins</h3>
                  <p className="text-xs text-fg-premium-muted">All day - All classes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}