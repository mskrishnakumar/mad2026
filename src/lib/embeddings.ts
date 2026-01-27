import type { Embedding, SimilarityResult } from './types';

// ============================================
// EMBEDDING & VECTOR SEARCH UTILITIES
// Based on patterns from CareerAdvisor & ScholarshipFinder
// ============================================

/**
 * Calculate cosine similarity between two vectors
 * Returns value between -1 and 1 (1 = identical, 0 = orthogonal, -1 = opposite)
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  if (magnitude === 0) return 0;

  return dotProduct / magnitude;
}

/**
 * Find top K most similar items based on vector similarity
 */
export function findTopKSimilar(
  queryVector: number[],
  embeddings: Embedding[],
  k: number = 10,
  minScore: number = 0
): SimilarityResult[] {
  const similarities: SimilarityResult[] = embeddings.map((embedding) => ({
    id: embedding.id,
    score: cosineSimilarity(queryVector, embedding.vector),
  }));

  return similarities
    .filter((s) => s.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

/**
 * Build a map of ID to embedding for fast lookup
 */
export function buildEmbeddingMap(
  embeddings: Embedding[]
): Map<string, number[]> {
  return new Map(embeddings.map((e) => [e.id, e.vector]));
}

/**
 * Normalize a vector to unit length
 */
export function normalizeVector(vector: number[]): number[] {
  const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
  if (magnitude === 0) return vector;
  return vector.map((v) => v / magnitude);
}

/**
 * Average multiple vectors into one
 */
export function averageVectors(vectors: number[][]): number[] {
  if (vectors.length === 0) return [];
  const dim = vectors[0].length;
  const avg = new Array(dim).fill(0);

  for (const vec of vectors) {
    for (let i = 0; i < dim; i++) {
      avg[i] += vec[i];
    }
  }

  return avg.map((v) => v / vectors.length);
}

// ============================================
// EMBEDDING CACHE
// Simple in-memory cache with TTL
// ============================================

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class EmbeddingCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private ttlMs: number;

  constructor(ttlMinutes: number = 30) {
    this.ttlMs = ttlMinutes * 60 * 1000;
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: string, value: T): void {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs,
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

// Export a singleton cache for embeddings
export const embeddingCache = new EmbeddingCache<number[]>(30);

// ============================================
// EMBEDDING GENERATION HELPERS
// Use with your preferred embedding provider
// ============================================

/**
 * Generate cache key from text
 */
export function getEmbeddingCacheKey(text: string): string {
  // Simple hash function for cache key
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `emb_${hash}`;
}

/**
 * Batch texts for embedding generation
 * Most APIs have limits on batch size
 */
export function batchTextsForEmbedding(
  texts: string[],
  batchSize: number = 100
): string[][] {
  const batches: string[][] = [];
  for (let i = 0; i < texts.length; i += batchSize) {
    batches.push(texts.slice(i, i + batchSize));
  }
  return batches;
}
