'use client';

import { useEffect, useState } from 'react';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

const REDIRECT_SECONDS = 3;

export function UserNotAuthenticated() {
  const [seconds, setSeconds] = useState(REDIRECT_SECONDS);
  const [redirectRequested, setRedirectRequested] = useState(false);
  const router = useRouter();
  const animateOut = redirectRequested || seconds === 0;

  useEffect(() => {
    if (animateOut) return;
    const interval = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : s));
    }, 1000);
    return () => clearInterval(interval);
  }, [animateOut]);

  return (
    <section
      className={animateOut ? 'animate-jump-out' : 'animate-fade-up'}
      onAnimationEnd={() => animateOut && router.push('/auth/login')}
    >
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Lock />
          </EmptyMedia>
          <EmptyTitle>Hey there!</EmptyTitle>
          <EmptyDescription>
            You&apos;ll need to log in to see your financial data.
            <br />
            Redirecting in <span className="font-mono">{seconds}</span> second
            {seconds !== 1 ? 's' : ''}...
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            variant="link"
            size="sm"
            className="text-xs"
            onClick={() => {
              setRedirectRequested(true);
            }}
          >
            Not redirected? Click here
          </Button>
        </EmptyContent>
      </Empty>
    </section>
  );
}
