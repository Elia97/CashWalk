"use client";

import type { Account } from "../page";
import { Plus, Shield, Trash } from "lucide-react";
import {
  SUPPORTED_O_AUTH_PROVIDER_DETAILS,
  SupportedOAuthProviders,
} from "@/lib/auth/o-auth-providers";
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

export function AccountCard({
  provider,
  account,
}: {
  provider: string;
  account?: Account;
}) {
  const router = useRouter();
  const providerDetails = SUPPORTED_O_AUTH_PROVIDER_DETAILS[
    provider as SupportedOAuthProviders
  ] ?? {
    name: provider,
    Icon: Shield,
  };

  return (
    <Card>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <providerDetails.Icon className="size-5" />
            <div>
              <p className="font-medium">{providerDetails.name}</p>
              {!account ? (
                <p className="text-sm text-muted-foreground">
                  Connect your {providerDetails.name} account for easier sign
                  in.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Linked on {new Date(account.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          {!account ? (
            <BetterAuthActionButton
              variant={"outline"}
              size={"sm"}
              successMessage="Linked account successfully"
              action={() =>
                authClient.linkSocial({
                  provider,
                  callbackURL: "/profile",
                })
              }
            >
              <Plus />
              Link
            </BetterAuthActionButton>
          ) : (
            <BetterAuthActionButton
              variant={"destructive"}
              size={"sm"}
              successMessage="Unlinked account successfully"
              action={() =>
                authClient.unlinkAccount(
                  {
                    accountId: account.accountId,
                    providerId: provider,
                  },
                  {
                    onSuccess: () => {
                      router.refresh();
                    },
                  },
                )
              }
            >
              <Trash />
              Unlink
            </BetterAuthActionButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
