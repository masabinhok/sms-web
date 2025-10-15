import TeacherSidebar from '@/components/teacher/TeacherSidebar';
import { ReactNode } from 'react';

export default function TeacherLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
