/**
 * School Information Template
 * 
 * Replace all {{PLACEHOLDER}} values with your actual school information
 * This file contains all customizable school details used throughout the website
 */

export const SCHOOL_INFO = {
  // Basic Information
  name: "{{SCHOOL_NAME}}",
  tagline: "{{TAGLINE}}",
  motto: "Empowering Minds, Shaping Futures",
  
  // Contact Information
  contact: {
    address: "{{CONTACT_ADDRESS}}",
    city: "{{CITY}}",
    state: "{{STATE}}",
    country: "{{COUNTRY}}",
    zipCode: "{{ZIP_CODE}}",
    phone: "{{PHONE_NUMBER}}",
    alternatePhone: "{{ALTERNATE_PHONE}}",
    email: "{{EMAIL_ADDRESS}}",
    admissionEmail: "{{ADMISSION_EMAIL}}",
    website: "{{WEBSITE_URL}}"
  },

  // Social Media Links
  social: {
    facebook: "{{FACEBOOK_URL}}",
    instagram: "{{INSTAGRAM_URL}}",
    twitter: "{{TWITTER_URL}}",
    youtube: "{{YOUTUBE_URL}}",
    linkedin: "{{LINKEDIN_URL}}"
  },

  // Hero Section Content
  hero: {
    title: "Welcome to {{SCHOOL_NAME}}",
    subtitle: "{{HERO_DESCRIPTION}}",
    description: "Nurturing excellence in education since {{FOUNDING_YEAR}}. We provide world-class education in a caring environment.",
    ctaPrimary: "Learn More",
    ctaSecondary: "Admissions Open",
    videoUrl: "{{VIRTUAL_TOUR_VIDEO_URL}}"
  },

  // About Section Content
  about: {
    title: "About {{SCHOOL_NAME}}",
    description: "{{ABOUT_TEXT}}",
    mission: "{{MISSION_STATEMENT}}",
    vision: "{{VISION_STATEMENT}}",
    values: [
      "Excellence in Education",
      "Character Development",
      "Innovation and Creativity",
      "Community Service",
      "Global Perspective"
    ],
    foundingYear: "{{FOUNDING_YEAR}}",
    principalName: "{{PRINCIPAL_NAME}}",
    principalMessage: "{{PRINCIPAL_MESSAGE}}"
  },

  // Statistics
  stats: {
    yearsOfExperience: "25+",
    totalStudents: "1000+",
    qualifiedTeachers: "50+",
    successRate: "95%",
    campusArea: "{{CAMPUS_AREA}}",
    classrooms: "{{NUMBER_OF_CLASSROOMS}}",
    laboratories: "{{NUMBER_OF_LABS}}",
    libraries: "{{NUMBER_OF_LIBRARIES}}"
  },

  // Office Hours
  officeHours: {
    weekdays: "Monday - Friday: 8:00 AM - 5:00 PM",
    saturday: "Saturday: 9:00 AM - 2:00 PM",
    sunday: "Sunday: Closed",
    holidays: "Closed on public holidays"
  },

  // Accreditation & Affiliations
  accreditation: {
    affiliatedTo: "{{AFFILIATION_BOARD}}",
    recognizedBy: "{{RECOGNITION_AUTHORITY}}",
    accreditedBy: "{{ACCREDITATION_BODY}}",
    schoolCode: "{{SCHOOL_CODE}}"
  }
} as const;

// Current year for footer
export const CURRENT_YEAR = new Date().getFullYear();
