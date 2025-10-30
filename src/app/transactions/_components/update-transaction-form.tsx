"use client";

import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
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
import { formatDate } from "@/lib/utils";
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
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
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
      data as unknown as Partial<ClientTransaction>,
    );
    if (res.error) {
      toast.error(res.message || "Failed to update transaction");
    } else {
      toast.success("Transaction updated successfully");
      closeDialog();
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleUpdateTransaction)}>
      <FieldGroup className="gap-4">
        <Controller
          name="date"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="date">Date</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    data-empty={!field.value}
                    className="data-[empty=true]:text-muted-foreground"
                    aria-label="Date filter"
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
                  />
                </PopoverContent>
              </Popover>
            </Field>
          )}
        />

        <Field orientation={"responsive"}>
          <Controller
            name="bankAccountId"
            control={form.control}
            render={({ field }) => (
              <Field className="flex-1">
                <FieldLabel htmlFor="bankAccountId">Bank Account</FieldLabel>
                {!isLoading ? (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
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
                ) : (
                  <Loader2 className="animate-spin mx-auto" />
                )}
              </Field>
            )}
          />

          <Controller
            name="categoryId"
            control={form.control}
            render={({ field }) => (
              <Field className="flex-1">
                <FieldLabel htmlFor="categoryId">Category</FieldLabel>
                {!isLoading ? (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Loader2 className="animate-spin mx-auto" />
                )}
              </Field>
            )}
          />
        </Field>

        <Field orientation={"responsive"}>
          <Controller
            name="transactionType"
            control={form.control}
            render={({ field }) => (
              <Field className="flex-1">
                <FieldLabel htmlFor="transactionType">
                  Transaction Type
                </FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Transaction Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />

          <Controller
            name="amount"
            control={form.control}
            render={({ field }) => (
              <Field className="flex-1">
                <div className="flex items-center gap-2">
                  <FieldLabel htmlFor="amount">Amount</FieldLabel>
                  <FieldError errors={[form.formState.errors.amount]} />
                </div>
                <NumberInput
                  id="balance"
                  placeholder="Balance"
                  value={field.value}
                  onChange={field.onChange}
                />
              </Field>
            )}
          />
        </Field>
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
