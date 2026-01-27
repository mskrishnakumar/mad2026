// ============================================
// AZURE OPENAI CLIENT
// Based on patterns from CareerAdvisor & ScholarshipFinder
// ============================================

// For Azure OpenAI with AI SDK (streaming chat)
// npm install @ai-sdk/azure ai

// For Azure OpenAI with OpenAI SDK (embeddings, completions)
// npm install openai

/**
 * Environment variables needed:
 * - AZURE_OPENAI_API_KEY
 * - AZURE_OPENAI_ENDPOINT (e.g., https://your-resource.openai.azure.com)
 * - AZURE_OPENAI_DEPLOYMENT (e.g., gpt-4o)
 * - AZURE_OPENAI_EMBEDDING_DEPLOYMENT (e.g., text-embedding-3-small)
 * - AZURE_OPENAI_API_VERSION (e.g., 2024-08-01-preview)
 */

// ============================================
// OPTION 1: AI SDK (Recommended for chat with streaming)
// ============================================

/*
import { createAzure } from '@ai-sdk/azure';

export const azure = createAzure({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  resourceName: process.env.AZURE_OPENAI_RESOURCE_NAME, // or use baseURL
  // baseURL: process.env.AZURE_OPENAI_ENDPOINT,
});

export const chatModel = azure(process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o');

// Usage in API route:
// import { streamText } from 'ai';
// const result = await streamText({
//   model: chatModel,
//   messages: [...],
//   system: 'You are a helpful assistant.',
// });
// return result.toDataStreamResponse();
*/

// ============================================
// OPTION 2: OpenAI SDK (For embeddings and non-streaming)
// ============================================

/*
import { AzureOpenAI } from 'openai';

export const openaiClient = new AzureOpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-08-01-preview',
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT,
});

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openaiClient.embeddings.create({
    model: process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT || 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const response = await openaiClient.embeddings.create({
    model: process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT || 'text-embedding-3-small',
    input: texts,
  });
  return response.data.map((d) => d.embedding);
}

export async function chatCompletion(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const response = await openaiClient.chat.completions.create({
    model: process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o',
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 1000,
  });
  return response.choices[0]?.message?.content || '';
}
*/

// ============================================
// PLACEHOLDER EXPORTS
// Uncomment the appropriate section above based on your needs
// ============================================

export const OPENAI_CONFIG = {
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT,
  embeddingDeployment: process.env.AZURE_OPENAI_EMBEDDING_DEPLOYMENT,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION || '2024-08-01-preview',
};

// Validate config at startup
export function validateOpenAIConfig(): boolean {
  const required = ['apiKey', 'endpoint', 'deployment'];
  const missing = required.filter(
    (key) => !OPENAI_CONFIG[key as keyof typeof OPENAI_CONFIG]
  );

  if (missing.length > 0) {
    console.warn(`Missing OpenAI config: ${missing.join(', ')}`);
    return false;
  }
  return true;
}
