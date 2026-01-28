'use client';

import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/layout/Sidebar';

// Mock student user data
const mockStudent = {
  name: 'Rahul Kumar',
  email: 'rahul.kumar@student.magicbus.org',
  lastSignedIn: '28 Jan 2026, 8:15 AM',
};

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Registration page should not show sidebar (for new users)
  const isRegistrationPage = pathname === '/student/register';

  // Layout without sidebar for registration
  if (isRegistrationPage) {
    return <>{children}</>;
  }

  // Layout with sidebar for authenticated student pages
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar userType="student" />

      {/* Main Content Area */}
      <div className="md:ml-64">
        {/* Header for Student Portal */}
        <header className="bg-white border-b sticky top-0 z-30">
          <div className="px-4 md:px-8 h-16 flex items-center justify-between">
            {/* Page Title - Hidden on mobile where hamburger menu is */}
            <div className="ml-12 md:ml-0">
              <span className="font-semibold text-gray-900">Student Portal</span>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{mockStudent.name}</p>
                <p className="text-xs text-muted-foreground">{mockStudent.email}</p>
              </div>
              <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {mockStudent.name.split(' ').map(n => n[0]).join('')}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                asChild
              >
                <Link href="/">
                  <LogOut className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Log Out</span>
                </Link>
              </Button>
            </div>
          </div>
          {/* Last signed in - mobile visible */}
          <div className="px-4 pb-2 sm:hidden ml-12">
            <p className="text-xs text-muted-foreground">
              Last signed in: {mockStudent.lastSignedIn}
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
