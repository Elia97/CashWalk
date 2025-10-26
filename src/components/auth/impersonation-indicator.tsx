"use client";

import { authClient } from "@/lib/auth/auth-client";
import { UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import { BetterAuthActionButton } from "./better-auth-action-button";

export function ImpersonationIndicator() {
  const router = useRouter();
  const { data: session, refetch } = authClient.useSession();

  if (session?.session.impersonatedBy == null) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <BetterAuthActionButton
        action={() =>
          authClient.admin.stopImpersonating(undefined, {
            onSuccess: () => {
              router.push("/admin");
              refetch();
            },
          })
        }
        variant={"destructive"}
        size={"sm"}
      >
        <UserX />
      </BetterAuthActionButton>
    </div>
  );
}
