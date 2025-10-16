"use client"

import { useAuth } from '@/store/authStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const navSection = (title: string, items: { label: string; href: string }[]) => ({ title, items });

const SECTIONS = [
  navSection('Student', [
    { label: 'Dashboard', href: '/student' },
  ]),
  navSection('Class Info', [
    { label: 'Subjects', href: '/student/subjects' },
    { label: 'Assignments', href: '/student/assignments' },
  ]),
  navSection('Performance', [
    { label: 'Grades', href: '/student/grades' },
    { label: 'Attendance', href: '/student/attendance' },
  ]),
  navSection('Communication', [
    { label: 'Messages', href: '/student/messages' },
    { label: 'Announcements', href: '/student/announcements' },
  ]),
  // 'Account' section removed — profile is already available in the fixed footer
];

export default function StudentSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="w-72 min-w-[18rem] max-w-xs h-screen sticky top-0 bg-white border-r border-gray-200 flex flex-col">
      <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white font-bold">
            S
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">School Name</span>
            <span className="text-xs text-gray-500">Student Dashboard</span>
          </div>
        </Link>
      </div>

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
                        active ? 'bg-violet-50 text-violet-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-violet-300" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-gray-100">
        <Link href="/student/profile" className="flex items-center gap-3">
          <div className="relative">
            <span className="overflow-hidden rounded-full bg-violet-600 w-10 h-10 flex items-center uppercase justify-center text-white font-semibold">
              {user?.username ? user.username.split('-')[0][0] + (user.username.split('-')[1]?.[0] ?? '') : 'S'}
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
