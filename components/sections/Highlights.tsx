"use client"

import React, { useEffect, useRef } from 'react'
import { Microscope, Monitor, Users, Palette, Globe, Shield, Trophy } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SCHOOL_CONFIG } from '@/lib/constants'
import gsap from 'gsap'
import { revealOnScroll, staggerList } from '@/lib/gsap'

const iconMap = {
  Microscope,
  Monitor,
  Users,
  Palette,
  Globe,
  Shield
}

export function Highlights() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      revealOnScroll('.highlights-header', { y: 30 });
      staggerList('.highlight-card', { 
        y: 30, 
        scrollTrigger: {
          trigger: '.highlights-grid',
          start: 'top 80%'
        }
      });
      
      gsap.from('.stat-item', {
        scale: 0.5,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.stats-container',
          start: 'top 85%'
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 bg-bg-premium relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="highlights-header text-center mb-20 opacity-0">
          <Badge className="bg-accent-primary/10 text-accent-primary mb-6 px-4 py-2 border-accent-primary/20">
            <Trophy className="h-4 w-4 mr-2" />
            Our Strengths
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-fg-premium mb-6 tracking-tight">
            Why Choose {SCHOOL_CONFIG.SCHOOL_NAME}?
          </h2>
          <p className="text-xl text-fg-premium-muted max-w-3xl mx-auto leading-relaxed font-light">
            Discover what makes our school exceptional and why families trust us with their children&apos;s education.
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="highlights-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SCHOOL_CONFIG.HIGHLIGHTS.map((highlight, index) => {
            const IconComponent = iconMap[highlight.icon as keyof typeof iconMap]
            
            return (
              <div
                key={index}
                className="highlight-card opacity-0"
              >
                <Card className="h-full bg-bg-premium-secondary border-white/5 hover:border-accent-primary/30 transition-all duration-500 group relative overflow-hidden">
                  {/* Animated gradient background on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/0 to-purple-600/0 group-hover:from-accent-primary/5 group-hover:to-purple-600/5 transition-all duration-500" />
                  
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-primary via-purple-500 to-accent-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  
                  <CardContent className="p-8 text-center relative z-10">
                    <div 
                      className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-accent-primary/20 group-hover:bg-accent-primary/10"
                    >
                      <IconComponent className="w-10 h-10 text-fg-premium-muted group-hover:text-accent-primary transition-colors duration-500" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-fg-premium mb-4 group-hover:text-accent-primary transition-colors duration-300">
                      {highlight.title}
                    </h3>
                    
                    <p className="text-fg-premium-muted leading-relaxed group-hover:text-fg-premium/80 transition-colors duration-300 text-sm">
                      {highlight.description}
                    </p>
                    
                    {/* Decorative element */}
                    <div className="mt-6 flex justify-center">
                      <div className="w-12 h-1 bg-gradient-to-r from-accent-primary to-purple-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>

        {/* Stats Section */}
        <div className="stats-container mt-20">
          <Card className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] text-white shadow-2xl border-white/5 overflow-hidden relative">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/10 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full translate-y-32 -translate-x-32 blur-3xl" />
            
            <CardContent className="p-12 lg:p-16 relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
                {[
                  { value: '25+', label: 'Years of Excellence' },
                  { value: '1000+', label: 'Happy Students' },
                  { value: '50+', label: 'Expert Teachers' },
                  { value: '95%', label: 'Success Rate' }
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="stat-item group"
                  >
                    <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-accent-primary to-purple-400 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">
                      {stat.value}
                    </div>
                    <div className="text-fg-premium-muted font-medium group-hover:text-white transition-colors">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}