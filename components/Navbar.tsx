"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
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
  Users,
  BookOpen,
  Award,
  Calendar,
  MessageSquare,
  ChevronDown,
  Sparkles,
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

  const menuItems = [
    {
      title: "About",
      href: "#about",
      icon: Users,
      description: "Learn about our school's mission and values",
      items: [
        { title: "Our Story", href: "#about", description: "Discover our journey" },
        { title: "Mission & Vision", href: "#mission", description: "Our guiding principles" },
        { title: "Leadership Team", href: "#team", description: "Meet our educators" },
        { title: "Awards & Recognition", href: "#awards", description: "Our achievements" },
      ],
    },
    {
      title: "Programs",
      href: "#programs",
      icon: GraduationCap,
      description: "Explore our academic offerings",
      items: [
        { title: "Early Years", href: "#early-years", description: "Nursery to Class 2" },
        { title: "Primary School", href: "#primary", description: "Class 3 to 5" },
        { title: "Secondary School", href: "#secondary", description: "Class 6 to 10" },
        { title: "Higher Secondary", href: "#higher-secondary", description: "Class 11 & 12" },
      ],
    },
    {
      title: "Academics",
      href: "#academics",
      icon: BookOpen,
      description: "Academic excellence and curriculum",
      items: [
        { title: "Curriculum", href: "#curriculum", description: "Our academic framework" },
        { title: "Facilities", href: "#facilities", description: "Learning environments" },
        { title: "Library", href: "#library", description: "Knowledge resources" },
        { title: "Technology", href: "#technology", description: "Digital learning tools" },
      ],
    },
    {
      title: "Activities",
      href: "#activities",
      icon: Award,
      description: "Co-curricular and extracurricular programs",
      items: [
        { title: "Sports", href: "#sports", description: "Athletic programs" },
        { title: "Arts & Culture", href: "#arts", description: "Creative expression" },
        { title: "Clubs & Societies", href: "#clubs", description: "Student organizations" },
        { title: "Events", href: "#events", description: "School celebrations" },
      ],
    },
    {
      title: "Admissions",
      href: "#admissions",
      icon: Calendar,
      description: "Join our school community",
      items: [
        { title: "Application Process", href: "#application", description: "How to apply" },
        { title: "Requirements", href: "#requirements", description: "Admission criteria" },
        { title: "Fees Structure", href: "#fees", description: "Tuition and costs" },
        { title: "Scholarships", href: "#scholarships", description: "Financial assistance" },
      ],
    },
    {
      title: "Contact",
      href: "#contact",
      icon: MessageSquare,
      description: "Get in touch with us",
    },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "premium-nav shadow-lg backdrop-blur-xl bg-white/90 border-b border-white/20"
          : "bg-transparent"
      }`}
    >
      {/* Top Bar - Contact Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`hidden lg:block border-b border-white/10 transition-all duration-300 ${
          isScrolled ? "py-1 bg-white/5" : "py-2 bg-gradient-to-r from-blue-950/90 to-blue-900/90"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6 text-white/90">
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
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-100 border-yellow-400/30">
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
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full blur-lg opacity-20 animate-pulse" />
              <img
                src="/school-logo.svg"
                alt={SCHOOL_CONFIG.SCHOOL_NAME}
                className="h-12 w-12 relative z-10"
              />
            </div>
            <div>
              <h1 className={`font-bold text-xl ${isScrolled ? 'text-gray-900' : 'text-white'} transition-colors duration-300`}>
                {SCHOOL_CONFIG.SCHOOL_NAME}
              </h1>
              <p className={`text-sm ${isScrolled ? 'text-gray-600' : 'text-white/80'} transition-colors duration-300`}>
                {SCHOOL_CONFIG.TAGLINE}
              </p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="hidden lg:block"
          >
            <NavigationMenu>
              <NavigationMenuList className="space-x-2">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <NavigationMenuItem key={item.title}>
                      {item.items ? (
                        <>
                          <NavigationMenuTrigger 
                            className={`group premium-button bg-transparent hover:bg-white/10 ${
                              isScrolled ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-200'
                            } transition-all duration-300 font-medium`}
                          >
                            <Icon className="h-4 w-4 mr-2" />
                            {item.title}
                            <ChevronDown className="h-3 w-3 ml-1 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="grid gap-3 p-6 w-[400px] glass-effect"
                            >
                              <div className="grid gap-2">
                                <h4 className="text-lg font-semibold heading-premium">
                                  {item.title}
                                </h4>
                                <p className="text-sm text-premium">
                                  {item.description}
                                </p>
                              </div>
                              <Separator className="my-2" />
                              <div className="grid gap-2">
                                {item.items.map((subItem) => (
                                  <NavigationMenuLink
                                    key={subItem.title}
                                    href={subItem.href}
                                    className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground premium-card"
                                  >
                                    <div className="text-sm font-medium leading-none group-hover:text-blue-600 transition-colors">
                                      {subItem.title}
                                    </div>
                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                      {subItem.description}
                                    </p>
                                  </NavigationMenuLink>
                                ))}
                              </div>
                            </motion.div>
                          </NavigationMenuContent>
                        </>
                      ) : (
                        <NavigationMenuLink
                          href={item.href}
                          className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 ${
                            isScrolled ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-200'
                          } premium-button`}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {item.title}
                        </NavigationMenuLink>
                      )}
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
              className={`premium-button border-2 ${
                isScrolled 
                  ? 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white' 
                  : 'border-white text-white hover:bg-white hover:text-blue-900'
              } transition-all duration-300`}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Visit
            </Button>
            <Button 
              className="premium-button gradient-secondary text-blue-900 hover:shadow-lg hover:shadow-yellow-500/25 font-semibold"
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Apply Now
            </Button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className={`lg:hidden p-2 rounded-md ${
              isScrolled ? 'text-gray-900' : 'text-white'
            } transition-colors duration-300`}
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
            className="lg:hidden glass-effect border-t border-white/10"
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
                    >
                      <a
                        href={item.href}
                        className="flex items-center space-x-3 py-3 px-4 rounded-lg hover:bg-white/5 transition-colors duration-200 text-white"
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className="h-5 w-5 text-blue-300" />
                        <span className="font-medium">{item.title}</span>
                      </a>
                    </motion.div>
                  );
                })}
                <Separator className="my-4" />
                <div className="space-y-3">
                  <Button className="w-full gradient-secondary text-blue-900 font-semibold">
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Apply Now
                  </Button>
                  <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-blue-900">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Visit
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
