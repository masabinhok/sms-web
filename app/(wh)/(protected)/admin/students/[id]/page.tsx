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
        <div className="text-gray-500">Loading student details...</div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/admin/students')}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Students
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => router.push(`/admin/students/${student.id}/edit`)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialog(true)}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>

        {/* Student Profile Card */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-48 -translate-x-48"></div>
          </div>
          
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-5xl md:text-6xl font-bold shadow-lg ring-4 ring-white/30">
              {student.fullName.charAt(0).toUpperCase()}
            </div>
            
            {/* Student Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{student.fullName}</h1>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className={`${getGenderBadgeColor(student.gender)} border px-3 py-1 text-sm font-medium`}>
                  {student.gender || 'Not specified'}
                </Badge>
                <Badge className="bg-white/20 border-white/30 text-white px-3 py-1 text-sm font-medium">
                  {calculateAge(student.dob)} years old
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <School className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-white/70">Class</p>
                    <p className="font-semibold">{student.classId}</p>
                  </div>
                </div>
  
                <div className="flex items-center gap-2">
                  <Hash className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-white/70">Roll Number</p>
                    <p className="font-semibold">{student.rollNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              </div>
            </div>
            <div className="p-6 space-y-5">
              {/* Full Name */}
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg">
                  <IdCard className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Full Name</p>
                  <p className="text-base text-gray-900 font-medium">{student.fullName}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="bg-green-50 text-green-600 p-2.5 rounded-lg">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Email Address</p>
                  <p className="text-base text-gray-900 font-medium break-all">{student.email}</p>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="flex items-start gap-4">
                <div className="bg-purple-50 text-purple-600 p-2.5 rounded-lg">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Date of Birth</p>
                  <p className="text-base text-gray-900 font-medium">{formatDate(student.dob)}</p>
                </div>
              </div>

              {/* Address */}
              {student.address && (
                <div className="flex items-start gap-4">
                  <div className="bg-amber-50 text-amber-600 p-2.5 rounded-lg">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Home Address</p>
                    <p className="text-base text-gray-900 font-medium">{student.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Guardian Information */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-cyan-50">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600" />
                <h3 className="text-lg font-semibold text-gray-900">Guardian Information</h3>
              </div>
            </div>
            <div className="p-6 space-y-5">
              {/* Guardian Name */}
              <div className="flex items-start gap-4">
                <div className="bg-teal-50 text-teal-600 p-2.5 rounded-lg">
                  <UserCircle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Guardian Name</p>
                  <p className="text-base text-gray-900 font-medium">{student.guardianName}</p>
                </div>
              </div>

              {/* Guardian Contact */}
              <div className="flex items-start gap-4">
                <div className="bg-rose-50 text-rose-600 p-2.5 rounded-lg">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Contact Number</p>
                  <p className="text-base text-gray-900 font-medium">{student.guardianContact}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Record Information */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow lg:col-span-2">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Record Timestamps</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Created At */}
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Profile Created</p>
                    <p className="text-base text-gray-900 font-medium">{formatDate(student.createdAt)}</p>
                  </div>
                </div>

                {/* Last Updated */}
                <div className="flex items-start gap-4">
                  <div className="bg-green-50 text-green-600 p-2.5 rounded-lg">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Last Updated</p>
                    <p className="text-base text-gray-900 font-medium">{formatDate(student.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Delete Student</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {student.fullName}? This action cannot be undone and will also remove their login credentials.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
