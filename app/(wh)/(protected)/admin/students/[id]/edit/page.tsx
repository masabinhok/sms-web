'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { studentApi, Student, UpdateStudentData } from '@/lib/student-api'
import { useMessage } from '@/store/messageStore'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function EditStudentPage() {
  const router = useRouter()
  const params = useParams()
  const { addMessage } = useMessage()
  const studentId = params.id as string

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<UpdateStudentData>({})

  useEffect(() => {
    if (studentId) {
      fetchStudent()
    }
  }, [studentId])

  const fetchStudent = async () => {
    setLoading(true)
    try {
      const student = await studentApi.getById(studentId)
      setFormData({
        fullName: student.fullName,
        dob: student.dob.split('T')[0], // Convert to YYYY-MM-DD format
        email: student.email,
        gender: student.gender,
        class: student.class,
        section: student.section,
        rollNumber: student.rollNumber,
        guardianName: student.guardianName,
        guardianContact: student.guardianContact,
        address: student.address,
      })
    } catch (error) {
      console.error('Failed to fetch student:', error)
      addMessage('Failed to load student details', 'error')
      router.push('/admin/students')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      // Convert date to ISO format if changed
      const dataToSubmit = {
        ...formData,
        dob: formData.dob ? new Date(formData.dob).toISOString() : undefined,
      }
      
      await studentApi.update(studentId, dataToSubmit)
      addMessage('Student updated successfully', 'success')
      router.push(`/admin/students/${studentId}`)
    } catch (error: any) {
      console.error('Failed to update student:', error)
      addMessage(error?.message || 'Failed to update student', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading student details...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/admin/students/${studentId}`)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Student</h1>
          <p className="text-gray-600 mt-1">Update student information</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName || ''}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob || ''}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  value={formData.gender || ''}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Academic Information</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="class">Class *</Label>
                <Input
                  id="class"
                  value={formData.class || ''}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  placeholder="e.g., 10th Grade"
                  required
                />
              </div>
              <div>
                <Label htmlFor="section">Section *</Label>
                <Input
                  id="section"
                  value={formData.section || ''}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  placeholder="e.g., A"
                  required
                />
              </div>
              <div>
                <Label htmlFor="rollNumber">Roll Number *</Label>
                <Input
                  id="rollNumber"
                  value={formData.rollNumber || ''}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  placeholder="e.g., 15"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Guardian Information */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Guardian Information</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guardianName">Guardian Name *</Label>
                <Input
                  id="guardianName"
                  value={formData.guardianName || ''}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="guardianContact">Guardian Contact *</Label>
                <Input
                  id="guardianContact"
                  value={formData.guardianContact || ''}
                  onChange={(e) => setFormData({ ...formData, guardianContact: e.target.value })}
                  placeholder="10-15 digits"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Home address"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/admin/students/${studentId}`)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {submitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
