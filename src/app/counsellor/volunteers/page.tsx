'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, CheckCircle, XCircle, Clock, Building2, Users, PhoneCall } from 'lucide-react';

// Mock data for demo
const mockVolunteers = [
  {
    id: 'VOL001',
    name: 'Amit Sharma',
    email: 'amit.sharma@barclays.com',
    phone: '+91-9876543210',
    organization: 'Barclays',
    supportTypes: ['mentor_post_placement', 'support_followups'],
    status: 'approved' as const,
    registrationDate: '15 Jan 2026',
    assignedStudents: 5,
  },
  {
    id: 'VOL002',
    name: 'Neha Gupta',
    email: 'neha.gupta@barclays.com',
    phone: '+91-9876543211',
    organization: 'Barclays',
    supportTypes: ['mentor_post_placement'],
    status: 'pending' as const,
    registrationDate: '25 Jan 2026',
    assignedStudents: 0,
  },
  {
    id: 'VOL003',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@infosys.com',
    phone: '+91-9876543212',
    organization: 'Infosys',
    supportTypes: ['support_followups'],
    status: 'approved' as const,
    registrationDate: '10 Jan 2026',
    assignedStudents: 3,
  },
  {
    id: 'VOL004',
    name: 'Sunita Reddy',
    email: 'sunita.reddy@tcs.com',
    phone: '+91-9876543213',
    organization: 'TCS',
    supportTypes: ['mentor_post_placement', 'support_followups'],
    status: 'pending' as const,
    registrationDate: '27 Jan 2026',
    assignedStudents: 0,
  },
];

const SUPPORT_TYPE_LABELS: Record<string, string> = {
  mentor_post_placement: 'Mentor',
  support_followups: 'Follow-ups',
};

export default function AdminVolunteersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [volunteers, setVolunteers] = useState(mockVolunteers);

  const filteredVolunteers = volunteers.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.organization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = volunteers.filter(v => v.status === 'pending').length;
  const approvedCount = volunteers.filter(v => v.status === 'approved').length;

  function handleApprove(volunteerId: string) {
    setVolunteers(prev =>
      prev.map(v =>
        v.id === volunteerId ? { ...v, status: 'approved' as const } : v
      )
    );
  }

  function handleReject(volunteerId: string) {
    setVolunteers(prev => prev.filter(v => v.id !== volunteerId));
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Volunteer Management</h1>
        <p className="text-muted-foreground">Manage volunteer applications and assignments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{volunteers.length}</p>
                <p className="text-sm text-muted-foreground">Total Volunteers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
                <p className="text-sm text-muted-foreground">Active Volunteers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or organization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('pending')}
            size="sm"
          >
            Pending ({pendingCount})
          </Button>
          <Button
            variant={statusFilter === 'approved' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('approved')}
            size="sm"
          >
            Approved ({approvedCount})
          </Button>
        </div>
      </div>

      {/* Volunteers List */}
      <div className="grid gap-4">
        {filteredVolunteers.map((volunteer) => (
          <Card key={volunteer.id} className={volunteer.status === 'pending' ? 'border-amber-200 bg-amber-50/30' : ''}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold flex-shrink-0">
                    {volunteer.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{volunteer.name}</h3>
                      <Badge variant={volunteer.status === 'approved' ? 'default' : 'secondary'}>
                        {volunteer.status === 'approved' ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approved
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </>
                        )}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Building2 className="h-4 w-4" />
                      <span>{volunteer.organization}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{volunteer.email}</span>
                      <span>{volunteer.phone}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {volunteer.supportTypes.map((type) => (
                        <span key={type} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                          {SUPPORT_TYPE_LABELS[type]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {volunteer.status === 'approved' && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{volunteer.assignedStudents} students</p>
                      <p className="text-xs text-muted-foreground">assigned</p>
                    </div>
                  )}

                  {volunteer.status === 'pending' ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(volunteer.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleReject(volunteer.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredVolunteers.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No volunteers found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
