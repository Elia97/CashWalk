"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import { BetterAuthActionButton } from "./better-auth-action-button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";

export function AuthButton() {
  const { data: session, isPending } = authClient.useSession();
  const [hasAdminPermission, setHasAdminPermission] = useState<boolean>(false);

  useEffect(() => {
    if (!session) return;
    authClient.admin
      .hasPermission({ permission: { user: ["list"] } })
      .then(({ data }) => {
        setHasAdminPermission(data?.success ?? false);
      });
  }, [session]);

  if (isPending) return <Loader2 className="animate-spin" />;

  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="size-9">
            <AvatarImage src={session.user.image!} alt={session.user.name} />
            <AvatarFallback>
              {session.user.name
                ? session.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : "U"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="flex flex-col gap-2 py-3 px-2">
            <span className="text-sm">{session.user.name}</span>
            <span className="text-sm text-muted-foreground">
              {session.user.email}
            </span>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={"/profile"}>Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={"/settings"}>Settings</Link>
          </DropdownMenuItem>
          {hasAdminPermission && (
            <DropdownMenuItem asChild>
              <Link href={"/admin"}>Admin</Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <BetterAuthActionButton
              variant={"destructive"}
              action={() => authClient.signOut()}
              className="w-full"
            >
              Logout
            </BetterAuthActionButton>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button asChild size={"icon-lg"}>
      <Link href={"/auth/login"}>
        <LogIn />
      </Link>
    </Button>
  );
}
