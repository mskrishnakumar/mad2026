'use client';

import { useRouter } from 'next/navigation';
import { LucideIcon } from 'lucide-react';

interface RoleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  colorScheme: 'teal' | 'blue' | 'purple' | 'amber';
}

const colorSchemes = {
  teal: {
    border: 'border-teal-200 hover:border-teal-500',
    iconBg: 'bg-teal-100 group-hover:bg-teal-200',
    iconColor: 'text-teal-600',
  },
  blue: {
    border: 'border-blue-200 hover:border-blue-500',
    iconBg: 'bg-blue-100 group-hover:bg-blue-200',
    iconColor: 'text-blue-600',
  },
  purple: {
    border: 'border-purple-200 hover:border-purple-500',
    iconBg: 'bg-purple-100 group-hover:bg-purple-200',
    iconColor: 'text-purple-600',
  },
  amber: {
    border: 'border-amber-200 hover:border-amber-500',
    iconBg: 'bg-amber-100 group-hover:bg-amber-200',
    iconColor: 'text-amber-600',
  },
};

export function RoleCard({ title, description, icon: Icon, href, colorScheme }: RoleCardProps) {
  const router = useRouter();
  const colors = colorSchemes[colorScheme];

  return (
    <button
      onClick={() => router.push(href)}
      className={`
        bg-white rounded-2xl p-8 border-2 ${colors.border}
        hover:shadow-lg transition-all duration-300 text-left group
        w-full min-h-[200px] flex flex-col
      `}
    >
      <div
        className={`
          w-14 h-14 ${colors.iconBg} rounded-xl
          flex items-center justify-center mb-4
          transition-colors duration-300
        `}
      >
        <Icon className={`h-7 w-7 ${colors.iconColor}`} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 flex-grow">{description}</p>
      <div className={`mt-4 text-sm font-medium ${colors.iconColor} flex items-center gap-1`}>
        Enter Portal
        <svg
          className="w-4 h-4 transition-transform group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}
