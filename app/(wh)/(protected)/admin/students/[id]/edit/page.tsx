'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { studentApi, Student, UpdateStudentData } from '@/lib/student-api'
import { useMessage } from '@/store/messageStore'
import { 
  ArrowLeft, 
  Save, 
  User, 
  Mail, 
  Calendar, 
  School, 
  Users, 
  Phone, 
  MapPin,
  Hash,
  UserCircle,
  BookOpen,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

interface FormErrors {
  fullName?: string
  dob?: string
  email?: string
  class?: string
  section?: string
  rollNumber?: string
  guardianName?: string
  guardianContact?: string
  address?: string
}

export default function EditStudentPage() {
  const router = useRouter()
  const params = useParams()
  const { addMessage } = useMessage()
  const studentId = params.id as string

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<UpdateStudentData>({})
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())

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
        classId: student.classId,
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

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'fullName':
        if (!value || value.trim().length < 2) return 'Name must be at least 2 characters'
        if (value.length > 100) return 'Name must be at most 100 characters'
        break
      case 'email':
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email'
        break
      case 'dob':
        if (!value) return 'Date of birth is required'
        break
      case 'class':
        if (!value || value.trim().length < 1) return 'Class is required'
        break
      case 'section':
        if (!value || value.trim().length < 1) return 'Section is required'
        if (value.length > 5) return 'Section must be at most 5 characters'
        break
      case 'rollNumber':
        if (!value || !/^[0-9]+$/.test(value)) return 'Roll number must contain only numbers'
        break
      case 'guardianName':
        if (!value || value.trim().length < 2) return 'Guardian name must be at least 2 characters'
        if (value.length > 100) return 'Guardian name must be at most 100 characters'
        break
      case 'guardianContact':
        if (!value || !/^[0-9]{10,15}$/.test(value)) return 'Contact must be 10-15 digits'
        break
      case 'address':
        if (value && value.length > 0) {
          if (value.trim().length < 5) return 'Address must be at least 5 characters'
          if (value.length > 200) return 'Address must be at most 200 characters'
        }
        break
    }
    return undefined
  }

  const handleFieldChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Validate on change if field has been touched
    if (touched.has(name)) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (name: string) => {
    setTouched(prev => new Set(prev).add(name))
    const value = String((formData as Record<string, unknown>)[name] || '')
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    const requiredFields = ['fullName', 'email', 'dob', 'class', 'section', 'rollNumber', 'guardianName', 'guardianContact']
    
    requiredFields.forEach(field => {
      const value = String((formData as Record<string, unknown>)[field] || '')
      const error = validateField(field, value)
      if (error) {
        newErrors[field as keyof FormErrors] = error
        isValid = false
      }
    })

    // Validate optional fields if they have values
    if (formData.address) {
      const addressError = validateField('address', formData.address)
      if (addressError) {
        newErrors.address = addressError
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mark all fields as touched
    const allFields = ['fullName', 'email', 'dob', 'class', 'section', 'rollNumber', 'guardianName', 'guardianContact', 'address']
    setTouched(new Set(allFields))
    
    if (!validateForm()) {
      addMessage('Please fix the validation errors', 'error')
      return
    }

    setSubmitting(true)
    
    try {
      // Convert date to ISO format if changed
      const dataToSubmit = {
        ...formData,
        dob: formData.dob ? new Date(formData.dob).toISOString() : undefined,
      }
      
      await studentApi.update(studentId, dataToSubmit)
      addMessage('Student profile updated successfully!', 'success')
      router.push(`/admin/students/${studentId}`)
    } catch (error) {
      const err = error as { message?: string };
      console.error('Failed to update student:', error)
      addMessage(err?.message || 'Failed to update student', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const hasChanges = () => {
    return Object.keys(formData).length > 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-premium flex items-center justify-center p-6">
        <div className="glass-panel rounded-xl p-8 shadow-2xl flex items-center gap-3 border-white/10">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-accent-primary border-t-transparent"></div>
          <span className="text-fg-premium font-medium">Loading student details...</span>
        </div>
      </div>
    )
  }

  const InputField = ({ 
    label, 
    name, 
    type = 'text', 
    placeholder, 
    icon: Icon, 
    required = false,
    maxLength
  }: { 
    label: string
    name: keyof UpdateStudentData
    type?: string
    placeholder?: string
    icon?: React.ComponentType<{ className?: string }>
    required?: boolean
    maxLength?: number
  }) => {
    const hasError = touched.has(name) && errors[name as keyof FormErrors]
    const isValid = Boolean(touched.has(name) && !errors[name as keyof FormErrors] && (formData as Record<string, unknown>)[name])

    return (
      <div>
        <Label htmlFor={name} className="mb-2 flex items-center gap-2 text-sm font-medium text-fg-premium">
          {Icon && <Icon className="w-4 h-4 text-fg-premium-muted" />}
          {label} {required && <span className="text-red-400">*</span>}
        </Label>
        <div className="relative">
          <Input
            id={name}
            type={type}
            value={(formData as Record<string, unknown>)[name] as string || ''}
            onChange={(e) => handleFieldChange(name, e.target.value)}
            onBlur={() => handleBlur(name)}
            placeholder={placeholder}
            maxLength={maxLength}
            className={`bg-white/5 border-white/10 text-fg-premium placeholder:text-fg-premium-muted ${hasError ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''} ${isValid ? 'border-green-400 focus:border-green-500 focus:ring-green-500/20' : ''}`}
          />
          {isValid && (
            <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
          )}
        </div>
        {hasError && (
          <div className="mt-1.5 flex items-center gap-1 text-sm text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span>{errors[name as keyof FormErrors]}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-premium">
      <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/admin/students/${studentId}`)}
              className="glass-panel border-white/10 text-fg-premium hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-fg-premium">Edit Student Profile</h1>
              <p className="text-fg-premium-muted mt-1">Update student information</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="glass-panel rounded-xl border-white/10 shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="px-6 py-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-accent-primary" />
                <h3 className="text-lg font-semibold text-fg-premium">Personal Information</h3>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField
                  label="Full Name"
                  name="fullName"
                  icon={User}
                  placeholder="Enter student's full name"
                  required
                  maxLength={100}
                />
                <InputField
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  icon={Calendar}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  icon={Mail}
                  placeholder="student@school.com"
                  required
                />
                <div>
                  <Label htmlFor="gender" className="mb-2 flex items-center gap-2 text-sm font-medium text-fg-premium">
                    <UserCircle className="w-4 h-4 text-fg-premium-muted" />
                    Gender
                  </Label>
                  <Select 
                    value={formData.gender || ''} 
                    onValueChange={(value) => handleFieldChange('gender', value)}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-fg-premium">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="glass-panel border-white/10">
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="glass-panel rounded-xl border-white/10 shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="px-6 py-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-fg-premium">Academic Information</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <InputField
                  label="Class"
                  name="classId"
                  icon={School}
                  placeholder="e.g., 10th Grade"
                  required
                />

              </div>
            </div>
          </div>

          {/* Guardian Information */}
          <div className="glass-panel rounded-xl border-white/10 shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="px-6 py-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-400" />
                <h3 className="text-lg font-semibold text-fg-premium">Guardian Information</h3>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField
                  label="Guardian Name"
                  name="guardianName"
                  icon={UserCircle}
                  placeholder="Parent/Guardian full name"
                  required
                  maxLength={100}
                />
                <InputField
                  label="Guardian Contact"
                  name="guardianContact"
                  type="tel"
                  icon={Phone}
                  placeholder="10-15 digit phone number"
                  required
                  maxLength={15}
                />
              </div>

              <div>
                <Label htmlFor="address" className="mb-2 flex items-center gap-2 text-sm font-medium text-fg-premium">
                  <MapPin className="w-4 h-4 text-fg-premium-muted" />
                  Home Address
                </Label>
                <Textarea
                  id="address"
                  value={formData.address || ''}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  onBlur={() => handleBlur('address')}
                  placeholder="Enter complete home address"
                  rows={3}
                  maxLength={200}
                  className={`bg-white/5 border-white/10 text-fg-premium placeholder:text-fg-premium-muted ${touched.has('address') && errors.address ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                />
                {touched.has('address') && errors.address && (
                  <div className="mt-1.5 flex items-center gap-1 text-sm text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.address}</span>
                  </div>
                )}
                <p className="mt-1.5 text-xs text-fg-premium-muted">
                  {(formData.address?.length || 0)}/200 characters
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="sticky bottom-0 glass-panel rounded-xl border-white/10 shadow-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-fg-premium-muted">
                {hasChanges() && Object.keys(errors).length === 0 && (
                  <div className="flex items-center gap-1.5 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>Ready to save</span>
                  </div>
                )}
                {Object.keys(errors).length > 0 && (
                  <div className="flex items-center gap-1.5 text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>{Object.keys(errors).length} validation error{Object.keys(errors).length !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/admin/students/${studentId}`)}
                  className="min-w-[100px] glass-panel border-white/10 text-fg-premium hover:bg-white/10"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting || Object.keys(errors).length > 0}
                  className="min-w-[140px] bg-gradient-to-r from-accent-primary to-accent-secondary hover:opacity-90"
                >
                  {submitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
