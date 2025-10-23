import type { Account } from "../page";
import { Card, CardContent } from "@/components/ui";
import { AccountLinking } from "./account-linking";

export async function LinkedAccountsTab({ accounts }: { accounts: Account[] }) {
  const notCredentialAccounts = accounts.filter(
    (a) => a.providerId !== "credential",
  );

  return (
    <Card>
      <CardContent>
        <AccountLinking currentAccounts={notCredentialAccounts} />
      </CardContent>
    </Card>
  );
}
