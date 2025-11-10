import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

export function LoadingSuspense({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Loader2 className="size-20 animate-spin" />}>{children}</Suspense>;
}
