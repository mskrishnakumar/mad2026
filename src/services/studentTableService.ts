import { getTableClient, TABLES, StudentEntity } from '@/lib/azure-tables';
import type { StudentParsed } from '@/lib/types/data';

const PARTITION_KEY = 'STUDENT';

function entityToStudent(entity: StudentEntity): StudentParsed {
  return {
    id: entity.rowKey,
    name: entity.name,
    age: entity.age.toString(),
    gender: entity.gender,
    school: entity.school,
    grade: entity.grade,
    contact_phone: entity.contactPhone,
    contact_email: entity.contactEmail,
    education_level: entity.educationLevel,
    status: entity.status as StudentParsed['status'],
    skills: JSON.parse(entity.skills || '[]'),
    aspirations: JSON.parse(entity.aspirations || '[]'),
    enrolled_date: entity.enrolledDate,
    counsellor_id: entity.counsellorId,
  };
}

function studentToEntity(student: Partial<StudentParsed> & { id: string }): StudentEntity {
  return {
    partitionKey: PARTITION_KEY,
    rowKey: student.id,
    name: student.name || '',
    age: parseInt(student.age || '0') || 0,
    gender: student.gender || '',
    school: student.school || '',
    grade: student.grade || '',
    contactPhone: student.contact_phone || '',
    contactEmail: student.contact_email || '',
    educationLevel: student.education_level || '',
    status: student.status || 'Onboarding',
    skills: JSON.stringify(student.skills || []),
    aspirations: JSON.stringify(student.aspirations || []),
    enrolledDate: student.enrolled_date || new Date().toISOString().split('T')[0],
    counsellorId: student.counsellor_id || 'COU001',
  };
}

export async function getAllStudents(): Promise<StudentParsed[]> {
  const client = getTableClient(TABLES.STUDENTS);
  const students: StudentParsed[] = [];

  const entities = client.listEntities<StudentEntity>({
    queryOptions: { filter: `PartitionKey eq '${PARTITION_KEY}'` }
  });

  for await (const entity of entities) {
    students.push(entityToStudent(entity));
  }

  return students;
}

export async function getStudentById(id: string): Promise<StudentParsed | null> {
  const client = getTableClient(TABLES.STUDENTS);

  try {
    const entity = await client.getEntity<StudentEntity>(PARTITION_KEY, id);
    return entityToStudent(entity);
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}

export async function createStudent(student: Partial<StudentParsed> & { id: string }): Promise<StudentParsed> {
  const client = getTableClient(TABLES.STUDENTS);
  const entity = studentToEntity(student);

  await client.createEntity(entity);
  return entityToStudent(entity);
}

export async function updateStudent(id: string, updates: Partial<StudentParsed>): Promise<StudentParsed | null> {
  const client = getTableClient(TABLES.STUDENTS);

  try {
    const existing = await client.getEntity<StudentEntity>(PARTITION_KEY, id);
    const updated = studentToEntity({ ...entityToStudent(existing), ...updates, id });

    await client.updateEntity(updated, 'Replace');
    return entityToStudent(updated);
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}

export async function deleteStudent(id: string): Promise<boolean> {
  const client = getTableClient(TABLES.STUDENTS);

  try {
    await client.deleteEntity(PARTITION_KEY, id);
    return true;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 404) {
      return false;
    }
    throw error;
  }
}

export async function searchStudents(query: string): Promise<StudentParsed[]> {
  const students = await getAllStudents();
  const lowerQuery = query.toLowerCase();

  return students.filter(s =>
    s.name.toLowerCase().includes(lowerQuery) ||
    s.id.toLowerCase().includes(lowerQuery) ||
    s.school.toLowerCase().includes(lowerQuery)
  );
}

export async function getStudentStats() {
  const students = await getAllStudents();

  return {
    total: students.length,
    active: students.filter(s => s.status === 'Active').length,
    matched: students.filter(s => s.status === 'Matched').length,
    placed: students.filter(s => s.status === 'Placed').length,
    onboarding: students.filter(s => s.status === 'Onboarding').length,
  };
}

export async function generateStudentId(): Promise<string> {
  const students = await getAllStudents();
  const maxId = students
    .map(s => parseInt(s.id.replace('STU', '')) || 0)
    .reduce((max, id) => Math.max(max, id), 0);

  return `STU${String(maxId + 1).padStart(3, '0')}`;
}
