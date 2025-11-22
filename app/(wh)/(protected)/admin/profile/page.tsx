'use client'

import { useAuth } from '@/store/authStore'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Shield, Calendar, Key, Camera, Lock, Phone } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { passwordChangeSchema, type PasswordChangeFormData } from '@/lib/validation/password-change-schema'
import { authApi } from '@/lib/api-client'
import { useMessage } from '@/store/messageStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'

export default function AdminProfile() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const {addMessage} = useMessage();
  const {logout}  = useAuth();
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // React Hook Form for password change with Zod validation
  const {
    register,
    handleSubmit: handlePasswordFormSubmit,
    formState: { errors, isSubmitting },
    reset: resetPasswordForm,
    watch,
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');

  // Initialize edit form when dialog opens
  const handleEditOpen = () => {
    if (user) {
      setEditFormData({
        name: user.username, // Use username instead of name for admin
        email: user.email || user.profileEmail || '',
      });
    }
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to update profile
    console.log('Updating profile:', editFormData);
    setIsEditDialogOpen(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addMessage('Passwords do not match', 'error');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await authApi.changePassword(passwordData.currentPassword, passwordData.newPassword);
      addMessage(response.message || 'Password changed successfully');
      setIsPasswordDialogOpen(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      const err = error as { message?: string };
      console.error('Password change failed:', error);
      addMessage(err.message || 'Password change failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">No user data available</div>
      </div>
    )
  }

  const profileFields = [
    {
      label: 'Username',
      value: user.username,
      icon: User,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'Email',
      value: user.email || user.profileEmail || 'Not provided',
      icon: Mail,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      label: 'Role',
      value: user.role,
      icon: Shield,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    {
      label: 'User ID',
      value: user.id,
      icon: Key,
      color: 'text-gray-600',
      bg: 'bg-gray-50'
    },
  ]

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not available'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-bg-premium p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text ">
            Profile Settings
          </h1>
          <p className="text-fg-premium-muted mt-2">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="grid gap-6">
          {/* Profile Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-white/10 bg-white/5 glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-fg-premium">
                  <User className="w-5 h-5 text-accent-primary" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-fg-premium-muted">
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                      {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-fg-premium">{user?.username}</h3>
                    <p className="text-fg-premium-muted">{user?.role}</p>
                    <Badge className="bg-accent-primary/20 text-accent-primary border-accent-primary/20">
                      Active Account
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-fg-premium">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-fg-premium-muted" />
                      <Input 
                        defaultValue={user?.username} 
                        className="pl-9 bg-white/5 border-white/10 text-fg-premium" 
                        disabled 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-fg-premium">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-fg-premium-muted" />
                      <Input 
                        defaultValue="admin@school.com" 
                        className="pl-9 bg-white/5 border-white/10 text-fg-premium" 
                        disabled 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-fg-premium">Role</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-3 h-4 w-4 text-fg-premium-muted" />
                      <Input 
                        defaultValue={user?.role} 
                        className="pl-9 bg-white/5 border-white/10 text-fg-premium" 
                        disabled 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-fg-premium">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-fg-premium-muted" />
                      <Input 
                        placeholder="+1 (555) 000-0000" 
                        className="pl-9 bg-white/5 border-white/10 text-fg-premium placeholder:text-white/20" 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-accent-primary hover:bg-accent-primary/90 text-white">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Settings Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-white/10 bg-white/5 glass-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-fg-premium">
                  <Lock className="w-5 h-5 text-accent-primary" />
                  Security Settings
                </CardTitle>
                <CardDescription className="text-fg-premium-muted">
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
                  <div className="space-y-1">
                    <h4 className="font-medium text-fg-premium">Password</h4>
                    <p className="text-sm text-fg-premium-muted">
                      Last changed 30 days ago
                    </p>
                  </div>
                  <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-white/10 bg-white/5 text-fg-premium hover:bg-white/10 hover:text-white">
                        Change Password
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-bg-premium border-white/10 text-fg-premium sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="text-fg-premium">Change Password</DialogTitle>
                        <DialogDescription className="text-fg-premium-muted">
                          Make sure your new password is strong and secure.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handlePasswordChange} className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label className="text-fg-premium">Current Password</Label>
                          <Input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="bg-white/5 border-white/10 text-fg-premium"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-fg-premium">New Password</Label>
                          <Input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="bg-white/5 border-white/10 text-fg-premium"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-fg-premium">Confirm New Password</Label>
                          <Input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="bg-white/5 border-white/10 text-fg-premium"
                          />
                        </div>
                        <DialogFooter>
                          <Button 
                            type="submit" 
                            disabled={isLoading}
                            className="bg-accent-primary hover:bg-accent-primary/90 text-white"
                          >
                            {isLoading ? "Updating..." : "Update Password"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
                  <div className="space-y-1">
                    <h4 className="font-medium text-fg-premium">Two-Factor Authentication</h4>
                    <p className="text-sm text-fg-premium-muted">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline" className="border-white/10 bg-white/5 text-fg-premium hover:bg-white/10 hover:text-white">
                    Enable 2FA
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                  <div className="space-y-1">
                    <h4 className="font-medium text-fg-premium">Logout</h4>
                    <p className="text-sm text-fg-premium-muted">
                      Sign out of your account
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                   onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}