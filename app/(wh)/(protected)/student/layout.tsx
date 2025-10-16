import Sidebar from '@/components/sidebar/Sidebar';
import { ReactNode } from 'react';

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="student" />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
