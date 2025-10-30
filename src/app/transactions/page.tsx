import { auth } from "@/lib/auth/auth";
import { TransactionManagement } from "./_components/transaction-management";
import { getUserTransactions } from "./actions/transaction-actions";
import { headers } from "next/headers";
import { UserNotAuthenticated } from "@/components/auth/user-not-authenticated";

export default async function TransactionsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session == null) return <UserNotAuthenticated />;

  const res = await getUserTransactions(session.user.id);
  return (
    <section>
      <h1 className="hidden">Transactions Page</h1>
      {res.data && <TransactionManagement transactions={res.data} />}
    </section>
  );
}
