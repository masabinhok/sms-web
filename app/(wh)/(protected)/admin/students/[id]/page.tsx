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
  UserCircle
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

  const fields = [
    {
      label: 'Full Name',
      value: student.fullName,
      icon: User,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'Email',
      value: student.email,
      icon: Mail,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      label: 'Date of Birth',
      value: formatDate(student.dob),
      icon: Calendar,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      label: 'Gender',
      value: student.gender || 'Not specified',
      icon: UserCircle,
      color: 'text-pink-600',
      bg: 'bg-pink-50'
    },
    {
      label: 'Class',
      value: student.class,
      icon: School,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    },
    {
      label: 'Section',
      value: student.section,
      icon: School,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50'
    },
    {
      label: 'Roll Number',
      value: student.rollNumber,
      icon: Hash,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    {
      label: 'Guardian Name',
      value: student.guardianName,
      icon: Users,
      color: 'text-teal-600',
      bg: 'bg-teal-50'
    },
    {
      label: 'Guardian Contact',
      value: student.guardianContact,
      icon: Phone,
      color: 'text-rose-600',
      bg: 'bg-rose-50'
    },
  ]

  if (student.address) {
    fields.push({
      label: 'Address',
      value: student.address,
      icon: MapPin,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    })
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/admin/students')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Details</h1>
            <p className="text-gray-600 mt-1">View complete student information</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => router.push(`/admin/students/${student.id}/edit`)}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
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

      {/* Student Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-bold">
            {student.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-3xl font-bold">{student.fullName}</h2>
            <p className="text-blue-100 mt-1">{student.class} - Section {student.section}</p>
            <p className="text-blue-100 mt-1">Roll Number: {student.rollNumber}</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field) => (
              <div key={field.label} className="flex items-start gap-4">
                <div className={`${field.bg} ${field.color} p-3 rounded-lg`}>
                  <field.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">{field.label}</p>
                  <p className="mt-1 text-gray-900 font-medium break-words">{field.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timestamps */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-900">Record Information</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Created At</p>
              <p className="mt-1 text-gray-900 font-medium">{formatDate(student.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-green-50 text-green-600 p-3 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Last Updated</p>
              <p className="mt-1 text-gray-900 font-medium">{formatDate(student.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
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
