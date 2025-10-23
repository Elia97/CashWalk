"use client";

import { BetterAuthActionButton } from "@/components/auth";
import { authClient } from "@/lib/auth/auth-client";

export function AccountDeletion() {
  return (
    <BetterAuthActionButton
      requireAreYouSure
      variant={"destructive"}
      className="w-full"
      successMessage="Account deletion initiated... Please check your email to confirm"
      action={() => authClient.deleteUser({ callbackURL: "/" })}
    >
      Delete Account Permanently
    </BetterAuthActionButton>
  );
}
