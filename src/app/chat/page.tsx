'use client';

import { ChatWindow } from '@/components/ChatWindow';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-background py-8">
      <Container size="md">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>

        <ChatWindow
          title="Chat Demo"
          placeholder="Ask me anything..."
          suggestions={[
            "What can you help me with?",
            "Tell me about this app",
            "How do recommendations work?",
          ]}
        />

        <p className="text-sm text-muted-foreground text-center mt-4">
          Configure your AI provider in <code className="bg-muted px-1 rounded">src/lib/openai.ts</code> to enable real responses.
        </p>
      </Container>
    </main>
  );
}
