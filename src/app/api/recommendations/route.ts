import { NextRequest, NextResponse } from 'next/server';
import {
  calculateHybridScore,
  rankRecommendations,
  createScoreBreakdown,
  DEFAULT_SCORING_CONFIG,
  type ScoringConfig,
} from '@/lib/scoring';

// ============================================
// RECOMMENDATIONS API ROUTE TEMPLATE
// Hybrid scoring: rule-based + semantic matching
// ============================================

interface RecommendationRequest {
  profile: Record<string, unknown>;
  quickMode?: boolean; // Skip semantic scoring for fast response
  config?: Partial<ScoringConfig>;
}

interface ScoredItem {
  id: string;
  name: string;
  score: number;
  scoreBreakdown: ReturnType<typeof createScoreBreakdown>;
  // Add your domain-specific fields
}

export async function POST(request: NextRequest) {
  try {
    const body: RecommendationRequest = await request.json();
    const { profile, quickMode = false, config } = body;

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile is required' },
        { status: 400 }
      );
    }

    const scoringConfig = { ...DEFAULT_SCORING_CONFIG, ...config };
    const startTime = Date.now();

    // Load your items (from DB, JSON, etc.)
    const items = await loadItems();

    // Score each item
    const scoredItems: ScoredItem[] = await Promise.all(
      items.map(async (item) => {
        // Calculate rule-based eligibility score
        const eligibilityScore = calculateEligibilityScore(profile, item);

        // Calculate semantic score (skip in quick mode)
        let semanticScore = 0;
        if (!quickMode) {
          semanticScore = await calculateSemanticScore(profile, item);
        }

        // Combine scores
        const score = quickMode
          ? eligibilityScore
          : calculateHybridScore(eligibilityScore, semanticScore, scoringConfig);

        return {
          id: item.id,
          name: item.name,
          score,
          scoreBreakdown: createScoreBreakdown(eligibilityScore, semanticScore),
        };
      })
    );

    // Rank and filter
    const recommendations = rankRecommendations(scoredItems, scoringConfig);

    return NextResponse.json({
      recommendations,
      meta: {
        total: items.length,
        returned: recommendations.length,
        mode: quickMode ? 'quick' : 'full',
        processingTimeMs: Date.now() - startTime,
      },
    });

  } catch (error) {
    console.error('Recommendations API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}

// GET endpoint for simple queries
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  // Return top items without personalization
  const items = await loadItems();
  const topItems = items.slice(0, limit);

  return NextResponse.json({ items: topItems });
}

// ============================================
// PLACEHOLDER FUNCTIONS - Implement for your domain
// ============================================

interface Item {
  id: string;
  name: string;
  description: string;
  // Add domain-specific fields
}

async function loadItems(): Promise<Item[]> {
  // TODO: Load from database, JSON file, or API
  // Example:
  // return await fetch('/api/items').then(r => r.json());
  // return JSON.parse(fs.readFileSync('./data/items.json', 'utf-8'));

  return [
    { id: '1', name: 'Sample Item 1', description: 'Description 1' },
    { id: '2', name: 'Sample Item 2', description: 'Description 2' },
  ];
}

function calculateEligibilityScore(
  profile: Record<string, unknown>,
  item: Item
): number {
  // TODO: Implement rule-based scoring
  // Example scoring criteria:
  // - Location match: +25 points
  // - Category match: +20 points
  // - Requirements met: +30 points
  // - Preferences match: +25 points

  let score = 50; // Base score

  // Add your domain-specific rules here
  // if (profile.location === item.location) score += 25;
  // if (profile.skills?.includes(item.requiredSkill)) score += 30;

  return Math.min(100, Math.max(0, score));
}

async function calculateSemanticScore(
  profile: Record<string, unknown>,
  item: Item
): Promise<number> {
  // TODO: Implement semantic similarity scoring
  // 1. Convert profile to text/embedding
  // 2. Compare with item embedding
  // 3. Return similarity score (0-100)

  // Placeholder - returns random score
  return Math.random() * 100;
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
