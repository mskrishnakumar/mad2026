'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, UserCheck, Building2, GraduationCap, Users, CheckCircle, Loader2 } from 'lucide-react';

// Type for placed student with optional mentor
interface PlacedStudent {
  id: string;
  name: string;
  company: string;
  position: string;
  placementDate: string;
  mentorId: string | null;
  mentorName: string | null;
}

// Mock data
const mockPlacedStudents: PlacedStudent[] = [
  { id: 'STU001', name: 'Rahul Kumar', company: 'TCS', position: 'Junior Developer', placementDate: '15 Dec 2025', mentorId: 'VOL001', mentorName: 'Amit Sharma' },
  { id: 'STU002', name: 'Priya Singh', company: 'Infosys', position: 'Customer Support', placementDate: '20 Dec 2025', mentorId: 'VOL001', mentorName: 'Amit Sharma' },
  { id: 'STU003', name: 'Amit Patel', company: 'Wipro', position: 'Technical Support', placementDate: '10 Jan 2026', mentorId: null, mentorName: null },
  { id: 'STU004', name: 'Sneha Reddy', company: 'HCL Technologies', position: 'Data Entry', placementDate: '5 Jan 2026', mentorId: null, mentorName: null },
  { id: 'STU005', name: 'Vikram Sharma', company: 'Tech Mahindra', position: 'Junior Analyst', placementDate: '12 Jan 2026', mentorId: 'VOL003', mentorName: 'Rajesh Kumar' },
  { id: 'STU006', name: 'Kavitha Nair', company: 'Cognizant', position: 'Software Trainee', placementDate: '18 Jan 2026', mentorId: null, mentorName: null },
];

const mockApprovedVolunteers = [
  { id: 'VOL001', name: 'Amit Sharma', organization: 'Barclays', assignedCount: 2 },
  { id: 'VOL003', name: 'Rajesh Kumar', organization: 'Infosys', assignedCount: 1 },
  { id: 'VOL005', name: 'Meera Patel', organization: 'Barclays', assignedCount: 0 },
];

export default function MentorAssignmentPage() {
  const [students, setStudents] = useState(mockPlacedStudents);
  const [volunteers] = useState(mockApprovedVolunteers);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'assigned' | 'unassigned'>('all');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<PlacedStudent | null>(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);

  const unassignedCount = students.filter(s => !s.mentorId).length;
  const assignedCount = students.filter(s => s.mentorId).length;

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'assigned' && s.mentorId) ||
      (filterStatus === 'unassigned' && !s.mentorId);
    return matchesSearch && matchesFilter;
  });

  function openAssignDialog(student: typeof mockPlacedStudents[0]) {
    setSelectedStudent(student);
    setSelectedVolunteer('');
    setIsDialogOpen(true);
  }

  async function handleAssign() {
    if (!selectedStudent || !selectedVolunteer) return;

    setIsAssigning(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const volunteer = volunteers.find(v => v.id === selectedVolunteer);

    setStudents(prev =>
      prev.map(s =>
        s.id === selectedStudent.id
          ? { ...s, mentorId: selectedVolunteer, mentorName: volunteer?.name || null }
          : s
      )
    );

    setIsAssigning(false);
    setIsDialogOpen(false);
    setSelectedStudent(null);
    setSelectedVolunteer('');
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mentor Assignment</h1>
        <p className="text-muted-foreground">Assign volunteers as mentors to placed students</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                <p className="text-sm text-muted-foreground">Placed Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{unassignedCount}</p>
                <p className="text-sm text-muted-foreground">Need Mentor</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{assignedCount}</p>
                <p className="text-sm text-muted-foreground">Mentor Assigned</p>
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
            placeholder="Search by student name or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('all')}
            size="sm"
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'unassigned' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('unassigned')}
            size="sm"
          >
            Unassigned ({unassignedCount})
          </Button>
          <Button
            variant={filterStatus === 'assigned' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('assigned')}
            size="sm"
          >
            Assigned ({assignedCount})
          </Button>
        </div>
      </div>

      {/* Students List */}
      <div className="grid gap-4">
        {filteredStudents.map((student) => (
          <Card key={student.id} className={!student.mentorId ? 'border-amber-200 bg-amber-50/30' : ''}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold flex-shrink-0">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{student.name}</h3>
                      {student.mentorId ? (
                        <Badge className="bg-green-100 text-green-700">
                          <UserCheck className="h-3 w-3 mr-1" />
                          Mentor Assigned
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                          Needs Mentor
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Building2 className="h-4 w-4" />
                      <span>{student.position} at {student.company}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Placed on {student.placementDate}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {student.mentorId && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{student.mentorName}</p>
                      <p className="text-xs text-muted-foreground">Current Mentor</p>
                    </div>
                  )}

                  <Button
                    size="sm"
                    variant={student.mentorId ? 'outline' : 'default'}
                    onClick={() => openAssignDialog(student)}
                  >
                    <UserCheck className="h-4 w-4 mr-1" />
                    {student.mentorId ? 'Change Mentor' : 'Assign Mentor'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredStudents.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No students found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Assignment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Mentor</DialogTitle>
            <DialogDescription>
              Select a volunteer to mentor {selectedStudent?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Select Volunteer</label>
            <div className="space-y-2">
              {volunteers.map((volunteer) => (
                <button
                  key={volunteer.id}
                  onClick={() => setSelectedVolunteer(volunteer.id)}
                  className={`
                    w-full p-4 rounded-lg border-2 text-left transition-all
                    ${selectedVolunteer === volunteer.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{volunteer.name}</p>
                      <p className="text-sm text-muted-foreground">{volunteer.organization}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{volunteer.assignedCount} students</p>
                      {selectedVolunteer === volunteer.id && (
                        <CheckCircle className="h-5 w-5 text-purple-500 mt-1 ml-auto" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!selectedVolunteer || isAssigning}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isAssigning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Assign Mentor
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
