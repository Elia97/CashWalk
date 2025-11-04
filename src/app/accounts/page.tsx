import { headers } from "next/headers";
import { getUserBankAccounts } from "./actions/bank-account-actions";
import { auth } from "@/lib/auth/auth";
import { BankAccountManagement } from "./_components/bank-account-management";
import { UserNotAuthenticated } from "@/components/auth/user-not-authenticated";

export default async function AccountsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session == null) return <UserNotAuthenticated />;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const res = await getUserBankAccounts(session.user.id);
  return (
    <section className="animate-fade-up">
      <h1 className="hidden">Accounts Page</h1>
      {res.data && <BankAccountManagement accounts={res.data} />}
    </section>
  );
}
