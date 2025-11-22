"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  GraduationCap, 
  Building,
  Globe,
  Microscope,
  Calculator,
  Palette,
  Music,
  Languages,
  Trophy,
  Laptop,
  Users
} from 'lucide-react'
import Link from 'next/link'

export default function AcademicsPage() {
  const programs = [
    {
      title: "Early Years (Pre-K to Grade 2)",
      description: "Foundation building through play-based and experiential learning",
      icon: Users,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10"
    },
    {
      title: "Elementary (Grade 3-5)",
      description: "Core subject mastery with introduction to specialized learning",
      icon: BookOpen,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Middle School (Grade 6-8)",
      description: "Comprehensive curriculum with focus on critical thinking",
      icon: Calculator,
      color: "text-green-400",
      bgColor: "bg-green-500/10"
    },
    {
      title: "High School (Grade 9-12)",
      description: "Advanced academics preparing students for university and beyond",
      icon: GraduationCap,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    }
  ]

  const facilities = [
    { icon: Microscope, title: "Science Labs", description: "Modern laboratories for Physics, Chemistry, and Biology" },
    { icon: Laptop, title: "Computer Labs", description: "State-of-the-art technology and programming facilities" },
    { icon: BookOpen, title: "Library", description: "Extensive collection of books and digital resources" },
    { icon: Palette, title: "Art Studios", description: "Creative spaces for artistic expression" },
    { icon: Music, title: "Music Room", description: "Equipped for instrumental and vocal training" },
    { icon: Globe, title: "Language Lab", description: "Interactive language learning environment" }
  ]

  const subjects = [
    "Mathematics", "Science", "English Language", "Social Studies",
    "Computer Science", "Foreign Languages", "Physical Education",
    "Visual Arts", "Music", "Environmental Studies"
  ]

  return (
    <div className="min-h-screen bg-bg-premium">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Badge variant="outline" className="mb-6 border-blue-400/30 text-blue-400">
            <BookOpen className="h-4 w-4 mr-2" />
            Academics
          </Badge>
          <h1 className="text-5xl lg:text-6xl font-bold text-fg-premium mb-6">
            Academic <span className="text-accent-primary">Excellence</span>
          </h1>
          <p className="text-xl text-fg-premium-muted max-w-3xl">
            Comprehensive curriculum designed to develop critical thinking, creativity, and character in every student.
          </p>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-fg-premium mb-4">Our Programs</h2>
            <p className="text-fg-premium-muted max-w-2xl mx-auto">
              Age-appropriate learning pathways from early childhood through high school graduation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {programs.map((program, index) => {
              const Icon = program.icon
              return (
                <Card key={index} className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <div className={`p-3 ${program.bgColor} rounded-lg`}>
                        <Icon className={`h-6 w-6 ${program.color}`} />
                      </div>
                    </div>
                    <CardTitle className="text-fg-premium group-hover:text-white transition-colors">
                      {program.title}
                    </CardTitle>
                    <CardDescription className="text-fg-premium-muted">
                      {program.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-accent-primary/30 text-accent-primary">
              <BookOpen className="h-4 w-4 mr-2" />
              Curriculum
            </Badge>
            <h2 className="text-4xl font-bold text-fg-premium mb-4">Subjects Offered</h2>
            <p className="text-fg-premium-muted max-w-2xl mx-auto">
              Comprehensive subject coverage ensuring well-rounded education.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {subjects.map((subject, index) => (
              <Badge key={index} variant="outline" className="px-4 py-2 border-white/10 bg-white/5 text-fg-premium hover:bg-white/10 transition-colors">
                {subject}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-accent-primary/30 text-accent-primary">
              <Building className="h-4 w-4 mr-2" />
              Facilities
            </Badge>
            <h2 className="text-4xl font-bold text-fg-premium mb-4">World-Class Facilities</h2>
            <p className="text-fg-premium-muted max-w-2xl mx-auto">
              Modern infrastructure supporting innovative teaching and learning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility, index) => {
              const Icon = facility.icon
              return (
                <Card key={index} className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
                  <CardContent className="pt-6">
                    <div className="p-3 bg-accent-primary/10 rounded-lg w-fit mb-4 group-hover:bg-accent-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-accent-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-fg-premium mb-2">{facility.title}</h3>
                    <p className="text-sm text-fg-premium-muted">{facility.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-accent-primary to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Explore Our Academic Programs
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Schedule a visit to see our facilities and meet our faculty.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
              <Link href="/admissions">
                Apply Now
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/contact">
                Schedule Visit
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Template Note */}
      <div className="bg-yellow-500/10 border-t border-yellow-500/20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-yellow-200">
            📝 Note: This is a template page. Customize with actual curriculum details, specific program information, and real facility photographs for production deployment.
          </p>
        </div>
      </div>
    </div>
  )
}
