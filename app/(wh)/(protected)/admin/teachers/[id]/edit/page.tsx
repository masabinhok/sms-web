'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { teacherApi, Teacher, UpdateTeacherData } from '@/lib/teacher-api'
import { useMessage } from '@/store/messageStore'
import { 
  ArrowLeft, 
  Save, 
  User, 
  Mail, 
  Calendar, 
  Phone, 
  MapPin,
  UserCircle,
  AlertCircle,
  CheckCircle,
  X,
  BookOpen,
  GraduationCap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

const SUBJECTS = [
  { value: 'MATH', label: 'Mathematics' },
  { value: 'SCIENCE', label: 'Science' },
  { value: 'ENGLISH', label: 'English' },
  { value: 'COMPUTER_SCIENCE', label: 'Computer Science' },
  { value: 'PHYSICS', label: 'Physics' },
  { value: 'CHEMISTRY', label: 'Chemistry' },
  { value: 'BIOLOGY', label: 'Biology' },
  { value: 'MUSIC', label: 'Music' },
  { value: 'DANCE', label: 'Dance' },
  { value: 'ART', label: 'Art' },
  { value: 'SOCIAL_STUDIES', label: 'Social Studies' },
];

const CLASSES = [
  { value: 'NURSERY', label: 'Nursery' },
  { value: 'LKG', label: 'LKG' },
  { value: 'UKG', label: 'UKG' },
  { value: 'FIRST', label: '1st' },
  { value: 'SECOND', label: '2nd' },
  { value: 'THIRD', label: '3rd' },
  { value: 'FOURTH', label: '4th' },
  { value: 'FIFTH', label: '5th' },
  { value: 'SIXTH', label: '6th' },
  { value: 'SEVENTH', label: '7th' },
  { value: 'EIGHTH', label: '8th' },
  { value: 'NINTH', label: '9th' },
  { value: 'TENTH', label: '10th' },
  { value: 'ELEVENTH', label: '11th' },
  { value: 'TWELFTH', label: '12th' },
];

interface FormErrors {
  fullName?: string
  dob?: string
  email?: string
  phone?: string
  address?: string
}

export default function EditTeacherPage() {
  const router = useRouter()
  const params = useParams()
  const { addMessage } = useMessage()
  const teacherId = params.id as string

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<UpdateTeacherData>({})
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (teacherId) {
      fetchTeacher()
    }
  }, [teacherId])

  const fetchTeacher = async () => {
    setLoading(true)
    try {
      const teacher = await teacherApi.getById(teacherId)
      setFormData({
        fullName: teacher.fullName,
        dob: teacher.dob.split('T')[0], // Convert to YYYY-MM-DD format
        email: teacher.email,
        gender: teacher.gender,
        phone: teacher.phone,
        address: teacher.address,
      })
      setSelectedSubjects(teacher.subjectIds || [])
      setSelectedClasses(teacher.classIds || [])
    } catch (error) {
      console.error('Failed to fetch teacher:', error)
      addMessage('Failed to load teacher details', 'error')
      router.push('/admin/teachers')
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
      case 'phone':
        if (!value || !/^[0-9]{10,15}$/.test(value)) return 'Phone must be 10-15 digits'
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

  const toggleSubject = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    )
  }

  const toggleClass = (classValue: string) => {
    setSelectedClasses(prev =>
      prev.includes(classValue)
        ? prev.filter(c => c !== classValue)
        : [...prev, classValue]
    )
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    const requiredFields = ['fullName', 'email', 'dob', 'phone', 'address']
    
    requiredFields.forEach(field => {
      const value = String((formData as Record<string, unknown>)[field] || '')
      const error = validateField(field, value)
      if (error) {
        newErrors[field as keyof FormErrors] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mark all fields as touched
    const allFields = ['fullName', 'email', 'dob', 'phone', 'address']
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
        subjects: selectedSubjects.length > 0 ? selectedSubjects : undefined,
        classes: selectedClasses.length > 0 ? selectedClasses : undefined,
      }
      
      await teacherApi.update(teacherId, dataToSubmit)
      addMessage('Teacher profile updated successfully!', 'success')
      router.push(`/admin/teachers/${teacherId}`)
    } catch (error) {
      const err = error as { message?: string };
      console.error('Failed to update teacher:', error)
      addMessage(err?.message || 'Failed to update teacher', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-premium flex items-center justify-center p-6">
        <div className="glass-panel rounded-xl p-8 shadow-2xl flex items-center gap-3 border-white/10">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-500 border-t-transparent"></div>
          <span className="text-fg-premium font-medium">Loading teacher details...</span>
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
    name: keyof UpdateTeacherData
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
              onClick={() => router.push(`/admin/teachers/${teacherId}`)}
              className="glass-panel border-white/10 text-fg-premium hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-fg-premium">Edit Teacher Profile</h1>
              <p className="text-fg-premium-muted mt-1">Update teacher information</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="glass-panel rounded-xl border-white/10 shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="px-6 py-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-fg-premium">Personal Information</h3>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <InputField
                    label="Full Name"
                    name="fullName"
                    icon={User}
                    placeholder="Enter teacher's full name"
                    required
                    maxLength={100}
                  />
                </div>

                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  icon={Mail}
                  placeholder="teacher@school.com"
                  required
                />

                <InputField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  icon={Phone}
                  placeholder="10-15 digit phone number"
                  required
                  maxLength={15}
                />

                <InputField
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  icon={Calendar}
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

                <div className="md:col-span-2">
                  <Label htmlFor="address" className="mb-2 flex items-center gap-2 text-sm font-medium text-fg-premium">
                    <MapPin className="w-4 h-4 text-fg-premium-muted" />
                    Home Address <span className="text-red-400">*</span>
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
          </div>

          {/* Teaching Subjects */}
          <div className="glass-panel rounded-xl border-white/10 shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="px-6 py-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-fg-premium">Teaching Subjects</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-fg-premium-muted">Select the subjects this teacher can teach</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {SUBJECTS.map((subject) => (
                  <button
                    key={subject.value}
                    type="button"
                    onClick={() => toggleSubject(subject.value)}
                    className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all transform hover:scale-105 ${
                      selectedSubjects.includes(subject.value)
                        ? 'border-green-500 bg-green-500/20 text-green-300 shadow-md'
                        : 'border-white/10 bg-white/5 text-fg-premium hover:border-green-400 hover:bg-green-400/10'
                    }`}
                  >
                    {subject.label}
                  </button>
                ))}
              </div>
              {selectedSubjects.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                  <CheckCircle className="w-4 h-4" />
                  <span>Selected: {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>

          {/* Teaching Classes */}
          <div className="glass-panel rounded-xl border-white/10 shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="px-6 py-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-fg-premium">Teaching Classes</h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-fg-premium-muted">Select the classes this teacher can teach</p>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-6">
                {CLASSES.map((classItem) => (
                  <button
                    key={classItem.value}
                    type="button"
                    onClick={() => toggleClass(classItem.value)}
                    className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all transform hover:scale-105 ${
                      selectedClasses.includes(classItem.value)
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300 shadow-md'
                        : 'border-white/10 bg-white/5 text-fg-premium hover:border-purple-400 hover:bg-purple-400/10'
                    }`}
                  >
                    {classItem.label}
                  </button>
                ))}
              </div>
              {selectedClasses.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-purple-400 bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                  <CheckCircle className="w-4 h-4" />
                  <span>Selected: {selectedClasses.length} class{selectedClasses.length !== 1 ? 'es' : ''}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="sticky bottom-0 glass-panel rounded-xl border-white/10 shadow-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-fg-premium-muted">
                {Object.keys(errors).length === 0 && (
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
                  onClick={() => router.push(`/admin/teachers/${teacherId}`)}
                  className="min-w-[100px] glass-panel border-white/10 text-fg-premium hover:bg-white/10"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting || Object.keys(errors).length > 0}
                  className="min-w-[140px] bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90"
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
