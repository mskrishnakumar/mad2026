import type {
  StudentExtended,
  DashboardStatsExtended,
  PipelineStage,
} from '@/lib/types/data';
import {
  getMockStudents,
  getPipelineDistribution,
  getRiskDistribution,
  getEngagementChannelStats,
  getReferralSourceStats,
} from '@/lib/mockData/studentMockData';
import { THRESHOLDS } from '@/lib/utils/riskCalculator';

/**
 * Get extended dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStatsExtended> {
  const students = getMockStudents();

  const byPipelineStage = getPipelineDistribution(students);
  const byRiskLevel = getRiskDistribution(students);

  const atRiskCount = students.filter(
    s => s.riskScore.totalScore >= THRESHOLDS.HIGH_RISK_SCORE
  ).length;

  const placedCount = students.filter(
    s => s.pipelineStage === 'Post Placement'
  ).length;

  const placementRate = students.length > 0
    ? Math.round((placedCount / students.length) * 100)
    : 0;

  // Count active alerts (unread alerts for high-risk students)
  const activeAlerts = students.filter(
    s => s.riskScore.totalScore >= THRESHOLDS.HIGH_RISK_SCORE
  ).length;

  // Calculate engagement channel statistics
  const byEngagementChannel = getEngagementChannelStats(students);

  // Calculate referral source statistics
  const byReferralSource = getReferralSourceStats(students);

  return {
    total: students.length,
    byPipelineStage,
    byRiskLevel,
    atRiskCount,
    activeAlerts,
    placementRate,
    byEngagementChannel,
    byReferralSource,
  };
}

/**
 * Get all extended students with risk scores
 */
export async function getExtendedStudents(): Promise<StudentExtended[]> {
  return getMockStudents();
}

/**
 * Get students filtered by pipeline stage
 */
export async function getStudentsByPipelineStage(
  stage: PipelineStage
): Promise<StudentExtended[]> {
  const students = getMockStudents();
  return students.filter(s => s.pipelineStage === stage);
}

/**
 * Get at-risk students (score >= 70)
 */
export async function getAtRiskStudents(limit?: number): Promise<StudentExtended[]> {
  const students = getMockStudents();
  const atRisk = students
    .filter(s => s.riskScore.totalScore >= THRESHOLDS.HIGH_RISK_SCORE)
    .sort((a, b) => b.riskScore.totalScore - a.riskScore.totalScore);

  return limit ? atRisk.slice(0, limit) : atRisk;
}

/**
 * Get a single student by ID
 */
export async function getStudentById(id: string): Promise<StudentExtended | null> {
  const students = getMockStudents();
  return students.find(s => s.id === id) || null;
}

/**
 * Search students by name
 */
export async function searchStudents(query: string): Promise<StudentExtended[]> {
  const students = getMockStudents();
  const lowerQuery = query.toLowerCase();
  return students.filter(s =>
    s.name.toLowerCase().includes(lowerQuery) ||
    s.id.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get pipeline stage progress summary
 */
export async function getPipelineProgress(): Promise<{
  stages: { stage: PipelineStage; count: number; percentage: number }[];
  totalStudents: number;
}> {
  const students = getMockStudents();
  const distribution = getPipelineDistribution(students);
  const total = students.length;

  const stages = (Object.keys(distribution) as PipelineStage[]).map(stage => ({
    stage,
    count: distribution[stage],
    percentage: total > 0 ? Math.round((distribution[stage] / total) * 100) : 0,
  }));

  return {
    stages,
    totalStudents: total,
  };
}
