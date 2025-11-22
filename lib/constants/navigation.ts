/**
 * Navigation Menu Configuration
 * 
 * This file contains the navigation menu structure for the website
 * Organized by sections with icons, descriptions, and nested items
 */

import {
  Building,
  BookOpen,
  Award,
  GraduationCap,
  MessageSquare,
  Star,
  Trophy,
  Palette,
  Globe,
  Users,
  Calendar,
  Phone,
  MapPin,
  Mail,
} from 'lucide-react';

export const NAVIGATION_MENU = [
  {
    title: "About",
    href: "/about",
    icon: Building,
    description: "Discover our heritage and mission",
    items: [
      { 
        title: "Our Story", 
        href: "/about#story", 
        description: "Founded with a vision for excellence",
        icon: BookOpen 
      },
      { 
        title: "Mission & Vision", 
        href: "/about#mission", 
        description: "Our guiding principles and goals",
        icon: Star 
      },
      { 
        title: "Leadership Team", 
        href: "/about#team", 
        description: "Meet our dedicated educators",
        icon: Users 
      },
      { 
        title: "Awards & Recognition", 
        href: "/about#awards", 
        description: "Celebrating our achievements",
        icon: Trophy 
      },
    ],
  },
  {
    title: "Academics",
    href: "/academics",
    icon: BookOpen,
    description: "Excellence in education",
    items: [
      { 
        title: "Curriculum", 
        href: "/academics#curriculum", 
        description: "Comprehensive academic framework",
        icon: BookOpen 
      },
      { 
        title: "Programs", 
        href: "/academics#programs", 
        description: "Early Years to Higher Secondary",
        icon: GraduationCap 
      },
      { 
        title: "Facilities", 
        href: "/academics#facilities", 
        description: "Modern learning environments",
        icon: Building 
      },
      { 
        title: "Digital Learning", 
        href: "/academics#technology", 
        description: "Technology-enhanced education",
        icon: Globe 
      },
    ],
  },
  {
    title: "Student Life",
    href: "#student-life",
    icon: Award,
    description: "Beyond the classroom",
    items: [
      { 
        title: "Sports & Athletics", 
        href: "#sports", 
        description: "Physical excellence and teamwork",
        icon: Trophy 
      },
      { 
        title: "Arts & Culture", 
        href: "#arts", 
        description: "Creative expression and talent",
        icon: Palette 
      },
      { 
        title: "Clubs & Societies", 
        href: "#clubs", 
        description: "Student organizations and interests",
        icon: Users 
      },
      { 
        title: "Events & Activities", 
        href: "#events", 
        description: "Celebrations and competitions",
        icon: Calendar 
      },
    ],
  },
  {
    title: "Admissions",
    href: "/admissions",
    icon: GraduationCap,
    description: "Join our community",
    items: [
      { 
        title: "Application Process", 
        href: "/admissions#application", 
        description: "Step-by-step admission guide",
        icon: BookOpen 
      },
      { 
        title: "Requirements", 
        href: "/admissions#requirements", 
        description: "Eligibility and documentation",
        icon: Star 
      },
      { 
        title: "Fee Structure", 
        href: "/admissions#fees", 
        description: "Transparent pricing information",
        icon: Building 
      },
      { 
        title: "Scholarships", 
        href: "/admissions#scholarships", 
        description: "Financial assistance programs",
        icon: Award 
      },
    ],
  },
  {
    title: "Contact",
    href: "/contact",
    icon: MessageSquare,
    description: "Get in touch with us",
    items: [
      { 
        title: "Contact Information", 
        href: "/contact#contact-info", 
        description: "Phone, email, and address details",
        icon: Phone 
      },
      { 
        title: "Visit Campus", 
        href: "/contact#visit", 
        description: "Schedule a campus tour",
        icon: MapPin 
      },
      { 
        title: "Send Message", 
        href: "/contact#message", 
        description: "Contact form and inquiries",
        icon: Mail 
      },
      { 
        title: "Directions", 
        href: "/contact#directions", 
        description: "Location and travel information",
        icon: Globe 
      },
    ],
  },
] as const;

// Simple navigation links for footer and other areas
export const SIMPLE_NAVIGATION = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Academics", href: "/academics" },
  { label: "Admissions", href: "/admissions" },
  { label: "Gallery", href: "/gallery" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" }
] as const;
