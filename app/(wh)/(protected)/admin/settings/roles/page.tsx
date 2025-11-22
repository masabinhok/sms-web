"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Shield, Lock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function RolesSettingsPage() {
  return (
    <div className="min-h-screen bg-bg-premium p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button asChild variant="outline" size="sm" className="border-white/10 bg-white/5 text-fg-premium">
          <Link href="/admin/settings"><ArrowLeft className="h-4 w-4 mr-2" />Back to Settings</Link>
        </Button>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-accent-primary" />
            <h1 className="text-3xl font-bold text-fg-premium">User Roles & Permissions</h1>
          </div>
          <p className="text-fg-premium-muted">Manage user roles, permissions, and access control</p>
        </div>

        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="text-fg-premium flex items-center gap-2">🚧 Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-fg-premium-muted mb-4">This feature is under development. Features will include:</p>
            <ul className="space-y-2 text-fg-premium-muted">
              <li className="flex items-start gap-2"><Users className="h-4 w-4 mt-1 text-accent-primary" /><span>Define custom user roles</span></li>
              <li className="flex items-start gap-2"><Shield className="h-4 w-4 mt-1 text-accent-primary" /><span>Configure granular permissions</span></li>
              <li className="flex items-start gap-2"><Lock className="h-4 w-4 mt-1 text-accent-primary" /><span>Set access control rules</span></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
