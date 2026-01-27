import type { Recommendation, ScoreBreakdown } from './types';

// ============================================
// HYBRID SCORING UTILITIES
// Combines rule-based eligibility with semantic matching
// Pattern used in both CareerAdvisor & ScholarshipFinder
// ============================================

export interface ScoringConfig {
  // Weight for rule-based eligibility score (0-1)
  eligibilityWeight: number;
  // Weight for semantic similarity score (0-1)
  semanticWeight: number;
  // Minimum score to include in recommendations
  minRecommendationScore: number;
  // Maximum number of recommendations to return
  maxRecommendations: number;
  // Threshold for "strong" semantic match
  strongSemanticMatch: number;
}

export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  eligibilityWeight: 0.6,
  semanticWeight: 0.4,
  minRecommendationScore: 40,
  maxRecommendations: 10,
  strongSemanticMatch: 60,
};

/**
 * Calculate hybrid score combining eligibility and semantic scores
 */
export function calculateHybridScore(
  eligibilityScore: number,
  semanticScore: number,
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): number {
  return (
    config.eligibilityWeight * eligibilityScore +
    config.semanticWeight * semanticScore
  );
}

/**
 * Normalize a score to 0-100 range
 */
export function normalizeScore(score: number, min: number, max: number): number {
  if (max === min) return 50;
  return Math.max(0, Math.min(100, ((score - min) / (max - min)) * 100));
}

/**
 * Sort and filter recommendations based on score
 */
export function rankRecommendations<T extends { score: number }>(
  items: T[],
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): T[] {
  return items
    .filter((item) => item.score >= config.minRecommendationScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, config.maxRecommendations);
}

/**
 * Create score breakdown for transparency
 */
export function createScoreBreakdown(
  eligibilityScore: number,
  semanticScore: number,
  additionalScores?: Record<string, number>
): ScoreBreakdown {
  return {
    eligibilityScore,
    semanticScore,
    ...additionalScores,
  };
}

// ============================================
// RULE-BASED SCORING HELPERS
// Customize these for your domain
// ============================================

/**
 * Score based on exact match
 */
export function exactMatchScore(
  userValue: string | undefined,
  targetValue: string | undefined,
  matchPoints: number = 100,
  noMatchPoints: number = 0
): number {
  if (!userValue || !targetValue) return noMatchPoints;
  return userValue.toLowerCase() === targetValue.toLowerCase()
    ? matchPoints
    : noMatchPoints;
}

/**
 * Score based on array overlap
 */
export function arrayOverlapScore(
  userArray: string[] | undefined,
  targetArray: string[] | undefined,
  maxPoints: number = 100
): number {
  if (!userArray?.length || !targetArray?.length) return 0;

  const userSet = new Set(userArray.map((s) => s.toLowerCase()));
  const matches = targetArray.filter((t) => userSet.has(t.toLowerCase()));

  return Math.round((matches.length / targetArray.length) * maxPoints);
}

/**
 * Score based on numeric range inclusion
 */
export function rangeInclusionScore(
  userValue: number | undefined,
  minValue: number | undefined,
  maxValue: number | undefined,
  matchPoints: number = 100,
  noMatchPoints: number = 0
): number {
  if (userValue === undefined) return noMatchPoints;

  const meetsMin = minValue === undefined || userValue >= minValue;
  const meetsMax = maxValue === undefined || userValue <= maxValue;

  return meetsMin && meetsMax ? matchPoints : noMatchPoints;
}

/**
 * Score based on threshold comparison
 */
export function thresholdScore(
  userValue: number | undefined,
  threshold: number,
  aboveThresholdPoints: number = 100,
  belowThresholdPoints: number = 0
): number {
  if (userValue === undefined) return belowThresholdPoints;
  return userValue >= threshold ? aboveThresholdPoints : belowThresholdPoints;
}

// ============================================
// QUICK MODE SCORING
// Rule-based only, no AI calls - for fast responses
// ============================================

export interface QuickModeResult<T> {
  recommendations: T[];
  mode: 'quick';
  processingTimeMs: number;
}

/**
 * Perform quick scoring without semantic analysis
 * Use when you need fast responses or as a fallback
 */
export function quickModeScoring<T extends { score: number }>(
  items: T[],
  scoreFunction: (item: T) => number,
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): QuickModeResult<T> {
  const startTime = Date.now();

  const scored = items.map((item) => ({
    ...item,
    score: scoreFunction(item),
  }));

  const recommendations = rankRecommendations(scored, config);

  return {
    recommendations,
    mode: 'quick',
    processingTimeMs: Date.now() - startTime,
  };
}
