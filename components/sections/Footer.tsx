'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import { SCHOOL_CONFIG, CURRENT_YEAR } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* School Info */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              {SCHOOL_CONFIG.SCHOOL_NAME}
            </h3>
            <p className="text-blue-200 mb-6 max-w-md leading-relaxed">
              {SCHOOL_CONFIG.MOTTO} - Committed to providing excellent education and nurturing young minds for a brighter future.
            </p>
            <div className="space-y-3 text-blue-200">
              {[
                { icon: MapPin, text: `${SCHOOL_CONFIG.CONTACT.ADDRESS}, ${SCHOOL_CONFIG.CONTACT.CITY}` },
                { icon: Phone, text: SCHOOL_CONFIG.CONTACT.PHONE },
                { icon: Mail, text: SCHOOL_CONFIG.CONTACT.EMAIL }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start group cursor-pointer hover:text-white transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <item.icon className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5 text-yellow-400" />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-bold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {SCHOOL_CONFIG.NAVIGATION.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className="text-blue-200 hover:text-white transition-all duration-300 flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                    <span className="group-hover:translate-x-1 transition-transform">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Programs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-bold mb-6 text-white">Programs</h4>
            <ul className="space-y-3 text-blue-200">
              {[
                { name: 'Early Years', href: '/programs/early-years' },
                { name: 'Primary Level', href: '/programs/primary' },
                { name: 'Secondary Level', href: '/programs/secondary' },
                { name: 'Higher Secondary', href: '/programs/higher-secondary' }
              ].map((program) => (
                <li key={program.href}>
                  <Link 
                    href={program.href} 
                    className="hover:text-white transition-all duration-300 flex items-center group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                    <span className="group-hover:translate-x-1 transition-transform">{program.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-blue-800/50 pt-10 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <motion.div 
              className="text-blue-200 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              © {CURRENT_YEAR} {SCHOOL_CONFIG.SCHOOL_NAME}. All rights reserved.
            </motion.div>
            
            <motion.div 
              className="flex space-x-5"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {[
                { icon: Facebook, href: SCHOOL_CONFIG.SOCIAL.FACEBOOK, label: 'Facebook', color: 'hover:bg-blue-600' },
                { icon: Instagram, href: SCHOOL_CONFIG.SOCIAL.INSTAGRAM, label: 'Instagram', color: 'hover:bg-pink-600' },
                { icon: Twitter, href: SCHOOL_CONFIG.SOCIAL.TWITTER, label: 'Twitter', color: 'hover:bg-sky-500' },
                { icon: Youtube, href: SCHOOL_CONFIG.SOCIAL.YOUTUBE, label: 'YouTube', color: 'hover:bg-red-600' }
              ].map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-blue-200 hover:text-white ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                  aria-label={social.label}
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}