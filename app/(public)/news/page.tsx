"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Newspaper, Calendar, ArrowRight, Award, Users, BookOpen } from 'lucide-react'
import Link from 'next/link'

export default function NewsPage() {
  const news = [
    {
      title: "Annual Sports Day 2024 - A Grand Success",
      category: "Events",
      date: "November 15, 2024",
      excerpt: "Our annual sports day showcased incredible talent and sportsmanship from all grade levels.",
      icon: Award
    },
    {
      title: "New STEM Lab Inaugurated",
      category: "Facilities",
      date: "November 10, 2024",
      excerpt: "State-of-the-art STEM laboratory opens, providing students with hands-on learning opportunities.",
      icon: BookOpen
    },
    {
      title: "Students Win National Science Competition",
      category: "Achievement",
      date: "November 5, 2024",
      excerpt: "Our science team brought home first place in the prestigious national science olympiad.",
      icon: Award
    },
    {
      title: "Parent-Teacher Conference Scheduled",
      category: "Announcement",
      date: "October 30, 2024",
      excerpt: "Join us for meaningful discussions about your child's academic progress and development.",
      icon: Users
    },
    {
      title: "Cultural Festival 2024 Highlights",
      category: "Events",
      date: "October 25, 2024",
      excerpt: "Students celebrated diversity through music, dance, and art at our annual cultural festival.",
      icon: Users
    },
    {
      title: "Admission Open for Academic Year 2025",
      category: "Announcement",
      date: "October 20, 2024",
      excerpt: "Applications now being accepted for the upcoming academic year. Limited seats available.",
      icon: BookOpen
    }
  ]

  return (
    <div className="min-h-screen bg-bg-premium">
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Badge variant="outline" className="mb-6 border-orange-400/30 text-orange-400">
            <Newspaper className="h-4 w-4 mr-2" />
            News & Updates
          </Badge>
          <h1 className="text-5xl lg:text-6xl font-bold text-fg-premium mb-6">
            Latest <span className="text-accent-primary">News</span>
          </h1>
          <p className="text-xl text-fg-premium-muted max-w-3xl">
            Stay updated with the latest happenings, achievements, and announcements from our school community.
          </p>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, index) => {
              const Icon = item.icon
              return (
                <Card key={index} className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="border-accent-primary/30 text-accent-primary text-xs">
                        {item.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-fg-premium-muted">
                        <Calendar className="h-3 w-3" />
                        {item.date}
                      </div>
                    </div>
                    <CardTitle className="text-fg-premium group-hover:text-white transition-colors">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-fg-premium-muted mb-4">{item.excerpt}</p>
                    <Button variant="link" className="text-accent-primary hover:text-accent-primary/80 p-0">
                      Read More <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" className="border-white/10 bg-white/5 text-fg-premium hover:bg-white/10">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Template Note */}
      <div className="bg-yellow-500/10 border-t border-yellow-500/20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-yellow-200">
            📝 Note: This is a template. Connect to a CMS or database to manage real news articles, announcements, and updates dynamically.
          </p>
        </div>
      </div>
    </div>
  )
}
