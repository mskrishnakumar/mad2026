import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/layout/Container';
import { MessageSquare, Sparkles, Zap, Palette } from 'lucide-react';
import Link from 'next/link';
import { ThemePicker } from '@/components/ThemePicker';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Container className="py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            MAD2026
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Your hackathon starter is ready. Edit this page to build something awesome.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/chat">Try Chat Demo</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/api/health">Check API</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <MessageSquare className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Chat Ready</CardTitle>
              <CardDescription>
                Pre-built chat component with streaming support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Connect to Azure OpenAI or any LLM provider. RAG pattern included.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Sparkles className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Smart Recommendations</CardTitle>
              <CardDescription>
                Hybrid scoring with rule-based + semantic matching
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Personalized results using embeddings and eligibility rules.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 mb-2 text-primary" />
              <CardTitle>Quick Mode</CardTitle>
              <CardDescription>
                Fast fallback when you need speed over accuracy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Skip AI calls for instant responses during development.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Color Palette Picker */}
        <Card className="max-w-2xl mx-auto mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <CardTitle>Choose Your Color Palette</CardTitle>
            </div>
            <CardDescription>
              Select a color theme for your project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ThemePicker />
          </CardContent>
        </Card>

        {/* Quick Start */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-muted p-4 font-mono text-sm">
              <p className="text-muted-foreground"># Configure your environment</p>
              <p>cp .env.example .env.local</p>
              <p className="text-muted-foreground mt-2"># Edit src/app/page.tsx to customize</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Check <code className="bg-muted px-1 rounded">README.md</code> for full documentation.
            </p>
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
