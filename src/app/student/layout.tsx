'use client';

import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header for Student Portal */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-sm font-black text-white tracking-tight">MP</span>
            </div>
            <div>
              <span className="font-bold text-gray-900">Mission <span className="text-primary">Possible</span></span>
              <span className="text-xs text-muted-foreground ml-2 hidden sm:inline">Student Portal</span>
            </div>
          </Link>

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
        <div className="container mx-auto px-4 pb-2 sm:hidden">
          <p className="text-xs text-muted-foreground">
            {mockStudent.name} | Last signed in: {mockStudent.lastSignedIn}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
