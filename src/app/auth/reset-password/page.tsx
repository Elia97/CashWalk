import { ResetPasswordForm } from "./_components/reset-password-form";
import { LoadingSuspense } from "@/components/ui/loading-suspence";

export default function ResetPasswordPage() {
  return (
    <LoadingSuspense>
      <ResetPasswordForm />
    </LoadingSuspense>
  );
}
