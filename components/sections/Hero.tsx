"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Play, Award, Users, BookOpen, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { SCHOOL_CONFIG } from '@/lib/constants'

export function Hero() {
  const heroStats = [
    { icon: Users, label: "Students", value: "1,500+" },
    { icon: BookOpen, label: "Programs", value: "25+" },
    { icon: Award, label: "Awards", value: "50+" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 lg:pt-20">
      {/* Premium Background with Parallax Effect */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800" />
        <div className="absolute inset-0 bg-[url('/images/hero.jpg')] bg-cover bg-center bg-no-repeat opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-transparent to-blue-900/20" />
        
        {/* Animated Particles - Using fixed positions to avoid hydration mismatch */}
        <div className="absolute inset-0">
          {[
            { left: '10%', top: '20%', duration: 4, delay: 0 },
            { left: '25%', top: '60%', duration: 5, delay: 0.5 },
            { left: '40%', top: '30%', duration: 3.5, delay: 1 },
            { left: '55%', top: '70%', duration: 4.5, delay: 0.3 },
            { left: '70%', top: '15%', duration: 3.8, delay: 0.8 },
            { left: '85%', top: '50%', duration: 4.2, delay: 0.2 },
            { left: '15%', top: '80%', duration: 3.6, delay: 1.2 },
            { left: '30%', top: '45%', duration: 4.8, delay: 0.6 },
            { left: '60%', top: '25%', duration: 3.3, delay: 1.5 },
            { left: '80%', top: '75%', duration: 4.4, delay: 0.4 },
            { left: '20%', top: '10%', duration: 3.7, delay: 1.8 },
            { left: '50%', top: '55%', duration: 4.1, delay: 0.9 },
            { left: '75%', top: '40%', duration: 3.9, delay: 0.7 },
            { left: '35%', top: '85%', duration: 4.6, delay: 1.1 },
            { left: '65%', top: '20%', duration: 3.4, delay: 1.4 },
            { left: '90%', top: '65%', duration: 4.3, delay: 0.1 },
            { left: '5%', top: '35%', duration: 3.2, delay: 1.6 },
            { left: '45%', top: '90%', duration: 4.7, delay: 0.5 },
            { left: '95%', top: '30%', duration: 3.1, delay: 1.3 },
            { left: '12%', top: '50%', duration: 4.9, delay: 1.7 }
          ].map((particle, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: particle.left,
                top: particle.top,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-left"
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <Badge className="bg-yellow-500/20 text-yellow-100 border-yellow-400/30 px-4 py-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 mr-2" />
                Excellence in Education Since 1970
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              <span className="block">{SCHOOL_CONFIG.HERO.TITLE}</span>
              <span className="block text-gradient-secondary text-4xl md:text-5xl lg:text-6xl mt-2">
                {SCHOOL_CONFIG.TAGLINE}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed max-w-2xl"
            >
              {SCHOOL_CONFIG.HERO.SUBTITLE}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-6 mb-12"
            >
              <Button 
                size="lg" 
                className="premium-button gradient-secondary text-blue-900 font-bold px-8 py-4 text-lg hover:shadow-2xl hover:shadow-yellow-500/25 transform hover:scale-105 transition-all duration-300"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                {SCHOOL_CONFIG.HERO.CTA_PRIMARY}
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="premium-button border-2 border-white text-white hover:bg-white  font-semibold px-8 py-4 text-lg glass-effect"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Watch Virtual Tour
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl bg-white">
                  <DialogHeader>
                    <DialogTitle>Virtual Tour</DialogTitle>
                  </DialogHeader>
                  <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                    <p className="text-white">Virtual Tour Video Placeholder</p>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="grid grid-cols-3 gap-6"
            >
              {heroStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    className="glass-effect rounded-lg p-4 text-center group hover:bg-white/10 transition-all duration-300"
                  >
                    <Icon className="h-8 w-8 text-yellow-400 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-blue-200">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Right Column - Visual Elements */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative hidden lg:block"
          >
            {/* Floating Cards */}
            <div className="relative">
              {/* Main Image Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="glass-effect rounded-2xl p-6 bg-white/10"
              >
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-800 to-blue-600 rounded-xl mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/images/about-school.jpg')] bg-cover bg-center opacity-60" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-semibold text-lg">Modern Campus</h3>
                    <p className="text-blue-100 text-sm">State-of-the-art facilities</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Achievement Cards */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -top-8 -left-8 glass-effect rounded-xl p-4 bg-emerald-500/20 border border-emerald-400/30"
              >
                <Award className="h-6 w-6 text-emerald-400 mb-2" />
                <div className="text-white font-semibold text-sm">Excellence Award</div>
                <div className="text-emerald-200 text-xs">Best School 2024</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                className="absolute -bottom-4 -right-4 glass-effect rounded-xl p-4 bg-purple-500/20 border border-purple-400/30"
              >
                <Users className="h-6 w-6 text-purple-400 mb-2" />
                <div className="text-white font-semibold text-sm">Happy Students</div>
                <div className="text-purple-200 text-xs">98% Satisfaction</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/80 cursor-pointer"
          >
            <div className="text-sm mb-2">Scroll to explore</div>
            <ChevronDown className="w-6 h-6 mx-auto" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}