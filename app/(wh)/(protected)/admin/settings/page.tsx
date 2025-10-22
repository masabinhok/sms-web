'use client'

import React from 'react'
import { Settings, Building2, Calendar, Bell, Shield, Database } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AdminSettings() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-600" />
            System Settings
          </h1>
          <p className="text-gray-600 text-lg mt-2">
            Configure your school management system preferences
          </p>
        </div>

        {/* Coming Soon Notice */}
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-4">
                <Settings className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings Page Coming Soon</h2>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                This page is under development. You'll be able to configure school information, 
                academic settings, and system preferences here.
              </p>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-sm py-1 px-3">
                In Development
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Future Settings Categories */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Building2 className="w-8 h-8 text-purple-600 mb-2" />
              <CardTitle>School Information</CardTitle>
              <CardDescription>
                Basic school details, contact info, and branding
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Calendar className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle>Academic Settings</CardTitle>
              <CardDescription>
                Academic year, terms, schedules, and holidays
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Bell className="w-8 h-8 text-orange-600 mb-2" />
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Email and system notification preferences
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="w-8 h-8 text-red-600 mb-2" />
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Password policies, session timeout, and security settings
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Database className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Backup, export, and data retention settings
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
