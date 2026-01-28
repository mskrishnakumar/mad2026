import { NextResponse } from 'next/server';
import { getStudents } from '@/services/studentService';
import { getProgrammes } from '@/services/programmeService';
import { getJobs } from '@/services/jobService';
import { createStudent } from '@/services/studentTableService';
import { createProgramme } from '@/services/programmeTableService';
import { createJob } from '@/services/jobTableService';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const table = searchParams.get('table'); // 'students', 'programmes', 'jobs', or 'all'

  const results = {
    students: { seeded: 0, errors: 0 },
    programmes: { seeded: 0, errors: 0 },
    jobs: { seeded: 0, errors: 0 },
  };

  try {
    // Seed Students
    if (table === 'students' || table === 'all') {
      const students = await getStudents();
      for (const student of students) {
        try {
          await createStudent({
            id: student.id,
            name: student.name,
            age: student.age,
            gender: student.gender,
            school: student.school,
            grade: student.grade,
            contact_phone: student.contact_phone,
            contact_email: student.contact_email,
            education_level: student.education_level,
            status: student.status,
            skills: student.skills,
            aspirations: student.aspirations,
            enrolled_date: student.enrolled_date,
            counsellor_id: student.counsellor_id,
          });
          results.students.seeded++;
        } catch (error) {
          // Entity might already exist
          results.students.errors++;
        }
      }
    }

    // Seed Programmes
    if (table === 'programmes' || table === 'all') {
      const programmes = await getProgrammes();
      for (const programme of programmes) {
        try {
          await createProgramme(programme);
          results.programmes.seeded++;
        } catch (error) {
          results.programmes.errors++;
        }
      }
    }

    // Seed Jobs
    if (table === 'jobs' || table === 'all') {
      const jobs = await getJobs();
      for (const job of jobs) {
        try {
          await createJob(job);
          results.jobs.seeded++;
        } catch (error) {
          results.jobs.errors++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Seeding complete',
      results,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Seeding failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to seed tables',
    endpoints: [
      'POST /api/seed?table=all - Seed all tables',
      'POST /api/seed?table=students - Seed students table',
      'POST /api/seed?table=programmes - Seed programmes table',
      'POST /api/seed?table=jobs - Seed jobs table',
    ],
  });
}
