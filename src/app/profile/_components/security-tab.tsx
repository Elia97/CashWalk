import type { Account, Passkey } from "../page";
import { ChangePasswordForm } from "./change-password-form";
import { SetPasswordButton } from "./set-password-button";
import { TwoFactorAuthForm } from "./two-factor-auth-form";
import { PasskeyManagement } from "./passkey-management";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export async function SecurityTab({
  accounts,
  passkeys,
  email,
  isTwoFactorEnabled,
}: {
  accounts: Account[];
  passkeys: Passkey[];
  email: string;
  isTwoFactorEnabled: boolean;
}) {
  const hasPasswordAccount = accounts.some(
    (a) => a.providerId === "credential",
  );

  if (hasPasswordAccount) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password for improved security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex justify-between items-center gap-2">
            <CardTitle>Two Factor Authentication</CardTitle>
            <Badge variant={isTwoFactorEnabled ? "default" : "destructive"}>
              {isTwoFactorEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </CardHeader>
          <CardContent>
            <TwoFactorAuthForm isEnabled={isTwoFactorEnabled} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Passkeys</CardTitle>
          </CardHeader>
          <CardContent>
            <PasskeyManagement passkeys={passkeys} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Set Password</CardTitle>
          <CardDescription>
            We will send you a password reset email to set up a password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SetPasswordButton email={email} />
        </CardContent>
      </Card>
    </div>
  );
}
