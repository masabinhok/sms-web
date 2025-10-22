'use client'

import React, { useState } from 'react'
import { 
  Building2, 
  ArrowLeft, 
  Save,
  Globe,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { SCHOOL_INFO } from '@/lib/constants/school-info'

interface FormData {
  // Basic Information
  name: string
  tagline: string
  motto: string
  foundingYear: string
  
  // Contact Information
  address: string
  city: string
  state: string
  country: string
  zipCode: string
  phone: string
  alternatePhone: string
  email: string
  admissionEmail: string
  website: string
  
  // Social Media
  facebook: string
  instagram: string
  twitter: string
  youtube: string
  linkedin: string
  
  // About Information
  description: string
  mission: string
  vision: string
  principalName: string
  principalMessage: string
  
  // Statistics
  campusArea: string
  classrooms: string
  laboratories: string
  libraries: string
  
  // Accreditation
  affiliatedTo: string
  recognizedBy: string
  accreditedBy: string
  schoolCode: string
}

export default function SchoolInfoSettings() {
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    // Load existing data from SCHOOL_INFO
    name: SCHOOL_INFO.name,
    tagline: SCHOOL_INFO.tagline,
    motto: SCHOOL_INFO.motto,
    foundingYear: SCHOOL_INFO.about.foundingYear,
    
    address: SCHOOL_INFO.contact.address,
    city: SCHOOL_INFO.contact.city,
    state: SCHOOL_INFO.contact.state,
    country: SCHOOL_INFO.contact.country,
    zipCode: SCHOOL_INFO.contact.zipCode,
    phone: SCHOOL_INFO.contact.phone,
    alternatePhone: SCHOOL_INFO.contact.alternatePhone,
    email: SCHOOL_INFO.contact.email,
    admissionEmail: SCHOOL_INFO.contact.admissionEmail,
    website: SCHOOL_INFO.contact.website,
    
    facebook: SCHOOL_INFO.social.facebook,
    instagram: SCHOOL_INFO.social.instagram,
    twitter: SCHOOL_INFO.social.twitter,
    youtube: SCHOOL_INFO.social.youtube,
    linkedin: SCHOOL_INFO.social.linkedin,
    
    description: SCHOOL_INFO.about.description,
    mission: SCHOOL_INFO.about.mission,
    vision: SCHOOL_INFO.about.vision,
    principalName: SCHOOL_INFO.about.principalName,
    principalMessage: SCHOOL_INFO.about.principalMessage,
    
    campusArea: SCHOOL_INFO.stats.campusArea,
    classrooms: SCHOOL_INFO.stats.classrooms,
    laboratories: SCHOOL_INFO.stats.laboratories,
    libraries: SCHOOL_INFO.stats.libraries,
    
    affiliatedTo: SCHOOL_INFO.accreditation.affiliatedTo,
    recognizedBy: SCHOOL_INFO.accreditation.recognizedBy,
    accreditedBy: SCHOOL_INFO.accreditation.accreditedBy,
    schoolCode: SCHOOL_INFO.accreditation.schoolCode,
  })

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Here you would save to your backend/database
    console.log('Saving school info:', formData)
    
    setIsSaving(false)
    setShowSuccess(true)
    
    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const InputField = ({ 
    label, 
    field, 
    placeholder, 
    icon: Icon,
    type = 'text',
    required = false,
    maxLength
  }: { 
    label: string
    field: keyof FormData
    placeholder?: string
    icon?: React.ElementType
    type?: string
    required?: boolean
    maxLength?: number
  }) => (
    <div className="space-y-2">
      <Label htmlFor={field} className="text-gray-700 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={field}
        type={type}
        value={formData[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className="bg-white border-gray-300"
      />
    </div>
  )

  const TextareaField = ({ 
    label, 
    field, 
    placeholder,
    rows = 3,
    required = false,
    maxLength
  }: { 
    label: string
    field: keyof FormData
    placeholder?: string
    rows?: number
    required?: boolean
    maxLength?: number
  }) => (
    <div className="space-y-2">
      <Label htmlFor={field} className="text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Textarea
        id={field}
        value={formData[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
        maxLength={maxLength}
        className="bg-white border-gray-300 resize-none"
      />
      {maxLength && (
        <p className="text-xs text-gray-500 text-right">
          {formData[field].length}/{maxLength}
        </p>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Link 
              href="/admin/settings"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Settings
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Building2 className="w-8 h-8 text-purple-600" />
              School Information
            </h1>
            <p className="text-gray-600 mt-2">
              Configure basic school details that appear on your website and reports
            </p>
          </div>
          {showSuccess && (
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Saved Successfully
            </Badge>
          )}
        </div>

        {/* Info Banner */}
        <Card className="border-l-4 border-l-blue-500 bg-blue-50/50">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Important Information</h3>
                <p className="text-sm text-blue-800">
                  These settings control the information displayed on your public website, reports, and certificates.
                  Make sure all information is accurate and up-to-date. Changes will be reflected immediately across the system.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-600" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Essential school details and identity
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <InputField
                    label="School Name"
                    field="name"
                    placeholder="e.g., Greenfield International School"
                    required
                    maxLength={100}
                  />
                </div>
                <InputField
                  label="Tagline"
                  field="tagline"
                  placeholder="e.g., Excellence in Education"
                  maxLength={100}
                />
                <InputField
                  label="Founding Year"
                  field="foundingYear"
                  placeholder="e.g., 2000"
                  maxLength={4}
                />
                <div className="md:col-span-2">
                  <InputField
                    label="Motto"
                    field="motto"
                    placeholder="e.g., Empowering Minds, Shaping Futures"
                    maxLength={150}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Contact Information
              </CardTitle>
              <CardDescription>
                Address and contact details for communication
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <InputField
                    label="Street Address"
                    field="address"
                    icon={MapPin}
                    placeholder="e.g., 123 Education Street"
                    required
                    maxLength={200}
                  />
                </div>
                <InputField
                  label="City"
                  field="city"
                  placeholder="e.g., New York"
                  required
                  maxLength={50}
                />
                <InputField
                  label="State/Province"
                  field="state"
                  placeholder="e.g., NY"
                  required
                  maxLength={50}
                />
                <InputField
                  label="Country"
                  field="country"
                  placeholder="e.g., United States"
                  required
                  maxLength={50}
                />
                <InputField
                  label="Zip/Postal Code"
                  field="zipCode"
                  placeholder="e.g., 10001"
                  maxLength={10}
                />
                <InputField
                  label="Primary Phone"
                  field="phone"
                  icon={Phone}
                  type="tel"
                  placeholder="e.g., +1 (555) 123-4567"
                  required
                  maxLength={20}
                />
                <InputField
                  label="Alternate Phone"
                  field="alternatePhone"
                  icon={Phone}
                  type="tel"
                  placeholder="e.g., +1 (555) 987-6543"
                  maxLength={20}
                />
                <InputField
                  label="General Email"
                  field="email"
                  icon={Mail}
                  type="email"
                  placeholder="e.g., info@school.com"
                  required
                  maxLength={100}
                />
                <InputField
                  label="Admissions Email"
                  field="admissionEmail"
                  icon={Mail}
                  type="email"
                  placeholder="e.g., admissions@school.com"
                  maxLength={100}
                />
                <InputField
                  label="Website URL"
                  field="website"
                  icon={Globe}
                  type="url"
                  placeholder="e.g., https://www.school.com"
                  maxLength={100}
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-pink-600" />
                Social Media Links
              </CardTitle>
              <CardDescription>
                Connect your social media profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <InputField
                  label="Facebook"
                  field="facebook"
                  icon={Facebook}
                  placeholder="https://facebook.com/yourschool"
                  maxLength={200}
                />
                <InputField
                  label="Instagram"
                  field="instagram"
                  icon={Instagram}
                  placeholder="https://instagram.com/yourschool"
                  maxLength={200}
                />
                <InputField
                  label="Twitter"
                  field="twitter"
                  icon={Twitter}
                  placeholder="https://twitter.com/yourschool"
                  maxLength={200}
                />
                <InputField
                  label="YouTube"
                  field="youtube"
                  icon={Youtube}
                  placeholder="https://youtube.com/@yourschool"
                  maxLength={200}
                />
                <InputField
                  label="LinkedIn"
                  field="linkedin"
                  icon={Linkedin}
                  placeholder="https://linkedin.com/school/yourschool"
                  maxLength={200}
                />
              </div>
            </CardContent>
          </Card>

          {/* About Information */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-green-600" />
                About & Description
              </CardTitle>
              <CardDescription>
                Tell your school's story
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <TextareaField
                label="School Description"
                field="description"
                placeholder="Write a compelling description of your school..."
                rows={4}
                maxLength={1000}
              />
              <TextareaField
                label="Mission Statement"
                field="mission"
                placeholder="What is your school's mission?"
                rows={3}
                maxLength={500}
              />
              <TextareaField
                label="Vision Statement"
                field="vision"
                placeholder="What is your school's vision?"
                rows={3}
                maxLength={500}
              />
              <div className="grid md:grid-cols-2 gap-5">
                <InputField
                  label="Principal's Name"
                  field="principalName"
                  placeholder="e.g., Dr. Jane Smith"
                  maxLength={100}
                />
              </div>
              <TextareaField
                label="Principal's Message"
                field="principalMessage"
                placeholder="A message from the principal..."
                rows={4}
                maxLength={1000}
              />
            </CardContent>
          </Card>

          {/* Statistics & Infrastructure */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-orange-600" />
                Infrastructure & Statistics
              </CardTitle>
              <CardDescription>
                Campus facilities and infrastructure details
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <InputField
                  label="Campus Area"
                  field="campusArea"
                  placeholder="e.g., 5 acres"
                  maxLength={50}
                />
                <InputField
                  label="Number of Classrooms"
                  field="classrooms"
                  placeholder="e.g., 50"
                  maxLength={10}
                />
                <InputField
                  label="Number of Laboratories"
                  field="laboratories"
                  placeholder="e.g., 8"
                  maxLength={10}
                />
                <InputField
                  label="Number of Libraries"
                  field="libraries"
                  placeholder="e.g., 2"
                  maxLength={10}
                />
              </div>
            </CardContent>
          </Card>

          {/* Accreditation */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                Accreditation & Affiliation
              </CardTitle>
              <CardDescription>
                Official recognition and certification details
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <InputField
                  label="Affiliated To"
                  field="affiliatedTo"
                  placeholder="e.g., CBSE, State Board"
                  maxLength={100}
                />
                <InputField
                  label="Recognized By"
                  field="recognizedBy"
                  placeholder="e.g., Ministry of Education"
                  maxLength={100}
                />
                <InputField
                  label="Accredited By"
                  field="accreditedBy"
                  placeholder="e.g., National Accreditation Body"
                  maxLength={100}
                />
                <InputField
                  label="School Code"
                  field="schoolCode"
                  placeholder="e.g., SCH123456"
                  maxLength={50}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="sticky bottom-6 bg-white rounded-xl border-2 border-gray-200 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Make sure all information is accurate before saving
              </p>
              <div className="flex gap-3">
                <Link href="/admin/settings">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
                  disabled={isSaving}
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
