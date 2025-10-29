"use client";

import { useEffect } from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function UserNotAuthenticated() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/auth/login");
    }, 3000);
  });

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Lock />
        </EmptyMedia>
        <EmptyTitle>You&apos;re not logged in</EmptyTitle>
        <EmptyDescription>Please log in to access your data.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild variant={"link"}>
          <Link href="/auth/login">Go to Login</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
