"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { QrCodeVerify } from "./qr-code-verify";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  LoadingSwap,
  PasswordInput,
} from "@/components/ui";

const twoFactorAuthSchema = z.object({
  password: z.string().min(1),
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
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(
          isEnabled ? handleDisableTwoFactorAuth : handleEnableTwoFactorAuth,
        )}
      >
        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="●●●●●●" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
      </form>
    </Form>
  );
}
