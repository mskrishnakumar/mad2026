import { fetchData } from '@/lib/data-source';
import type { Student, StudentParsed } from '@/lib/types/data';

export async function getStudents(): Promise<StudentParsed[]> {
  const rawStudents = await fetchData<Student>('students.csv');

  return rawStudents.map(student => ({
    ...student,
    skills: student.skills.split(',').map(s => s.trim()),
    aspirations: student.aspirations.split(',').map(s => s.trim()),
  }));
}

export async function getStudentById(id: string): Promise<StudentParsed | null> {
  const students = await getStudents();
  return students.find(s => s.id === id) || null;
}

export async function getStudentsByStatus(status: Student['status']): Promise<StudentParsed[]> {
  const students = await getStudents();
  return students.filter(s => s.status === status);
}

export async function getStudentStats() {
  const students = await getStudents();

  return {
    total: students.length,
    active: students.filter(s => s.status === 'Active').length,
    matched: students.filter(s => s.status === 'Matched').length,
    placed: students.filter(s => s.status === 'Placed').length,
    onboarding: students.filter(s => s.status === 'Onboarding').length,
  };
}

export async function searchStudents(query: string): Promise<StudentParsed[]> {
  const students = await getStudents();
  const lowerQuery = query.toLowerCase();

  return students.filter(s =>
    s.name.toLowerCase().includes(lowerQuery) ||
    s.id.toLowerCase().includes(lowerQuery) ||
    s.education_level.toLowerCase().includes(lowerQuery)
  );
}
