'use client'

import { useAuth } from '@/store/authStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const navSection = (title: string, items: { label: string; href: string }[]) => ({ title, items });

const SECTIONS = [
    navSection('Admin', [
    { label: 'Dashboard', href: '/admin' }, 
  ]),
  navSection('Create Profile', [
    { label: 'Student', href: '/admin/create-profile/student' },
    { label: 'Teacher', href: '/admin/create-profile/teacher' },
    { label: 'Admin', href: '/admin/create-profile/admin' },
  ]),
  navSection('Student Management', [
    { label: 'All Students', href: '/admin/students' },
    
  ]),
  navSection('Teacher Management', [
    { label: 'All Teachers', href: '/admin/teachers' },
   
  ]),
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const  { user} = useAuth();

  return (
    <aside className="w-72 min-w-[18rem] max-w-xs h-screen sticky top-0 bg-white border-r border-gray-200 flex flex-col">
      {/* Header with logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-sky-600 to-indigo-600 flex items-center justify-center text-white font-bold">
            {/* Initials placeholder for logo */}
            S
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">School Name</span>
            <span className="text-xs text-gray-500">Admin Dashboard</span>
          </div>
        </Link>
      </div>

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {SECTIONS.map((section) => (
          <div key={section.title} className="mb-6">
            <h4 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">{section.title}</h4>
            <ul className="mt-2">
              {section.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href} className="my-1">
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 w-full text-sm px-3 py-2 rounded-md transition-colors ${
                        active ? 'bg-sky-50 text-sky-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-sky-300" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer admin profile */}
      <div className="px-4 py-4 border-t border-gray-100">
        <Link href="/admin/profile" className="flex items-center gap-3">
          <div className="relative">
            <span className="overflow-hidden rounded-full bg-sky-600 w-10 h-10 flex items-center uppercase justify-center text-white font-semibold">
                {user?.username ? user.username.split('-')[0][0] + user.username.split('-')[1][0] : 'A'}
            </span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">{user?.username}</div>
            <div className="text-xs text-gray-500">{user?.role}</div>
          </div>
        </Link>
      </div>
    </aside>
  );
}