import Image from "next/image";
import { auth } from "@/lib/auth/auth";
import { Key, LinkIcon, Shield, Trash2, User } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileUpdateForm } from "./_components/profile-update-form";
import { SecurityTab } from "./_components/security-tab";
import { SessionsTab } from "./_components/sessions-tab";
import { LinkedAccountsTab } from "./_components/linked-accounts-tab";
import { AccountDeletion } from "./_components/account-deletion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSuspense } from "@/components/ui/loading-suspence";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export type Passkey = Awaited<ReturnType<typeof auth.api.listPasskeys>>[number];

export type Account = Awaited<
  ReturnType<typeof auth.api.listUserAccounts>
>[number];

export type Session = Awaited<ReturnType<typeof auth.api.listSessions>>[number];

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth/login");

  const [passkeys, accounts, sessions] = await Promise.all([
    auth.api.listPasskeys({
      headers: await headers(),
    }),
    auth.api.listUserAccounts({
      headers: await headers(),
    }),
    auth.api.listSessions({ headers: await headers() }),
  ]);

  return (
    <section>
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="size-16 bg-muted rounded-full flex items-center justify-center overflow-hidden">
            {session.user.image ? (
              <Image
                width={64}
                height={64}
                src={session.user.image}
                alt={session.user.name || "User Avatar"}
                className="object-cover"
              />
            ) : (
              <User className="size-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex gap-1 justify-between items-start">
              <h1 className="text-3xl font-bold">
                {session.user.name || "User Profile"}
              </h1>
              <Badge>{session.user?.role}</Badge>
            </div>
            <p className="text-muted-foreground">{session.user.email}</p>
          </div>
        </div>
      </div>

      <Tabs className="space-y-2" defaultValue="profile">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">
            <User />
            <span className="max-sm:hidden">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield />
            <span className="max-sm:hidden">Security</span>
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <Key />
            <span className="max-sm:hidden">Sessions</span>
          </TabsTrigger>
          <TabsTrigger value="linked-accounts">
            <LinkIcon />
            <span className="max-sm:hidden">Linked Accounts</span>
          </TabsTrigger>
          <TabsTrigger value="danger-zone">
            <Trash2 />
            <span className="max-sm:hidden">Danger Zone</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardContent>
              <ProfileUpdateForm user={session.user} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security">
          <LoadingSuspense>
            <SecurityTab
              accounts={accounts}
              passkeys={passkeys}
              email={session.user.email}
              isTwoFactorEnabled={session.user.twoFactorEnabled ?? false}
            />
          </LoadingSuspense>
        </TabsContent>
        <TabsContent value="sessions">
          <LoadingSuspense>
            <SessionsTab
              sessions={sessions}
              currentSessionToken={session.session.token}
            />
          </LoadingSuspense>
        </TabsContent>
        <TabsContent value="linked-accounts">
          <LoadingSuspense>
            <LinkedAccountsTab accounts={accounts} />
          </LoadingSuspense>
        </TabsContent>
        <TabsContent value="danger-zone">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <AccountDeletion />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}
