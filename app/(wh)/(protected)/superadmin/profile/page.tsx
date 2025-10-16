"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function SuperAdminProfilePage() {
  const router = useRouter()
  const { user, logout, loading } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (err) {
      console.error('Logout failed', err)
    }
  }


  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="p-6">
      <div className="max-w-3xl mx-auto">
        <Card className="p-6">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  {user?.username ? (
                    <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  ) : (
                    <AvatarFallback>SA</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{user?.name ?? user?.username ?? 'Super Admin'}</CardTitle>
                  <div className="text-sm text-muted-foreground">{user?.email ?? user?.profileEmail ?? '—'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="destructive" size="sm" onClick={handleLogout} disabled={loading}>Logout</Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <h4 className="text-sm text-muted-foreground">About</h4>
                <p className="mt-2 text-sm text-muted-foreground">{user?.name ? `Account username: ${user.username}` : 'No additional profile information available.'}</p>
                <div className="mt-4">
                  <h5 className="text-sm text-muted-foreground">Joined</h5>
                  <div className="text-sm">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-muted rounded-md text-sm">
                  <div className="text-xs text-muted-foreground">Role</div>
                  <div className="font-medium">{user?.role ?? 'SUPERADMIN'}</div>
                </div>
                <div className="p-3 bg-muted rounded-md text-sm">
                  <div className="text-xs text-muted-foreground">Last active</div>
                  <div className="font-medium">{user?.updatedAt ? new Date(user.updatedAt).toLocaleString() : '—'}</div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <div className="flex items-center justify-between w-full gap-4">
              <div className="text-sm text-muted-foreground">Signed in as <span className="font-medium">{user?.email ?? user?.username ?? '—'}</span></div>
              <div>
                <Button variant="ghost" onClick={() => navigator.clipboard?.writeText(user?.email ?? user?.username ?? '')}>Copy Email</Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  )
}
