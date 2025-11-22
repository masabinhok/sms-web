"use client"

import React, { useState, useRef, useLayoutEffect, useEffect } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useSchool } from '@/components/SchoolProvider'
import { TESTIMONIALS } from '@/lib/constants/testimonials'

gsap.registerPlugin(ScrollTrigger)

export function Testimonials() {
  const { school } = useSchool();
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const slideRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.from(headerRef.current, {
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      })

      // Grid Animation (for larger screens)
      const cards = gsap.utils.toArray('.testimonial-card')
      gsap.from(cards, {
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 75%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Slide Animation
  useEffect(() => {
    if (slideRef.current) {
      gsap.fromTo(slideRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
      )
    }
  }, [currentIndex])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  }

  return (
    <section id="testimonials" ref={containerRef} className="py-24 lg:py-32 bg-premium relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-[600px] h-[600px] bg-accent-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 left-20 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-20">
          <Badge variant="outline" className="mb-6 px-4 py-2 border-accent-primary/30 text-accent-primary bg-accent-primary/10 backdrop-blur-sm">
            <Star className="h-4 w-4 mr-2" />
            Testimonials
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-blue-400">Community</span> Says
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Hear from parents, students, and alumni about their experiences at {school?.name || 'our school'}.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-5xl mx-auto">
          <div ref={slideRef} className="relative">
            <Card className="bg-white/5 border-white/10 backdrop-blur-md shadow-2xl overflow-hidden relative">
              {/* Decorative quote marks */}
              <div className="absolute top-0 left-0 text-accent-primary/10 text-9xl font-serif leading-none select-none">&quot;</div>
              <div className="absolute bottom-0 right-0 text-blue-500/10 text-9xl font-serif leading-none select-none rotate-180">&quot;</div>
              
              <CardContent className="p-6 md:p-12 lg:p-16 text-center relative z-10">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-accent-primary to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 md:mb-8 shadow-lg shadow-accent-primary/20">
                  <Quote className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                
                <blockquote className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 md:mb-10 leading-relaxed font-medium italic">
                  &quot;{TESTIMONIALS[currentIndex].content}&quot;
                </blockquote>
                
                <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-5">
                  <div className="w-16 h-16 md:w-20 md:h-20 relative rounded-full overflow-hidden ring-4 ring-white/10 shadow-lg">
                    <Image
                      src={TESTIMONIALS[currentIndex].image}
                      alt={TESTIMONIALS[currentIndex].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <div className="font-bold text-lg text-white">
                      {TESTIMONIALS[currentIndex].name}
                    </div>
                    <div className="text-accent-primary text-sm md:text-base">
                      {TESTIMONIALS[currentIndex].role}
                    </div>
                    {/* Star rating */}
                    <div className="flex justify-center md:justify-start mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center space-x-6 mt-10">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="rounded-full w-12 h-12 border-white/10 bg-white/5 text-white hover:bg-accent-primary hover:border-accent-primary hover:text-white transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            {/* Dots */}
            <div className="flex space-x-3">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex 
                      ? 'w-10 h-2 bg-accent-primary' 
                      : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="rounded-full w-12 h-12 border-white/10 bg-white/5 text-white hover:bg-accent-primary hover:border-accent-primary hover:text-white transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* All Testimonials Grid (Hidden on mobile) */}
        <div ref={gridRef} className="hidden lg:grid grid-cols-3 gap-8 mt-20">
          {TESTIMONIALS.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="testimonial-card h-full"
            >
              <Card className="h-full bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 group relative overflow-hidden">
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/0 to-blue-600/0 group-hover:from-accent-primary/10 group-hover:to-blue-600/10 transition-all duration-500" />
                
                <CardContent className="p-8 relative z-10">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  
                  <Quote className="w-8 h-8 text-white/20 mb-4 group-hover:text-accent-primary/50 transition-colors" />
                  
                  <p className="text-gray-400 mb-6 line-clamp-4 leading-relaxed group-hover:text-gray-300 transition-colors">
                    &quot;{testimonial.content}&quot;
                  </p>
                  
                  <div className="flex items-center space-x-4 pt-4 border-t border-white/10">
                    <div className="w-12 h-12 relative rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-accent-primary transition-all">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm group-hover:text-accent-primary transition-colors">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-500 text-xs group-hover:text-gray-400">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}