"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { QrCodeVerify } from "./qr-code-verify";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const twoFactorAuthSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

type TwoFactorAuthFormData = z.infer<typeof twoFactorAuthSchema>;
export type TwoFactorData = {
  totpURI: string;
  backupCodes: string[];
};

export function TwoFactorAuthForm({ isEnabled }: { isEnabled: boolean }) {
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(
    null,
  );
  const router = useRouter();
  const form = useForm<TwoFactorAuthFormData>({
    resolver: zodResolver(twoFactorAuthSchema),
    defaultValues: { password: "" },
  });

  const handleDisableTwoFactorAuth = async (data: TwoFactorAuthFormData) => {
    await authClient.twoFactor.disable(
      {
        password: data.password,
      },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to disable 2FA.");
        },
        onSuccess: () => {
          form.reset();
          router.refresh();
        },
      },
    );
  };

  const handleEnableTwoFactorAuth = async (data: TwoFactorAuthFormData) => {
    const res = await authClient.twoFactor.enable({
      password: data.password,
    });

    if (res.error) {
      toast.error(res.error.message || "Failed to enable 2FA.");
    } else {
      setTwoFactorData(res.data);
    }
  };

  if (twoFactorData) {
    return (
      <QrCodeVerify
        {...twoFactorData}
        onDone={() => {
          setTwoFactorData(null);
        }}
      />
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(
        isEnabled ? handleDisableTwoFactorAuth : handleEnableTwoFactorAuth,
      )}
    >
      <FieldGroup className="gap-4">
        {/* Password Field */}
        <Controller
          name="password"
          control={form.control}
          render={({ field }) => (
            <Field>
              <div className="flex items-center gap-2">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <FieldError errors={[form.formState.errors.password]} />
              </div>
              <PasswordInput
                id="password"
                placeholder="Your Password"
                autoComplete="current-password webauthn"
                {...field}
              />
            </Field>
          )}
        />

        <Field orientation="horizontal">
          <Button
            type="submit"
            className="w-full mt-4"
            disabled={form.formState.isSubmitting}
            variant={isEnabled ? "destructive" : "default"}
          >
            <LoadingSwap isLoading={form.formState.isSubmitting}>
              {isEnabled ? "Disable" : "Enable"} 2FA
            </LoadingSwap>
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
