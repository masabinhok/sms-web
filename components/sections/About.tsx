"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSchool } from '@/components/SchoolProvider'
import { ScheduleVisitDialog, BrochureDialog } from '@/components/VisitBrochureDialogs'
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  BookOpen, 
  Award, 
  Globe,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react'
import gsap from 'gsap'
import { revealOnScroll, staggerList } from '@/lib/gsap'
import { ABOUT_IMAGE, PATTERN_IMAGE } from '@/lib/constants/media'

export function About() {
  const { school } = useSchool();
  const sectionRef = useRef<HTMLElement>(null);
  const [visitDialogOpen, setVisitDialogOpen] = useState(false);
  const [brochureDialogOpen, setBrochureDialogOpen] = useState(false);
  
  const features = [
    {
      icon: Users,
      title: "Expert Faculty",
      description: "Dedicated teachers with years of experience"
    },
    {
      icon: BookOpen,
      title: "Modern Curriculum",
      description: "Updated syllabus aligned with global standards"
    },
    {
      icon: Award,
      title: "Excellence Record",
      description: "Consistent outstanding academic results"
    },
    {
      icon: Globe,
      title: "Global Perspective",
      description: "International exposure and cultural diversity"
    }
  ];

  const achievements = [
    "50+ years of educational excellence",
    "98% student satisfaction rate",
    "Top 10 school in the region",
    "1500+ successful alumni",
    "25+ academic programs",
    "State-of-the-art facilities"
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      revealOnScroll('.about-header', { y: 30 });
      revealOnScroll('.about-visual', { x: -50 });
      revealOnScroll('.about-content', { x: 50 });
      
      staggerList('.achievement-item', { 
        scrollTrigger: {
          trigger: '.achievements-list',
          start: 'top 85%'
        }
      });

      revealOnScroll('.mission-card', { y: 30, delay: 0.1 });
      revealOnScroll('.vision-card', { y: 30, delay: 0.2 });
      
      staggerList('.feature-card', { 
        y: 30,
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top 85%'
        }
      });

      revealOnScroll('.about-cta', { y: 30 });

      // Floating animations
      gsap.to('.float-stat', { y: -10, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.float-badge', { y: 10, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-20 lg:py-28 bg-bg-premium-secondary relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="about-header text-center mb-16 opacity-0">
          <Badge className="bg-accent-primary/10 text-accent-primary mb-4 px-4 py-2 border-accent-primary/20">
            <Star className="h-4 w-4 mr-2" />
            About {school?.name || 'Our School'}
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-fg-premium mb-6 tracking-tight">
            About {school?.name || 'Our School'}
          </h2>
          <p className="text-xl text-fg-premium-muted max-w-3xl mx-auto leading-relaxed font-light">
            Discover our journey of educational excellence and commitment to nurturing future leaders.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          
          {/* Left Column - Premium Visual */}
          <div className="about-visual relative opacity-0">
            <div className="relative">
              {/* Main Image */}
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-purple-900/20 z-10" />
                <img src={ABOUT_IMAGE} alt="About School" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-premium via-transparent to-transparent z-20" />
                
                {/* Overlay Content */}
                <div className="absolute bottom-6 left-6 right-6 z-30">
                  <div className="glass-panel rounded-xl p-6">
                    <h3 className="text-white font-bold text-xl mb-2">Modern Learning Environment</h3>
                    <p className="text-fg-premium-muted text-sm">Inspiring spaces designed for growth and discovery</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Stats Card */}
              <div className="float-stat absolute -top-6 -right-6 glass-panel rounded-xl p-6 bg-bg-premium/90 border border-white/10 shadow-xl z-40">
                <div className="text-3xl font-bold text-accent-primary">50+</div>
                <div className="text-sm text-fg-premium-muted">Years of Excellence</div>
              </div>
              
              {/* Floating Achievement Badge */}
              <div className="float-badge absolute -bottom-4 -left-4 glass-panel rounded-full p-4 bg-yellow-500/20 border border-yellow-500/30 shadow-lg z-40">
                <Award className="h-8 w-8 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="about-content space-y-8 opacity-0">
            {/* Description */}
            <div className="space-y-6">
              <p className="text-lg text-fg-premium-muted leading-relaxed">
                {school?.description || 'We are committed to providing quality education that prepares students for a bright future.'}
              </p>
              
              <p className="text-lg text-fg-premium-muted leading-relaxed">
                Our commitment to excellence extends beyond academics to character building, 
                leadership development, and preparing students for a rapidly evolving world.
              </p>
            </div>

            {/* Achievements List */}
            <div className="achievements-list space-y-3">
              <h4 className="text-xl font-semibold text-fg-premium mb-4">Our Achievements</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="achievement-item flex items-center space-x-3 opacity-0"
                  >
                    <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-fg-premium-muted">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Button 
                size="lg" 
                className="bg-accent-primary hover:bg-accent-primary/90 text-white font-semibold shadow-lg shadow-accent-primary/20 group transition-all duration-300"
              >
                Learn More About Us
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Mission Card */}
          <div className="mission-card opacity-0 h-full">
            <Card className="h-full bg-bg-premium border-white/5 hover:border-accent-primary/30 transition-all duration-300 group hover:shadow-2xl hover:shadow-accent-primary/5">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-accent-primary/10 rounded-full mr-4 group-hover:bg-accent-primary/20 transition-colors">
                    <Target className="h-8 w-8 text-accent-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-fg-premium">Our Mission</h3>
                </div>
                <p className="text-fg-premium-muted leading-relaxed">
                  {school?.mission || 'To provide quality education that empowers students to reach their full potential.'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Vision Card */}
          <div className="vision-card opacity-0 h-full">
            <Card className="h-full bg-bg-premium border-white/5 hover:border-yellow-500/30 transition-all duration-300 group hover:shadow-2xl hover:shadow-yellow-500/5">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-yellow-500/10 rounded-full mr-4 group-hover:bg-yellow-500/20 transition-colors">
                    <Eye className="h-8 w-8 text-yellow-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-fg-premium">Our Vision</h3>
                </div>
                <p className="text-fg-premium-muted leading-relaxed">
                  {school?.vision || 'To be a leading educational institution that shapes future leaders.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-fg-premium mb-4">Why Choose Us?</h3>
            <p className="text-xl text-fg-premium-muted max-w-2xl mx-auto font-light">
              Discover what makes our educational approach unique and effective.
            </p>
          </div>
          
          <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="feature-card opacity-0"
                >
                  <Card className="bg-bg-premium border-white/5 text-center group hover:border-white/20 transition-all duration-300 h-full">
                    <CardContent className="p-6">
                      <div className="mx-auto w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent-primary/20 transition-colors">
                        <Icon className="h-8 w-8 text-fg-premium-muted group-hover:text-accent-primary transition-colors" />
                      </div>
                      <h4 className="text-lg font-semibold text-fg-premium mb-2">{feature.title}</h4>
                      <p className="text-fg-premium-muted text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="about-cta text-center opacity-0">
          <Card className="bg-gradient-to-r from-accent-primary to-indigo-900 text-white border-none overflow-hidden relative">
            <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: `url('${PATTERN_IMAGE}')` }} />
            <CardContent className="p-8 md:p-12 relative z-10">
              <Heart className="h-12 w-12 text-pink-400 mx-auto mb-6 animate-pulse" />
              <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Join Our Community?</h3>
              <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto font-light">
                Experience the difference of quality education in a nurturing environment 
                that prepares students for success in life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => setVisitDialogOpen(true)}
                  className="bg-white text-blue-900 hover:bg-gray-100 font-semibold shadow-xl transition-all duration-300"
                >
                  Schedule a Visit
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setBrochureDialogOpen(true)}
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  Download Brochure
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <ScheduleVisitDialog open={visitDialogOpen} onOpenChange={setVisitDialogOpen} />
      <BrochureDialog open={brochureDialogOpen} onOpenChange={setBrochureDialogOpen} />
    </section>
  )
}