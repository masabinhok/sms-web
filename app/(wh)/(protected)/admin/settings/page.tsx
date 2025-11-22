'use client'

import React from 'react'
import { 
  Settings, 
  Building2, 
  Calendar, 
  Bell, 
  Shield, 
  Database,
  Users,
  FileText,
  Globe,
  ChevronRight,
  CheckCircle2
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface SettingCategory {
  id: string
  title: string
  description: string
  icon: React.ElementType
  color: string
  iconBg: string
  href: string
  status: 'active' | 'coming-soon'
}

export default function AdminSettings() {
  const settingCategories: SettingCategory[] = [
    {
      id: 'school-info',
      title: 'School Information',
      description: 'Basic school details, contact info, branding, and social media',
      icon: Building2,
      color: 'text-purple-600',
      iconBg: 'bg-purple-100',
      href: '/admin/settings/school-info',
      status: 'active'
    },
    {
      id: 'academic',
      title: 'Academic Settings',
      description: 'Academic year, terms, grading system, and exam schedules',
      icon: Calendar,
      color: 'text-green-600',
      iconBg: 'bg-green-100',
      href: '/admin/settings/academic',
      status: 'coming-soon'
    },
    {
      id: 'user-roles',
      title: 'User Roles & Permissions',
      description: 'Manage user roles, permissions, and access control',
      icon: Users,
      color: 'text-blue-600',
      iconBg: 'bg-blue-100',
      href: '/admin/settings/roles',
      status: 'coming-soon'
    },
    {
      id: 'notifications',
      title: 'Notification Settings',
      description: 'Email, SMS, and push notification preferences',
      icon: Bell,
      color: 'text-orange-600',
      iconBg: 'bg-orange-100',
      href: '/admin/settings/notifications',
      status: 'coming-soon'
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      description: 'Password policies, session timeout, and security protocols',
      icon: Shield,
      color: 'text-red-600',
      iconBg: 'bg-red-100',
      href: '/admin/settings/security',
      status: 'coming-soon'
    },
    {
      id: 'data',
      title: 'Data Management',
      description: 'Backup, export, import, and data retention policies',
      icon: Database,
      color: 'text-indigo-600',
      iconBg: 'bg-indigo-100',
      href: '/admin/settings/data',
      status: 'coming-soon'
    },
    {
      id: 'reports',
      title: 'Report Templates',
      description: 'Customize report cards, certificates, and document templates',
      icon: FileText,
      color: 'text-teal-600',
      iconBg: 'bg-teal-100',
      href: '/admin/settings/reports',
      status: 'coming-soon'
    },
    {
      id: 'website',
      title: 'Public Website',
      description: 'Configure public-facing website content and appearance',
      icon: Globe,
      color: 'text-pink-600',
      iconBg: 'bg-pink-100',
      href: '/admin/settings/website',
      status: 'coming-soon'
    }
  ]

  return (
    <div className="min-h-screen bg-bg-premium p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-fg-premium flex items-center gap-3">
            <Settings className="w-8 h-8 text-accent-primary" />
            System Settings
          </h1>
          <p className="text-fg-premium-muted text-lg mt-2">
            Configure your school management system preferences and settings
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingCategories.map((category) => {
            const Icon = category.icon
            const isActive = category.status === 'active'
            
            return (
              <div key={category.id}>
                {isActive ? (
                  <Link 
                    href={category.href}
                    className="block group"
                  >
                    <Card className="h-full border-white/10 bg-white/5 transition-all duration-300 hover:shadow-lg hover:border-accent-primary/50 hover:-translate-y-1 glass-panel">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <div className={`p-3 rounded-xl bg-white/10 group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className={`w-6 h-6 text-accent-primary`} />
                          </div>
                          <div className="flex items-center gap-1 text-green-400">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-xs font-medium">Available</span>
                          </div>
                        </div>
                        <CardTitle className="text-lg flex items-center justify-between text-fg-premium">
                          {category.title}
                          <ChevronRight className="w-5 h-5 text-fg-premium-muted group-hover:text-accent-primary group-hover:translate-x-1 transition-all" />
                        </CardTitle>
                        <CardDescription className="text-sm text-fg-premium-muted">
                          {category.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ) : (
                  <div className="cursor-not-allowed opacity-75">
                    <Card className="h-full border-white/10 bg-white/5 glass-panel">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <div className={`p-3 rounded-xl bg-white/5`}>
                            <Icon className={`w-6 h-6 text-fg-premium-muted`} />
                          </div>
                          <Badge variant="outline" className="text-fg-premium-muted border-white/10 text-xs">
                            Coming Soon
                          </Badge>
                        </div>
                        <CardTitle className="text-lg text-fg-premium-muted">
                          {category.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-fg-premium-muted">
                          {category.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Help Section */}
        <Card className="border-accent-primary/30 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 glass-panel">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="bg-accent-primary p-3 rounded-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-fg-premium mb-2">Need Help with Settings?</h3>
                <p className="text-sm text-fg-premium-muted mb-4">
                  Each settings page includes detailed instructions and tooltips. If you need additional assistance,
                  please consult our documentation or contact support.
                </p>
                <div className="flex gap-3">
                  <Badge className="bg-accent-primary/20 text-accent-primary hover:bg-accent-primary/30 cursor-pointer border-accent-primary/20">
                    📚 View Documentation
                  </Badge>
                  <Badge className="bg-accent-primary/20 text-accent-primary hover:bg-accent-primary/30 cursor-pointer border-accent-primary/20">
                    💬 Contact Support
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
