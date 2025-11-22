/**
 * School Information - Client-Side Static Data
 * 
 * This file provides static school information for the landing page.
 * No API calls are made - all data is loaded from JSON at build time.
 */

import schoolData from '@/lib/data/school-data.json';

// Flatten the structure to match component expectations
export const SCHOOL_INFO = {
  // Basic Information
  name: schoolData.name,
  tagline: schoolData.tagline,
  motto: schoolData.motto,
  
  // Contact Information (flattened for direct access)
  address: schoolData.address,
  city: schoolData.city,
  state: schoolData.state,
  country: schoolData.country,
  zipCode: schoolData.zipCode,
  phone: schoolData.phone,
  alternatePhone: schoolData.alternatePhone,
  email: schoolData.email,
  admissionEmail: schoolData.admissionEmail,
  website: schoolData.website,

  // Social Media Links (flattened)
  facebook: schoolData.facebook,
  instagram: schoolData.instagram,
  twitter: schoolData.twitter,
  youtube: schoolData.youtube,
  linkedin: schoolData.linkedin,

  // Hero Section Content (flattened)
  heroTitle: schoolData.heroTitle,
  heroSubtitle: schoolData.heroSubtitle,
  heroDescription: schoolData.heroDescription,
  heroCTA: schoolData.heroCTA,
  heroVideoUrl: schoolData.heroVideoUrl,

  // About Section Content (flattened)
  description: schoolData.description,
  mission: schoolData.mission,
  vision: schoolData.vision,
  values: schoolData.values,
  foundingYear: schoolData.foundingYear,
  principalName: schoolData.principalName,
  principalMessage: schoolData.principalMessage,

  // Statistics
  stats: schoolData.stats,

  // Office Hours
  officeHours: schoolData.officeHours,

  // Accreditation & Affiliations (flattened)
  affiliatedTo: schoolData.affiliatedTo,
  recognizedBy: schoolData.recognizedBy,
  accreditedBy: schoolData.accreditedBy,
  schoolCode: schoolData.schoolCode,

  // Additional Information
  achievements: schoolData.achievements,
} as const;

// Current year for footer
export const CURRENT_YEAR = new Date().getFullYear();
