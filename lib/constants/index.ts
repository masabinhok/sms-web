/**
 * Constants Index
 * 
 * Central export point for all constants
 * Maintains backward compatibility with existing SCHOOL_CONFIG
 */

export * from './school-info';
export * from './navigation';
export * from './programs';
export * from './features';
export * from './testimonials';
export * from './media';

// Import individual constants
import { SCHOOL_INFO } from './school-info';
import { SIMPLE_NAVIGATION } from './navigation';
import { PROGRAMS } from './programs';
import { HIGHLIGHTS } from './features';
import { TESTIMONIALS } from './testimonials';
import { GALLERY_IMAGE_URLS } from './media';

/**
 * Legacy SCHOOL_CONFIG object for backward compatibility
 * @deprecated Use individual exports instead
 */
export const SCHOOL_CONFIG = {
  // Basic Information
  SCHOOL_NAME: SCHOOL_INFO.name,
  TAGLINE: SCHOOL_INFO.tagline,
  MOTTO: SCHOOL_INFO.motto,
  
  // Contact Information
  CONTACT: {
    ADDRESS: SCHOOL_INFO.address,
    CITY: SCHOOL_INFO.city,
    PHONE: SCHOOL_INFO.phone,
    EMAIL: SCHOOL_INFO.email,
    WEBSITE: SCHOOL_INFO.website
  },

  // Hero Section
  HERO: {
    TITLE: SCHOOL_INFO.heroTitle,
    SUBTITLE: SCHOOL_INFO.heroSubtitle,
    CTA_PRIMARY: SCHOOL_INFO.heroCTA,
    CTA_SECONDARY: "Admissions Open"
  },

  // About Section
  ABOUT: {
    TITLE: `About ${SCHOOL_INFO.name}`,
    DESCRIPTION: SCHOOL_INFO.description,
    MISSION: SCHOOL_INFO.mission,
    VISION: SCHOOL_INFO.vision
  },

  // Programs
  PROGRAMS: PROGRAMS.map((program: typeof PROGRAMS[number]) => ({
    id: program.id,
    title: program.title,
    description: program.description,
    icon: program.icon,
    grades: program.grades,
    features: program.features
  })),

  // Highlights/Features
  HIGHLIGHTS: HIGHLIGHTS.map((highlight: typeof HIGHLIGHTS[number]) => ({
    title: highlight.title,
    description: highlight.description,
    icon: highlight.icon
  })),

  // Testimonials
  TESTIMONIALS: TESTIMONIALS.map((testimonial: typeof TESTIMONIALS[number]) => ({
    id: testimonial.id,
    name: testimonial.name,
    role: testimonial.role,
    content: testimonial.content,
    image: testimonial.image
  })),

  // Gallery
  GALLERY_IMAGES: GALLERY_IMAGE_URLS,

  // Social Media
  SOCIAL: {
    FACEBOOK: SCHOOL_INFO.facebook,
    INSTAGRAM: SCHOOL_INFO.instagram,
    TWITTER: SCHOOL_INFO.twitter,
    YOUTUBE: SCHOOL_INFO.youtube
  },

  // Navigation Menu
  NAVIGATION: SIMPLE_NAVIGATION
};
