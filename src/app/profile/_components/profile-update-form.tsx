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
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { capitalize } from '@/lib/utils';

const profileUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.email().min(1, 'Email is required').max(100, 'Email is too long'),
});

type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;

export function ProfileUpdateForm({ user }: { user: { name?: string; email?: string } }) {
  const router = useRouter();
  const form = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: user,
  });

  const handleProfileUpdate = async (data: ProfileUpdateFormData) => {
    if (
      !form.formState.isDirty ||
      Object.keys(form.formState.dirtyFields).every(
        (key) => data[key as keyof ProfileUpdateFormData] === user[key as keyof typeof user],
      )
    ) {
      toast.info('No changes to update.');
      return;
    }

    const updateData: Partial<ProfileUpdateFormData> = {};

    Object.keys(form.formState.dirtyFields).forEach((key) => {
      if (
        key !== 'email' &&
        (form.formState.dirtyFields as Partial<Record<keyof ProfileUpdateFormData, boolean>>)[
          key as keyof ProfileUpdateFormData
        ]
      ) {
        updateData[key as keyof ProfileUpdateFormData] = data[key as keyof ProfileUpdateFormData];
      }
    });

    if (Object.keys(updateData).length > 0) {
      const updateUserResult = await authClient.updateUser(updateData);
      if (updateUserResult.error) {
        toast.error(updateUserResult.error.message || 'Failed to update profile.');
      } else {
        toast.success('Profile updated successfully!');
      }
    }

    if (form.formState.dirtyFields.email) {
      const changeEmailResult = await authClient.changeEmail({
        newEmail: data.email,
        callbackURL: '/profile',
      });
      if (changeEmailResult.error) {
        toast.error(changeEmailResult.error.message || 'Failed to change email.');
      } else {
        toast.success('Email change requested! Please check your inbox to confirm.');
      }
    }

    router.refresh();
  };

  return (
    <form onSubmit={form.handleSubmit(handleProfileUpdate)}>
      <FieldGroup>
        <FieldGroup>
          {/* Name Field */}
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="flex-1">
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>{capitalize(field.name)}</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Your Name"
                    autoComplete="name"
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
              </Field>
            )}
          />

          {/* Email Field */}
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="flex-1">
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>{capitalize(field.name)}</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Your Email"
                    autoComplete="email"
                  />
                  {fieldState.error && <FieldError errors={[fieldState.error]} />}
                </FieldContent>
              </Field>
            )}
          />
        </FieldGroup>

        <Field orientation="horizontal">
          <Button type="submit" className="w-full mt-4" disabled={form.formState.isSubmitting}>
            <LoadingSwap isLoading={form.formState.isSubmitting}>Update Profile</LoadingSwap>
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
