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
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { SCHOOL_INFO } from '@/lib/constants/school-info'
import { SchoolInfo } from '@/types/types'
import { api } from '@/lib/api-client'
import { useMessage } from '@/store/messageStore'

// Move InputField component outside to prevent recreation on every render
interface InputFieldProps {
  label: string
  field: keyof SchoolInfo
  placeholder?: string
  icon?: React.ElementType
  type?: string
  required?: boolean
  maxLength?: number
  helpText?: string
  value: string
  onChange: (field: keyof SchoolInfo, value: string) => void
}

const InputField = ({ 
  label, 
  field, 
  placeholder, 
  icon: Icon,
  type = 'text',
  required = false,
  maxLength,
  helpText,
  value,
  onChange
}: InputFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={field} className="text-gray-700 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-gray-500" />}
      {label}
      {required && <span className="text-red-500">*</span>}
    </Label>
    <Input
      id={field}
      type={type}
      value={value}
      onChange={(e) => onChange(field, e.target.value)}
      placeholder={placeholder}
      required={required}
      maxLength={maxLength}
      className="bg-white border-gray-300"
    />
    {helpText && (
      <p className="text-xs text-gray-500">{helpText}</p>
    )}
  </div>
)

// Move TextareaField component outside to prevent recreation on every render
interface TextareaFieldProps {
  label: string
  field: keyof SchoolInfo
  placeholder?: string
  rows?: number
  required?: boolean
  maxLength?: number
  value: string
  onChange: (field: keyof SchoolInfo, value: string) => void
}

const TextareaField = ({ 
  label, 
  field, 
  placeholder,
  rows = 3,
  required = false,
  maxLength,
  value,
  onChange
}: TextareaFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={field} className="text-gray-700">
      {label}
      {required && <span className="text-red-500">*</span>}
    </Label>
    <Textarea
      id={field}
      value={value}
      onChange={(e) => onChange(field, e.target.value)}
      placeholder={placeholder}
      rows={rows}
      required={required}
      maxLength={maxLength}
      className="bg-white border-gray-300 resize-none"
    />
    {maxLength && (
      <p className="text-xs text-gray-500 text-right">
        {value.length}/{maxLength}
      </p>
    )}
  </div>
)

