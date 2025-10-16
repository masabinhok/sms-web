import Sidebar from '@/components/sidebar/Sidebar';
import { ReactNode } from 'react';

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="super-admin" />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
