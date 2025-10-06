"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Microscope, Monitor, Users, Palette, Globe, Shield, Trophy } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SCHOOL_CONFIG } from '@/lib/constants'

const iconMap = {
  Microscope,
  Monitor,
  Users,
  Palette,
  Globe,
  Shield
}

export function Highlights() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50/30 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
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
          <Badge className="bg-yellow-100 text-yellow-800 mb-6 px-4 py-2 border-yellow-200">
            <Trophy className="h-4 w-4 mr-2" />
            Our Strengths
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold heading-premium mb-6">
            Why Choose {SCHOOL_CONFIG.SCHOOL_NAME}?
          </h2>
          <p className="text-xl text-premium max-w-3xl mx-auto leading-relaxed">
            Discover what makes our school exceptional and why families trust us with their children&apos;s education.
          </p>
        </motion.div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SCHOOL_CONFIG.HIGHLIGHTS.map((highlight, index) => {
            const IconComponent = iconMap[highlight.icon as keyof typeof iconMap]
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Card className="h-full bg-white border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                  {/* Animated gradient background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/5 group-hover:to-purple-600/5 transition-all duration-500" />
                  
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  
                  <CardContent className="p-8 text-center relative z-10">
                    <motion.div 
                      className="w-20 h-20 bg-gradient-to-br from-blue-100 via-blue-50 to-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md group-hover:shadow-2xl"
                      whileHover={{ scale: 1.2, rotate: 8 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <IconComponent className="w-10 h-10 text-blue-600 group-hover:text-purple-600 transition-colors duration-500" />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors duration-300">
                      {highlight.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {highlight.description}
                    </p>
                    
                    {/* Decorative element */}
                    <div className="mt-6 flex justify-center">
                      <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <Card className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white shadow-2xl border-none overflow-hidden relative">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32" />
            
            <CardContent className="p-12 lg:p-16 relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
                {[
                  { value: '25+', label: 'Years of Excellence' },
                  { value: '1000+', label: 'Happy Students' },
                  { value: '50+', label: 'Expert Teachers' },
                  { value: '95%', label: 'Success Rate' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                      {stat.value}
                    </div>
                    <div className="text-blue-100 font-medium group-hover:text-white transition-colors">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}