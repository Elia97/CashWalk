import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { BackupCodeForm } from "./_components/backup-code-form";
import { TotpForm } from "./_components/totp-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default async function TwoFactorPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session != null) return redirect("/");

  return (
    <section className="animate-fade-up">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="totp">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="totp">Authenticator</TabsTrigger>
              <TabsTrigger value="backup">Backup Code</TabsTrigger>
            </TabsList>

            <TabsContent value="totp">
              <TotpForm />
            </TabsContent>

            <TabsContent value="backup">
              <BackupCodeForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
}
