'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, GraduationCap, Loader2, CheckCircle, Clock, IndianRupee, TrendingUp, User } from 'lucide-react';
import type { StudentParsed } from '@/lib/types/data';
import type { ProgrammeParsed } from '@/lib/types/data';

export default function ProgrammeMatchingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<StudentParsed[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentParsed | null>(null);
  const [programmes, setProgrammes] = useState<ProgrammeParsed[]>([]);
  const [searching, setSearching] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSelectedStudent(null);
    setProgrammes([]);

    try {
      const response = await fetch(`/api/students?search=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  }

  async function selectStudent(student: StudentParsed) {
    setSelectedStudent(student);
    setStudents([]);
    setLoadingMatches(true);

    try {
      const skillsParam = student.skills.join(',');
      const response = await fetch(`/api/programmes?skills=${encodeURIComponent(skillsParam)}`);
      if (response.ok) {
        const data = await response.json();
        setProgrammes(data);
      }
    } catch (error) {
      console.error('Failed to fetch matches:', error);
    } finally {
      setLoadingMatches(false);
    }
  }

  function calculateMatchScore(programme: ProgrammeParsed, studentSkills: string[]): number {
    const matchedSkills = programme.required_skills.filter(skill =>
      studentSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()) ||
                           skill.toLowerCase().includes(s.toLowerCase()))
    );
    return Math.round((matchedSkills.length / programme.required_skills.length) * 100);
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Programme Matching</h1>
        <p className="text-muted-foreground">Match students to suitable training programmes</p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Find a Student</CardTitle>
          <CardDescription>Search for a student to view programme recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or student code..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={searching}>
              {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
            </Button>
          </form>

          {/* Search Results */}
          {students.length > 0 && (
            <div className="mt-4 border rounded-lg divide-y">
              {students.map((student) => (
                <button
                  key={student.id}
                  onClick={() => selectStudent(student)}
                  className="w-full p-4 text-left hover:bg-muted/50 transition-colors flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.id} • {student.school}</p>
                  </div>
                  <div className="flex gap-1">
                    {student.skills.slice(0, 2).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Student Profile */}
      {selectedStudent && (
        <Card className="border-teal-200 bg-teal-50/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-teal-500 rounded-xl flex items-center justify-center">
                <User className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{selectedStudent.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedStudent.id} • {selectedStudent.school} • {selectedStudent.grade}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedStudent.skills.map((skill) => (
                    <Badge key={skill} className="bg-teal-100 text-teal-700 hover:bg-teal-200">{skill}</Badge>
                  ))}
                </div>
                <div className="mt-3">
                  <p className="text-sm text-muted-foreground">Aspirations: {selectedStudent.aspirations.join(', ')}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedStudent(null)}>
                Change Student
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loadingMatches && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          <span className="ml-3 text-muted-foreground">Finding best programme matches...</span>
        </div>
      )}

      {/* Programme Recommendations */}
      {selectedStudent && !loadingMatches && programmes.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Recommended Programmes ({programmes.length})</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {programmes.map((programme) => {
              const matchScore = calculateMatchScore(programme, selectedStudent.skills);
              return (
                <Card key={programme.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{programme.name}</h3>
                        <p className="text-sm text-muted-foreground">{programme.category}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        matchScore >= 75 ? 'bg-green-100 text-green-700' :
                        matchScore >= 50 ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {matchScore}% Match
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{programme.description}</p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{programme.duration_months} months</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span>{programme.employment_rate}% placement</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        <span>₹{programme.avg_salary.toLocaleString()}/mo avg</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        <span>{programme.certification === 'Yes' ? 'Certified' : 'No cert'}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {programme.required_skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className={selectedStudent.skills.some(s =>
                            s.toLowerCase().includes(skill.toLowerCase()) ||
                            skill.toLowerCase().includes(s.toLowerCase())
                          ) ? 'border-green-300 bg-green-50 text-green-700' : ''}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <Button className="w-full">Assign Programme</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedStudent && students.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Select a Student</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Search and select a student above to see AI-powered programme recommendations based on their skills and aspirations
            </p>
          </CardContent>
        </Card>
      )}

      {/* No Matches */}
      {selectedStudent && !loadingMatches && programmes.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
              <GraduationCap className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Matching Programmes</h3>
            <p className="text-muted-foreground text-center max-w-md">
              No programmes match this student's current skill set. Consider onboarding them to build foundational skills first.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
