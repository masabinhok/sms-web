"use client"

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Baby, BookOpen, GraduationCap, Trophy, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SCHOOL_CONFIG } from '@/lib/constants'
import gsap from 'gsap'
import { revealOnScroll, staggerList } from '@/lib/gsap'

const iconMap = {
  Baby,
  BookOpen,
  GraduationCap,
  Trophy
}

export function Programs() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      revealOnScroll('.programs-header', { y: 30 });
      
      staggerList('.program-card', { 
        y: 30,
        scrollTrigger: {
          trigger: '.programs-grid',
          start: 'top 80%'
        }
      });

      revealOnScroll('.programs-cta', { y: 30, delay: 0.2 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="programs" ref={sectionRef} className="py-20 lg:py-32 bg-bg-premium relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="programs-header text-center mb-20 opacity-0">
          <Badge className="bg-accent-primary/10 text-accent-primary mb-6 px-4 py-2 border-accent-primary/20">
            <BookOpen className="h-4 w-4 mr-2" />
            Our Programs
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-fg-premium mb-6 tracking-tight">
            Academic Programs
          </h2>
          <p className="text-xl text-fg-premium-muted max-w-3xl mx-auto leading-relaxed font-light">
            Comprehensive education programs designed to nurture and develop students at every stage of their learning journey.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="programs-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SCHOOL_CONFIG.PROGRAMS.map((program, index) => {
            const IconComponent = iconMap[program.icon as keyof typeof iconMap]
            
            return (
              <div
                key={program.id}
                className="program-card opacity-0 flex"
              >
                <Card className="flex flex-col w-full bg-white/5 backdrop-blur-md border-white/10 hover:border-accent-primary/50 shadow-lg hover:shadow-2xl hover:shadow-accent-primary/20 transition-all duration-500 group relative overflow-hidden">
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-transparent to-purple-600/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  
                  <CardHeader className="text-center relative z-10 pb-4">
                    <div 
                      className="w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner border border-white/10 group-hover:border-accent-primary/30"
                    >
                      <IconComponent className="w-10 h-10 text-white/70 group-hover:text-accent-primary transition-colors duration-300" />
                    </div>
                    <CardTitle className="text-xl font-bold text-white mb-3 group-hover:text-accent-primary transition-colors">
                      {program.title}
                    </CardTitle>
                    <Badge variant="secondary" className="mx-auto bg-white/10 text-white/80 border-white/10 font-semibold px-3 py-1 group-hover:bg-accent-primary group-hover:text-white transition-all duration-300">
                      {program.grades}
                    </Badge>
                  </CardHeader>
                  
                  <CardContent className="text-center flex flex-col flex-1 relative z-10">
                    <CardDescription className="text-white/60 leading-relaxed mb-6 h-12 flex items-center justify-center">
                      {program.description}
                    </CardDescription>
                    
                    <div className="space-y-3 py-4 border-t border-white/5 flex-1">
                      {program.features.slice(0, 5).map((feature: string, idx: number) => (
                        <div 
                          key={idx} 
                          className="flex items-start text-sm text-white/70 group-hover:text-white transition-colors"
                        >
                          <div className="w-1.5 h-1.5 bg-accent-primary rounded-full mr-3 flex-shrink-0 mt-1.5 shadow-[0_0_8px_rgba(var(--accent-primary),0.8)]" />
                          <span className="text-left">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full border-white/10 text-white hover:bg-accent-primary hover:text-white hover:border-accent-primary transition-all duration-300 font-semibold group-hover:shadow-lg mt-6 bg-white/5 backdrop-blur-sm"
                      asChild
                    >
                      <Link href={`/academics/programs/${program.id}`} className="flex items-center justify-center">
                        Explore Program
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="programs-cta text-center mt-20 opacity-0">
          <Button 
            size="lg" 
            asChild 
            className="bg-accent-primary hover:bg-accent-primary/90 text-white font-bold px-8 py-6 text-lg shadow-xl shadow-accent-primary/20 hover:shadow-2xl hover:shadow-accent-primary/30 hover:scale-105 transition-all duration-300 rounded-xl"
          >
            <Link href="/academics" className="flex items-center">
              View All Programs
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}