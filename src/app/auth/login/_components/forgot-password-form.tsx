'use client';

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSwap } from '@/components/ui/loading-swap';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

const forgotPasswordSchema = z.object({
  email: z.email().min(1, 'Email is required').max(100, 'Email is too long'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm({ openSignInTab }: { openSignInTab: () => void }) {
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    await authClient.requestPasswordReset(
      {
        ...data,
        redirectTo: '/auth/reset-password',
      },
      {
        onError: (error) => {
          toast.error(error.error.message || 'Failed to request password reset');
        },
        onSuccess: () => {
          toast.success('Password reset email sent');
        },
      },
    );
    form.reset();
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleForgotPassword)}>
      <FieldGroup className="gap-4">
        {/* Email Field */}
        <Controller
          name="email"
          control={form.control}
          render={({ field }) => (
            <Field>
              <div className="flex items-center gap-2">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <FieldError errors={[form.formState.errors.email]} />
              </div>
              <Input id="email" placeholder="Your Email" autoComplete="email webauthn" {...field} />
            </Field>
          )}
        />

        <Field orientation={'horizontal'}>
          <Button type="button" variant={'outline'} onClick={openSignInTab}>
            Back to Sign In
          </Button>
          <Button type="submit" className="flex-1" disabled={form.formState.isSubmitting}>
            <LoadingSwap isLoading={form.formState.isSubmitting}>Send Reset Link</LoadingSwap>
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
