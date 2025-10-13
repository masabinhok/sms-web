'use client'

import { useAuth } from '@/store/authStore'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Shield, Calendar, Key } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { passwordChangeSchema, type PasswordChangeFormData } from '@/lib/validation/password-change-schema'
import { authApi } from '@/lib/api-client'
import { useMessage } from '@/store/messageStore'

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

  const handlePasswordSubmit = async (data: PasswordChangeFormData) => {
    try {
      const response = await authApi.changePassword(data.currentPassword, data.newPassword)
      addMessage(`${response.message ? response.message : 'Password changed successfully'}`);
      
      // Success - close dialog and reset form
      setIsPasswordDialogOpen(false);
      resetPasswordForm();
      
    } catch (error) {
      console.error('Password change failed:', error);
      // TODO: Show error message
      addMessage('Password change failed. Please try again.', 'error');
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
    <div className="space-y-6 mx-auto max-w-4xl p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user.username}</h1>
            <p className="text-blue-100 mt-1">Administrator Account</p>
            <div className="flex items-center gap-2 mt-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">{user.role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profileFields.map((field) => (
              <div key={field.label} className="flex items-start gap-4">
                <div className={`${field.bg} ${field.color} p-3 rounded-lg`}>
                  <field.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">{field.label}</p>
                  <p className="mt-1 text-gray-900 font-medium break-all">{field.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">Account Details</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Account Created</p>
              <p className="mt-1 text-gray-900 font-medium">{formatDate(user.createdAt)}</p>
            </div>
          </div>
          {user.updatedAt && (
            <div className="flex items-start gap-4">
              <div className="bg-green-50 text-green-600 p-3 rounded-lg">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                <p className="mt-1 text-gray-900 font-medium">{formatDate(user.updatedAt)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button 
          onClick={handleEditOpen}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Edit Profile
        </button>
        <button 
          onClick={() => setIsPasswordDialogOpen(true)}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Change Password
        </button>
        <button 
          onClick={async () => {
            try {
              // Wait for logout to complete (cookies cleared)
              await logout();
              console.log('Logout complete, redirecting...');
            } catch (error) {
              console.error('Logout error:', error);
            } finally {
              // Always redirect regardless
              window.location.href = '/';
            }
          }}
          className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Edit Profile</DialogTitle>
            <DialogDescription className="text-gray-600">
              Update your profile information. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  placeholder="Enter your email"
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username" className="text-gray-700">Username</Label>
                <Input
                  id="username"
                  value={user?.username || ''}
                  disabled
                  className="bg-gray-100 cursor-not-allowed border-gray-300 text-gray-600"
                />
                <p className="text-xs text-gray-500">Username cannot be changed</p>
              </div>
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setIsEditDialogOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={(open) => {
        setIsPasswordDialogOpen(open);
        if (!open) resetPasswordForm();
      }}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Change Password</DialogTitle>
            <DialogDescription className="text-gray-600">
              Enter your current password and choose a new password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordFormSubmit(handlePasswordSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword" className="text-gray-700">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  className="bg-white border-gray-300 text-gray-900"
                  {...register('currentPassword')}
                />
                {errors.currentPassword && (
                  <p className="text-sm text-red-600">{errors.currentPassword.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword" className="text-gray-700">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  className="bg-white border-gray-300 text-gray-900"
                  {...register('newPassword')}
                />
                {errors.newPassword && (
                  <p className="text-sm text-red-600">{errors.newPassword.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  Password must be at least 8 characters and contain uppercase, lowercase, number, and special character (@$!%*?&)
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  className="bg-white border-gray-300 text-gray-900"
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
              {newPassword && confirmPassword && newPassword !== confirmPassword && !errors.confirmPassword && (
                <p className="text-sm text-orange-600">Passwords do not match</p>
              )}
            </div>
            <DialogFooter>
              <button
                type="button"
                onClick={() => {
                  setIsPasswordDialogOpen(false);
                  resetPasswordForm();
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Changing...' : 'Change Password'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}