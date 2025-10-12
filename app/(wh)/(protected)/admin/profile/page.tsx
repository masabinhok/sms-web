'use client'

import { useAuth } from '@/store/authStore'
import React from 'react'
import { User, Mail, Shield, Calendar, Key } from 'lucide-react'

export default function AdminProfile() {
  const { user, loading } = useAuth();

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
      label: 'Name',
      value: user.name || 'Not provided',
      icon: User,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
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
    {
      label: 'Profile ID',
      value: user.profileId || 'Not linked',
      icon: Key,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
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
            <h1 className="text-3xl font-bold">{user.name || user.username}</h1>
            <p className="text-blue-100 mt-1">Administrator Profile</p>
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
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Edit Profile
        </button>
        <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
          Change Password
        </button>
      </div>
    </div>
  )
}