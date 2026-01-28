import type { RiskFactors, RiskScore, RiskScoreBreakdown } from '@/lib/types/data';

// Research-backed weight constants for dropout risk prediction
// Based on educational research (Chies et al. 2014, Tinto's Student Integration Model)
export const WEIGHTS = {
  ATTENDANCE: 25,        // First week attendance - strongest predictor
  CONNECTIVITY: 20,      // Internet + Mobile access - digital divide
  DISTANCE: 15,          // Distance from center - geographic barriers
  FIRST_GEN: 10,         // First generation graduate - family support gaps
  ENGAGEMENT: 10,        // Login attempts - digital engagement
  CONTACT: 10,           // Counsellor contact attempts - student unresponsive
  QUIZ: 10,              // Quiz score - academic performance indicator
} as const;

// Risk thresholds for categorization
export const THRESHOLDS = {
  LOW_MAX: 39,           // 0-39 = Low risk
  MEDIUM_MAX: 64,        // 40-64 = Medium risk
  HIGH_MAX: 84,          // 65-84 = High risk (red flag)
  CRITICAL_MIN: 85,      // 85-100 = Critical risk
  HIGH_RISK_SCORE: 65,   // Alert threshold
  MAX_DISTANCE_KM: 10,   // Distance beyond which max risk applies (10km is high enough to dropout)
  MIN_LOGINS_EXPECTED: 10,  // Expected logins per 30 days
  MAX_CONTACT_ATTEMPTS: 5,  // Contact attempts before max concern (student unresponsive)
  LOW_QUIZ_SCORE: 40,    // Quiz score below this = high risk
} as const;

/**
 * Calculate connectivity risk based on internet and mobile access
 * Max 20 points (WEIGHTS.CONNECTIVITY)
 */
function calculateConnectivityRisk(factors: RiskFactors): number {
  let risk = 0;

  // No internet = 10 points risk
  if (!factors.hasInternet) {
    risk += 10;
  }

  // Mobile access assessment
  if (!factors.hasMobile) {
    // No mobile = 10 points risk
    risk += 10;
  } else if (factors.mobileType === 'basic') {
    // Basic phone = 5 points risk (limited functionality)
    risk += 5;
  }
  // Smartphone = 0 points risk

  return Math.min(risk, WEIGHTS.CONNECTIVITY);
}

/**
 * Calculate detailed breakdown of risk score components
 */
function calculateBreakdown(factors: RiskFactors): RiskScoreBreakdown {
  return {
    // Attendance: 0% attendance = 25 points, 100% attendance = 0 points
    attendanceRisk: Math.round(
      WEIGHTS.ATTENDANCE * (1 - factors.firstWeekAttendance / 100)
    ),

    // Distance: 0km = 0 points, 10km+ = 15 points (linear scale)
    distanceRisk: Math.round(
      WEIGHTS.DISTANCE * Math.min(factors.distanceFromCentreKm / THRESHOLDS.MAX_DISTANCE_KM, 1)
    ),

    // First Generation: yes = 10 points, no = 0 points
    firstGenRisk: factors.isFirstGenGraduate ? WEIGHTS.FIRST_GEN : 0,

    // Connectivity: Combined internet + mobile scoring (max 20 points)
    connectivityRisk: calculateConnectivityRisk(factors),

    // Engagement: fewer logins = higher risk
    // 0 logins = 10 points, 10+ logins = 0 points
    engagementRisk: Math.round(
      WEIGHTS.ENGAGEMENT * Math.max(0, 1 - factors.loginAttempts / THRESHOLDS.MIN_LOGINS_EXPECTED)
    ),

    // Contact attempts: more attempts needed = higher risk (student unresponsive)
    // 0 attempts = 0 points (easily reachable), 5+ attempts = 10 points
    contactRisk: Math.round(
      WEIGHTS.CONTACT * Math.min(factors.counsellorContactAttempts / THRESHOLDS.MAX_CONTACT_ATTEMPTS, 1)
    ),

    // Quiz score: below 40% = high risk, linear scale from 0-40%
    // 0% quiz = 10 points, 40%+ quiz = 0 points
    quizRisk: Math.round(
      WEIGHTS.QUIZ * Math.max(0, 1 - factors.quizScore / THRESHOLDS.LOW_QUIZ_SCORE)
    ),
  };
}

/**
 * Determine risk level based on total score
 */
function getRiskLevel(score: number): RiskScore['riskLevel'] {
  if (score >= THRESHOLDS.CRITICAL_MIN) return 'critical';
  if (score >= THRESHOLDS.HIGH_RISK_SCORE) return 'high';
  if (score > THRESHOLDS.LOW_MAX) return 'medium';
  return 'low';
}

/**
 * Calculate complete risk score from risk factors
 * @param factors - The student's risk factors
 * @returns Complete risk score with breakdown and level
 */
export function calculateRiskScore(factors: RiskFactors): RiskScore {
  const breakdown = calculateBreakdown(factors);
  const totalScore = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

  return {
    totalScore: Math.min(100, Math.round(totalScore)),
    riskLevel: getRiskLevel(totalScore),
    breakdown,
    lastCalculated: new Date().toISOString(),
  };
}

/**
 * Check if a student is considered at-risk based on score
 * @param score - The risk score (0-100)
 * @returns true if score exceeds high risk threshold (65)
 */
export function isAtRisk(score: number): boolean {
  return score >= THRESHOLDS.HIGH_RISK_SCORE;
}

/**
 * Get color class for risk level display
 */
export function getRiskLevelColor(level: RiskScore['riskLevel']): {
  bg: string;
  text: string;
  border: string;
} {
  const colors = {
    low: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
    medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
    high: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
    critical: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
  };
  return colors[level];
}

/**
 * Get human-readable label for risk level
 */
export function getRiskLevelLabel(level: RiskScore['riskLevel']): string {
  const labels = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk',
    critical: 'Critical',
  };
  return labels[level];
}
