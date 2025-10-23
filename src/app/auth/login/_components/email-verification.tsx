"use client";

import { BetterAuthActionButton } from "@/components/auth";
import { authClient } from "@/lib/auth/auth-client";
import { useEffect, useRef, useState } from "react";

export function EmailVerification({ email }: { email: string }) {
  const [timeToNextResend, setTimeToNextResend] = useState(30);
  const interval = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    startEmailVerificationCountdown();
  }, []);

  const startEmailVerificationCountdown = (time = 30) => {
    setTimeToNextResend(time);
    interval.current = setInterval(() => {
      setTimeToNextResend((prev) => {
        const newT = prev - 1;
        if (newT <= 0) {
          clearInterval(interval.current);
          return 0;
        }
        return newT;
      });
    }, 1000);
  };
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mt-2">
        A verification email has been sent to <strong>{email}</strong>. Please
        check your inbox and click the verification link to verify your email
        address.
      </p>
      <BetterAuthActionButton
        variant={"outline"}
        className="w-full"
        successMessage="Verification email sent!"
        disabled={timeToNextResend > 0}
        action={() => {
          startEmailVerificationCountdown();
          return authClient.sendVerificationEmail({
            email,
            callbackURL: "/",
          });
        }}
      >
        {timeToNextResend > 0
          ? `Resend verification email in ${timeToNextResend}s`
          : "Resend verification email"}
      </BetterAuthActionButton>
    </div>
  );
}
