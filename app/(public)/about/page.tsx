"use client"

import React from 'react'
import { useSchool } from '@/components/SchoolProvider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Building, 
  Target, 
  Eye, 
  Users, 
  Award, 
  BookOpen,
  Heart,
  Globe,
  Trophy,
  Star,
  ArrowRight,
  GraduationCap
} from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  const { school } = useSchool()

  const values = school?.values || [
    "Excellence in Education",
    "Integrity and Character",
    "Innovation and Creativity",
    "Community Service",
    "Global Citizenship",
    "Environmental Stewardship"
  ]

  const achievements = school?.achievements || [
    "Top 10 Schools in the Region",
    "100% College Acceptance Rate",
    "National Science Fair Winners",
    "State Sports Championship",
    "Excellence in Arts Award"
  ]

  return (
    <div className="min-h-screen bg-bg-premium">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Badge variant="outline" className="mb-6 border-accent-primary/30 text-accent-primary">
            <Building className="h-4 w-4 mr-2" />
            About Us
          </Badge>
          <h1 className="text-5xl lg:text-6xl font-bold text-fg-premium mb-6">
            About <span className="text-accent-primary">{school?.name}</span>
          </h1>
          <p className="text-xl text-fg-premium-muted max-w-3xl">
            {school?.description || 'Nurturing excellence in education for over two decades.'}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-fg-premium">
                  <div className="p-3 bg-accent-primary/10 rounded-lg mr-4">
                    <Target className="h-6 w-6 text-accent-primary" />
                  </div>
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-fg-premium-muted leading-relaxed">
                  {school?.mission || 'To provide quality education that empowers students to become lifelong learners, critical thinkers, and responsible global citizens.'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-fg-premium">
                  <div className="p-3 bg-purple-500/10 rounded-lg mr-4">
                    <Eye className="h-6 w-6 text-purple-400" />
                  </div>
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-fg-premium-muted leading-relaxed">
                  {school?.vision || 'To be a leading educational institution recognized globally for academic excellence and producing graduates who positively impact society.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-accent-primary/30 text-accent-primary">
              <Heart className="h-4 w-4 mr-2" />
              Our Values
            </Badge>
            <h2 className="text-4xl font-bold text-fg-premium mb-4">What We Stand For</h2>
            <p className="text-fg-premium-muted max-w-2xl mx-auto">
              Our core values guide everything we do and shape the character of our students.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-accent-primary/10 rounded-lg group-hover:bg-accent-primary/20 transition-colors">
                      <Star className="h-5 w-5 text-accent-primary" />
                    </div>
                    <p className="text-fg-premium font-medium">{value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-accent-primary/30 text-accent-primary">
              <Trophy className="h-4 w-4 mr-2" />
              Achievements
            </Badge>
            <h2 className="text-4xl font-bold text-fg-premium mb-4">Our Excellence Record</h2>
            <p className="text-fg-premium-muted max-w-2xl mx-auto">
              Celebrating our accomplishments and continued commitment to excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="border-white/10 bg-gradient-to-br from-accent-primary/5 to-transparent hover:from-accent-primary/10 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Award className="h-6 w-6 text-accent-primary flex-shrink-0 mt-1" />
                    <p className="text-fg-premium">{achievement}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-accent-primary to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Join Our Community
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Discover how {school?.name} can help your child reach their full potential.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
              <Link href="/admissions">
                <GraduationCap className="h-5 w-5 mr-2" />
                Apply Now
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/contact">
                <ArrowRight className="h-5 w-5 mr-2" />
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Template Note */}
      <div className="bg-yellow-500/10 border-t border-yellow-500/20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-yellow-200">
            📝 Note: This is a template page. For real school deployment, customize content with actual school information, history, leadership team details, and professional photography.
          </p>
        </div>
      </div>
    </div>
  )
}
