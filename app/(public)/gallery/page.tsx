"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Image as ImageIcon, Video, Award, Users, BookOpen, Trophy } from 'lucide-react'

export default function GalleryPage() {
  const categories = [
    { name: "Campus", icon: ImageIcon, count: 24 },
    { name: "Events", icon: Trophy, count: 36 },
    { name: "Sports", icon: Award, count: 18 },
    { name: "Academics", icon: BookOpen, count: 15 },
    { name: "Arts", icon: Users, count: 21 },
    { name: "Videos", icon: Video, count: 12 }
  ]

  return (
    <div className="min-h-screen bg-bg-premium">
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Badge variant="outline" className="mb-6 border-purple-400/30 text-purple-400">
            <ImageIcon className="h-4 w-4 mr-2" />
            Gallery
          </Badge>
          <h1 className="text-5xl lg:text-6xl font-bold text-fg-premium mb-6">
            Photo & Video <span className="text-accent-primary">Gallery</span>
          </h1>
          <p className="text-xl text-fg-premium-muted max-w-3xl">
            Explore moments that capture the vibrant life and spirit of our school community.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <Card key={index} className="border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
                  <CardContent className="pt-6 text-center">
                    <div className="p-3 bg-accent-primary/10 rounded-lg w-fit mx-auto mb-3 group-hover:bg-accent-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-accent-primary" />
                    </div>
                    <p className="font-semibold text-fg-premium mb-1">{category.name}</p>
                    <p className="text-xs text-fg-premium-muted">{category.count} items</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Placeholder Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
              <Card key={item} className="border-white/10 bg-white/5 overflow-hidden group cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-accent-primary/20 to-purple-500/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <ImageIcon className="h-16 w-16 text-white/30" />
                </div>
                <CardContent className="pt-4">
                  <p className="text-fg-premium font-medium mb-1">Photo Title {item}</p>
                  <p className="text-sm text-fg-premium-muted">Category • Date</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Template Note */}
      <div className="bg-yellow-500/10 border-t border-yellow-500/20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-yellow-200">
            📝 Note: This is a template. Add actual photos and videos of campus, events, and activities for production. Consider integrating with a media management system or CDN.
          </p>
        </div>
      </div>
    </div>
  )
}
