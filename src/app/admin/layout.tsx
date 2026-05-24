'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AuthGuard from '@/components/AuthGuard';
import Topbar from '@/components/Topbar';
import Sidebar from '@/components/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        'use client';

        import { useState } from 'react';

        import AuthGuard from '@/components/AuthGuard';
        import Topbar from '@/components/Topbar';
        import Sidebar from '@/components/Sidebar';

        export default function AdminLayout({ children }: { children: React.ReactNode }) {
          const [open, setOpen] = useState(true);

          return (
            <AuthGuard>
              <div className="min-h-screen md:flex">
                <Sidebar open={open} setOpen={setOpen} />
                <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
                  <Topbar onToggleSidebar={() => setOpen((v) => !v)} />
                  <main className="pt-20 px-6 pb-6">
                    <div className="w-full max-w-7xl mx-auto">{children}</div>
                  </main>
                </div>
              </div>
            </AuthGuard>
          );
        }