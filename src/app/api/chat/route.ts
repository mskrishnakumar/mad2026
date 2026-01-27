import { NextRequest, NextResponse } from 'next/server';

// ============================================
// CHAT API ROUTE TEMPLATE
// Supports both streaming (AI SDK) and non-streaming responses
// ============================================

// For streaming with AI SDK, uncomment:
// import { streamText } from 'ai';
// import { createAzure } from '@ai-sdk/azure';

// const azure = createAzure({
//   apiKey: process.env.AZURE_OPENAI_API_KEY,
//   resourceName: process.env.AZURE_OPENAI_RESOURCE_NAME,
// });

interface ChatRequest {
  message: string;
  context?: {
    userProfile?: Record<string, unknown>;
    conversationHistory?: Array<{ role: string; content: string }>;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, context } = body;

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // ============================================
    // OPTION 1: Streaming Response (Recommended for chat)
    // ============================================
    /*
    const systemPrompt = buildSystemPrompt(context);

    const result = await streamText({
      model: azure(process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o'),
      system: systemPrompt,
      messages: [
        ...(context?.conversationHistory || []),
        { role: 'user', content: message },
      ],
    });

    return result.toDataStreamResponse();
    */

    // ============================================
    // OPTION 2: Non-streaming Response (Simpler)
    // ============================================

    // Placeholder response - replace with actual AI call
    const response = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `This is a placeholder response to: "${message}". Configure your AI provider in src/lib/openai.ts and update this route.`,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}

// ============================================
// HELPER: Build system prompt with context (RAG pattern)
// ============================================
function buildSystemPrompt(context?: ChatRequest['context']): string {
  let prompt = `You are a helpful assistant. Be concise and helpful.`;

  // Add user context if available
  if (context?.userProfile) {
    prompt += `\n\nUser context:\n${JSON.stringify(context.userProfile, null, 2)}`;
  }

  // Add relevant items/data for RAG
  // const relevantItems = await searchRelevantItems(query);
  // prompt += `\n\nRelevant information:\n${formatItems(relevantItems)}`;

  return prompt;
}

// Handle OPTIONS for CORS (if needed)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
