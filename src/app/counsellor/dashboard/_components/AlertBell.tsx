'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, X, AlertTriangle, AlertCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StudentAlert } from '@/lib/types/data';

interface AlertBellProps {
  alerts: StudentAlert[];
  unreadCount: number;
  onMarkRead: (alertId: string) => void;
  onMarkAllRead: () => void;
  className?: string;
}

export function AlertBell({
  alerts,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
  className,
}: AlertBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllRead}
                  className="text-xs text-primary hover:underline"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Alert List */}
          <div className="max-h-80 overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-500">
                No notifications
              </div>
            ) : (
              alerts.map((alert) => (
                <a
                  key={alert.id}
                  href={`/counsellor/students/${alert.studentId}`}
                  className={cn(
                    'flex gap-3 border-b border-gray-50 px-4 py-3 transition-colors hover:bg-gray-50 cursor-pointer',
                    !alert.isRead && 'bg-blue-50/50'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                      alert.severity === 'critical'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-orange-100 text-orange-600'
                    )}
                  >
                    {alert.severity === 'critical' ? (
                      <AlertCircle className="h-4 w-4" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{alert.studentName}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">
                      {alert.message}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {formatTimeAgo(alert.createdAt)}
                    </p>
                  </div>

                  {/* Mark Read Button */}
                  {!alert.isRead && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onMarkRead(alert.id);
                      }}
                      className="shrink-0 self-start rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                      title="Mark as read"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  )}
                </a>
              ))
            )}
          </div>

          {/* Footer */}
          {alerts.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-2">
              <a
                href="/counsellor/students?filter=atRisk"
                className="block text-center text-sm text-primary hover:underline"
              >
                View all at-risk students
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
