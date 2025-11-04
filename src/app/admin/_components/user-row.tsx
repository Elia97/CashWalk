"use client";

import { authClient } from "@/lib/auth/auth-client";
import { UserWithRole } from "better-auth/plugins";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";

export function UserRow({
  user,
  selfId,
}: {
  user: UserWithRole;
  selfId: string;
}) {
  const isSelf = user.id === selfId;
  const router = useRouter();
  const { refetch } = authClient.useSession();

  const handleImpersonateUser = (userId: string) => {
    authClient.admin.impersonateUser(
      { userId },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to impersonate user");
        },
        onSuccess: () => {
          refetch();
          router.push("/");
        },
      },
    );
  };

  const handleRevokeSessions = (userId: string) => {
    authClient.admin.revokeUserSessions(
      { userId },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to revoke sessions");
        },
        onSuccess: () => {
          toast.success("User sessions revoked successfully");
        },
      },
    );
  };

  const handleBanUser = (userId: string) => {
    authClient.admin.banUser(
      { userId },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to ban user");
        },
        onSuccess: () => {
          toast.success("User banned successfully");
          router.refresh();
        },
      },
    );
  };

  const handleUnbanUser = (userId: string) => {
    authClient.admin.unbanUser(
      { userId },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to unban user");
        },
        onSuccess: () => {
          toast.success("User unbanned successfully");
          router.refresh();
        },
      },
    );
  };

  const handleRemoveUser = (userId: string) => {
    authClient.admin.removeUser(
      { userId },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to remove user");
        },
        onSuccess: () => {
          toast.success("User removed successfully");
          router.refresh();
        },
      },
    );
  };

  return (
    <TableRow>
      <TableCell>
        <div>
          <div className="font-medium">{user.name || "No name"}</div>
          <div className="text-sm text-muted-foreground">
            {user.email || "No email"}
          </div>
          <div className="flex items-center gap-2 not-empty:mt-2">
            {user.banned && <Badge variant="destructive">Banned</Badge>}
            {!user.emailVerified && <Badge variant="outline">Unverified</Badge>}
            {isSelf && <Badge>You</Badge>}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
          {user.role || "No role"}
        </Badge>
      </TableCell>
      <TableCell>{formatDate(user.createdAt)}</TableCell>
      <TableCell>
        {!isSelf && (
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} size={"icon"}>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => handleImpersonateUser(user.id)}
                >
                  Impersonate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRevokeSessions(user.id)}>
                  Revoke Sessions
                </DropdownMenuItem>
                {user.banned ? (
                  <DropdownMenuItem onClick={() => handleUnbanUser(user.id)}>
                    Unban User
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => handleBanUser(user.id)}>
                    Ban User
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />

                <AlertDialogTrigger asChild>
                  <DropdownMenuItem variant="destructive">
                    Delete User
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete User</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this user? This action cannot
                  be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleRemoveUser(user.id)}
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </TableCell>
    </TableRow>
  );
}
