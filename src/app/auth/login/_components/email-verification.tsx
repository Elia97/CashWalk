'use client';

import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button';
import { authClient } from '@/lib/auth/auth-client';
import { useCallback, useEffect, useRef, useState } from 'react';

export function EmailVerification({ email }: { email: string }) {
  const [timeToNextResend, setTimeToNextResend] = useState(30);
  const interval = useRef<NodeJS.Timeout>(undefined);

  const clearCountdown = useCallback(() => {
    if (interval.current) {
      clearInterval(interval.current);
      interval.current = undefined;
    }
  }, []);

  const startEmailVerificationCountdown = useCallback(
    (time = 30) => {
      clearCountdown();
      setTimeToNextResend(time);
      interval.current = setInterval(() => {
        setTimeToNextResend((prev) => {
          const next = prev - 1;
          if (next <= 0) {
            clearCountdown();
            return 0;
          }
          return next;
        });
      }, 1000);
    },
    [clearCountdown],
  );

  useEffect(() => {
    const startHandle = setTimeout(() => {
      startEmailVerificationCountdown();
    }, 0);

    return () => {
      clearTimeout(startHandle);
      clearCountdown();
    };
  }, [startEmailVerificationCountdown, clearCountdown]);

  const handleResend = useCallback(() => {
    startEmailVerificationCountdown();
    return authClient.sendVerificationEmail({
      email,
      callbackURL: '/',
    });
  }, [email, startEmailVerificationCountdown]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mt-2">
        A verification email has been sent to <strong>{email}</strong>. Please check your inbox and
        click the verification link to verify your email address.
      </p>
      <BetterAuthActionButton
        variant={'outline'}
        className="w-full"
        successMessage="Verification email sent!"
        disabled={timeToNextResend > 0}
        action={handleResend}
      >
        {timeToNextResend > 0
          ? `Resend verification email in ${timeToNextResend}s`
          : 'Resend verification email'}
      </BetterAuthActionButton>
    </div>
  );
}
