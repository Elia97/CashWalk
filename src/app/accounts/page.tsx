import { headers } from "next/headers";
import { getUserBankAccounts } from "./actions/bank-account-actions";
import { auth } from "@/lib/auth/auth";
import { BankAccountManagement } from "./_components/bank-account-management";

export default async function AccountsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return null;
  }

  const res = await getUserBankAccounts(session.user.id);
  if (res.data) {
    return <BankAccountManagement accounts={res.data} />;
  }
}
