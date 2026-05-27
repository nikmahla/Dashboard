'use client';

import { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Breadcrumbs from '@/components/Breadcrumbs';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { ui } from '@/lib/ui';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <div className={ui.layout.shell}>
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className={ui.layout.content}>
          <Topbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
          <main className="flex-1 px-4 pb-6 pt-20 sm:px-6 md:pb-8">
            <div className={ui.layout.main}>
              <Breadcrumbs />
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
