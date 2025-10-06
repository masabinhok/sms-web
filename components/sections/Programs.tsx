"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Baby, BookOpen, GraduationCap, Trophy, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SCHOOL_CONFIG } from '@/lib/constants'

const iconMap = {
  Baby,
  BookOpen,
  GraduationCap,
  Trophy
}

export function Programs() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Academic Programs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive education programs designed to nurture and develop students at every stage of their learning journey.
          </p>
        </motion.div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SCHOOL_CONFIG.PROGRAMS.map((program, index) => {
            const IconComponent = iconMap[program.icon as keyof typeof iconMap]
            
            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl text-blue-900">{program.title}</CardTitle>
                    <Badge variant="secondary" className="mx-auto">
                      {program.grades}
                    </Badge>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <CardDescription className="text-gray-600">
                      {program.description}
                    </CardDescription>
                    
                    <div className="space-y-2">
                      {program.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center justify-center text-sm text-gray-500">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all"
                      asChild
                    >
                      <Link href={`/academics/programs/${program.id}`}>
                        Explore Program
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button size="lg" asChild className="bg-blue-900 hover:bg-blue-800">
            <Link href="/academics">
              View All Programs
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}