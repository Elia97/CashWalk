'use client';

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSwap } from '@/components/ui/loading-swap';
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field';

const totpFormSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits long'),
});

type TotpFormData = z.infer<typeof totpFormSchema>;

export function TotpForm() {
  const router = useRouter();
  const form = useForm<TotpFormData>({
    resolver: zodResolver(totpFormSchema),
    defaultValues: {
      code: '',
    },
  });

  const handleTotpSubmit = async (data: TotpFormData) => {
    await authClient.twoFactor.verifyTotp(data, {
      onError: (error) => {
        toast.error(error.error.message || 'Failed to verify code');
      },
      onSuccess: () => {
        router.push('/');
      },
    });
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleTotpSubmit)}>
      <FieldGroup className="gap-4">
        {/* Code Field */}
        <Controller
          name="code"
          control={form.control}
          render={({ field }) => (
            <Field>
              <div className="flex items-center gap-2">
                <FieldLabel htmlFor="code">Backup Code</FieldLabel>
                <FieldError errors={[form.formState.errors.code]} />
              </div>
              <Input id="code" placeholder="Your Code" autoComplete="off" {...field} />
            </Field>
          )}
        />

        <Field orientation="horizontal">
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            <LoadingSwap isLoading={form.formState.isSubmitting}>Verify</LoadingSwap>
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
