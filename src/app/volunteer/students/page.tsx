'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Building2, Calendar, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

// Mock data for demo
const mockStudents = [
  {
    id: 'STU001',
    name: 'Rahul Kumar',
    company: 'TCS',
    position: 'Junior Developer',
    placementDate: '15 Dec 2025',
    phone: '+91-9876543210',
    email: 'rahul.kumar@email.com',
    lastContact: '26 Jan 2026',
    status: 'On Track',
    activities: 5,
  },
  {
    id: 'STU002',
    name: 'Priya Singh',
    company: 'Infosys',
    position: 'Customer Support',
    placementDate: '20 Dec 2025',
    phone: '+91-9876543211',
    email: 'priya.singh@email.com',
    lastContact: '23 Jan 2026',
    status: 'Needs Attention',
    activities: 3,
  },
  {
    id: 'STU003',
    name: 'Amit Patel',
    company: 'Wipro',
    position: 'Technical Support',
    placementDate: '10 Jan 2026',
    phone: '+91-9876543212',
    email: 'amit.patel@email.com',
    lastContact: '21 Jan 2026',
    status: 'On Track',
    activities: 4,
  },
  {
    id: 'STU004',
    name: 'Sneha Reddy',
    company: 'HCL Technologies',
    position: 'Data Entry Operator',
    placementDate: '5 Jan 2026',
    phone: '+91-9876543213',
    email: 'sneha.reddy@email.com',
    lastContact: '20 Jan 2026',
    status: 'On Track',
    activities: 6,
  },
  {
    id: 'STU005',
    name: 'Vikram Sharma',
    company: 'Tech Mahindra',
    position: 'Junior Analyst',
    placementDate: '12 Jan 2026',
    phone: '+91-9876543214',
    email: 'vikram.sharma@email.com',
    lastContact: '18 Jan 2026',
    status: 'Needs Attention',
    activities: 2,
  },
];

export default function VolunteerStudentsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = mockStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
        <p className="text-muted-foreground">Students assigned to you for post-placement mentoring</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Students Grid */}
      <div className="grid gap-4">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold flex-shrink-0">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{student.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        student.status === 'On Track'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {student.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Building2 className="h-4 w-4" />
                      <span>{student.position} at {student.company}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Placed: {student.placementDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{student.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span>{student.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{student.activities} activities</p>
                    <p className="text-xs text-muted-foreground">Last: {student.lastContact}</p>
                  </div>
                  <Button asChild>
                    <Link href={`/volunteer/students/${student.id}`}>
                      View & Update
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredStudents.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No students found matching your search.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
