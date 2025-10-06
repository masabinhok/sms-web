"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { SCHOOL_CONFIG } from '@/lib/constants'

export function About() {
  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/about-school.jpg"
                alt="About our school"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {SCHOOL_CONFIG.ABOUT.TITLE}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                {SCHOOL_CONFIG.ABOUT.DESCRIPTION}
              </p>
            </div>

            {/* Mission & Vision */}
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-600">
                <h3 className="text-xl font-semibold text-blue-900 mb-2">Our Mission</h3>
                <p className="text-gray-600">
                  {SCHOOL_CONFIG.ABOUT.MISSION}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
                <h3 className="text-xl font-semibold text-blue-900 mb-2">Our Vision</h3>
                <p className="text-gray-600">
                  {SCHOOL_CONFIG.ABOUT.VISION}
                </p>
              </div>
            </div>

            <Button asChild className="bg-blue-900 hover:bg-blue-800">
              <Link href="/about">Read More</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}