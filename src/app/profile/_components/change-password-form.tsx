'use client';

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { LoadingSwap } from '@/components/ui/loading-swap';
import { PasswordInput } from '@/components/ui/password-input';
import { Checkbox } from '@/components/ui/checkbox';
import { FieldGroup, Field, FieldLabel, FieldError, FieldContent } from '@/components/ui/field';
import { capitalize } from '@/lib/utils';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current Password is required'),
    newPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters long')
      .max(100, 'Password is too long'),
    confirmNewPassword: z.string().min(1, 'Confirm New Password is required'),
    revokeOtherSessions: z.boolean(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm() {
  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      revokeOtherSessions: false,
    },
  });

  const handleProfileUpdate = async (data: ChangePasswordFormData) => {
    await authClient.changePassword(data, {
      onError: (error) => {
        toast.error(error.error.message || 'Failed to change password.');
      },
      onSuccess: () => {
        toast.success('Password changed successfully.');
        form.reset();
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleProfileUpdate)}>
      <FieldGroup>
        <FieldGroup>
          {/* Current Password Field */}
          <Controller
            name="currentPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="flex-1">
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>{capitalize(field.name)}</FieldLabel>
                  <PasswordInput
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Your Current Password"
                    autoComplete="current-password webauthn"
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} className="text-nowrap" />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          {/* New Password Field */}
          <Controller
            name="newPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="flex-1">
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>{capitalize(field.name)}</FieldLabel>
                  <PasswordInput
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Your New Password"
                    autoComplete="new-password webauthn"
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} className="text-nowrap" />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          {/* Confirm New Password Field */}
          <Controller
            name="confirmNewPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="flex-1">
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>{capitalize(field.name)}</FieldLabel>
                  <PasswordInput
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Confirm Your New Password"
                    autoComplete="new-password webauthn"
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} className="text-nowrap" />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          {/* Revoke Other Sessions Field */}
          <Controller
            name="revokeOtherSessions"
            control={form.control}
            render={({ field }) => (
              <Field orientation={'horizontal'}>
                <Checkbox
                  id="revokeOtherSessions"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldLabel htmlFor="revokeOtherSessions">Revoke other sessions</FieldLabel>
              </Field>
            )}
          />
        </FieldGroup>

        <Button type="submit" className="w-full mt-4" disabled={form.formState.isSubmitting}>
          <LoadingSwap isLoading={form.formState.isSubmitting}>Change Password</LoadingSwap>
        </Button>
      </FieldGroup>
    </form>
  );
}
