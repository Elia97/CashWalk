'use client';

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { QrCodeVerify } from './qr-code-verify';
import { Button } from '@/components/ui/button';
import { LoadingSwap } from '@/components/ui/loading-swap';
import { PasswordInput } from '@/components/ui/password-input';
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { capitalize } from '@/lib/utils';

const twoFactorAuthSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

type TwoFactorAuthFormData = z.infer<typeof twoFactorAuthSchema>;
export type TwoFactorData = {
  totpURI: string;
  backupCodes: string[];
};

export function TwoFactorAuthForm({ isEnabled }: { isEnabled: boolean }) {
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(null);
  const router = useRouter();
  const form = useForm<TwoFactorAuthFormData>({
    resolver: zodResolver(twoFactorAuthSchema),
    defaultValues: { password: '' },
  });

  const handleDisableTwoFactorAuth = async (data: TwoFactorAuthFormData) => {
    await authClient.twoFactor.disable(
      {
        password: data.password,
      },
      {
        onError: (error) => {
          toast.error(error.error.message || 'Failed to disable 2FA.');
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
      toast.error(res.error.message || 'Failed to enable 2FA.');
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
      onSubmit={form.handleSubmit(
        isEnabled ? handleDisableTwoFactorAuth : handleEnableTwoFactorAuth,
      )}
    >
      <FieldGroup>
        {/* Password Field */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="flex-1">
              <FieldContent>
                <FieldLabel htmlFor={field.name}>{capitalize(field.name)}</FieldLabel>
                <PasswordInput
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Your Password"
                  autoComplete="current-password webauthn"
                />
                {fieldState.error && (
                  <FieldError errors={[fieldState.error]} className="text-nowrap" />
                )}
              </FieldContent>
            </Field>
          )}
        />

        <Field orientation="horizontal">
          <Button
            type="submit"
            className="w-full mt-4"
            disabled={form.formState.isSubmitting}
            variant={isEnabled ? 'destructive' : 'default'}
          >
            <LoadingSwap isLoading={form.formState.isSubmitting}>
              {isEnabled ? 'Disable' : 'Enable'} 2FA
            </LoadingSwap>
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
