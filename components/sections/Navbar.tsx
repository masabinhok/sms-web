"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
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
import { useSchool } from "@/components/SchoolProvider";
import { NAVIGATION_MENU } from "@/lib/constants/navigation";
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Sparkles,
  Users,
} from "lucide-react";
import { useAuth } from "@/store/authStore";
import gsap from "gsap";
import { animateIn, staggerList } from "@/lib/gsap";

// Create a client-only component for user authentication UI
const UserAuthButton = dynamic(() => Promise.resolve(({ isScrolled }: { isScrolled: boolean }) => {
  const { user } = useAuth();
  
  return (
    <Button 
      variant="outline" 
      size="sm"
      asChild
      className={`transition-all duration-300 rounded-lg ${
        isScrolled 
          ? 'border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white' 
          : 'border-white/20 text-white hover:bg-white/10 hover:text-white bg-white/5 backdrop-blur-sm'
      }`}
    >
      {user ? (
        <Link href={`/${user.role.toLowerCase()}`}>
          <Users className="h-4 w-4 mr-2" />
          {user.username}
        </Link>
      ) : (
        <Link href="/auth/login">
          <Users className="h-4 w-4 mr-2" />
          Login
        </Link>
      )}
    </Button>
  );
}), {
  ssr: false,
  loading: () => (
    <Button 
      variant="outline" 
      size="sm"
      className="border-white/10 text-white/50"
      disabled
    >
      <Users className="h-4 w-4 mr-2" />
      Loading...
    </Button>
  )
});

