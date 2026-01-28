'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';

const mockNotifications = [
  {
    id: 1,
    type: 'success',
    title: 'Registration Approved',
    message: 'Your registration has been verified successfully. Welcome to Magic Bus!',
    date: '28 Jan 2026, 10:30 AM',
    read: false,
  },
  {
    id: 2,
    type: 'info',
    title: 'Programme Recommendation',
    message: 'Based on your profile, we recommend the "Digital Skills Foundation" programme.',
    date: '27 Jan 2026, 3:15 PM',
    read: false,
  },
  {
    id: 3,
    type: 'alert',
    title: 'Document Update Required',
    message: 'Please upload an updated address proof for your records.',
    date: '26 Jan 2026, 11:00 AM',
    read: true,
  },
  {
    id: 4,
    type: 'info',
    title: 'New Programme Available',
    message: 'A new "Customer Service Excellence" programme is now available at your centre.',
    date: '25 Jan 2026, 9:00 AM',
    read: true,
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'alert':
      return <AlertCircle className="h-5 w-5 text-amber-500" />;
    default:
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

export default function NotificationsPage() {
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your programme and registration status</p>
        </div>
        {unreadCount > 0 && (
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            {unreadCount} new
          </span>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Recent Notifications
          </CardTitle>
          <CardDescription>Your latest updates and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-colors ${
                  notification.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {getIcon(notification.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{notification.title}</h4>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{notification.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
