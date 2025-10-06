"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SCHOOL_CONFIG } from '@/lib/constants'

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % SCHOOL_CONFIG.TESTIMONIALS.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + SCHOOL_CONFIG.TESTIMONIALS.length) % SCHOOL_CONFIG.TESTIMONIALS.length)
  }

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-white via-purple-50/20 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />
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
          <Badge className="bg-purple-100 text-purple-800 mb-6 px-4 py-2 border-purple-200">
            <Star className="h-4 w-4 mr-2" />
            Testimonials
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold heading-premium mb-6">
            What Our Community Says
          </h2>
          <p className="text-xl text-premium max-w-3xl mx-auto leading-relaxed">
            Hear from parents, students, and alumni about their experiences at {SCHOOL_CONFIG.SCHOOL_NAME}.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-5xl mx-auto">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-none shadow-2xl overflow-hidden relative">
              {/* Decorative quote marks */}
              <div className="absolute top-0 left-0 text-blue-600/10 text-9xl font-serif leading-none select-none">"</div>
              <div className="absolute bottom-0 right-0 text-purple-600/10 text-9xl font-serif leading-none select-none rotate-180">"</div>
              
              <CardContent className="p-12 lg:p-16 text-center relative z-10">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                    <Quote className="w-10 h-10 text-white" />
                  </div>
                </motion.div>
                
                <blockquote className="text-xl lg:text-2xl text-gray-800 mb-10 leading-relaxed font-medium">
                  &quot;{SCHOOL_CONFIG.TESTIMONIALS[currentIndex].content}&quot;
                </blockquote>
                
                <div className="flex items-center justify-center space-x-5">
                  <motion.div 
                    className="w-20 h-20 relative rounded-full overflow-hidden ring-4 ring-blue-200 shadow-lg"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Image
                      src={SCHOOL_CONFIG.TESTIMONIALS[currentIndex].image}
                      alt={SCHOOL_CONFIG.TESTIMONIALS[currentIndex].name}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                  <div className="text-left">
                    <div className="font-bold text-lg text-gray-900">
                      {SCHOOL_CONFIG.TESTIMONIALS[currentIndex].name}
                    </div>
                    <div className="text-gray-600">
                      {SCHOOL_CONFIG.TESTIMONIALS[currentIndex].role}
                    </div>
                    {/* Star rating */}
                    <div className="flex mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-center items-center space-x-6 mt-10">
            <Button
              variant="outline"
              size="sm"
              onClick={prevTestimonial}
              className="rounded-full p-3 h-auto border-2 border-blue-200 hover:border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-xl"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            {/* Dots */}
            <div className="flex space-x-3">
              {SCHOOL_CONFIG.TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex 
                      ? 'w-10 h-3 bg-gradient-to-r from-blue-600 to-purple-600' 
                      : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={nextTestimonial}
              className="rounded-full p-3 h-auto border-2 border-blue-200 hover:border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-xl"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* All Testimonials Grid (Hidden on mobile) */}
        <div className="hidden lg:grid grid-cols-3 gap-8 mt-20">
          {SCHOOL_CONFIG.TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
            >
              <Card className="h-full bg-white border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/5 group-hover:to-purple-600/5 transition-all duration-500" />
                
                <CardContent className="p-8 relative z-10">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <Quote className="w-10 h-10 text-blue-600/20 mb-4" />
                  
                  <p className="text-gray-600 mb-6 line-clamp-4 leading-relaxed">
                    &quot;{testimonial.content}&quot;
                  </p>
                  
                  <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                    <motion.div 
                      className="w-14 h-14 relative rounded-full overflow-hidden ring-2 ring-gray-200 group-hover:ring-blue-400 transition-all"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm group-hover:text-blue-700 transition-colors">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-600 text-xs">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}