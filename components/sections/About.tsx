"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSchool } from '@/components/SchoolProvider'
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

export function About() {
  const { school } = useSchool();
  
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

  return (
    <section id="about" className="py-20 lg:py-28 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="bg-blue-100 text-blue-800 mb-4 px-4 py-2">
            <Star className="h-4 w-4 mr-2" />
            About {school?.name || 'Our School'}
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold heading-premium mb-6">
            About {school?.name || 'Our School'}
          </h2>
          <p className="text-xl text-premium max-w-3xl mx-auto leading-relaxed">
            Discover our journey of educational excellence and commitment to nurturing future leaders.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          
          {/* Left Column - Premium Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative">
              {/* Main Image */}
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl premium-card-glow">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-600">
                  <div className="absolute inset-0 bg-[url('/images/about-school.jpg')] bg-cover bg-center opacity-80" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 to-transparent" />
                
                {/* Overlay Content */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="glass-effect rounded-xl p-6">
                    <h3 className="text-white font-bold text-xl mb-2">Modern Learning Environment</h3>
                    <p className="text-blue-100 text-sm">Inspiring spaces designed for growth and discovery</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Stats Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-6 -right-6 glass-effect rounded-xl p-6 bg-white/90 border border-white/20 shadow-lg"
              >
                <div className="text-3xl font-bold text-blue-900">50+</div>
                <div className="text-sm text-gray-600">Years of Excellence</div>
              </motion.div>
              
              {/* Floating Achievement Badge */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 glass-effect rounded-full p-4 bg-yellow-500/90 shadow-lg"
              >
                <Award className="h-8 w-8 text-white" />
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Description */}
            <div className="space-y-6">
              <p className="text-lg text-premium leading-relaxed">
                {school?.description || 'We are committed to providing quality education that prepares students for a bright future.'}
              </p>
              
              <p className="text-lg text-premium leading-relaxed">
                Our commitment to excellence extends beyond academics to character building, 
                leadership development, and preparing students for a rapidly evolving world.
              </p>
            </div>

            {/* Achievements List */}
            <div className="space-y-3">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">Our Achievements</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{achievement}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
            >
              <Button 
                size="lg" 
                className="premium-button gradient-primary text-white font-semibold hover:shadow-lg group"
              >
                Learn More About Us
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="premium-card h-full group hover:shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-blue-100 rounded-full mr-4 group-hover:bg-blue-200 transition-colors">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                </div>
                <p className="text-premium leading-relaxed">
                  {school?.mission || 'To provide quality education that empowers students to reach their full potential.'}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="premium-card h-full group hover:shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-yellow-100 rounded-full mr-4 group-hover:bg-yellow-200 transition-colors">
                    <Eye className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                </div>
                <p className="text-premium leading-relaxed">
                  {school?.vision || 'To be a leading educational institution that shapes future leaders.'}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold heading-premium mb-4">Why Choose Us?</h3>
            <p className="text-xl text-premium max-w-2xl mx-auto">
              Discover what makes our educational approach unique and effective.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="premium-card text-center group hover:shadow-xl">
                    <CardContent className="p-6">
                      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                        <Icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                      <p className="text-premium text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="premium-card bg-gradient-to-r from-blue-900 to-blue-700 text-white">
            <CardContent className="p-12">
              <Heart className="h-12 w-12 text-yellow-400 mx-auto mb-6" />
              <h3 className="text-3xl font-bold mb-4">Ready to Join Our Community?</h3>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Experience the difference of quality education in a nurturing environment 
                that prepares students for success in life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="premium-button gradient-secondary text-blue-900 font-semibold hover:shadow-xl"
                >
                  Schedule a Visit
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="premium-button border-white text-white hover:bg-white hover:text-blue-900"
                >
                  Download Brochure
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}