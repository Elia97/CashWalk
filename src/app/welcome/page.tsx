import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { WelcomeForm } from "./_components/welcome-form";
import { getUserPrimaryBankAccount } from "../overview/actions/overview-actions";
import { redirect } from "next/navigation";

export default async function WelcomePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("User session is required");
  const res = await getUserPrimaryBankAccount(session.user.id);
  if (res.data) redirect("/overview");

  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {session.user.name}! 👋</CardTitle>
          <CardDescription>
            Let&apos;s get started! Add your first account and begin tracking
            your money.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WelcomeForm />
        </CardContent>
      </Card>
    </section>
  );
}
