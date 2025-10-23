"use client";

import { BetterAuthActionButton } from "@/components/auth";
import { authClient } from "@/lib/auth/auth-client";
import {
  SUPPORTED_O_AUTH_PROVIDER_DETAILS,
  SUPPORTED_O_AUTH_PROVIDERS,
} from "@/lib/auth/o-auth-providers";

export function SocialAuthButtons() {
  return SUPPORTED_O_AUTH_PROVIDERS.map((provider) => {
    const Icon = SUPPORTED_O_AUTH_PROVIDER_DETAILS[provider].Icon;
    return (
      <BetterAuthActionButton
        variant={"outline"}
        key={provider}
        className="w-full"
        action={() =>
          authClient.signIn.social({
            provider,
            callbackURL: "/",
          })
        }
      >
        <Icon />
        {SUPPORTED_O_AUTH_PROVIDER_DETAILS[provider].name}
      </BetterAuthActionButton>
    );
  });
}
