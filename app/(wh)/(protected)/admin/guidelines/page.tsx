'use client'

import React, { useState } from 'react'
import { 
  CheckCircle2, 
  Circle, 
  School, 
  BookOpen, 
  Users, 
  GraduationCap, 
  Settings,
  ChevronRight,
  Info,
  AlertCircle,
  Lightbulb,
  ArrowRight
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface GuidelineStep {
  id: number
  title: string
  description: string
  icon: React.ElementType
  status: 'completed' | 'in-progress' | 'pending'
  actionLabel: string
  actionLink: string
  details: string[]
  tips: string[]
}

export default function AdminGuidelines() {
  const router = useRouter()
  const [expandedStep, setExpandedStep] = useState<number | null>(1)

  // This would ideally come from a context or API to track actual progress
  const [steps, setSteps] = useState<GuidelineStep[]>([
    {
      id: 1,
      title: 'Setup School Information',
      description: 'Configure basic school details and settings',
      icon: School,
      status: 'in-progress',
      actionLabel: 'Configure Settings',
      actionLink: '/admin/settings',
      details: [
        'Set school name, address, and contact information',
        'Upload school logo and branding',
        'Configure academic year and term settings',
        'Set up basic policies and regulations'
      ],
      tips: [
        'Ensure all contact information is up-to-date',
        'School information will appear on reports and certificates'
      ]
    },
    {
      id: 2,
      title: 'Create Classes',
      description: 'Set up all grade levels and class sections',
      icon: BookOpen,
      status: 'pending',
      actionLabel: 'Manage Classes',
      actionLink: '/admin/classes',
      details: [
        'Create grade levels (e.g., Grade 1, Grade 2, etc.)',
        'Add class sections for each grade (e.g., A, B, C)',
        'Set class capacity and room assignments',
        'Define class schedules and timings'
      ],
      tips: [
        'Create all classes before adding subjects',
        'Use clear naming conventions (e.g., "Grade 10 - Section A")',
        'Consider future expansion when planning class structure'
      ]
    },
    {
      id: 3,
      title: 'Create Subjects',
      description: 'Define curriculum subjects for each grade level',
      icon: BookOpen,
      status: 'pending',
      actionLabel: 'Manage Subjects',
      actionLink: '/admin/subjects',
      details: [
        'Add core subjects (Math, Science, English, etc.)',
        'Add optional/elective subjects',
        'Assign subjects to specific grade levels',
        'Set subject codes and credits',
        'Define subject prerequisites if any'
      ],
      tips: [
        'Complete class creation before adding subjects',
        'Group subjects by departments for better organization',
        'Subjects can be shared across multiple classes',
        'Set realistic credit hours for each subject'
      ]
    },
    {
      id: 4,
      title: 'Create Teacher Profiles',
      description: 'Add teaching staff and assign their roles',
      icon: Users,
      status: 'pending',
      actionLabel: 'Add Teachers',
      actionLink: '/admin/add-teacher',
      details: [
        'Enter teacher personal information',
        'Set up login credentials',
        'Assign subjects to teachers',
        'Assign classes to teachers',
        'Set teacher specializations and qualifications'
      ],
      tips: [
        'Ensure classes and subjects are created first',
        'Teachers can be assigned to multiple subjects and classes',
        'Default passwords should be changed on first login',
        'Verify email addresses for communication'
      ]
    },
    {
      id: 5,
      title: 'Create Student Profiles',
      description: 'Enroll students and assign them to classes',
      icon: GraduationCap,
      status: 'pending',
      actionLabel: 'Add Students',
      actionLink: '/admin/add-student',
      details: [
        'Enter student personal information',
        'Add guardian/parent contact details',
        'Assign students to appropriate classes',
        'Generate student roll numbers',
        'Set up login credentials for students',
        'Upload student photographs (optional)'
      ],
      tips: [
        'Complete steps 1-4 before enrolling students',
        'Keep guardian contact information updated',
        'Roll numbers should follow a consistent format',
        'Students automatically get access to their class subjects',
        'Bulk import feature available for multiple students'
      ]
    },
    {
      id: 6,
      title: 'Review and Monitor',
      description: 'Regular maintenance and system monitoring',
      icon: Settings,
      status: 'pending',
      actionLabel: 'View Reports',
      actionLink: '/admin/reports',
      details: [
        'Review all created profiles for accuracy',
        'Check class assignments and teacher allocations',
        'Monitor system activity through logs',
        'Generate and review reports',
        'Update information as needed'
      ],
      tips: [
        'Perform regular audits of user accounts',
        'Keep track of system changes through activity logs',
        'Address any inconsistencies immediately',
        'Backup important data regularly'
      ]
    }
  ])

  const handleStepClick = (stepId: number) => {
    setExpandedStep(expandedStep === stepId ? null : stepId)
  }

  const handleAction = (link: string) => {
    router.push(link)
  }

  const getStatusIcon = (status: GuidelineStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-green-600" />
      case 'in-progress':
        return <Circle className="w-6 h-6 text-blue-600 fill-blue-600" />
      case 'pending':
        return <Circle className="w-6 h-6 text-gray-400" />
    }
  }

  const getStatusBadge = (status: GuidelineStep['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">In Progress</Badge>
      case 'pending':
        return <Badge variant="outline" className="text-gray-600">Pending</Badge>
    }
  }

  const completedSteps = steps.filter(s => s.status === 'completed').length
  const progress = (completedSteps / steps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Lightbulb className="w-8 h-8 text-yellow-500" />
              Admin Setup Guidelines
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Follow these steps to properly configure your school management system
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Setup Progress</span>
                <span className="text-2xl font-bold text-blue-600">{completedSteps}/{steps.length}</span>
              </CardTitle>
              <CardDescription>
                Complete all steps to ensure smooth operation of your school system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {progress === 100 ? '🎉 All steps completed! Your system is ready.' : `${Math.round(progress)}% complete`}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-l-4 border-l-orange-500 bg-orange-50/50">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-orange-900 mb-1">Important: Follow the Sequential Order</h3>
                  <p className="text-sm text-orange-800">
                    Please follow these steps in order. Each step builds upon the previous one. 
                    For example, you must create classes and subjects before creating teacher and student profiles, 
                    as they need to be assigned to existing classes and subjects.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isExpanded = expandedStep === step.id
            
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card className={`transition-all duration-300 hover:shadow-lg ${
                  step.status === 'in-progress' ? 'border-2 border-blue-400 shadow-md' : 
                  step.status === 'completed' ? 'border-2 border-green-400' : ''
                }`}>
                  <CardHeader 
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleStepClick(step.id)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Step Number & Status */}
                      <div className="flex flex-col items-center gap-2">
                        {getStatusIcon(step.status)}
                        <span className="text-xs font-bold text-gray-500">Step {step.id}</span>
                      </div>

                      {/* Icon */}
                      <div className={`p-3 rounded-xl ${
                        step.status === 'completed' ? 'bg-green-100' :
                        step.status === 'in-progress' ? 'bg-blue-100' :
                        'bg-gray-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          step.status === 'completed' ? 'text-green-600' :
                          step.status === 'in-progress' ? 'text-blue-600' :
                          'text-gray-600'
                        }`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <CardTitle className="text-xl">{step.title}</CardTitle>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(step.status)}
                            <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                              isExpanded ? 'rotate-90' : ''
                            }`} />
                          </div>
                        </div>
                        <CardDescription className="text-base">{step.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <CardContent className="border-t pt-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Details */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Info className="w-4 h-4 text-blue-600" />
                            What to do:
                          </h4>
                          <ul className="space-y-2">
                            {step.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Tips */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-600" />
                            Tips:
                          </h4>
                          <ul className="space-y-2">
                            {step.tips.map((tip, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 bg-yellow-50 p-2 rounded">
                                <span className="text-yellow-600">💡</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-6 flex justify-end">
                        <Button
                          onClick={() => handleAction(step.actionLink)}
                          className={`${
                            step.status === 'completed' ? 'bg-green-600 hover:bg-green-700' :
                            step.status === 'in-progress' ? 'bg-blue-600 hover:bg-blue-700' :
                            'bg-gray-600 hover:bg-gray-700'
                          } text-white`}
                        >
                          {step.actionLabel}
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-purple-600" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                If you encounter any issues or need assistance with the setup process, please don't hesitate to reach out to our support team.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-100">
                  📧 Contact Support
                </Button>
                <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-100">
                  📚 View Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
