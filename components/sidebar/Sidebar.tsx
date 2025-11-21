'use client'

import { adminSections, studentSections, superAdminSections, teacherSections } from '@/lib/constants/sidebar';
import { useAuth } from '@/store/authStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { animateIn, staggerList } from '@/lib/gsap';

export default function Sidebar({role} : {role: string}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const sidebarRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const getSectionsByRole = (role: string) =>{
    switch (role){
        case 'superadmin':
            return superAdminSections;
        case 'admin':
            return adminSections;
        case 'teacher':
            return teacherSections;
        case 'student':
            return studentSections;
        default:
            return [];
    }
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Slide-in glassmorphic with subtle bounce
      gsap.fromTo(sidebarRef.current, 
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "elastic.out(1, 0.75)" }
      );

      // Stagger list items
      staggerList('.nav-item', { delay: 0.4 });
    }, sidebarRef);

    return () => ctx.revert();
  }, []);

  return (
    <aside 
      ref={sidebarRef}
      className="w-72 min-w-[18rem] max-w-xs h-screen sticky top-0 sidebar-glass border-r border-white/10 flex flex-col z-50"
      data-premium="sidebar"
    >
      {/* Header with logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-primary to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            S
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-fg-premium tracking-tight">School Name</span>
            <span className="text-[10px] uppercase tracking-wider text-fg-premium-muted"> <span className='capitalize'>{role}</span> Dashboard</span>
          </div>
        </Link>
      </div>

      <nav ref={navRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
        {getSectionsByRole(role).map((section) => (
          <div key={section.title} className="nav-section">
            <h4 className="px-2 text-[10px] font-bold text-fg-premium-muted uppercase tracking-widest mb-3 opacity-70">{section.title}</h4>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href} className="nav-item opacity-0">
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 w-full text-sm px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden ${
                        active 
                          ? 'bg-white/10 text-white font-medium shadow-sm' 
                          : 'text-fg-premium-muted hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {active && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-accent-primary rounded-r-full shadow-[0_0_10px_rgba(94,106,210,0.6)]" />
                      )}
                      <span className={`w-1.5 h-1.5 rounded-full transition-colors ${active ? 'bg-accent-primary' : 'bg-white/20 group-hover:bg-white/40'}`} />
                      <span className="truncate relative z-10">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="px-6 py-6 border-t border-white/5 bg-black/20 backdrop-blur-md">
        <Link href={`/${role}/profile`} className="flex items-center gap-3 group">
          <div className="relative">
            <span className="overflow-hidden rounded-full bg-gradient-to-tr from-accent-primary to-purple-600 w-10 h-10 flex items-center uppercase justify-center text-white font-bold shadow-lg group-hover:ring-2 ring-white/20 transition-all">
                {user?.username?.charAt(0) || 'U'}
            </span>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#121416] rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-fg-premium truncate group-hover:text-white transition-colors">{user?.username}</div>
            <div className="text-xs text-fg-premium-muted truncate">{user?.role}</div>
          </div>
        </Link>
      </div>
    </aside>
  );
}