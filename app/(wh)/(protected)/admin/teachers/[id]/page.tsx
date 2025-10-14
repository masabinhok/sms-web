'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { teacherApi, Teacher } from '@/lib/teacher-api'
import { useMessage } from '@/store/messageStore'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  User, 
  Mail, 
  Calendar, 
  Phone, 
  MapPin,
  UserCircle,
  Clock,
  IdCard,
  BookOpen,
  GraduationCap
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

const SUBJECTS_MAP: Record<string, string> = {
  MATH: 'Mathematics',
  SCIENCE: 'Science',
  ENGLISH: 'English',
  COMPUTER_SCIENCE: 'Computer Science',
  PHYSICS: 'Physics',
  CHEMISTRY: 'Chemistry',
  BIOLOGY: 'Biology',
  MUSIC: 'Music',
  DANCE: 'Dance',
  ART: 'Art',
  SOCIAL_STUDIES: 'Social Studies',
};

const CLASSES_MAP: Record<string, string> = {
  NURSERY: 'Nursery',
  LKG: 'LKG',
  UKG: 'UKG',
  FIRST: '1st',
  SECOND: '2nd',
  THIRD: '3rd',
  FOURTH: '4th',
  FIFTH: '5th',
  SIXTH: '6th',
  SEVENTH: '7th',
  EIGHTH: '8th',
  NINTH: '9th',
  TENTH: '10th',
  ELEVENTH: '11th',
  TWELFTH: '12th',
};

export default function TeacherDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { addMessage } = useMessage()
  const teacherId = params.id as string

  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)

  useEffect(() => {
    if (teacherId) {
      fetchTeacher()
    }
  }, [teacherId])

  const fetchTeacher = async () => {
    setLoading(true)
    try {
      const data = await teacherApi.getById(teacherId)
      setTeacher(data)
    } catch (error) {
      console.error('Failed to fetch teacher:', error)
      addMessage('Failed to load teacher details', 'error')
      router.push('/admin/teachers')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!teacher) return
    
    setDeleting(true)
    try {
      await teacherApi.delete(teacher.id)
      addMessage('Teacher deleted successfully', 'success')
      router.push('/admin/teachers')
    } catch (error) {
      console.error('Failed to delete teacher:', error)
      addMessage('Failed to delete teacher', 'error')
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

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading teacher details...</div>
      </div>
    )
  }

  if (!teacher) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/30">
      <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/admin/teachers')}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Teachers
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => router.push(`/admin/teachers/${teacher.id}/edit`)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
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

        {/* Teacher Profile Card */}
        <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-700 rounded-2xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-48 -translate-x-48"></div>
          </div>
          
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-5xl md:text-6xl font-bold shadow-lg ring-4 ring-white/30">
              {teacher.fullName.charAt(0).toUpperCase()}
            </div>
            
            {/* Teacher Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{teacher.fullName}</h1>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className={`${getGenderBadgeColor(teacher.gender)} border px-3 py-1 text-sm font-medium`}>
                  {teacher.gender || 'Not specified'}
                </Badge>
                <Badge className="bg-white/20 border-white/30 text-white px-3 py-1 text-sm font-medium">
                  {calculateAge(teacher.dob)} years old
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-white/70">Email</p>
                    <p className="font-semibold text-sm break-all">{teacher.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  <div>
                    <p className="text-xs text-white/70">Phone</p>
                    <p className="font-semibold">{teacher.phone}</p>
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
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              </div>
            </div>
            <div className="p-6 space-y-5">
              {/* Full Name */}
              <div className="flex items-start gap-4">
                <div className="bg-green-50 text-green-600 p-2.5 rounded-lg">
                  <IdCard className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Full Name</p>
                  <p className="text-base text-gray-900 font-medium">{teacher.fullName}</p>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="flex items-start gap-4">
                <div className="bg-purple-50 text-purple-600 p-2.5 rounded-lg">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Date of Birth</p>
                  <p className="text-base text-gray-900 font-medium">{formatDate(teacher.dob)}</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="bg-amber-50 text-amber-600 p-2.5 rounded-lg">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Home Address</p>
                  <p className="text-base text-gray-900 font-medium">{teacher.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Teaching Information */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Teaching Information</h3>
              </div>
            </div>
            <div className="p-6 space-y-5">
              {/* Subjects */}
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 text-blue-600 p-2.5 rounded-lg">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Subjects</p>
                  <div className="flex flex-wrap gap-2">
                    {teacher.subjects && teacher.subjects.length > 0 ? (
                      teacher.subjects.map((subject, idx) => (
                        <Badge 
                          key={idx}
                          className="bg-blue-100 text-blue-700 border-blue-200"
                        >
                          {SUBJECTS_MAP[subject] || subject}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">No subjects assigned</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Classes */}
              <div className="flex items-start gap-4">
                <div className="bg-purple-50 text-purple-600 p-2.5 rounded-lg">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Classes</p>
                  <div className="flex flex-wrap gap-2">
                    {teacher.classes && teacher.classes.length > 0 ? (
                      teacher.classes.map((cls, idx) => (
                        <Badge 
                          key={idx}
                          className="bg-purple-100 text-purple-700 border-purple-200"
                        >
                          {CLASSES_MAP[cls] || cls}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">No classes assigned</span>
                    )}
                  </div>
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
                    <p className="text-base text-gray-900 font-medium">{formatDate(teacher.createdAt)}</p>
                  </div>
                </div>

                {/* Last Updated */}
                <div className="flex items-start gap-4">
                  <div className="bg-green-50 text-green-600 p-2.5 rounded-lg">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Last Updated</p>
                    <p className="text-base text-gray-900 font-medium">{formatDate(teacher.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Teacher</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {teacher.fullName}? This action cannot be undone and will also remove their login credentials.
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
