import type { StudentExtended, RiskScore, RiskFactors } from '@/lib/types/data';
import { calculateRiskScore, isAtRisk, THRESHOLDS } from '@/lib/utils/riskCalculator';
import { getMockStudents } from '@/lib/mockData/studentMockData';

/**
 * Get risk score for a specific student
 */
export async function getStudentRiskScore(studentId: string): Promise<RiskScore | null> {
  const students = getMockStudents();
  const student = students.find(s => s.id === studentId);

  if (!student) return null;

  return student.riskScore;
}

/**
 * Recalculate risk score for a student with updated factors
 */
export async function recalculateRiskScore(
  studentId: string,
  updatedFactors?: Partial<RiskFactors>
): Promise<RiskScore | null> {
  const students = getMockStudents();
  const student = students.find(s => s.id === studentId);

  if (!student) return null;

  const factors = updatedFactors
    ? { ...student.riskFactors, ...updatedFactors }
    : student.riskFactors;

  return calculateRiskScore(factors);
}

/**
 * Batch calculate risk scores for multiple students
 */
export async function batchCalculateRiskScores(
  studentIds: string[]
): Promise<Map<string, RiskScore>> {
  const students = getMockStudents();
  const results = new Map<string, RiskScore>();

  studentIds.forEach(id => {
    const student = students.find(s => s.id === id);
    if (student) {
      results.set(id, student.riskScore);
    }
  });

  return results;
}

/**
 * Get students ranked by risk score (highest first)
 */
export async function getStudentsRankedByRisk(limit?: number): Promise<StudentExtended[]> {
  const students = getMockStudents();
  const sorted = [...students].sort(
    (a, b) => b.riskScore.totalScore - a.riskScore.totalScore
  );

  return limit ? sorted.slice(0, limit) : sorted;
}

/**
 * Get high-risk students (score >= 70)
 */
export async function getHighRiskStudents(): Promise<StudentExtended[]> {
  const students = getMockStudents();
  return students.filter(s => isAtRisk(s.riskScore.totalScore));
}

/**
 * Get critical risk students (score >= 85)
 */
export async function getCriticalRiskStudents(): Promise<StudentExtended[]> {
  const students = getMockStudents();
  return students.filter(s => s.riskScore.totalScore >= THRESHOLDS.CRITICAL_MIN);
}

/**
 * Get risk score trends over time (mock implementation)
 * In production, this would query historical data
 */
export async function getRiskTrend(
  studentId: string,
  days: number = 30
): Promise<{ date: string; score: number }[]> {
  const students = getMockStudents();
  const student = students.find(s => s.id === studentId);

  if (!student) return [];

  // Generate mock trend data
  const trend: { date: string; score: number }[] = [];
  const currentScore = student.riskScore.totalScore;

  for (let i = days; i >= 0; i -= 7) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    // Add some variance to show trend
    const variance = Math.floor(Math.random() * 10) - 5;
    const score = Math.max(0, Math.min(100, currentScore + variance + (i / 5)));

    trend.push({
      date: date.toISOString().split('T')[0],
      score: Math.round(score),
    });
  }

  return trend;
}

/**
 * Get risk factor analysis for a student
 * Returns which factors contribute most to their risk
 */
export async function getRiskFactorAnalysis(studentId: string): Promise<{
  topFactors: { factor: string; contribution: number; description: string }[];
  recommendations: string[];
} | null> {
  const students = getMockStudents();
  const student = students.find(s => s.id === studentId);

  if (!student) return null;

  const { breakdown } = student.riskScore;

  const factors = [
    {
      factor: 'Attendance',
      contribution: breakdown.attendanceRisk,
      description: 'First week attendance was low',
    },
    {
      factor: 'Distance',
      contribution: breakdown.distanceRisk,
      description: 'Student lives far from the centre',
    },
    {
      factor: 'First Generation',
      contribution: breakdown.firstGenRisk,
      description: 'First in family to pursue higher education',
    },
    {
      factor: 'Connectivity',
      contribution: breakdown.connectivityRisk,
      description: 'Limited access to internet or mobile',
    },
    {
      factor: 'Engagement',
      contribution: breakdown.engagementRisk,
      description: 'Low digital platform engagement',
    },
    {
      factor: 'Reachability',
      contribution: breakdown.contactRisk,
      description: 'Difficult to reach by counsellor',
    },
  ];

  // Sort by contribution (highest first)
  const topFactors = factors
    .filter(f => f.contribution > 0)
    .sort((a, b) => b.contribution - a.contribution);

  // Generate recommendations based on top factors
  const recommendations: string[] = [];

  if (breakdown.attendanceRisk > 10) {
    recommendations.push('Schedule a one-on-one meeting to discuss attendance challenges');
  }
  if (breakdown.distanceRisk > 8) {
    recommendations.push('Explore transportation support or nearby alternative centres');
  }
  if (breakdown.connectivityRisk > 10) {
    recommendations.push('Provide offline learning materials or schedule in-centre study time');
  }
  if (breakdown.engagementRisk > 8) {
    recommendations.push('Send engagement reminders via SMS or WhatsApp');
  }
  if (breakdown.contactRisk > 5) {
    recommendations.push('Try alternative contact methods (family member, home visit)');
  }

  return {
    topFactors,
    recommendations,
  };
}
