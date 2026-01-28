'use client';

import { useState, useEffect } from 'react';
import { DashboardCards } from './_components/DashboardCards';
import { DashboardTable } from './_components/DashboardTable';
import { AtRiskStudentsPanel } from './_components/AtRiskStudentsPanel';
import { AlertBell } from './_components/AlertBell';
import { ViewToggle, type ViewMode } from './_components/ViewToggle';
import type { DashboardStatsExtended, StudentAlert } from '@/lib/types/data';

export default function CounsellorDashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [stats, setStats] = useState<DashboardStatsExtended | null>(null);
  const [alerts, setAlerts] = useState<StudentAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [statsRes, alertsRes] = await Promise.all([
          fetch('/api/students?stats=extended'),
          fetch('/api/alerts?limit=10'),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (alertsRes.ok) {
          const alertsData = await alertsRes.json();
          setAlerts(alertsData);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const handleMarkAlertRead = async (alertId: string) => {
    try {
      await fetch('/api/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId }),
      });

      setAlerts(prev =>
        prev.map(alert =>
          alert.id === alertId ? { ...alert, isRead: true } : alert
        )
      );
    } catch (error) {
      console.error('Failed to mark alert as read:', error);
    }
  };

  const handleMarkAllAlertsRead = async () => {
    try {
      await fetch('/api/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      });

      setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all alerts as read:', error);
    }
  };

  const unreadCount = alerts.filter(a => !a.isRead).length;

  return (
    <div className="space-y-8">
      {/* Page Header with Alert Bell and View Toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your student pipeline overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle value={viewMode} onChange={setViewMode} />
          <AlertBell
            alerts={alerts}
            unreadCount={unreadCount}
            onMarkRead={handleMarkAlertRead}
            onMarkAllRead={handleMarkAllAlertsRead}
          />
        </div>
      </div>

      {/* At-Risk Students Panel - Always visible at top */}
      <AtRiskStudentsPanel />

      {/* Main Dashboard Content - Toggleable between Cards and Table */}
      {viewMode === 'cards' ? (
        <DashboardCards stats={stats} loading={loading} />
      ) : (
        <DashboardTable />
      )}
    </div>
  );
}
