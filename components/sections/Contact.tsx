"use client"

import React, { useState, useRef, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useSchool } from '@/components/SchoolProvider'

gsap.registerPlugin(ScrollTrigger)

export function Contact() {
  const { school } = useSchool();
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

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

      // Info Cards Animation
      const cards = gsap.utils.toArray('.contact-card')
      gsap.from(cards, {
        scrollTrigger: {
          trigger: infoRef.current,
          start: "top 75%",
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      })

      // Form Animation
      gsap.from(formRef.current, {
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 75%",
        },
        x: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      })

      // Map Animation
      gsap.from(mapRef.current, {
        scrollTrigger: {
          trigger: mapRef.current,
          start: "top 85%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section id="contact" ref={containerRef} className="py-24 lg:py-32 bg-premium relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-[600px] h-[600px] bg-accent-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-20 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-20">
          <Badge variant="outline" className="mb-6 px-4 py-2 border-accent-primary/30 text-accent-primary bg-accent-primary/10 backdrop-blur-sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Us
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-blue-400">Touch</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Have questions about admissions, programs, or campus life? We&apos;re here to help you learn more about {school?.name || 'our school'}.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div ref={infoRef} className="space-y-6">
            {[
              { icon: MapPin, title: 'Visit Us', content: `${school?.address || ''}\n${school?.city || ''}`, color: 'text-blue-400' },
              { icon: Phone, title: 'Call Us', content: school?.phone || '', color: 'text-green-400' },
              { icon: Mail, title: 'Email Us', content: school?.email || '', color: 'text-purple-400' },
              { icon: Clock, title: 'Office Hours', content: 'Monday - Friday: 8:00 AM - 5:00 PM\nSaturday: 9:00 AM - 2:00 PM\nSunday: Closed', color: 'text-orange-400' }
            ].map((item, index) => (
              <div
                key={index}
                className="contact-card"
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 group overflow-hidden relative">
                  {/* Gradient accent line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-${item.color.replace('text-', '')} to-transparent opacity-50`} />
                  
                  <CardHeader>
                    <CardTitle className="flex items-center text-white group-hover:text-accent-primary transition-colors">
                      <div className={`w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mr-3 border border-white/10 group-hover:border-accent-primary/50 transition-colors`}>
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                      </div>
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 leading-relaxed whitespace-pre-line group-hover:text-gray-300 transition-colors">
                      {item.content}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div ref={formRef} className="lg:col-span-2">
            <Card className="shadow-2xl border-white/10 bg-white/5 backdrop-blur-md">
              <CardHeader className="bg-white/5 border-b border-white/10">
                <CardTitle className="text-2xl text-white">Send us a Message</CardTitle>
                <p className="text-gray-400 mt-2">Fill out the form below and we&apos;ll get back to you as soon as possible.</p>
              </CardHeader>
              <CardContent className="pt-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-accent-primary focus:ring-accent-primary/20 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john.doe@example.com"
                        className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-accent-primary focus:ring-accent-primary/20 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-accent-primary focus:ring-accent-primary/20 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-gray-300 mb-2">
                        Subject *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Admission Inquiry"
                        className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-accent-primary focus:ring-accent-primary/20 transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-300 mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your inquiry..."
                      className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-accent-primary focus:ring-accent-primary/20 transition-all duration-300 resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-accent-primary hover:bg-accent-primary/90 text-white font-bold py-6 text-lg shadow-lg shadow-accent-primary/20 hover:shadow-accent-primary/40 transition-all duration-300"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div ref={mapRef} className="mt-20">
          <Card className="shadow-xl border-white/10 bg-white/5 overflow-hidden">
            <CardHeader className="bg-white/5 border-b border-white/10">
              <CardTitle className="text-2xl text-white flex items-center">
                <MapPin className="h-6 w-6 mr-3 text-accent-primary" />
                Find Us on the Map
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full h-96 bg-black/40 flex items-center justify-center relative group">
                <div className="text-center text-gray-500">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-accent-primary/50" />
                  <p className="font-semibold text-lg text-gray-400">Interactive Map Placeholder</p>
                  <p className="text-sm mt-2 text-gray-500">Replace with Google Maps embed or custom map</p>
                </div>
                {/* Overlay hint */}
                <div className="absolute inset-0 bg-accent-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}