'use client';

import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
  FieldSet,
  FieldContent,
  FieldDescription,
  FieldLegend,
  FieldSeparator,
} from '@/components/ui/field';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { ClientBankAccount } from '@/drizzle/schema';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { LoadingSwap } from '@/components/ui/loading-swap';
import { NumberInput } from '@/components/ui/number-input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { capitalize } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/components/ui/multi-select';
import { createWelcomeDataAction } from '../actions/welcome-actions';
import { getWelcomeCategoriesByType } from '@/lib/welcome-categories';

const welcomeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
  userId: z.string().min(1, 'User ID is required'),
  balance: z.number().min(0, 'Balance must be at least 0').max(10_000_000, 'Balance is too high'),
  accountType: z.enum(['checking', 'savings', 'cash'], {
    message: 'Type is required',
  }),
  currency: z.enum(['USD', 'EUR', 'GBP'], {
    message: 'Currency is required',
  }),
  accountNumber: z.string().max(18, 'Account number is too long').optional(),
  categories: z.array(z.string()).optional(),
});

type WelcomeFormData = z.infer<typeof welcomeSchema>;

export function WelcomeForm() {
  const { data: session, refetch } = authClient.useSession();
  const form = useForm<WelcomeFormData>({
    resolver: zodResolver(welcomeSchema),
    defaultValues: {
      name: '',
      userId: '',
      balance: 0,
      accountType: 'checking',
      currency: 'EUR',
      accountNumber: '',
    },
  });

  const router = useRouter();

  useEffect(() => {
    form.setValue('userId', session?.user.id || '', { shouldValidate: true });
  }, [form, session?.user.id]);

  const handleAddWelcomeData = async (data: WelcomeFormData) => {
    const res = await createWelcomeDataAction({
      bankAccount: {
        name: data.name,
        userId: data.userId,
        balance: data.balance,
        accountType: data.accountType,
        currency: data.currency,
        accountNumber: data.accountNumber,
      } as ClientBankAccount,
      categories: data.categories || [],
    });

    if (res.error) {
      toast.error(res.error || 'An error occurred while creating welcome data.');
    } else {
      toast.success('Data created successfully! Welcome aboard!');
      refetch();
      router.push('/transactions');
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleAddWelcomeData)}>
      <FieldGroup>
        <FieldSeparator />
        <FieldSet>
          <FieldLegend>Your First Account</FieldLegend>
          <FieldDescription>Let&apos;s start by adding your primary bank account.</FieldDescription>
          <Field orientation={'responsive'}>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="relative flex-1">
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>{capitalize(field.name)}</FieldLabel>
                    <FieldDescription>Give your account a friendly name.</FieldDescription>
                  </FieldContent>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Main Account"
                    autoComplete="off"
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} className="absolute top-full text-xs" />
                  )}
                </Field>
              )}
            />

            <Controller
              name="accountNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="relative flex-1">
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>{capitalize(field.name)}</FieldLabel>
                    <FieldDescription>Optional - add it for easy reference.</FieldDescription>
                  </FieldContent>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="1234567890"
                    autoComplete="off"
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} className="absolute top-full text-xs" />
                  )}
                </Field>
              )}
            />
          </Field>
        </FieldSet>
        <FieldSeparator />
        <FieldSet>
          <FieldLegend>Account Settings</FieldLegend>
          <FieldDescription>Choose your currency and set your starting balance.</FieldDescription>
          <Field orientation="responsive">
            <Controller
              name="currency"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="relative flex-1">
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>{capitalize(field.name)}</FieldLabel>
                    <FieldDescription>Choose your preferred currency.</FieldDescription>
                  </FieldContent>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger {...field} id={field.name} aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Choose currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} className="absolute top-full text-xs" />
                  )}
                </Field>
              )}
            />
            <Controller
              name="balance"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="relative flex-1">
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>{capitalize(field.name)}</FieldLabel>
                    <FieldDescription>How much do you have right now?</FieldDescription>
                  </FieldContent>
                  <NumberInput
                    {...field}
                    id={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                    placeholder="0"
                    min={0}
                    step={0.01}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} className="absolute top-full text-xs" />
                  )}
                </Field>
              )}
            />
          </Field>
        </FieldSet>
        <FieldSeparator />
        <FieldSet>
          <FieldLegend>Quick Start</FieldLegend>
          <FieldDescription>
            Pick some common categories to get started faster (you can add more later).
          </FieldDescription>
          <Controller
            name="categories"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="relative flex-1">
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>{capitalize(field.name)}</FieldLabel>
                  <FieldDescription>
                    Select a few to begin with - don&apos;t worry, you can customize everything
                    later!
                  </FieldDescription>
                </FieldContent>
                <MultiSelect onValuesChange={field.onChange} values={field.value}>
                  <MultiSelectTrigger {...field} id={field.name} aria-invalid={fieldState.invalid}>
                    <MultiSelectValue placeholder="Choose categories..." />
                  </MultiSelectTrigger>
                  <MultiSelectContent>
                    <MultiSelectGroup heading="Income">
                      {getWelcomeCategoriesByType().income.map((cat) => (
                        <MultiSelectItem key={cat.value} value={cat.value}>
                          <span className="mr-2">{cat.icon}</span>
                          {cat.label}
                        </MultiSelectItem>
                      ))}
                    </MultiSelectGroup>
                    <MultiSelectGroup heading="Expenses">
                      {getWelcomeCategoriesByType().expense.map((cat) => (
                        <MultiSelectItem key={cat.value} value={cat.value}>
                          <span className="mr-2">{cat.icon}</span>
                          {cat.label}
                        </MultiSelectItem>
                      ))}
                    </MultiSelectGroup>
                  </MultiSelectContent>
                </MultiSelect>
                {fieldState.error && (
                  <FieldError errors={[fieldState.error]} className="absolute top-full text-xs" />
                )}
              </Field>
            )}
          />
        </FieldSet>
        <FieldSeparator />
        <DialogFooter>
          <Field orientation="horizontal" className="mt-4">
            <Button type="submit" className="flex-1" disabled={form.formState.isSubmitting}>
              <LoadingSwap isLoading={form.formState.isSubmitting}>Get Started</LoadingSwap>
            </Button>
          </Field>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}
