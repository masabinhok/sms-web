import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import Link from 'next/link'
import { Users, GraduationCap, UserPlus, Settings, TrendingUp, Calendar, BookOpen, Award } from 'lucide-react'

export default function AdminDashboard() {
  // Mock data - replace with real data from API
  const stats = [
    {
      title: 'Total Students',
      value: '1,234',
      change: '+12%',
      trend: 'up',
      icon: GraduationCap,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Teachers',
      value: '89',
      change: '+3%',
      trend: 'up',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Active Classes',
      value: '42',
      change: '+5%',
      trend: 'up',
      icon: BookOpen,
      color: 'bg-purple-500',
    },
    {
      title: 'Attendance Rate',
      value: '94.5%',
      change: '+2.1%',
      trend: 'up',
      icon: Award,
      color: 'bg-orange-500',
    },
  ]

  const quickActions = [
    {
      title: 'Create Student Profile',
      description: 'Add a new student to the system',
      href: '/admin/create-profile/student',
      icon: GraduationCap,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Create Teacher Profile',
      description: 'Register a new teacher',
      href: '/admin/create-profile/teacher',
      icon: Users,
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      iconColor: 'text-green-600',
    },
    {
      title: 'Create Admin Profile',
      description: 'Add a new administrator',
      href: '/admin/create-profile',
      icon: UserPlus,
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      iconColor: 'text-purple-600',
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences',
      href: '/admin/settings',
      icon: Settings,
      color: 'bg-gray-50 hover:bg-gray-100 border-gray-200',
      iconColor: 'text-gray-600',
    },
  ]

  const recentActivities = [
    { action: 'New student enrolled', time: '2 minutes ago', type: 'student' },
    { action: 'Teacher profile updated', time: '15 minutes ago', type: 'teacher' },
    { action: 'Class schedule modified', time: '1 hour ago', type: 'class' },
    { action: 'Admin created', time: '2 hours ago', type: 'admin' },
  ]

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="space-y-6 mx-auto max-w-6xl p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back! Here's what's happening in your school today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                  <div className="mt-2 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">{stat.change}</span>
                    <span className="text-sm text-gray-500">from last month</span>
                  </div>
                </div>
                <div className={`rounded-full ${stat.color} p-3`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className={`group relative flex flex-col rounded-xl border p-6 transition-all ${action.color}`}
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${action.iconColor} bg-white`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold text-gray-900 group-hover:text-gray-700">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600">{action.description}</p>
                <div className="mt-4 flex items-center text-sm font-medium text-gray-700">
                  <span>Get started</span>
                  <svg
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Grid - Recent Activity & Upcoming Events */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                View all
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                View calendar
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-lg bg-blue-50 p-4">
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-blue-600 text-white">
                  <span className="text-xs font-medium">OCT</span>
                  <span className="text-lg font-bold">15</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Parent-Teacher Meeting</h3>
                  <p className="text-sm text-gray-600">10:00 AM - Main Hall</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg bg-green-50 p-4">
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-green-600 text-white">
                  <span className="text-xs font-medium">OCT</span>
                  <span className="text-lg font-bold">20</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Annual Sports Day</h3>
                  <p className="text-sm text-gray-600">9:00 AM - Sports Ground</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-lg bg-purple-50 p-4">
                <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-purple-600 text-white">
                  <span className="text-xs font-medium">OCT</span>
                  <span className="text-lg font-bold">25</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Exam Week Begins</h3>
                  <p className="text-sm text-gray-600">All day - All classes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}