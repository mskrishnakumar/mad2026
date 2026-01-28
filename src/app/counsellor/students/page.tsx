'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Download, Users } from 'lucide-react';

// Placeholder student data
const students = [
  { id: 'STU001', name: 'Priya Sharma', school: 'Delhi Public School', grade: '10th', status: 'Active', skills: ['Communication', 'Computer Basics'] },
  { id: 'STU002', name: 'Rahul Kumar', school: 'Kendriya Vidyalaya', grade: '11th', status: 'Matched', skills: ['IT', 'English'] },
  { id: 'STU003', name: 'Anita Patel', school: 'St. Mary School', grade: '12th', status: 'Placed', skills: ['Healthcare', 'First Aid'] },
  { id: 'STU004', name: 'Vikram Singh', school: 'Government School', grade: '9th', status: 'Onboarding', skills: ['Mechanics', 'Drawing'] },
  { id: 'STU005', name: 'Meera Reddy', school: 'Modern Academy', grade: '10th', status: 'Active', skills: ['Retail', 'Customer Service'] },
];

const statusColors: Record<string, string> = {
  Active: 'bg-blue-100 text-blue-700',
  Matched: 'bg-green-100 text-green-700',
  Placed: 'bg-purple-100 text-purple-700',
  Onboarding: 'bg-amber-100 text-amber-700',
};

export default function StudentsPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-muted-foreground">View and manage all registered students</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search students..." className="pl-10" />
      </div>

      {/* Students Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">Student</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">School</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Grade</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Skills</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.id}</p>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{student.school}</td>
                    <td className="p-4 text-gray-600">{student.grade}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[student.status]}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1 flex-wrap">
                        {student.skills.slice(0, 2).map((skill) => (
                          <span key={skill} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                            {skill}
                          </span>
                        ))}
                        {student.skills.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                            +{student.skills.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination placeholder */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Showing 1-5 of 1,234 students</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
}
