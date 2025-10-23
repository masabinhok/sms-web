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
  ArrowRight,
  RotateCcw,
  ShieldAlert,
  Lock,
  Loader2
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useSetupStore, StepStatus } from '@/store/setupStore'
import { checkStepSequence } from '@/lib/setup-validation'

interface GuidelineStep {
  id: number
  title: string
  description: string
  icon: React.ElementType
  actionLabel: string
  actionLink: string
  details: string[]
  tips: string[]
}

export default function AdminGuidelines() {
  const router = useRouter()
  const [expandedStep, setExpandedStep] = useState<number | null>(1)
  const [validating, setValidating] = useState(false)
  const [warningDialog, setWarningDialog] = useState<{
    open: boolean
    title: string
    message: string
    details?: string[]
    type: 'warning' | 'error' | 'info'
  }>({
    open: false,
    title: '',
    message: '',
    type: 'warning',
  })

  // Use Zustand store for step status
  const { 
    getStepStatus, 
    markStepCompleted, 
    markStepInProgress,
    getCompletedStepsCount,
    getProgressPercentage,
    resetAllSteps,
    canProceedToStep,
    getCompletedStepIds
  } = useSetupStore()

  // Steps configuration (status comes from store)
  const steps: GuidelineStep[] = [
    {
      id: 1,
      title: 'Setup School Information',
      description: 'Configure basic school details and settings',
      icon: School,
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
    },
  ]

  const handleStepClick = (stepId: number) => {
    setExpandedStep(expandedStep === stepId ? null : stepId)
  }

  const handleAction = (stepId: number, link: string) => {
    // Check sequence before allowing navigation
    const completedSteps = getCompletedStepIds()
    const sequenceCheck = checkStepSequence(stepId, completedSteps)
    
    if (!sequenceCheck.isValid) {
      setWarningDialog({
        open: true,
        title: '⚠️ Step Sequence Warning',
        message: sequenceCheck.message,
        details: sequenceCheck.details,
        type: 'warning',
      })
      return
    }

    router.push(link)
  }

  const handleMarkComplete = async (stepId: number) => {
    // Check sequence first
    const completedSteps = getCompletedStepIds()
    const sequenceCheck = checkStepSequence(stepId, completedSteps)
    
    if (!sequenceCheck.isValid) {
      setWarningDialog({
        open: true,
        title: '🔒 Cannot Complete Step',
        message: sequenceCheck.message,
        details: sequenceCheck.details,
        type: 'error',
      })
      return
    }

    setValidating(true)
    
    try {
      // Attempt to mark as completed (includes validation)
      const result = await markStepCompleted(stepId)
      
      if (!result.isValid) {
        setWarningDialog({
          open: true,
          title: '❌ Validation Failed',
          message: result.message,
          details: result.details,
          type: 'error',
        })
      } else {
        setWarningDialog({
          open: true,
          title: '✅ Step Completed',
          message: result.message,
          details: result.details,
          type: 'info',
        })
      }
    } catch (error) {
      setWarningDialog({
        open: true,
        title: '❌ Error',
        message: 'Failed to validate step completion',
        details: [error instanceof Error ? error.message : 'Unknown error'],
        type: 'error',
      })
    } finally {
      setValidating(false)
    }
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      resetAllSteps()
    }
  }

  const closeDialog = () => {
    setWarningDialog({ ...warningDialog, open: false })
  }

  const getStatusIcon = (status: StepStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-green-600" />
      case 'in-progress':
        return <Circle className="w-6 h-6 text-blue-600 fill-blue-600" />
      case 'pending':
        return <Circle className="w-6 h-6 text-gray-400" />
    }
  }

  const getStatusBadge = (status: StepStatus) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">In Progress</Badge>
      case 'pending':
        return <Badge variant="outline" className="text-gray-600">Pending</Badge>
    }
  }

  const completedSteps = getCompletedStepsCount()
  const progress = getProgressPercentage()

  return (
    <>
      {/* Warning/Error Dialog */}
      <Dialog open={warningDialog.open} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {warningDialog.type === 'warning' && (
                <ShieldAlert className="w-5 h-5 text-yellow-600" />
              )}
              {warningDialog.type === 'error' && (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              {warningDialog.type === 'info' && (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              )}
              {warningDialog.title}
            </DialogTitle>
            <DialogDescription className="text-base">
              {warningDialog.message}
            </DialogDescription>
          </DialogHeader>
          {warningDialog.details && warningDialog.details.length > 0 && (
            <div className={`rounded-lg p-4 ${
              warningDialog.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
              warningDialog.type === 'error' ? 'bg-red-50 border border-red-200' :
              'bg-green-50 border border-green-200'
            }`}>
              <ul className="space-y-2">
                {warningDialog.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-gray-600">•</span>
                    <span className={
                      warningDialog.type === 'warning' ? 'text-yellow-800' :
                      warningDialog.type === 'error' ? 'text-red-800' :
                      'text-green-800'
                    }>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <DialogFooter>
            <Button onClick={closeDialog} variant="outline">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 p-6">
        <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Lightbulb className="w-8 h-8 text-yellow-500" />
                Admin Setup Guidelines
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                Follow these steps to properly configure your school management system
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="text-gray-600 hover:text-red-600 hover:border-red-300"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Progress
            </Button>
          </div>
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
                <span className="text-2xl font-bold text-blue-600">{completedSteps}/6</span>
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
                <ShieldAlert className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-orange-900 mb-1 flex items-center gap-2">
                    Important: Sequential Order & Validation Required
                  </h3>
                  <p className="text-sm text-orange-800 mb-2">
                    <strong>Steps must be completed in order.</strong> Each step builds upon the previous one. 
                    You cannot skip steps or mark them complete without actually fulfilling the requirements.
                  </p>
                  <ul className="text-sm text-orange-800 space-y-1 ml-4">
                    <li className="flex items-start gap-2">
                      <Lock className="w-3 h-3 mt-1 flex-shrink-0" />
                      <span>Steps are locked until previous steps are completed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3 h-3 mt-1 flex-shrink-0" />
                      <span>Steps can only be marked complete after validation checks pass</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertCircle className="w-3 h-3 mt-1 flex-shrink-0" />
                      <span>You'll receive warnings if you try to skip ahead</span>
                    </li>
                  </ul>
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
            const status = getStepStatus(step.id)
            const isProceedable = canProceedToStep(step.id)
            
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Card className={`transition-all duration-300 hover:shadow-lg ${
                  status === 'in-progress' ? 'border-2 border-blue-400 shadow-md' : 
                  status === 'completed' ? 'border-2 border-green-400' : ''
                } ${!isProceedable ? 'opacity-60' : ''}`}>
                  <CardHeader 
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleStepClick(step.id)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Step Number & Status */}
                      <div className="flex flex-col items-center gap-2">
                        {getStatusIcon(status)}
                        <span className="text-xs font-bold text-gray-500">Step {step.id}</span>
                      </div>

                      {/* Icon */}
                      <div className={`p-3 rounded-xl ${
                        status === 'completed' ? 'bg-green-100' :
                        status === 'in-progress' ? 'bg-blue-100' :
                        'bg-gray-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          status === 'completed' ? 'text-green-600' :
                          status === 'in-progress' ? 'text-blue-600' :
                          'text-gray-600'
                        }`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <CardTitle className="text-xl">{step.title}</CardTitle>
                          <div className="flex items-center gap-2">
                            {!isProceedable && (
                              <Badge variant="outline" className="text-orange-600 border-orange-300">
                                Locked
                              </Badge>
                            )}
                            {getStatusBadge(status)}
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

                      {/* Action Buttons */}
                      <div className="mt-6 flex justify-between items-center">
                        {!isProceedable && (
                          <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                            <Lock className="w-4 h-4 text-orange-600" />
                            <p className="text-sm text-orange-600 font-medium">
                              Complete previous steps first
                            </p>
                          </div>
                        )}
                        <div className="flex gap-3 ml-auto">
                          {status === 'completed' && (
                            <Button
                              variant="outline"
                              onClick={() => handleAction(step.id, step.actionLink)}
                              className="border-green-300 text-green-700 hover:bg-green-50"
                            >
                              Review
                            </Button>
                          )}
                          {status !== 'completed' && (
                            <>
                              <Button
                                onClick={() => handleAction(step.id, step.actionLink)}
                                disabled={!isProceedable || validating}
                                className={`${
                                  status === 'in-progress' ? 'bg-blue-600 hover:bg-blue-700' :
                                  'bg-gray-600 hover:bg-gray-700'
                                } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                {step.actionLabel}
                                <ChevronRight className="w-4 h-4 ml-2" />
                              </Button>
                              <Button
                                onClick={() => handleMarkComplete(step.id)}
                                disabled={!isProceedable || validating}
                                variant="outline"
                                className="border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {validating ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Validating...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Mark Complete
                                  </>
                                )}
                              </Button>
                            </>
                          )}
                        </div>
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
    </>
  )
}
