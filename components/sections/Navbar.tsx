"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import { SCHOOL_CONFIG } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Calendar,
  Sparkles,
  BookOpen,
  Award,
  Users,
  Building,
  MessageSquare,
  Star,
  Trophy,
  Palette,
  Globe,
} from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Premium dropdown menu configuration
  const menuItems = [
    {
      title: "About",
      href: "#about",
      icon: Building,
      description: "Discover our heritage and mission",
      items: [
        { 
          title: "Our Story", 
          href: "#story", 
          description: "Founded with a vision for excellence",
          icon: BookOpen 
        },
        { 
          title: "Mission & Vision", 
          href: "#mission", 
          description: "Our guiding principles and goals",
          icon: Star 
        },
        { 
          title: "Leadership Team", 
          href: "#team", 
          description: "Meet our dedicated educators",
          icon: Users 
        },
        { 
          title: "Awards & Recognition", 
          href: "#awards", 
          description: "Celebrating our achievements",
          icon: Trophy 
        },
      ],
    },
    {
      title: "Academics",
      href: "#academics",
      icon: BookOpen,
      description: "Excellence in education",
      items: [
        { 
          title: "Curriculum", 
          href: "#curriculum", 
          description: "Comprehensive academic framework",
          icon: BookOpen 
        },
        { 
          title: "Programs", 
          href: "#programs", 
          description: "Early Years to Higher Secondary",
          icon: GraduationCap 
        },
        { 
          title: "Facilities", 
          href: "#facilities", 
          description: "Modern learning environments",
          icon: Building 
        },
        { 
          title: "Digital Learning", 
          href: "#technology", 
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
      href: "#admissions",
      icon: GraduationCap,
      description: "Join our community",
      items: [
        { 
          title: "Application Process", 
          href: "#application", 
          description: "Step-by-step admission guide",
          icon: BookOpen 
        },
        { 
          title: "Requirements", 
          href: "#requirements", 
          description: "Eligibility and documentation",
          icon: Star 
        },
        { 
          title: "Fee Structure", 
          href: "#fees", 
          description: "Transparent pricing information",
          icon: Building 
        },
        { 
          title: "Scholarships", 
          href: "#scholarships", 
          description: "Financial assistance programs",
          icon: Award 
        },
      ],
    },
    {
      title: "Contact",
      href: "#contact",
      icon: MessageSquare,
      description: "Get in touch with us",
      items: [
        { 
          title: "Contact Information", 
          href: "#contact-info", 
          description: "Phone, email, and address details",
          icon: Phone 
        },
        { 
          title: "Visit Campus", 
          href: "#visit", 
          description: "Schedule a campus tour",
          icon: MapPin 
        },
        { 
          title: "Send Message", 
          href: "#message", 
          description: "Contact form and inquiries",
          icon: Mail 
        },
        { 
          title: "Directions", 
          href: "#directions", 
          description: "Location and travel information",
          icon: Globe 
        },
      ],
    },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50"
          : "bg-transparent"
      }`}
    >
      {/* Top Bar - Contact Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`hidden lg:block transition-all duration-300 ${
          isScrolled 
            ? "py-1 bg-blue-900/5" 
            : "py-2 bg-gradient-to-r from-blue-950/90 to-blue-900/90"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between text-sm">
            <div className={`flex items-center space-x-6 transition-colors ${
              isScrolled ? "text-gray-600" : "text-white/90"
            }`}>
              <div className="flex items-center space-x-2">
                <Phone className="h-3 w-3" />
                <span>{SCHOOL_CONFIG.CONTACT.PHONE}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-3 w-3" />
                <span>{SCHOOL_CONFIG.CONTACT.EMAIL}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-3 w-3" />
                <span>{SCHOOL_CONFIG.CONTACT.ADDRESS}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge 
                variant="secondary" 
                className={`transition-all ${
                  isScrolled 
                    ? "bg-blue-100 text-blue-800 border-blue-200" 
                    : "bg-yellow-500/20 text-yellow-100 border-yellow-400/30"
                }`}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Admissions Open 2025
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Navigation */}
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center space-x-4"
          >
            <Link href="/" className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full blur-lg opacity-20 animate-pulse" />
                <img
                  src="/school-logo.svg"
                  alt={SCHOOL_CONFIG.SCHOOL_NAME}
                  className="h-12 w-12 relative z-10"
                />
              </div>
              <div>
                <h1 className={`font-bold text-xl transition-colors duration-300 ${
                  isScrolled ? 'text-gray-900' : 'text-white'
                }`}>
                  {SCHOOL_CONFIG.SCHOOL_NAME}
                </h1>
                <p className={`text-sm transition-colors duration-300 ${
                  isScrolled ? 'text-gray-600' : 'text-white/80'
                }`}>
                  {SCHOOL_CONFIG.TAGLINE}
                </p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="hidden lg:block"
          >
            <NavigationMenu viewport={false}>
              <NavigationMenuList className="flex space-x-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavigationMenuItem key={item.title}>
                      <NavigationMenuTrigger 
                        className={`group bg-transparent hover:bg-white/10 ${
                          isScrolled ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-200'
                        } transition-all duration-300 font-medium px-4 py-2 h-10 flex items-center space-x-2 data-[state=open]:bg-white/10`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 bg-white rounded-lg shadow-xl border border-gray-200">
                          <li className="row-span-3">
                            <div className="py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg -mx-4 -mt-4 mb-3 px-6 pt-4 pb-3">
                              <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Icon className="h-5 w-5 mr-2 text-blue-600" />
                                {item.title}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {item.description}
                              </p>
                            </div>
                          </li>
                          {item.items.map((subItem) => {
                            const SubIcon = subItem.icon;
                            return (
                              <li key={subItem.title}>
                                <NavigationMenuLink asChild>
                                  <Link
                                    href={subItem.href}
                                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-50 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  >
                                    <div className="flex items-start space-x-3">
                                      <SubIcon className="h-4 w-4 mt-0.5 text-gray-400 hover:text-blue-500 transition-colors flex-shrink-0" />
                                      <div className="space-y-1">
                                        <div className="text-sm font-medium leading-none text-gray-900 hover:text-blue-600">
                                          {subItem.title}
                                        </div>
                                        <p className="line-clamp-2 text-xs leading-snug text-gray-500">
                                          {subItem.description}
                                        </p>
                                      </div>
                                    </div>
                                  </Link>
                                </NavigationMenuLink>
                              </li>
                            );
                          })}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="hidden lg:flex items-center space-x-4"
          >
            <Button 
              variant="outline" 
              size="sm"
              asChild
              className={`transition-all duration-300 ${
                isScrolled 
                  ? 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white' 
                  : 'border-white text-white hover:bg-white hover:text-blue-900'
              }`}
            >
              <Link href="/auth/login">
                <Users className="h-4 w-4 mr-2" />
                Login
              </Link>
            </Button>
            <Button 
              asChild
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 hover:from-yellow-500 hover:to-yellow-600 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/admissions">
                <GraduationCap className="h-4 w-4 mr-2" />
                Apply Now
              </Link>
            </Button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className={`lg:hidden p-2 rounded-md transition-colors duration-300 ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200/50"
          >
            <div className="container mx-auto px-6 py-6">
              <div className="space-y-4">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-3 py-3 px-4 rounded-lg bg-blue-50/50 text-gray-900 font-semibold">
                        <Icon className="h-5 w-5 text-blue-600" />
                        <span>{item.title}</span>
                      </div>
                      <div className="ml-6 space-y-1">
                        {item.items.map((subItem) => {
                          const SubIcon = subItem.icon;
                          return (
                            <Link
                              key={subItem.title}
                              href={subItem.href}
                              className="flex items-center space-x-3 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-gray-700 group"
                              onClick={() => setIsOpen(false)}
                            >
                              <SubIcon className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                              <div>
                                <div className="font-medium text-sm">{subItem.title}</div>
                                <div className="text-xs text-gray-500">{subItem.description}</div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}                {/* Mobile CTA Buttons */}
                <div className="border-t border-gray-200 pt-4 space-y-3">
                  <Button asChild className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 font-semibold">
                    <Link href="/admissions" onClick={() => setIsOpen(false)}>
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Apply Now
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                    <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                      <Users className="h-4 w-4 mr-2" />
                      Login
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
