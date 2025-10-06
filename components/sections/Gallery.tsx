"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SCHOOL_CONFIG } from '@/lib/constants'

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % SCHOOL_CONFIG.GALLERY_IMAGES.length)
    }
  }

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + SCHOOL_CONFIG.GALLERY_IMAGES.length) % SCHOOL_CONFIG.GALLERY_IMAGES.length)
    }
  }

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <Badge className="bg-purple-100 text-purple-800 mb-6 px-4 py-2 border-purple-200">
            <ImageIcon className="h-4 w-4 mr-2" />
            Photo Gallery
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold heading-premium mb-6">
            Campus Life Gallery
          </h2>
          <p className="text-xl text-premium max-w-3xl mx-auto leading-relaxed">
            Take a glimpse into our vibrant campus life and modern facilities that create an inspiring learning environment.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SCHOOL_CONFIG.GALLERY_IMAGES.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-all duration-500"
              onClick={() => setSelectedImage(index)}
            >
              {/* Image */}
              <Image
                src={image}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              
              {/* Zoom icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <motion.div 
                  className="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center shadow-xl backdrop-blur-sm"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </motion.div>
              </div>
              
              {/* Image number badge */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500">
                {index + 1} / {SCHOOL_CONFIG.GALLERY_IMAGES.length}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        {selectedImage !== null && (
          <motion.div 
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative max-w-5xl w-full">
              <Button
                variant="ghost"
                size="sm"
                className="absolute -top-16 right-0 text-white hover:bg-white/10 hover:text-white transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-6 h-6" />
                <span className="ml-2">Close</span>
              </Button>
              
              <motion.div 
                className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image
                  src={SCHOOL_CONFIG.GALLERY_IMAGES[selectedImage]}
                  alt={`Gallery image ${selectedImage + 1}`}
                  fill
                  className="object-cover"
                />
              </motion.div>

              <Button
                variant="ghost"
                size="sm"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/10 bg-black/30 backdrop-blur-sm rounded-full p-3 transition-all"
                onClick={prevImage}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/10 bg-black/30 backdrop-blur-sm rounded-full p-3 transition-all"
                onClick={nextImage}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
              
              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
                {selectedImage + 1} / {SCHOOL_CONFIG.GALLERY_IMAGES.length}
              </div>
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <Button 
            size="lg" 
            asChild 
            className="premium-button gradient-primary text-white font-bold px-8 py-6 text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <a href="/gallery">View Full Gallery</a>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}