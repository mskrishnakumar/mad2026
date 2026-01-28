'use client';

import Link from 'next/link';
import Image from 'next/image';
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
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react';
import { useState, createContext, useContext } from 'react';

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
  { label: 'Profile', href: '/student/profile', icon: User },
  { label: 'Upskilling Programmes', href: '/student/programmes', icon: GraduationCap },
  { label: 'Job Opportunities', href: '/student/jobs', icon: Briefcase },
];

// Context for sidebar collapsed state
interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    return { isCollapsed: false, setIsCollapsed: () => {} };
  }
  return context;
}

interface SidebarProps {
  userType?: 'counsellor' | 'student' | 'volunteer';
  isCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ userType = 'counsellor', isCollapsed = false, onCollapsedChange }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = userType === 'counsellor'
    ? counsellorMenuItems
    : userType === 'volunteer'
    ? volunteerMenuItems
    : userType === 'student'
    ? studentMenuItems
    : [];

  const toggleCollapse = () => {
    onCollapsedChange?.(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-white shadow-md border"
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen bg-white border-r transition-all duration-300',
          'md:translate-x-0',
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full',
          // Desktop width based on collapsed state
          'md:w-64',
          isCollapsed && 'md:w-20'
        )}
      >
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-5 py-5 border-b hover:bg-gray-50 transition-colors",
            isCollapsed && "md:justify-center md:px-0"
          )}
        >
          {/* Hands Together Logo */}
          <div className="w-11 h-11 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
            <Image
              src="/images/logo-hands.jpg"
              alt="Mission Possible"
              width={44}
              height={44}
              className="w-full h-full object-cover"
            />
          </div>
          <div className={cn(isCollapsed && "md:hidden")}>
            <h1 className="font-bold text-gray-900 leading-tight">Mission</h1>
            <h1 className="font-bold text-primary leading-tight -mt-1">Possible</h1>
          </div>
        </Link>

        {/* Portal Label */}
        <div className={cn(
          "px-5 py-3 bg-gray-50/80",
          isCollapsed && "md:px-2 md:py-2"
        )}>
          <p className={cn(
            "text-xs font-medium text-muted-foreground uppercase tracking-wider",
            isCollapsed && "md:text-center"
          )}>
            {isCollapsed ? (
              <span className="hidden md:inline">{userType.charAt(0).toUpperCase()}</span>
            ) : null}
            <span className={cn(isCollapsed && "md:hidden")}>{userType} Portal</span>
          </p>
        </div>

        {/* Navigation */}
        <nav className={cn(
          "flex-1 px-4 py-4 space-y-1",
          isCollapsed && "md:px-2"
        )}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                  isCollapsed && 'md:justify-center md:px-0'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className={cn(isCollapsed && "md:hidden")}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle Button (Desktop only) */}
        <button
          onClick={toggleCollapse}
          className="hidden md:flex absolute -right-3 top-20 w-6 h-6 bg-white border rounded-full items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          )}
        </button>

        {/* Footer - Branding */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50/50",
          isCollapsed && "md:p-2"
        )}>
          <p className={cn(
            "text-xs text-center text-muted-foreground",
            isCollapsed && "md:hidden"
          )}>
            Magic Bus × Barclays
          </p>
          <p className={cn(
            "text-xs text-center text-muted-foreground/70",
            isCollapsed && "md:hidden"
          )}>
            Hack-a-Difference 2026
          </p>
          {isCollapsed && (
            <p className="hidden md:block text-xs text-center text-muted-foreground">MB</p>
          )}
        </div>
      </aside>
    </>
  );
}
