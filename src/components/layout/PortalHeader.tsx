'use client';

import Link from 'next/link';
import { LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock user data
const mockUsers = {
  counsellor: {
    name: 'Priya Mehta',
    email: 'priya.mehta@magicbus.org',
    lastSignedIn: '28 Jan 2026, 9:30 AM',
    role: 'Senior Counsellor',
  },
  student: {
    name: 'Rahul Kumar',
    email: 'rahul.kumar@student.magicbus.org',
    lastSignedIn: '28 Jan 2026, 8:15 AM',
    role: 'Student',
  },
  volunteer: {
    name: 'Amit Sharma',
    email: 'amit.sharma@barclays.com',
    lastSignedIn: '28 Jan 2026, 10:00 AM',
    role: 'Volunteer Mentor',
  },
};

interface PortalHeaderProps {
  userType: 'counsellor' | 'student' | 'volunteer';
}

export function PortalHeader({ userType }: PortalHeaderProps) {
  const user = mockUsers[userType];
  const avatarColor = userType === 'counsellor'
    ? 'bg-teal-500'
    : userType === 'volunteer'
    ? 'bg-purple-500'
    : 'bg-blue-500';

  return (
    <header className="h-16 bg-white border-b sticky top-0 z-30 md:ml-64">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        {/* Left side - can add breadcrumbs or page title later */}
        <div className="md:hidden" /> {/* Spacer for mobile menu button */}

        {/* Right side - User Info */}
        <div className="flex items-center gap-4 ml-auto">
          {/* User Details */}
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          {/* Avatar */}
          <div className="relative group">
            <button className="flex items-center gap-2">
              <div className={`w-10 h-10 ${avatarColor} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500 hidden sm:block" />
            </button>

            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
              <div className="px-4 py-2 border-b">
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground mt-1">Role: {user.role}</p>
              </div>
              <div className="px-4 py-2 border-b">
                <p className="text-xs text-muted-foreground">
                  Last signed in: {user.lastSignedIn}
                </p>
              </div>
              <div className="px-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  asChild
                >
                  <Link href="/">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
