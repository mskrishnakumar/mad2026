'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  UserPlus,
  Briefcase,
  GraduationCap,
  Users,
  Menu,
  X,
  Heart,
  UserCheck,
  Bell,
  ClipboardList,
  FileText,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { useState } from 'react';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const counsellorMenuItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/counsellor/dashboard', icon: LayoutDashboard },
  { label: 'Student Onboarding', href: '/counsellor/onboarding', icon: UserPlus },
  { label: 'Programme Matching', href: '/counsellor/programme-matching', icon: GraduationCap },
  { label: 'Job Matching', href: '/counsellor/job-matching', icon: Briefcase },
  { label: 'Students', href: '/counsellor/students', icon: Users },
  { label: 'Volunteers', href: '/counsellor/volunteers', icon: Heart },
  { label: 'Mentor Assignment', href: '/counsellor/mentor-assignment', icon: UserCheck },
];

const volunteerMenuItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/volunteer/dashboard', icon: LayoutDashboard },
  { label: 'My Students', href: '/volunteer/students', icon: Users },
];

const studentMenuItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
  { label: 'Registration', href: '/student/register', icon: ClipboardList },
  { label: 'My Profile', href: '/student/profile', icon: FileText },
  { label: 'Notifications', href: '/student/notifications', icon: Bell },
  { label: 'My Programmes', href: '/student/programmes', icon: GraduationCap },
  { label: 'Help & Support', href: '/student/help', icon: HelpCircle },
];

interface SidebarProps {
  userType?: 'counsellor' | 'student' | 'volunteer';
}

export function Sidebar({ userType = 'counsellor' }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = userType === 'counsellor'
    ? counsellorMenuItems
    : userType === 'volunteer'
    ? volunteerMenuItems
    : userType === 'student'
    ? studentMenuItems
    : [];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-white shadow-md border"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r transition-transform duration-300',
          'md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 px-5 py-5 border-b hover:bg-gray-50 transition-colors">
          {/* 5 Hands Together Logo */}
          <div className="w-11 h-11 bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center p-1.5">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              {/* 5 hands reaching to center */}
              <circle cx="12" cy="12" r="3" fill="white" opacity="0.9"/>
              <path d="M12 2 L12 6 M12 9 L12 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M20.5 7.5 L17.5 9.5 M15.5 10.5 L12 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M20.5 16.5 L17.5 14.5 M15.5 13.5 L12 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3.5 7.5 L6.5 9.5 M8.5 10.5 L12 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3.5 16.5 L6.5 14.5 M8.5 13.5 L12 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              {/* Hand shapes at the ends */}
              <circle cx="12" cy="2" r="1.5" fill="white"/>
              <circle cx="20.5" cy="7.5" r="1.5" fill="white"/>
              <circle cx="20.5" cy="16.5" r="1.5" fill="white"/>
              <circle cx="3.5" cy="7.5" r="1.5" fill="white"/>
              <circle cx="3.5" cy="16.5" r="1.5" fill="white"/>
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-gray-900 leading-tight">Mission</h1>
            <h1 className="font-bold text-primary leading-tight -mt-1">Possible</h1>
          </div>
        </Link>

        {/* Portal Label */}
        <div className="px-5 py-3 bg-gray-50/80">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {userType} Portal
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer - Branding */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50/50">
          <p className="text-xs text-center text-muted-foreground">
            Magic Bus × Barclays
          </p>
          <p className="text-xs text-center text-muted-foreground/70">
            Hack-a-Difference 2026
          </p>
        </div>
      </aside>
    </>
  );
}
