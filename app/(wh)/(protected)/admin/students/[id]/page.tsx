'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { studentApi, Student } from '@/lib/student-api'
import { useMessage } from '@/store/messageStore'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  User, 
  Mail, 
  Calendar, 
  School, 
  Users, 
  Phone, 
  MapPin,
  Hash,
  UserCircle,
  Clock,
  IdCard,
  BookOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

export default function StudentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { addMessage } = useMessage()
  const studentId = params.id as string

  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)

  useEffect(() => {
    if (studentId) {
      fetchStudent()
    }
  }, [studentId])

  const fetchStudent = async () => {
    setLoading(true)
    try {
      const data = await studentApi.getById(studentId)
      setStudent(data)
    } catch (error) {
      console.error('Failed to fetch student:', error)
      addMessage('Failed to load student details', 'error')
      router.push('/admin/students')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!student) return
    
    setDeleting(true)
    try {
      await studentApi.delete(student.id)
      addMessage('Student deleted successfully', 'success')
      router.push('/admin/students')
    } catch (error) {
      console.error('Failed to delete student:', error)
      addMessage('Failed to delete student', 'error')
      setDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="glass-panel p-8 flex items-center gap-3">
          <div className="w-6 h-6 border-3 border-accent-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-fg-premium">Loading student details...</span>
        </div>
      </div>
    )
  }

  if (!student) {
    return null
  }

  const getGenderBadgeColor = (gender?: string) => {
    switch (gender?.toLowerCase()) {
      case 'male':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'female':
        return 'bg-pink-100 text-pink-700 border-pink-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="min-h-screen bg-bg-premium">
      <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/admin/students')}
              className="glass-panel border-white/10 text-fg-premium hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Students
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => router.push(`/admin/students/${student.id}/edit`)}
              className="flex items-center gap-2 bg-gradient-to-r from-accent-primary to-accent-secondary hover:opacity-90"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialog(true)}
              className="flex items-center gap-2 bg-red-500/80 hover:bg-red-600"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Student Profile Card */}
        <div className="glass-panel border-white/10 rounded-2xl p-8 md:p-10 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full translate-y-48 -translate-x-48"></div>
          </div>
          
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-5xl md:text-6xl font-bold text-white shadow-lg ring-4 ring-white/20">
              {student.fullName.charAt(0).toUpperCase()}
            </div>
            
            {/* Student Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 text-fg-premium">{student.fullName}</h1>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className="bg-accent-primary/20 border-accent-primary text-accent-primary px-3 py-1 text-sm font-medium">
                  {student.gender || 'Not specified'}
                </Badge>
                <Badge className="bg-accent-secondary/20 border-accent-secondary text-accent-secondary px-3 py-1 text-sm font-medium">
                  {calculateAge(student.dob)} years old
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-fg-premium">
                <div className="flex items-center gap-2">
                  <School className="w-5 h-5 text-accent-primary" />
                  <div>
                    <p className="text-xs text-fg-premium-muted">Class</p>
                    <p className="font-semibold text-fg-premium">{student.classId}</p>
                  </div>
                </div>
  
                <div className="flex items-center gap-2">
                  <Hash className="w-5 h-5 text-accent-primary" />
                  <div>
                    <p className="text-xs text-fg-premium-muted">Roll Number</p>
                    <p className="font-semibold text-fg-premium">{student.rollNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="glass-panel border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all">
            <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-accent-primary" />
                <h3 className="text-lg font-semibold text-fg-premium">Personal Information</h3>
              </div>
            </div>
            <div className="p-6 space-y-5">
              {/* Full Name */}
              <div className="flex items-start gap-4">
                <div className="bg-accent-primary/10 text-accent-primary p-2.5 rounded-lg border border-white/10">
                  <IdCard className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-fg-premium-muted uppercase tracking-wider mb-1">Full Name</p>
                  <p className="text-base text-fg-premium font-medium">{student.fullName}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="bg-green-400/10 text-green-400 p-2.5 rounded-lg border border-white/10">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-fg-premium-muted uppercase tracking-wider mb-1">Email Address</p>
                  <p className="text-base text-fg-premium font-medium break-all">{student.email}</p>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="flex items-start gap-4">
                <div className="bg-accent-secondary/10 text-accent-secondary p-2.5 rounded-lg border border-white/10">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-fg-premium-muted uppercase tracking-wider mb-1">Date of Birth</p>
                  <p className="text-base text-fg-premium font-medium">{formatDate(student.dob)}</p>
                </div>
              </div>

              {/* Address */}
              {student.address && (
                <div className="flex items-start gap-4">
                  <div className="bg-amber-400/10 text-amber-400 p-2.5 rounded-lg border border-white/10">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-fg-premium-muted uppercase tracking-wider mb-1">Home Address</p>
                    <p className="text-base text-fg-premium font-medium">{student.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Guardian Information */}
          <div className="glass-panel border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all">
            <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-teal-400/10 to-cyan-400/10">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-400" />
                <h3 className="text-lg font-semibold text-fg-premium">Guardian Information</h3>
              </div>
            </div>
            <div className="p-6 space-y-5">
              {/* Guardian Name */}
              <div className="flex items-start gap-4">
                <div className="bg-teal-400/10 text-teal-400 p-2.5 rounded-lg border border-white/10">
                  <UserCircle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-fg-premium-muted uppercase tracking-wider mb-1">Guardian Name</p>
                  <p className="text-base text-fg-premium font-medium">{student.guardianName}</p>
                </div>
              </div>

              {/* Guardian Contact */}
              <div className="flex items-start gap-4">
                <div className="bg-rose-400/10 text-rose-400 p-2.5 rounded-lg border border-white/10">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-fg-premium-muted uppercase tracking-wider mb-1">Contact Number</p>
                  <p className="text-base text-fg-premium font-medium">{student.guardianContact}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Record Information */}
          <div className="glass-panel border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all lg:col-span-2">
            <div className="px-6 py-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-fg-premium" />
                <h3 className="text-lg font-semibold text-fg-premium">Record Timestamps</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Created At */}
                <div className="flex items-start gap-4">
                  <div className="bg-accent-primary/10 text-accent-primary p-2.5 rounded-lg border border-white/10">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-fg-premium-muted uppercase tracking-wider mb-1">Profile Created</p>
                    <p className="text-base text-fg-premium font-medium">{formatDate(student.createdAt)}</p>
                  </div>
                </div>

                {/* Last Updated */}
                <div className="flex items-start gap-4">
                  <div className="bg-green-400/10 text-green-400 p-2.5 rounded-lg border border-white/10">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-fg-premium-muted uppercase tracking-wider mb-1">Last Updated</p>
                    <p className="text-base text-fg-premium font-medium">{formatDate(student.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent className="glass-panel border-white/10 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-fg-premium">Delete Student</DialogTitle>
            <DialogDescription className="text-fg-premium-muted">
              Are you sure you want to delete {student.fullName}? This action cannot be undone and will also remove their login credentials.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog(false)}
              className="border-white/10 text-fg-premium hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-500/80 hover:bg-red-600 text-white"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
