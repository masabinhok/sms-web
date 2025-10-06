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
    ADDRESS: SCHOOL_INFO.contact.address,
    CITY: SCHOOL_INFO.contact.city,
    PHONE: SCHOOL_INFO.contact.phone,
    EMAIL: SCHOOL_INFO.contact.email,
    WEBSITE: SCHOOL_INFO.contact.website
  },

  // Hero Section
  HERO: {
    TITLE: SCHOOL_INFO.hero.title,
    SUBTITLE: SCHOOL_INFO.hero.subtitle,
    CTA_PRIMARY: SCHOOL_INFO.hero.ctaPrimary,
    CTA_SECONDARY: SCHOOL_INFO.hero.ctaSecondary
  },

  // About Section
  ABOUT: {
    TITLE: SCHOOL_INFO.about.title,
    DESCRIPTION: SCHOOL_INFO.about.description,
    MISSION: SCHOOL_INFO.about.mission,
    VISION: SCHOOL_INFO.about.vision
  },

  // Programs
  PROGRAMS: PROGRAMS.map((program: any) => ({
    id: program.id,
    title: program.title,
    description: program.description,
    icon: program.icon,
    grades: program.grades,
    features: program.features
  })),

  // Highlights/Features
  HIGHLIGHTS: HIGHLIGHTS.map((highlight: any) => ({
    title: highlight.title,
    description: highlight.description,
    icon: highlight.icon
  })),

  // Testimonials
  TESTIMONIALS: TESTIMONIALS.map((testimonial: any) => ({
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
    FACEBOOK: SCHOOL_INFO.social.facebook,
    INSTAGRAM: SCHOOL_INFO.social.instagram,
    TWITTER: SCHOOL_INFO.social.twitter,
    YOUTUBE: SCHOOL_INFO.social.youtube
  },

  // Navigation Menu
  NAVIGATION: SIMPLE_NAVIGATION
};
