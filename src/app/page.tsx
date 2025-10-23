"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { Loader2 } from "lucide-react";
import { BetterAuthActionButton } from "@/components/auth";
import { Button } from "@/components/ui";

export default function Home() {
  const [hasAdminPermission, setHasAdminPermission] = useState<boolean>(false);
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    authClient.admin
      .hasPermission({ permission: { user: ["list"] } })
      .then(({ data }) => {
        setHasAdminPermission(data?.success ?? false);
      });
  }, []);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (session) {
    return (
      <div className="my-6 px-4 max-w-md mx-auto">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold">
            Welcome back, {session.user.name}!
          </h1>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href={"/profile"}>Profile</Link>
            </Button>
            {hasAdminPermission && (
              <Button asChild size="lg" variant={"outline"}>
                <Link href={"/admin"}>Admin</Link>
              </Button>
            )}
            <BetterAuthActionButton
              size="lg"
              variant={"destructive"}
              successMessage="Signed out successfully"
              action={() => authClient.signOut()}
            >
              Sign Out
            </BetterAuthActionButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-6 px-4 max-w-md mx-auto">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold">Welcome to Better Auth</h1>
        <Button asChild size="lg">
          <Link href={"/auth/login"}>Sign In / Sign Up</Link>
        </Button>
      </div>
    </div>
  );
}
