"use client";

import { BetterAuthActionButton } from "@/components/auth";
import { authClient } from "@/lib/auth/auth-client";

export function SetPasswordButton({ email }: { email: string }) {
  return (
    <BetterAuthActionButton
      variant={"outline"}
      successMessage="Password reset email sent"
      action={() =>
        authClient.requestPasswordReset({
          email,
          redirectTo: "/auth/reset-password",
        })
      }
    >
      Send Password Reset Email
    </BetterAuthActionButton>
  );
}
