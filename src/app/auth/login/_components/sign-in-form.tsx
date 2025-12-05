'use client';

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSwap } from '@/components/ui/loading-swap';
import { PasswordInput } from '@/components/ui/password-input';
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { capitalize } from '@/lib/utils';

const signInSchema = z.object({
  email: z.email().min(1, 'Email is required').max(100, 'Email is too long'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password is too long'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export function SignInForm({
  openEmailVerificationTab,
  openForgotPasswordTab,
}: {
  openEmailVerificationTab: (email: string) => void;
  openForgotPasswordTab: () => void;
}) {
  const router = useRouter();
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSignIn = async (data: SignInFormData) => {
    await authClient.signIn.email(
      { ...data, callbackURL: '/overview' },
      {
        onError: (error) => {
          if (error.error.code === 'EMAIL_NOT_VERIFIED') {
            openEmailVerificationTab(data.email);
          }
          toast.error(error.error.message || 'Failed to sign in');
        },
        onSuccess: () => {
          toast.success('Successfully signed in');
          router.push('/overview');
        },
      },
    );
    form.reset();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={form.handleSubmit(handleSignIn)}>
        <FieldGroup>
          <FieldGroup>
            {/* Email Field */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>{capitalize(field.name)}</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Your Email"
                      autoComplete="email webauthn"
                    />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </FieldContent>
                </Field>
              )}
            />

            {/* Password Field */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>{capitalize(field.name)}</FieldLabel>
                    <PasswordInput
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Your Password"
                      autoComplete="current-password webauthn"
                    />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </FieldContent>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      className="text-sm font-normal hover:underline"
                      onClick={openForgotPasswordTab}
                    >
                      Forgot Password?
                    </Button>
                  </div>
                </Field>
              )}
            />
          </FieldGroup>
          <Field orientation="horizontal">
            <Button type="submit" className="flex-1" disabled={form.formState.isSubmitting}>
              <LoadingSwap isLoading={form.formState.isSubmitting}>Sign In</LoadingSwap>
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
