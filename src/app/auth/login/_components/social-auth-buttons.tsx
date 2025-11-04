"use client";

import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";
import { ButtonGroup } from "@/components/ui/button-group";
import { authClient } from "@/lib/auth/auth-client";
import {
  SUPPORTED_O_AUTH_PROVIDER_DETAILS,
  SUPPORTED_O_AUTH_PROVIDERS,
} from "@/lib/auth/o-auth-providers";

export function SocialAuthButtons() {
  return (
    <ButtonGroup className="w-full">
      {SUPPORTED_O_AUTH_PROVIDERS.map((provider) => {
        const Icon = SUPPORTED_O_AUTH_PROVIDER_DETAILS[provider].Icon;
        return (
          <BetterAuthActionButton
            variant={"outline"}
            key={provider}
            className="flex-1"
            action={() =>
              authClient.signIn.social({
                provider,
                callbackURL: "/overview",
                errorCallbackURL: "/auth/login",
                newUserCallbackURL: "/auth/welcome",
              })
            }
          >
            <Icon />
            <span className="max-sm:hidden">
              {SUPPORTED_O_AUTH_PROVIDER_DETAILS[provider].name}
            </span>
          </BetterAuthActionButton>
        );
      })}
    </ButtonGroup>
  );
}
