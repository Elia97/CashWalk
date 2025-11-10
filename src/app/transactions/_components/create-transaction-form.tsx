'use client';

import Link from 'next/link';
import { FieldGroup, Field, FieldLabel, FieldError, FieldSeparator } from '@/components/ui/field';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Hand, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { LoadingSwap } from '@/components/ui/loading-swap';
import { NumberInput } from '@/components/ui/number-input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { ClientTransaction } from '@/drizzle/schema';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { capitalize, formatDate } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { createTransaction, getTransactionFormData } from '../actions/transaction-actions';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { ButtonGroup } from '@/components/ui/button-group';
import { useRouter } from 'next/navigation';

const transactionSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  bankAccountId: z.string().min(1, 'Bank Account ID is required'),
  categoryId: z.string().min(1, 'Category ID is required'),
  transactionType: z.enum(['income', 'expense'], {
    message: 'Transaction type is required',
  }),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  date: z.date({ message: 'Date is required' }),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export function CreateTransactionForm({ closeDialog }: { closeDialog: () => void }) {
  const { data: session } = authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      userId: '',
      bankAccountId: '',
      categoryId: '',
      transactionType: 'expense',
      amount: 0,
      date: (() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
      })(),
    },
  });
  const [accounts, setAccounts] = useState<{ id: string; name: string; isPrimary: boolean }[]>([]);
  const [categories, setCategories] = useState<
    { id: string; name: string; categoryType: string }[]
  >([]);

  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const { bankAccounts: accountsData, categories: categoriesData } =
        await getTransactionFormData(session?.user.id || '').then(
          (res) => res.data || { bankAccounts: [], categories: [] },
        );
      setAccounts(accountsData);
      setCategories(categoriesData);

      form.reset({
        ...form.getValues(),
        userId: session?.user.id || '',
        bankAccountId: accountsData.find((a) => a.isPrimary)?.id || accountsData[0]?.id || '',
      });

      setIsLoading(false);
    }
    fetchData();
  }, [form, session?.user.id]);

  const handleAddTransaction = async (data: TransactionFormData) => {
    const normalizedData = {
      ...data,
      date: new Date(data.date.setHours(0, 0, 0, 0)),
    };
    const res = await createTransaction(normalizedData as unknown as ClientTransaction);
    if (res.error) {
      toast.error(res.message || 'Failed to create transaction');
    } else {
      toast.success('Transaction created successfully');
      router.refresh();
      closeDialog();
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (categories.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Hand />
          </EmptyMedia>
          <EmptyTitle>No categories yet</EmptyTitle>
          <EmptyDescription>
            Let&apos;s create your first category before adding transactions.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <ButtonGroup className="w-full">
            <ButtonGroup className="flex-1">
              <Button asChild variant={'outline'} className="w-full">
                <Link href="/settings">Create a Category</Link>
              </Button>
            </ButtonGroup>
          </ButtonGroup>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(handleAddTransaction)}>
      <FieldGroup>
        <FieldSeparator />
        <Controller
          name="date"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="relative flex-1">
              <FieldLabel htmlFor={field.name}>{capitalize(field.name)}</FieldLabel>
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    id={field.name}
                    variant="outline"
                    data-empty={!field.value}
                    className="data-[empty=true]:text-muted-foreground"
                    aria-label="Date filter"
                    aria-invalid={fieldState.invalid}
                  >
                    <CalendarIcon />
                    {formatDate(field.value)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    onDayClick={() => setShowCalendar(false)}
                  />
                </PopoverContent>
              </Popover>
              {fieldState.error && (
                <FieldError errors={[fieldState.error]} className="absolute top-full text-xs" />
              )}
            </Field>
          )}
        />

        <Field orientation={'responsive'}>
          <Controller
            name="bankAccountId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="relative flex-1">
                <FieldLabel htmlFor={field.name}>{capitalize(field.name)}</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger {...field} id={field.name} aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Choose account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <FieldError errors={[fieldState.error]} className="absolute top-full text-xs" />
                )}
              </Field>
            )}
          />

          <Controller
            name="amount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="relative flex-1">
                <FieldLabel htmlFor={field.name}>{capitalize(field.name)}</FieldLabel>
                <NumberInput
                  {...field}
                  id={field.name}
                  placeholder="0"
                  value={field.value}
                  onChange={field.onChange}
                  min={0}
                  step={0.01}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error && (
                  <FieldError errors={[fieldState.error]} className="absolute top-full text-xs" />
                )}
              </Field>
            )}
          />
        </Field>

        <Field orientation={'responsive'}>
          <Controller
            name="transactionType"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="relative flex-1">
                <FieldLabel htmlFor={field.name}>{capitalize(field.name)}</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger {...field} id={field.name} aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Income or Expense?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <FieldError errors={[fieldState.error]} className="absolute top-full text-xs" />
                )}
              </Field>
            )}
          />

          <Controller
            name="categoryId"
            control={form.control}
            render={({ field, fieldState }) => {
              const selectedType = form.watch('transactionType');
              const filteredCategories = categories.filter(
                (cat) => cat.categoryType === selectedType,
              );
              return (
                <Field data-invalid={fieldState.invalid} className="relative flex-1">
                  <FieldLabel htmlFor={field.name}>{capitalize(field.name)}</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger {...field} id={field.name} aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Choose category" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} className="absolute top-full text-xs" />
                  )}
                </Field>
              );
            }}
          />
        </Field>
        <FieldSeparator />
        <DialogFooter>
          <Field orientation="horizontal" className="mt-4">
            <Button variant="outline" className="flex-1" type="reset" onClick={() => closeDialog()}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={form.formState.isSubmitting}>
              <LoadingSwap isLoading={form.formState.isSubmitting}>Add Transaction</LoadingSwap>
            </Button>
          </Field>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}
