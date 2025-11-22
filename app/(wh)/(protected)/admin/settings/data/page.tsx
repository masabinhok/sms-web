"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Database, Download, Upload, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function DataSettingsPage() {
  return (
    <div className="min-h-screen bg-bg-premium p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button asChild variant="outline" size="sm" className="border-white/10 bg-white/5 text-fg-premium">
          <Link href="/admin/settings"><ArrowLeft className="h-4 w-4 mr-2" />Back to Settings</Link>
        </Button>

        <div>
          <div className="flex items-center gap-3 mb-2">
            <Database className="h-8 w-8 text-accent-primary" />
            <h1 className="text-3xl font-bold text-fg-premium">Data Management</h1>
          </div>
          <p className="text-fg-premium-muted">Backup, export, import, and data retention policies</p>
        </div>

        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="text-fg-premium flex items-center gap-2">🚧 Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-fg-premium-muted mb-4">This feature is under development. Features will include:</p>
            <ul className="space-y-2 text-fg-premium-muted">
              <li className="flex items-start gap-2"><Database className="h-4 w-4 mt-1 text-accent-primary" /><span>Automated backup scheduling</span></li>
              <li className="flex items-start gap-2"><Download className="h-4 w-4 mt-1 text-accent-primary" /><span>Data export tools</span></li>
              <li className="flex items-start gap-2"><Upload className="h-4 w-4 mt-1 text-accent-primary" /><span>Bulk data import</span></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
