"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScheduleVisitDialog, BrochureDialog } from '@/components/VisitBrochureDialogs'
import { 
  GraduationCap, 
  FileText, 
  DollarSign,
  Award,
  CheckCircle,
  Calendar,
  ClipboardList,
  Mail,
  Download
} from 'lucide-react'
import Link from 'next/link'

export default function AdmissionsPage() {
  const [visitDialogOpen, setVisitDialogOpen] = useState(false)
  const [brochureDialogOpen, setBrochureDialogOpen] = useState(false)

  const admissionSteps = [
    { step: 1, title: "Inquiry & Registration", description: "Submit initial inquiry form and register for admission" },
    { step: 2, title: "Submit Documents", description: "Provide required academic and personal documents" },
    { step: 3, title: "Entrance Assessment", description: "Complete age-appropriate entrance evaluation" },
    { step: 4, title: "Interview", description: "Parent-student interview with admission team" },
    { step: 5, title: "Admission Decision", description: "Receive admission decision within 7 working days" },
    { step: 6, title: "Enrollment", description: "Complete enrollment formalities and fee payment" }
  ]

  const requirements = [
    "Birth certificate (original and photocopy)",
    "Previous school records and transcripts",
    "Transfer certificate from previous school",
    "Recent passport-size photographs",
    "Medical records and immunization certificate",
    "Proof of residence",
    "Parent/Guardian identification documents"
  ]

  const scholarships = [
    {
      title: "Academic Excellence Scholarship",
      description: "Merit-based scholarships for outstanding academic performance",
      coverage: "Up to 50% tuition waiver"
    },
    {
      title: "Sports Excellence Scholarship",
      description: "For students with exceptional athletic achievements",
      coverage: "Up to 30% tuition waiver"
    },
    {
      title: "Need-Based Financial Aid",
      description: "Assistance for deserving students from economically disadvantaged backgrounds",
      coverage: "Varies by case"
    },
    {
      title: "Sibling Discount",
      description: "Special discount for families with multiple children enrolled",
      coverage: "10-15% discount"
    }
  ]

  return (
    <div className="min-h-screen bg-bg-premium">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Badge variant="outline" className="mb-6 border-green-400/30 text-green-400">
            <GraduationCap className="h-4 w-4 mr-2" />
            Admissions
          </Badge>
          <h1 className="text-5xl lg:text-6xl font-bold text-fg-premium mb-6">
            Join Our <span className="text-accent-primary">Community</span>
          </h1>
          <p className="text-xl text-fg-premium-muted max-w-3xl mb-8">
            Begin your journey towards excellence. We welcome students who are eager to learn and grow in a nurturing environment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => setVisitDialogOpen(true)} size="lg" className="bg-accent-primary hover:bg-accent-primary/90">
              <Calendar className="h-5 w-5 mr-2" />
              Schedule Campus Visit
            </Button>
            <Button onClick={() => setBrochureDialogOpen(true)} size="lg" variant="outline" className="border-white/10 bg-white/5 text-fg-premium hover:bg-white/10">
              <Download className="h-5 w-5 mr-2" />
              Download Brochure
            </Button>
          </div>
        </div>
      </section>

      {/* Admission Process */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-accent-primary/30 text-accent-primary">
              <ClipboardList className="h-4 w-4 mr-2" />
              Application Process
            </Badge>
            <h2 className="text-4xl font-bold text-fg-premium mb-4">How to Apply</h2>
            <p className="text-fg-premium-muted max-w-2xl mx-auto">
              Simple and transparent admission process designed for your convenience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {admissionSteps.map((item, index) => (
              <Card key={index} className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary font-bold">
                      {item.step}
                    </div>
                    <CardTitle className="text-lg text-fg-premium">{item.title}</CardTitle>
                  </div>
                  <CardDescription className="text-fg-premium-muted">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <Badge variant="outline" className="mb-4 border-accent-primary/30 text-accent-primary">
                <FileText className="h-4 w-4 mr-2" />
                Requirements
              </Badge>
              <h2 className="text-3xl font-bold text-fg-premium mb-6">Required Documents</h2>
              <p className="text-fg-premium-muted mb-8">
                Please prepare the following documents for the admission process:
              </p>
              <div className="space-y-3">
                {requirements.map((req, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-fg-premium">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="border-white/10 bg-gradient-to-br from-accent-primary/10 to-transparent">
              <CardHeader>
                <CardTitle className="text-fg-premium flex items-center gap-2">
                  <Mail className="h-5 w-5 text-accent-primary" />
                  Important Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-sm text-fg-premium-muted mb-1">Admission Open</p>
                  <p className="text-lg font-semibold text-fg-premium">January 1, 2025</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-sm text-fg-premium-muted mb-1">Last Date to Apply</p>
                  <p className="text-lg font-semibold text-fg-premium">March 31, 2025</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg">
                  <p className="text-sm text-fg-premium-muted mb-1">Academic Year Begins</p>
                  <p className="text-lg font-semibold text-fg-premium">April 15, 2025</p>
                </div>
                <p className="text-xs text-fg-premium-muted">
                  Note: Dates may vary. Contact admissions office for current information.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Scholarships */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-accent-primary/30 text-accent-primary">
              <Award className="h-4 w-4 mr-2" />
              Financial Assistance
            </Badge>
            <h2 className="text-4xl font-bold text-fg-premium mb-4">Scholarships & Aid</h2>
            <p className="text-fg-premium-muted max-w-2xl mx-auto">
              We believe in making quality education accessible to deserving students.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {scholarships.map((scholarship, index) => (
              <Card key={index} className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="h-6 w-6 text-accent-primary" />
                    <CardTitle className="text-fg-premium">{scholarship.title}</CardTitle>
                  </div>
                  <CardDescription className="text-fg-premium-muted">
                    {scholarship.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="border-green-400/30 text-green-400">
                    {scholarship.coverage}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-accent-primary to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Contact our admissions team for personalized guidance through the application process.
          </p>
          <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
            <Link href="/contact">
              Contact Admissions
            </Link>
          </Button>
        </div>
      </section>

      {/* Dialogs */}
      <ScheduleVisitDialog open={visitDialogOpen} onOpenChange={setVisitDialogOpen} />
      <BrochureDialog open={brochureDialogOpen} onOpenChange={setBrochureDialogOpen} />

      {/* Template Note */}
      <div className="bg-yellow-500/10 border-t border-yellow-500/20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-yellow-200">
            📝 Note: This is a template. Update with actual admission dates, fee structure, and school-specific requirements for production.
          </p>
        </div>
      </div>
    </div>
  )
}
