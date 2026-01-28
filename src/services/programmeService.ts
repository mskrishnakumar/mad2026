import { fetchData } from '@/lib/data-source';
import type { Programme, ProgrammeParsed } from '@/lib/types/data';

export async function getProgrammes(): Promise<ProgrammeParsed[]> {
  const rawProgrammes = await fetchData<Programme>('career_pathways.csv');

  return rawProgrammes.map(programme => ({
    ...programme,
    required_skills: programme.required_skills.split(',').map(s => s.trim()),
    duration_months: parseInt(programme.duration_months) || 0,
    employment_rate: parseInt(programme.employment_rate) || 0,
    avg_salary: parseInt(programme.avg_salary) || 0,
  }));
}

export async function getProgrammeById(id: string): Promise<ProgrammeParsed | null> {
  const programmes = await getProgrammes();
  return programmes.find(p => p.id === id) || null;
}

export async function getProgrammesByCategory(category: string): Promise<ProgrammeParsed[]> {
  const programmes = await getProgrammes();
  return programmes.filter(p => p.category === category);
}

export async function getCategories(): Promise<string[]> {
  const programmes = await getProgrammes();
  return [...new Set(programmes.map(p => p.category))];
}

export async function matchProgrammesForStudent(studentSkills: string[]): Promise<ProgrammeParsed[]> {
  const programmes = await getProgrammes();

  // Score programmes based on skill match
  const scored = programmes.map(programme => {
    const matchedSkills = programme.required_skills.filter(skill =>
      studentSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()) ||
                           skill.toLowerCase().includes(s.toLowerCase()))
    );
    const score = matchedSkills.length / programme.required_skills.length;
    return { programme, score, matchedSkills };
  });

  // Return sorted by match score
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.programme);
}
