"use client";

import type { TwoFactorData } from "./two-factor-auth-form";
import z from "zod";
import QRCode from "react-qr-code";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";

const qrCodeVerifySchema = z.object({
  token: z.string().length(6, "Code must be 6 digits"),
});

type QrCodeVerifyFormData = z.infer<typeof qrCodeVerifySchema>;

export function QrCodeVerify({
  totpURI,
  backupCodes,
  onDone,
}: TwoFactorData & { onDone: () => void }) {
  const [successfullyEnabled, setSuccessfullyEnabled] = useState(false);
  const router = useRouter();
  const form = useForm<QrCodeVerifyFormData>({
    resolver: zodResolver(qrCodeVerifySchema),
    defaultValues: { token: "" },
  });

  const handleQrCodeVerify = async (data: QrCodeVerifyFormData) => {
    await authClient.twoFactor.verifyTotp(
      {
        code: data.token,
      },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to verify 2FA code.");
        },
        onSuccess: () => {
          setSuccessfullyEnabled(true);
          router.refresh();
        },
      },
    );
  };

  if (successfullyEnabled) {
    return (
      <>
        <p className="text-sm text-muted-foreground mb-2">
          Save these backup codes in a secure location. They can be used to
          access your account if you lose access to your authenticator app.
        </p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {backupCodes.map((code, index) => {
            return (
              <div key={index} className="font-mono text-sm">
                {code}
              </div>
            );
          })}
        </div>
        <Button variant={"outline"} onClick={onDone}>
          Done
        </Button>
      </>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Scan the QR code with your authenticator app and enter the 6-digit
      </p>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(handleQrCodeVerify)}
      >
        <FieldGroup className="gap-4">
          {/* Token Field */}
          <Controller
            name="token"
            control={form.control}
            render={({ field }) => (
              <Field>
                <div className="flex items-center gap-2">
                  <FieldLabel htmlFor="token">Backup Code</FieldLabel>
                  <FieldError errors={[form.formState.errors.token]} />
                </div>
                <Input
                  id="token"
                  placeholder="Your Code"
                  autoComplete="off"
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
            >
              <LoadingSwap isLoading={form.formState.isSubmitting}>
                Submit Code
              </LoadingSwap>
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <div className="p-4 bg-white w-fit mx-auto">
        <QRCode size={256} value={totpURI} />
      </div>
    </div>
  );
}
