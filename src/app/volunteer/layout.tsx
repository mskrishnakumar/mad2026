'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/layout/Sidebar';
import { cn } from '@/lib/utils';

// Mock volunteer user data
const mockVolunteer = {
  name: 'Priya Sharma',
  email: 'priya.sharma@volunteer.magicbus.org',
  lastSignedIn: '29 Jan 2026, 9:30 AM',
};

export default function VolunteerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Login page should not show sidebar
  const isPublicPage = pathname === '/volunteer/login';

  // Layout without sidebar for login
  if (isPublicPage) {
    return <>{children}</>;
  }

  // Layout with sidebar for authenticated volunteer pages
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        userType="volunteer"
        isCollapsed={isSidebarCollapsed}
        onCollapsedChange={setIsSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className={cn(
        "transition-all duration-300",
        isSidebarCollapsed ? "md:ml-20" : "md:ml-64"
      )}>
        {/* Header for Volunteer Portal */}
        <header className="bg-white border-b sticky top-0 z-30">
          <div className="px-4 md:px-8 h-16 flex items-center justify-between">
            {/* Page Title - Hidden on mobile where hamburger menu is */}
            <div className="ml-12 md:ml-0">
              <span className="font-semibold text-gray-900">Volunteer Portal</span>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{mockVolunteer.name}</p>
                <p className="text-xs text-muted-foreground">{mockVolunteer.email}</p>
              </div>
              <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {mockVolunteer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                asChild
              >
                <Link href="/volunteer/login">
                  <LogOut className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Log Out</span>
                </Link>
              </Button>
            </div>
          </div>
          {/* Last signed in - mobile visible */}
          <div className="px-4 pb-2 sm:hidden ml-12">
            <p className="text-xs text-muted-foreground">
              Last signed in: {mockVolunteer.lastSignedIn}
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
