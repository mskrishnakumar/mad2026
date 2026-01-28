import type { StudentAlert } from '@/lib/types/data';
import { getMockAlerts } from '@/lib/mockData/studentMockData';

// In-memory storage for alert state (read/unread)
const alertReadState: Map<string, boolean> = new Map();

/**
 * Get all alerts for the counsellor
 */
export async function getAlerts(): Promise<StudentAlert[]> {
  const alerts = getMockAlerts();

  // Apply read state from in-memory storage
  return alerts.map(alert => ({
    ...alert,
    isRead: alertReadState.get(alert.id) ?? alert.isRead,
  }));
}

/**
 * Get only unread alerts
 */
export async function getUnreadAlerts(): Promise<StudentAlert[]> {
  const alerts = await getAlerts();
  return alerts.filter(alert => !alert.isRead);
}

/**
 * Get alert count summary
 */
export async function getAlertCounts(): Promise<{
  total: number;
  unread: number;
  critical: number;
  warning: number;
}> {
  const alerts = await getAlerts();

  return {
    total: alerts.length,
    unread: alerts.filter(a => !a.isRead).length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    warning: alerts.filter(a => a.severity === 'warning').length,
  };
}

/**
 * Mark an alert as read
 */
export async function markAlertAsRead(alertId: string): Promise<boolean> {
  alertReadState.set(alertId, true);
  return true;
}

/**
 * Mark all alerts as read
 */
export async function markAllAlertsAsRead(): Promise<void> {
  const alerts = getMockAlerts();
  alerts.forEach(alert => {
    alertReadState.set(alert.id, true);
  });
}

/**
 * Get alerts for a specific student
 */
export async function getAlertsForStudent(studentId: string): Promise<StudentAlert[]> {
  const alerts = await getAlerts();
  return alerts.filter(alert => alert.studentId === studentId);
}

/**
 * Create a new alert (for system use)
 */
export async function createAlert(
  alert: Omit<StudentAlert, 'id' | 'createdAt' | 'isRead'>
): Promise<StudentAlert> {
  const newAlert: StudentAlert = {
    ...alert,
    id: `ALR${Date.now()}`,
    createdAt: new Date().toISOString(),
    isRead: false,
  };

  // In production, this would persist to storage
  // For now, alerts are generated from mock data

  return newAlert;
}

/**
 * Get recent alerts (last N)
 */
export async function getRecentAlerts(limit: number = 5): Promise<StudentAlert[]> {
  const alerts = await getAlerts();
  return alerts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}
