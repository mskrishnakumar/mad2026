import { getTableClient, TABLES, ProgrammeEntity } from '@/lib/azure-tables';
import type { ProgrammeParsed } from '@/lib/types/data';

function entityToProgramme(entity: ProgrammeEntity): ProgrammeParsed {
  return {
    id: entity.rowKey,
    name: entity.name,
    category: entity.partitionKey,
    description: entity.description,
    required_skills: JSON.parse(entity.requiredSkills || '[]'),
    education_level: entity.educationLevel,
    duration_months: entity.durationMonths,
    certification: entity.certification,
    employment_rate: entity.employmentRate,
    avg_salary: entity.avgSalary,
  };
}

function programmeToEntity(programme: ProgrammeParsed): ProgrammeEntity {
  return {
    partitionKey: programme.category,
    rowKey: programme.id,
    name: programme.name,
    description: programme.description,
    requiredSkills: JSON.stringify(programme.required_skills),
    educationLevel: programme.education_level,
    durationMonths: programme.duration_months,
    certification: programme.certification,
    employmentRate: programme.employment_rate,
    avgSalary: programme.avg_salary,
  };
}

export async function getAllProgrammes(): Promise<ProgrammeParsed[]> {
  const client = getTableClient(TABLES.PROGRAMMES);
  const programmes: ProgrammeParsed[] = [];

  const entities = client.listEntities<ProgrammeEntity>();

  for await (const entity of entities) {
    programmes.push(entityToProgramme(entity));
  }

  return programmes;
}

export async function getProgrammeById(category: string, id: string): Promise<ProgrammeParsed | null> {
  const client = getTableClient(TABLES.PROGRAMMES);

  try {
    const entity = await client.getEntity<ProgrammeEntity>(category, id);
    return entityToProgramme(entity);
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}

export async function createProgramme(programme: ProgrammeParsed): Promise<ProgrammeParsed> {
  const client = getTableClient(TABLES.PROGRAMMES);
  const entity = programmeToEntity(programme);

  await client.createEntity(entity);
  return programme;
}

export async function getCategories(): Promise<string[]> {
  const programmes = await getAllProgrammes();
  return [...new Set(programmes.map(p => p.category))];
}

export async function matchProgrammesForStudent(studentSkills: string[]): Promise<ProgrammeParsed[]> {
  const programmes = await getAllProgrammes();

  const scored = programmes.map(programme => {
    const matchedSkills = programme.required_skills.filter(skill =>
      studentSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()) ||
                           skill.toLowerCase().includes(s.toLowerCase()))
    );
    const score = matchedSkills.length / programme.required_skills.length;
    return { programme, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.programme);
}
