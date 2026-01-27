'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

// ============================================
// HEADER COMPONENT
// Simple, reusable navigation header
// ============================================

interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

interface HeaderProps {
  title?: string;
  navItems?: NavItem[];
  rightContent?: React.ReactNode;
  className?: string;
}

export function Header({
  title = 'My App',
  navItems = [],
  rightContent,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">{title}</span>
        </Link>

        {navItems.length > 0 && (
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  item.active ? 'text-foreground' : 'text-foreground/60'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {rightContent && (
          <div className="ml-auto flex items-center space-x-4">
            {rightContent}
          </div>
        )}
      </div>
    </header>
  );
}
