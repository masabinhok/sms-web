"use client"

import React, { useEffect, useRef } from 'react'
import { ChevronDown, Play, Award, Users, BookOpen, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useSchool } from '@/components/SchoolProvider'
import gsap from 'gsap'
import { animateIn, staggerList } from '@/lib/gsap'

export function Hero() {
  const { school } = useSchool();
  const heroRef = useRef<HTMLElement>(null);
  
  const heroStats = [
    { icon: Users, label: "Students", value: "1,500+" },
    { icon: BookOpen, label: "Programs", value: "25+" },
    { icon: Award, label: "Awards", value: "50+" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background parallax
      gsap.to('.hero-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      // Content animations
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      
      tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.6 })
        .from('.hero-title span', { y: 50, opacity: 0, stagger: 0.1, duration: 0.8 }, '-=0.4')
        .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.6 }, '-=0.6')
        .from('.hero-cta', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
        .from('.hero-stat', { y: 20, opacity: 0, stagger: 0.1, duration: 0.6 }, '-=0.4')
        .from('.hero-visual', { x: 50, opacity: 0, duration: 1 }, '-=1');

      // Floating elements
      gsap.to('.float-card-1', { y: -15, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.float-card-2', { y: 15, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 0.5 });
      gsap.to('.float-card-3', { y: -10, duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 lg:pt-20 bg-bg-premium">
      {/* Premium Background with Parallax Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="hero-bg absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E1E24] to-[#0F172A] scale-110" />
        <div className="absolute inset-0 bg-[url('/images/hero.jpg')] bg-cover bg-center bg-no-repeat opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-premium via-transparent to-bg-premium/50" />
        
        {/* Animated Particles */}
        <div className="absolute inset-0 opacity-30">
            {/* Particles can be implemented with CSS or Canvas for better performance, keeping simple divs for now */}
             {[...Array(20)].map((_, i) => (
                <div 
                    key={i}
                    className="absolute w-1 h-1 bg-accent-primary rounded-full animate-pulse"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        opacity: Math.random() * 0.5 + 0.2
                    }}
                />
             ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh] py-20">
          
          {/* Left Column - Content */}
          <div className="text-left">
            {/* Premium Badge */}
            <div className="hero-badge mb-8 inline-block">
              <Badge className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 px-4 py-1.5 text-sm font-medium backdrop-blur-sm rounded-full">
                <Sparkles className="h-3.5 w-3.5 mr-2" />
                Excellence in Education Since 1970
              </Badge>
            </div>

            {/* Main Heading */}
            <h1 className="hero-title text-5xl md:text-6xl lg:text-7xl font-bold text-fg-premium mb-6 leading-[1.1] tracking-tight">
              <span className="block">{school?.heroTitle || 'Welcome to Our School'}</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-purple-400 mt-2 pb-2">
                {school?.tagline || ''}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle text-xl md:text-2xl text-fg-premium-muted mb-10 leading-relaxed max-w-2xl font-light">
              {school?.heroSubtitle || 'Nurturing excellence in education'}
            </p>

            {/* CTA Buttons */}
            <div className="hero-cta flex flex-col sm:flex-row gap-5 mb-16">
              <Button 
                size="lg" 
                className="bg-accent-primary hover:bg-accent-primary/90 text-white font-semibold px-8 py-6 text-lg shadow-[0_0_20px_rgba(94,106,210,0.3)] hover:shadow-[0_0_30px_rgba(94,106,210,0.5)] transition-all duration-300 rounded-xl"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                {school?.heroCTA || 'Learn More'}
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white/10 bg-white/5 text-fg-premium hover:bg-white/10 hover:text-white font-semibold px-8 py-6 text-lg backdrop-blur-md transition-all duration-300 rounded-xl"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Watch Virtual Tour
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl bg-bg-premium border-white/10 p-0 overflow-hidden rounded-2xl">
                  <DialogHeader className="sr-only">
                    <DialogTitle>Virtual Tour</DialogTitle>
                  </DialogHeader>
                  <div className="aspect-video bg-black flex items-center justify-center">
                    <p className="text-fg-premium-muted">Virtual Tour Video Placeholder</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 border-t border-white/5 pt-8">
              {heroStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="hero-stat group cursor-default"
                  >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-white/5 group-hover:bg-accent-primary/20 transition-colors duration-300">
                            <Icon className="h-5 w-5 text-accent-primary" />
                        </div>
                        <div className="text-2xl font-bold text-fg-premium">{stat.value}</div>
                    </div>
                    <div className="text-sm text-fg-premium-muted pl-1">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Visual Elements */}
          <div className="hero-visual relative hidden lg:block h-full min-h-[600px]">
            {/* Floating Cards */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Main Image Card */}
              <div className="float-card-1 relative z-10 w-[80%] aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />
                  <img src="/images/about-school.jpg" alt="Campus" className="w-full h-full object-cover" />
                  <div className="absolute bottom-8 left-8 z-20">
                    <h3 className="text-white font-bold text-2xl mb-1">Modern Campus</h3>
                    <p className="text-white/70 text-sm">State-of-the-art facilities for holistic growth</p>
                  </div>
              </div>

              {/* Floating Achievement Cards */}
              <div className="float-card-2 absolute top-20 right-0 glass-panel p-5 rounded-xl z-20 max-w-[200px]">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <Award className="h-5 w-5 text-emerald-400" />
                    </div>
                    <span className="text-emerald-400 font-bold text-sm">#1 Ranked</span>
                </div>
                <div className="text-fg-premium font-medium text-sm">Excellence Award</div>
                <div className="text-fg-premium-muted text-xs mt-1">Best School 2024</div>
              </div>

              <div className="float-card-3 absolute bottom-32 -left-8 glass-panel p-5 rounded-xl z-20 max-w-[200px]">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Users className="h-5 w-5 text-purple-400" />
                    </div>
                    <span className="text-purple-400 font-bold text-sm">98%</span>
                </div>
                <div className="text-fg-premium font-medium text-sm">Happy Students</div>
                <div className="text-fg-premium-muted text-xs mt-1">Based on 2024 survey</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center opacity-50 hover:opacity-100 transition-opacity duration-300">
          <div className="animate-bounce cursor-pointer">
            <ChevronDown className="w-6 h-6 text-fg-premium" />
          </div>
        </div>
      </div>
    </section>
  )
}