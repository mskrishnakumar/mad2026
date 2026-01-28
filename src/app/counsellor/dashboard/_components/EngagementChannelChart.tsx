'use client';

import { MessageSquare, Phone, Mail, Users, Send } from 'lucide-react';
import type { EngagementChannelStats, EngagementChannel } from '@/lib/types/data';

interface EngagementChannelChartProps {
  data: EngagementChannelStats[];
  total: number;
}

const channelConfig: Record<EngagementChannel, {
  label: string;
  icon: typeof MessageSquare;
  color: string;
  bgColor: string;
  textColor: string;
}> = {
  whatsapp: {
    label: 'WhatsApp',
    icon: MessageSquare,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
  },
  phone: {
    label: 'Phone Call',
    icon: Phone,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
  },
  sms: {
    label: 'SMS',
    icon: Send,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
  },
  in_person: {
    label: 'In Person',
    icon: Users,
    color: 'bg-amber-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
  },
  email: {
    label: 'Email',
    icon: Mail,
    color: 'bg-gray-500',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
  },
};

export function EngagementChannelChart({ data, total }: EngagementChannelChartProps) {
  const maxRate = Math.max(...data.map(d => d.responseRate), 1);
  const bestChannel = data[0]; // Already sorted by response rate
  const totalPositiveOutcomes = data.reduce((sum, d) => sum + d.positiveOutcomes, 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Engagement Channel Outcomes
        </h3>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {total} students
        </span>
      </div>

      <div className="space-y-4">
        {data.map((stat) => {
          const config = channelConfig[stat.channel];
          const Icon = config.icon;
          const barWidth = maxRate > 0 ? (stat.responseRate / maxRate) * 100 : 0;

          return (
            <div key={stat.channel} className="group">
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${config.bgColor}`}>
                    <Icon className={`h-4 w-4 ${config.textColor}`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {config.label}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {stat.totalStudents} contacted
                  </span>
                  <span className={`text-sm font-semibold ${config.textColor}`}>
                    {stat.responseRate}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${config.color}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>

              {/* Details row */}
              <div className="mt-1 flex items-center justify-between text-xs text-gray-400">
                <span>{stat.positiveOutcomes} positive outcomes</span>
                <span>Avg response: {stat.averageResponseTime} days</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-green-50 p-4">
          <p className="text-xs font-medium text-green-600">Best Performing</p>
          <p className="mt-1 text-lg font-bold text-green-700">
            {bestChannel ? channelConfig[bestChannel.channel].label : 'N/A'}
          </p>
          <p className="text-xs text-green-600">
            {bestChannel?.responseRate}% response rate
          </p>
        </div>
        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-xs font-medium text-blue-600">Positive Outcomes</p>
          <p className="mt-1 text-lg font-bold text-blue-700">
            {totalPositiveOutcomes}
          </p>
          <p className="text-xs text-blue-600">
            across all channels
          </p>
        </div>
      </div>
    </div>
  );
}
