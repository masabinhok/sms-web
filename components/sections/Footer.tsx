'use client'

import React, { useRef, useLayoutEffect } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import { useSchool } from '@/components/SchoolProvider'
import { SIMPLE_NAVIGATION } from '@/lib/constants/navigation'

gsap.registerPlugin(ScrollTrigger)

const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  const { school } = useSchool();
  const footerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered entry for columns
      gsap.from('.footer-col', {
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      })

      // Social icons animation
      gsap.from('.social-icon', {
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
        },
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.5,
        ease: "back.out(1.7)"
      })

    }, footerRef)

    return () => ctx.revert()
  }, [])
  
  return (
    <footer ref={footerRef} className="bg-black text-white relative overflow-hidden border-t border-white/10">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]" />
      </div>
      
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* School Info */}
          <div className="footer-col lg:col-span-2">
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              {school?.name || 'Our School'}
            </h3>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              {school?.motto || 'Excellence in Education'} - Committed to providing excellent education and nurturing young minds for a brighter future.
            </p>
            <div className="space-y-3 text-gray-400">
              {[
                { icon: MapPin, text: `${school?.address || ''}, ${school?.city || ''}` },
                { icon: Phone, text: school?.phone || '' },
                { icon: Mail, text: school?.email || '' }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="flex items-start group cursor-pointer hover:text-accent-primary transition-colors"
                >
                  <item.icon className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-accent-primary" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {SIMPLE_NAVIGATION.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className="text-gray-400 hover:text-accent-primary transition-all duration-300 flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-accent-primary" />
                    <span className="group-hover:translate-x-1 transition-transform">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div className="footer-col">
            <h4 className="text-lg font-bold mb-6 text-white">Programs</h4>
            <ul className="space-y-3 text-gray-400">
              {[
                { name: 'Early Years', href: '/programs/early-years' },
                { name: 'Primary Level', href: '/programs/primary' },
                { name: 'Secondary Level', href: '/programs/secondary' },
                { name: 'Higher Secondary', href: '/programs/higher-secondary' }
              ].map((program) => (
                <li key={program.href}>
                  <Link 
                    href={program.href} 
                    className="hover:text-accent-primary transition-all duration-300 flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-accent-primary" />
                    <span className="group-hover:translate-x-1 transition-transform">{program.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-white/10 pt-10 mt-12 footer-col">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-gray-500 text-sm">
              © {CURRENT_YEAR} {school?.name || 'Our School'}. All rights reserved.
            </div>
            
            <div className="flex space-x-5">
              {[
                { icon: Facebook, href: school?.facebook || '#', label: 'Facebook', color: 'hover:bg-blue-600' },
                { icon: Instagram, href: school?.instagram || '#', label: 'Instagram', color: 'hover:bg-pink-600' },
                { icon: Twitter, href: school?.twitter || '#', label: 'Twitter', color: 'hover:bg-sky-500' },
                { icon: Youtube, href: school?.youtube || '#', label: 'YouTube', color: 'hover:bg-red-600' }
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`social-icon w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg hover:border-transparent`}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}