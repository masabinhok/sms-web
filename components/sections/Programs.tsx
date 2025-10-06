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
    <section className="py-20 lg:py-32 bg-gradient-to-br from-white via-blue-50/30 to-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <Badge className="bg-blue-100 text-blue-800 mb-6 px-4 py-2 border-blue-200">
            <BookOpen className="h-4 w-4 mr-2" />
            Our Programs
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold heading-premium mb-6">
            Academic Programs
          </h2>
          <p className="text-xl text-premium max-w-3xl mx-auto leading-relaxed">
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
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <Card className="h-full bg-white border-gray-200 shadow-md hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 via-blue-500/0 to-purple-600/0 group-hover:from-blue-600/5 group-hover:via-blue-500/3 group-hover:to-purple-600/5 transition-all duration-500" />
                  
                  <CardHeader className="text-center relative z-10 pb-4">
                    <motion.div 
                      className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm group-hover:shadow-xl"
                      whileHover={{ scale: 1.15, rotate: 5 }}
                    >
                      <IconComponent className="w-10 h-10 text-blue-600 group-hover:text-blue-700 transition-colors" />
                    </motion.div>
                    <CardTitle className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">
                      {program.title}
                    </CardTitle>
                    <Badge variant="secondary" className="mx-auto bg-blue-100 text-blue-700 border-blue-200 font-semibold px-3 py-1">
                      {program.grades}
                    </Badge>
                  </CardHeader>
                  
                  <CardContent className="text-center space-y-6 relative z-10">
                    <CardDescription className="text-gray-600 leading-relaxed min-h-[3rem]">
                      {program.description}
                    </CardDescription>
                    
                    <div className="space-y-3 py-4">
                      {program.features.map((feature, idx) => (
                        <motion.div 
                          key={idx} 
                          className="flex items-center text-sm text-gray-600"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <div className="w-1.5 h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full mr-3 flex-shrink-0" />
                          <span className="text-left">{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full border-2 border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 font-semibold group-hover:shadow-lg mt-4"
                      asChild
                    >
                      <Link href={`/academics/programs/${program.id}`} className="flex items-center justify-center">
                        Explore Program
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
          className="text-center mt-20"
        >
          <Button 
            size="lg" 
            asChild 
            className="premium-button gradient-primary text-white font-bold px-8 py-6 text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <Link href="/academics" className="flex items-center">
              View All Programs
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}