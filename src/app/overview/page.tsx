import { getUserPrimaryBankAccount } from "./actions/overview-actions";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { OverviewManagement } from "./_components/overview-management";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function OverviewPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("User session is required");

  const res = await getUserPrimaryBankAccount(session.user.id);
  if (!res.data) redirect("/welcome");

  return (
    <section className="animate-fade-up">
      <h1 className="hidden">Overview Page</h1>
      {res.data && res.data?.transactions.length > 0 ? (
        <OverviewManagement account={res.data} />
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Lock />
            </EmptyMedia>
            <EmptyTitle>
              You need to create transactions to see your overview
            </EmptyTitle>
            <EmptyDescription>
              Please create some transactions to see your financial overview.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild variant={"link"}>
              <Link href="/transactions">Create some transactions</Link>
            </Button>
          </EmptyContent>
        </Empty>
      )}
      {res.error && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Lock />
            </EmptyMedia>
            <EmptyTitle>Something went wrong loading your overview</EmptyTitle>
            <EmptyDescription>
              Please try again or create a bank account.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild variant={"link"}>
              <Link href="/accounts">Create a Bank Account</Link>
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </section>
  );
}
