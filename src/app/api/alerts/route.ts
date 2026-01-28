import { NextResponse } from 'next/server';
import * as alertService from '@/services/alertService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const unread = searchParams.get('unread');
  const studentId = searchParams.get('studentId');
  const counts = searchParams.get('counts');
  const limit = searchParams.get('limit');

  try {
    // Get alert counts summary
    if (counts === 'true') {
      const alertCounts = await alertService.getAlertCounts();
      return NextResponse.json(alertCounts);
    }

    // Get alerts for specific student
    if (studentId) {
      const studentAlerts = await alertService.getAlertsForStudent(studentId);
      return NextResponse.json(studentAlerts);
    }

    // Get unread alerts only
    if (unread === 'true') {
      const unreadAlerts = await alertService.getUnreadAlerts();
      return NextResponse.json(unreadAlerts);
    }

    // Get recent alerts with limit
    if (limit) {
      const limitNum = parseInt(limit, 10);
      const recentAlerts = await alertService.getRecentAlerts(limitNum);
      return NextResponse.json(recentAlerts);
    }

    // Default: return all alerts
    const alerts = await alertService.getAlerts();
    return NextResponse.json(alerts);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch alerts';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { alertId, markAllRead } = body;

    if (markAllRead) {
      await alertService.markAllAlertsAsRead();
      return NextResponse.json({ success: true, message: 'All alerts marked as read' });
    }

    if (alertId) {
      const success = await alertService.markAlertAsRead(alertId);
      return NextResponse.json({ success, alertId });
    }

    return NextResponse.json(
      { error: 'Missing alertId or markAllRead parameter' },
      { status: 400 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update alert';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
