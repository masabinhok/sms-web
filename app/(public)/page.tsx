import React from 'react'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Programs } from '@/components/sections/Programs'
import { Highlights } from '@/components/sections/Highlights'
import { Gallery } from '@/components/sections/Gallery'
import { Testimonials } from '@/components/sections/Testimonials'
import { Contact } from '@/components/sections/Contact'
import { Footer } from '@/components/sections/Footer'

export default function Homepage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <Programs />
      <Highlights />
      <Gallery />
      <Testimonials />
      <Contact />
    </div>
  )
}