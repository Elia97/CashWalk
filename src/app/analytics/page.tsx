import { UserNotAuthenticated } from "@/components/auth/user-not-authenticated";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { getUserPrimaryBankAccount } from "../overview/actions/overview-actions";
import { Link } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { AnalyticsManagement } from "./_components/analytics-management";

export default async function AnalyticsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session == null) return <UserNotAuthenticated />;

  const res = await getUserPrimaryBankAccount(session.user.id);

  return (
    <section className="animate-fade-up">
      <h1 className="hidden">Analytics Page</h1>
      {res.data && res.data?.transactions.length > 0 ? (
        <AnalyticsManagement account={res.data} />
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Lock />
            </EmptyMedia>
            <EmptyTitle>
              You need to create transactions to see your analytics
            </EmptyTitle>
            <EmptyDescription>
              Please create some transactions to see your financial analytics.
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
            <EmptyTitle>Something went wrong loading your analytics</EmptyTitle>
            <EmptyDescription>
              Please try again or create some transactions.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild variant={"link"}>
              <Link href="/transactions">Create a Transaction</Link>
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </section>
  );
}
