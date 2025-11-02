"use client";

import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
  FieldSeparator,
} from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { NumberInput } from "@/components/ui/number-input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ClientTransaction } from "@/drizzle/schema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { capitalize, formatDate } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  getTransactionFormData,
  updateTransaction,
} from "../actions/transaction-actions";

const transactionSchema = z.object({
  bankAccountId: z.string().min(1, "Bank Account ID is required"),
  categoryId: z.string().min(1, "Category ID is required"),
  transactionType: z.enum(["income", "expense"], {
    message: "Transaction type is required",
  }),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  date: z.date({ message: "Date is required" }),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export function UpdateTransactionForm({
  transaction,
  closeDialog,
}: {
  transaction: ClientTransaction;
  closeDialog: () => void;
}) {
  const { data: session } = authClient.useSession();
  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      bankAccountId: transaction.bankAccountId,
      categoryId: transaction.categoryId,
      transactionType: transaction.transactionType,
      amount: transaction.amount,
      date: transaction.date,
    },
  });
  const [accounts, setAccounts] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<
    { id: string; name: string; categoryType: string }[]
  >([]);
  const filteredCategories = categories.filter(
    (category) => form.watch("transactionType") === category.categoryType,
  );
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    async function fetchData() {
      const { bankAccounts: accountsData, categories: categoriesData } =
        await getTransactionFormData(session?.user.id || "").then(
          (res) => res.data || { bankAccounts: [], categories: [] },
        );
      setAccounts(accountsData);
      setCategories(categoriesData);
      setIsLoading(false);
    }
    fetchData();
  }, [form, session?.user.id]);

  const handleUpdateTransaction = async (data: TransactionFormData) => {
    const res = await updateTransaction(
      transaction.id,
      data as unknown as ClientTransaction,
    );
    if (res.error) {
      toast.error(res.message || "Failed to update transaction");
    } else {
      toast.success("Transaction updated successfully");
      closeDialog();
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <form onSubmit={form.handleSubmit(handleUpdateTransaction)}>
      <FieldGroup>
        <FieldSeparator />
        <Controller
          name="date"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="relative flex-1"
            >
              <FieldLabel htmlFor={field.name}>
                {capitalize(field.name)}
              </FieldLabel>
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
                <FieldError
                  errors={[fieldState.error]}
                  className="absolute top-full text-xs"
                />
              )}
            </Field>
          )}
        />

        <Field orientation={"responsive"}>
          <Controller
            name="bankAccountId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="relative flex-1"
              >
                <FieldLabel htmlFor={field.name}>
                  {capitalize(field.name)}
                </FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Select Bank Account" />
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
                  <FieldError
                    errors={[fieldState.error]}
                    className="absolute top-full text-xs"
                  />
                )}
              </Field>
            )}
          />

          <Controller
            name="amount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="relative flex-1"
              >
                <FieldLabel htmlFor={field.name}>
                  {capitalize(field.name)}
                </FieldLabel>
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
                  <FieldError
                    errors={[fieldState.error]}
                    className="absolute top-full text-xs"
                  />
                )}
              </Field>
            )}
          />
        </Field>

        <Field orientation={"responsive"}>
          <Controller
            name="transactionType"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="relative flex-1"
              >
                <FieldLabel htmlFor={field.name}>
                  {capitalize(field.name)}
                </FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Select Transaction Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <FieldError
                    errors={[fieldState.error]}
                    className="absolute top-full text-xs"
                  />
                )}
              </Field>
            )}
          />

          <Controller
            name="categoryId"
            control={form.control}
            render={({ field, fieldState }) => {
              const selectedType = form.watch("transactionType");
              const filteredCategories = categories.filter(
                (cat) => cat.categoryType === selectedType,
              );
              return (
                <Field
                  data-invalid={fieldState.invalid}
                  className="relative flex-1"
                >
                  <FieldLabel htmlFor={field.name}>
                    {capitalize(field.name)}
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select Category" />
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
                    <FieldError
                      errors={[fieldState.error]}
                      className="absolute top-full text-xs"
                    />
                  )}
                </Field>
              );
            }}
          />
        </Field>
        <FieldSeparator />
        <DialogFooter>
          <Field orientation="horizontal" className="mt-4">
            <Button
              variant="outline"
              className="flex-1"
              type="reset"
              onClick={() => closeDialog()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={form.formState.isSubmitting}
            >
              <LoadingSwap isLoading={form.formState.isSubmitting}>
                Update
              </LoadingSwap>
            </Button>
          </Field>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}
