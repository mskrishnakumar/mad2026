import { Container } from '@/components/layout/Container';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Container className="py-16">
        {/* Hero Skeleton */}
        <div className="text-center mb-16">
          <Skeleton className="h-12 w-48 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto mb-8" />
          <div className="flex gap-4 justify-center">
            <Skeleton className="h-11 w-32" />
            <Skeleton className="h-11 w-32" />
          </div>
        </div>

        {/* Features Grid Skeleton */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border bg-card p-6">
              <Skeleton className="h-10 w-10 mb-4" />
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48 mb-4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>

        {/* Card Skeleton */}
        <div className="max-w-2xl mx-auto rounded-xl border bg-card p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-24 w-full mb-4" />
          <Skeleton className="h-4 w-64" />
        </div>
      </Container>
    </main>
  );
}
