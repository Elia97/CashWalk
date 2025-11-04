import { auth } from "@/lib/auth/auth";
import { TransactionManagement } from "./_components/transaction-management";
import { getUserTransactions } from "./actions/transaction-actions";
import { headers } from "next/headers";
import { UserNotAuthenticated } from "@/components/auth/user-not-authenticated";
import { DEFAULT_PAGE_SIZE } from "@/repo/transaction-repository";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    pageSize?: string;
    from?: string;
    to?: string;
    type?: "income" | "expense";
  };
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session == null) return <UserNotAuthenticated />;
  const params = await Promise.resolve(searchParams);
  const page = Number(params?.page ?? 1);
  const pageSize = Number(params?.pageSize ?? DEFAULT_PAGE_SIZE);
  const from = params?.from
    ? new Date(params.from)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const to = params?.to ? new Date(params.to) : new Date();
  const transactionType =
    params?.type === "income" || params?.type === "expense"
      ? params.type
      : undefined;
  const res = await getUserTransactions(session.user.id, {
    page,
    pageSize,
    from,
    to,
    transactionType,
  });

  return (
    <section className="animate-fade-up">
      <h1 className="hidden">Transactions Page</h1>
      {res.data && (
        <TransactionManagement
          initialData={res.data.transactions}
          totalCount={res.data.totalCount}
          page={page}
          pageSize={pageSize}
        />
      )}
    </section>
  );
}
