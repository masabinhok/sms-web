"use client"

import React, { useState, useRef, useLayoutEffect } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronLeft, ChevronRight, X, Image as ImageIcon, ZoomIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SCHOOL_CONFIG } from '@/lib/constants'

gsap.registerPlugin(ScrollTrigger)

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

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

      // Grid Animation
      const cards = gsap.utils.toArray('.gallery-card')
      gsap.from(cards, {
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 75%",
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out"
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Modal Animation
  useLayoutEffect(() => {
    if (selectedImage !== null && modalRef.current) {
      gsap.fromTo(modalRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
      )
    }
  }, [selectedImage])

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % SCHOOL_CONFIG.GALLERY_IMAGES.length)
    }
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + SCHOOL_CONFIG.GALLERY_IMAGES.length) % SCHOOL_CONFIG.GALLERY_IMAGES.length)
    }
  }

  return (
    <section ref={containerRef} className="py-24 lg:py-32 bg-premium relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-20">
          <Badge variant="outline" className="mb-6 px-4 py-2 border-accent-primary/30 text-accent-primary bg-accent-primary/10 backdrop-blur-sm">
            <ImageIcon className="h-4 w-4 mr-2" />
            Photo Gallery
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight">
            Campus Life <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-blue-400">Gallery</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Take a glimpse into our vibrant campus life and modern facilities that create an inspiring learning environment.
          </p>
        </div>

        {/* Gallery Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SCHOOL_CONFIG.GALLERY_IMAGES.map((image, index) => (
            <div
              key={index}
              className="gallery-card group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-white/5 border border-white/10 shadow-2xl"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              
              {/* Zoom icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-accent-primary hover:border-accent-primary transition-colors duration-300">
                  <ZoomIn className="w-6 h-6" />
                </div>
              </div>
              
              {/* Image number badge */}
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md border border-white/10 text-white px-3 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-y-2 group-hover:translate-y-0">
                {index + 1} / {SCHOOL_CONFIG.GALLERY_IMAGES.length}
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedImage !== null && (
          <div 
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div 
              ref={modalRef}
              className="relative max-w-6xl w-full h-[60vh] md:h-[80vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-12 right-0 text-white/70 hover:text-white hover:bg-white/10 transition-colors rounded-full z-50"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-6 h-6" />
              </Button>
              
              <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black/50">
                <Image
                  src={SCHOOL_CONFIG.GALLERY_IMAGES[selectedImage]}
                  alt={`Gallery image ${selectedImage + 1}`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 md:left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/10 bg-black/50 backdrop-blur-sm rounded-full p-2 transition-all border border-white/10 z-50"
                onClick={prevImage}
              >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 md:right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/10 bg-black/50 backdrop-blur-sm rounded-full p-2 transition-all border border-white/10 z-50"
                onClick={nextImage}
              >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
              </Button>
              
              {/* Image counter */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-full text-sm font-medium">
                {selectedImage + 1} / {SCHOOL_CONFIG.GALLERY_IMAGES.length}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-20">
          <Button 
            size="lg" 
            className="bg-accent-primary hover:bg-accent-primary/90 text-white font-medium px-8 py-6 text-lg shadow-lg shadow-accent-primary/20 hover:shadow-accent-primary/40 transition-all duration-300 rounded-full"
          >
            View Full Gallery
          </Button>
        </div>
      </div>
    </section>
  )
}