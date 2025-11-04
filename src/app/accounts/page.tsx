import { headers } from "next/headers";
import { getUserBankAccounts } from "./actions/bank-account-actions";
import { auth } from "@/lib/auth/auth";
import { BankAccountManagement } from "./_components/bank-account-management";
import { redirect } from "next/navigation";

export default async function AccountsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("User session is required");
  const res = await getUserBankAccounts(session.user.id);
  if (res.data?.length === 0) redirect("/welcome");
  const isAdmin = session.user?.role?.includes?.("admin") ?? false;

  return (
    <section className="animate-fade-up">
      <h1 className="hidden">Accounts Page</h1>
      {res.data && (
        <BankAccountManagement accounts={res.data} isAdmin={isAdmin} />
      )}
    </section>
  );
}
