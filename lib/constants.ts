// School Website Template Configuration
// Customize these values for any school

export const SCHOOL_CONFIG = {
  // Basic Information
  SCHOOL_NAME: "{{SCHOOL_NAME}}",
  TAGLINE: "{{TAGLINE}}",
  MOTTO: "Empowering Minds, Shaping Futures",
  
  // Contact Information
  CONTACT: {
    ADDRESS: "{{CONTACT_ADDRESS}}",
    CITY: "{{CITY}}",
    PHONE: "{{PHONE_NUMBER}}",
    EMAIL: "{{EMAIL_ADDRESS}}",
    WEBSITE: "{{WEBSITE_URL}}"
  },

  // Hero Section
  HERO: {
    TITLE: "Welcome to {{SCHOOL_NAME}}",
    SUBTITLE: "{{HERO_DESCRIPTION}}",
    CTA_PRIMARY: "Learn More",
    CTA_SECONDARY: "Admissions Open"
  },

  // About Section
  ABOUT: {
    TITLE: "Welcome to {{SCHOOL_NAME}}",
    DESCRIPTION: "{{ABOUT_TEXT}}",
    MISSION: "{{MISSION_STATEMENT}}",
    VISION: "{{VISION_STATEMENT}}"
  },

  // Programs
  PROGRAMS: [
    {
      id: 1,
      title: "Early Years (Nursery - Class 2)",
      description: "Building strong foundations through play-based learning and creativity.",
      icon: "Baby",
      grades: "Nursery - Grade 2",
      features: ["Play-based Learning", "Creative Arts", "Language Development"]
    },
    {
      id: 2,
      title: "Primary Level (Class 3 - 5)",
      description: "Developing core academic skills and critical thinking abilities.",
      icon: "BookOpen",
      grades: "Grade 3 - 5",
      features: ["Core Subjects", "STEAM Learning", "Character Building"]
    },
    {
      id: 3,
      title: "Secondary Level (Class 6 - 10)",
      description: "Comprehensive education preparing students for higher studies.",
      icon: "GraduationCap",
      grades: "Grade 6 - 10",
      features: ["Academic Excellence", "Skill Development", "Career Guidance"]
    },
    {
      id: 4,
      title: "Higher Secondary (+2)",
      description: "Specialized programs in Science, Management, and Humanities.",
      icon: "Trophy",
      grades: "Grade 11 - 12",
      features: ["Specialized Streams", "College Preparation", "Industry Connect"]
    }
  ],

  // Highlights/Features
  HIGHLIGHTS: [
    {
      title: "STEAM Learning",
      description: "Science, Technology, Engineering, Arts & Mathematics integrated curriculum",
      icon: "Microscope"
    },
    {
      title: "Smart Classrooms",
      description: "Modern technology-enabled learning environments",
      icon: "Monitor"
    },
    {
      title: "Qualified Teachers",
      description: "Experienced and dedicated faculty members",
      icon: "Users"
    },
    {
      title: "Sports & Arts",
      description: "Comprehensive co-curricular activities program",
      icon: "Palette"
    },
    {
      title: "Global Standards",
      description: "International curriculum and teaching methodologies",
      icon: "Globe"
    },
    {
      title: "Safe Environment",
      description: "Secure and nurturing campus for all students",
      icon: "Shield"
    }
  ],

  // Testimonials
  TESTIMONIALS: [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Parent of Grade 8 Student",
      content: "{{SCHOOL_NAME}} has provided my child with an exceptional education. The teachers are caring and the facilities are outstanding.",
      image: "/images/testimonial-1.jpg"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Alumni, Class of 2020",
      content: "The foundation I received at {{SCHOOL_NAME}} prepared me well for university and my career. Forever grateful!",
      image: "/images/testimonial-2.jpg"
    },
    {
      id: 3,
      name: "Dr. Priya Sharma",
      role: "Parent & Education Specialist",
      content: "As an educator myself, I'm impressed by the school's commitment to holistic development and academic excellence.",
      image: "/images/testimonial-3.jpg"
    }
  ],

  // Gallery
  GALLERY_IMAGES: [
    "/images/gallery-1.jpg",
    "/images/gallery-2.jpg",
    "/images/gallery-3.jpg",
    "/images/gallery-4.jpg",
    "/images/gallery-5.jpg",
    "/images/gallery-6.jpg"
  ],

  // Social Media
  SOCIAL: {
    FACEBOOK: "{{FACEBOOK_URL}}",
    INSTAGRAM: "{{INSTAGRAM_URL}}",
    TWITTER: "{{TWITTER_URL}}",
    YOUTUBE: "{{YOUTUBE_URL}}"
  },

  // Navigation Menu
  NAVIGATION: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Academics", href: "/academics" },
    { label: "Admissions", href: "/admissions" },
    { label: "Gallery", href: "/gallery" },
    { label: "News", href: "/news" },
    { label: "Contact", href: "/contact" }
  ]
};

// Current year for footer
export const CURRENT_YEAR = new Date().getFullYear();