// Create a mobile version of the user auth button
const MobileUserAuthButton = dynamic(() => Promise.resolve(({ onClose }: { onClose: () => void }) => {
  const { user } = useAuth();
  
  return user ? (
    <Button asChild variant="outline" className="w-full border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white">
      <Link href={`/${user.role.toLowerCase()}`} onClick={onClose}>
        <Users className="h-4 w-4 mr-2" />
        {user.username}
      </Link>
    </Button>
  ) : (
    <Button asChild variant="outline" className="w-full border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white">
      <Link href="/auth/login" onClick={onClose}>
        <Users className="h-4 w-4 mr-2" />
        Login
      </Link>
    </Button>
  );
}), {
  ssr: false,
  loading: () => (
    <Button variant="outline" className="w-full border-gray-300 text-gray-600" disabled>
      <Users className="h-4 w-4 mr-2" />
      Loading...
    </Button>
  )
});

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { school } = useSchool();
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    
    // Initial animation
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, { y: -100, duration: 1, ease: "power3.out" });
      gsap.from(".nav-top-bar", { opacity: 0, duration: 0.5, delay: 0.5 });
      gsap.from(".nav-logo", { x: -20, opacity: 0, duration: 0.5, delay: 0.6 });
      gsap.from(".nav-menu-item", { y: -10, opacity: 0, stagger: 0.05, duration: 0.5, delay: 0.7 });
      gsap.from(".nav-cta", { x: 20, opacity: 0, duration: 0.5, delay: 0.8 });
    }, navRef);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (isOpen && mobileMenuRef.current) {
      gsap.fromTo(mobileMenuRef.current, 
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.4, ease: "power3.out" }
      );
      staggerList(".mobile-nav-item", { delay: 0.2 });
    }
  }, [isOpen]);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled
          ? "bg-bg-premium/80 backdrop-blur-xl shadow-lg border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      {/* Top Bar - Contact Info */}
      <div
        className={`nav-top-bar hidden lg:block transition-all duration-300 ${
          isScrolled 
            ? "py-1 bg-black/20 border-b border-white/5" 
            : "py-2 bg-gradient-to-r from-black/40 to-transparent border-b border-white/5"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between text-xs font-medium">
            <div className="flex items-center space-x-6 text-fg-premium-muted">
              <div className="flex items-center space-x-2 hover:text-white transition-colors">
                <Phone className="h-3 w-3" />
                <span>{school?.phone || 'Loading...'}</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-white transition-colors">
                <Mail className="h-3 w-3" />
                <span>{school?.email || 'Loading...'}</span>
              </div>
              <div className="flex items-center space-x-2 hover:text-white transition-colors">
                <MapPin className="h-3 w-3" />
                <span>{school?.address || 'Loading...'}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge 
                variant="secondary" 
                className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 hover:bg-accent-primary/20 transition-colors"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Admissions Open 2025
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="nav-logo flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-accent-primary rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                <div className="w-10 h-10 bg-gradient-to-br from-accent-primary to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg relative z-10">
                  S
                </div>
              </div>
              <div>
                <h1 className="font-bold text-lg text-fg-premium tracking-tight group-hover:text-white transition-colors">
                  {school?.name || 'Loading...'}
                </h1>
                <p className="text-xs text-fg-premium-muted group-hover:text-fg-premium transition-colors">
                  {school?.tagline || ''}
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <NavigationMenu viewport={false}>
              <NavigationMenuList className="flex space-x-1">
                {NAVIGATION_MENU.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavigationMenuItem key={item.title} className="nav-menu-item">
                      <NavigationMenuTrigger 
                        className="group bg-transparent hover:bg-white/5 text-fg-premium-muted hover:text-white transition-all duration-300 font-medium px-4 py-2 h-9 text-sm rounded-lg data-[state=open]:bg-white/5 data-[state=open]:text-white"
                      >
                        <Icon className="h-3.5 w-3.5 mr-2 opacity-70 group-hover:opacity-100 transition-opacity" />
                        <span>{item.title}</span>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-2 p-3 bg-bg-premium border border-white/10 rounded-xl shadow-2xl shadow-black/50">
                          <li className="row-span-3">
                            <div className="p-4 bg-white/5 rounded-lg mb-2 border border-white/5">
                              <h4 className="text-base font-semibold text-white flex items-center mb-1">
                                <Icon className="h-4 w-4 mr-2 text-accent-primary" />
                                {item.title}
                              </h4>
                              <p className="text-xs text-fg-premium-muted leading-relaxed">
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
                                    className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-white/5 hover:text-white focus:bg-white/5 focus:text-white group"
                                  >
                                    <div className="flex items-start space-x-3">
                                      <div className="p-1.5 rounded-md bg-white/5 group-hover:bg-accent-primary/20 transition-colors">
                                        <SubIcon className="h-3.5 w-3.5 text-fg-premium-muted group-hover:text-accent-primary transition-colors" />
                                      </div>
                                      <div className="space-y-1">
                                        <div className="text-sm font-medium leading-none text-fg-premium group-hover:text-white">
                                          {subItem.title}
                                        </div>
                                        <p className="line-clamp-2 text-[10px] leading-snug text-fg-premium-muted group-hover:text-fg-premium/70">
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
          </div>

          {/* CTA Buttons */}
          <div className="nav-cta hidden lg:flex items-center space-x-3">
            <UserAuthButton isScrolled={isScrolled} />

            <Button 
              asChild
              className="bg-white text-black hover:bg-gray-200 font-semibold shadow-lg shadow-white/10 hover:shadow-white/20 transition-all duration-300 rounded-lg h-9 px-4 text-sm"
            >
              <Link href="/admissions">
                <GraduationCap className="h-4 w-4 mr-2" />
                Apply Now
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden bg-bg-premium border-t border-white/10 overflow-hidden"
        >
          <div className="container mx-auto px-6 py-6">
            <div className="space-y-6">
              {NAVIGATION_MENU.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="mobile-nav-item space-y-3 opacity-0"
                  >
                    <div className="flex items-center space-x-3 py-2 px-2 border-b border-white/5 text-fg-premium font-semibold">
                      <Icon className="h-4 w-4 text-accent-primary" />
                      <span className="text-sm uppercase tracking-wider">{item.title}</span>
                    </div>
                    <div className="ml-4 space-y-1 border-l border-white/5 pl-4">
                      {item.items.map((subItem) => {
                        const SubIcon = subItem.icon;
                        return (
                          <Link
                            key={subItem.title}
                            href={subItem.href}
                            className="flex items-center space-x-3 py-2 px-2 rounded-lg hover:bg-white/5 transition-colors duration-200 text-fg-premium-muted group"
                            onClick={() => setIsOpen(false)}
                          >
                            <SubIcon className="h-3.5 w-3.5 text-fg-premium-muted/50 group-hover:text-white transition-colors" />
                            <div>
                              <div className="font-medium text-sm group-hover:text-white transition-colors">{subItem.title}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              
              {/* Mobile CTA Buttons */}
              <div className="mobile-nav-item border-t border-white/10 pt-6 space-y-3 opacity-0">
                <Button asChild className="w-full bg-white text-black hover:bg-gray-200 font-semibold">
                  <Link href="/admissions" onClick={() => setIsOpen(false)}>
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Apply Now
                  </Link>
                </Button>
                <MobileUserAuthButton onClose={() => setIsOpen(false)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