export default function SchoolInfoSettings() {
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const {addMessage} = useMessage();

  const [formData, setFormData] = useState<SchoolInfo>({
    // Load existing data from SCHOOL_INFO
    name: SCHOOL_INFO.name,
    tagline: SCHOOL_INFO.tagline,
    motto: SCHOOL_INFO.motto,
    
    address: SCHOOL_INFO.contact.address,
    city: SCHOOL_INFO.contact.city,
    phone: SCHOOL_INFO.contact.phone,
    email: SCHOOL_INFO.contact.email,
    
    facebook: SCHOOL_INFO.social.facebook,
    instagram: SCHOOL_INFO.social.instagram,
    twitter: SCHOOL_INFO.social.twitter,
    youtube: SCHOOL_INFO.social.youtube,
    
    description: SCHOOL_INFO.about.description,
    mission: SCHOOL_INFO.about.mission,
    vision: SCHOOL_INFO.about.vision,
    
    heroTitle: SCHOOL_INFO.hero.title,
    heroSubtitle: SCHOOL_INFO.hero.subtitle,
    heroCTA: SCHOOL_INFO.hero.ctaPrimary,
  })

  const handleChange = (field: keyof SchoolInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try{
       const response = await api.post<{
      message: string
    }>('/academics/create-school', formData)
    addMessage(response.message)
     setIsSaving(false)
    setShowSuccess(true)
    }catch(error){

      console.log('Failed to create school')
      addMessage('Failed to create school.')
    }
  }

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
              Configure school details that appear on your public website
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
                <h3 className="font-semibold text-blue-900 mb-1">About These Settings</h3>
                <p className="text-sm text-blue-800">
                  These settings control information displayed on your <strong>public website only</strong>.
                  Only fields that are actively used in the website are shown here. Changes will be reflected immediately.
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
                School name and identity displayed throughout the website
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
                    helpText="Used in: Navbar, Footer, About section, Hero section"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <InputField
                  label="Tagline"
                  field="tagline"
                  placeholder="e.g., Excellence in Education"
                  required
                  maxLength={100}
                  helpText="Used in: Navbar, Hero section"
                  value={formData.tagline}
                  onChange={handleChange}
                />
                <InputField
                  label="Motto"
                  field="motto"
                  placeholder="e.g., Empowering Minds, Shaping Futures"
                  required
                  maxLength={150}
                  helpText="Used in: Footer"
                  value={formData.motto}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Hero Section */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-600" />
                Hero Section (Homepage Banner)
              </CardTitle>
              <CardDescription>
                Main headline and call-to-action on the homepage
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <InputField
                label="Hero Title"
                field="heroTitle"
                placeholder="e.g., Welcome to Our School"
                required
                maxLength={150}
                value={formData.heroTitle}
                onChange={handleChange}
              />
              <TextareaField
                label="Hero Subtitle"
                field="heroSubtitle"
                placeholder="A brief description that appears under the title..."
                rows={2}
                required
                maxLength={300}
                value={formData.heroSubtitle}
                onChange={handleChange}
              />
              <InputField
                label="Primary Button Text"
                field="heroCTA"
                placeholder="e.g., Learn More"
                required
                maxLength={50}
                value={formData.heroCTA}
                onChange={handleChange}
              />
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
                Displayed in Navbar, Footer, and Contact page
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
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
                <InputField
                  label="City"
                  field="city"
                  placeholder="e.g., New York"
                  required
                  maxLength={50}
                  value={formData.city}
                  onChange={handleChange}
                />
                <InputField
                  label="Phone Number"
                  field="phone"
                  icon={Phone}
                  type="tel"
                  placeholder="e.g., +1 (555) 123-4567"
                  required
                  maxLength={20}
                  value={formData.phone}
                  onChange={handleChange}
                />
                <div className="md:col-span-2">
                  <InputField
                    label="Email Address"
                    field="email"
                    icon={Mail}
                    type="email"
                    placeholder="e.g., info@school.com"
                    required
                    maxLength={100}
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
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
                Social media icons and links in the Footer
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
                  value={formData.facebook}
                  onChange={handleChange}
                />
                <InputField
                  label="Instagram"
                  field="instagram"
                  icon={Instagram}
                  placeholder="https://instagram.com/yourschool"
                  maxLength={200}
                  value={formData.instagram}
                  onChange={handleChange}
                />
                <InputField
                  label="Twitter"
                  field="twitter"
                  icon={Twitter}
                  placeholder="https://twitter.com/yourschool"
                  maxLength={200}
                  value={formData.twitter}
                  onChange={handleChange}
                />
                <InputField
                  label="YouTube"
                  field="youtube"
                  icon={Youtube}
                  placeholder="https://youtube.com/@yourschool"
                  maxLength={200}
                  value={formData.youtube}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* About Information */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-green-600" />
                About Section Content
              </CardTitle>
              <CardDescription>
                Displayed on the About section of your website
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <TextareaField
                label="School Description"
                field="description"
                placeholder="Write a compelling description of your school..."
                rows={4}
                required
                maxLength={1000}
                value={formData.description}
                onChange={handleChange}
              />
              <TextareaField
                label="Mission Statement"
                field="mission"
                placeholder="What is your school's mission?"
                rows={3}
                required
                maxLength={500}
                value={formData.mission}
                onChange={handleChange}
              />
              <TextareaField
                label="Vision Statement"
                field="vision"
                placeholder="What is your school's vision?"
                rows={3}
                required
                maxLength={500}
                value={formData.vision}
                onChange={handleChange}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="sticky bottom-6 bg-white rounded-xl border-2 border-gray-200 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                Changes will be visible immediately on the public website
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
