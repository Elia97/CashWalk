"use client";

import Link from "next/link";
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
import { CalendarIcon, Hand, Loader2 } from "lucide-react";
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
  createTransaction,
  getTransactionFormData,
} from "../actions/transaction-actions";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ButtonGroup } from "@/components/ui/button-group";

const transactionSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  bankAccountId: z.string().min(1, "Bank Account ID is required"),
  categoryId: z.string().min(1, "Category ID is required"),
  transactionType: z.enum(["income", "expense"], {
    message: "Transaction type is required",
  }),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  date: z.date({ message: "Date is required" }),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export function CreateTransactionForm({
  closeDialog,
}: {
  closeDialog: () => void;
}) {
  const { data: session } = authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      userId: "",
      bankAccountId: "",
      categoryId: "",
      transactionType: "expense",
      amount: 0,
      date: new Date(),
    },
  });
  const [accounts, setAccounts] = useState<
    { id: string; name: string; isPrimary: boolean }[]
  >([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );

  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const { bankAccounts: accountsData, categories: categoriesData } =
        await getTransactionFormData(session?.user.id || "").then(
          (res) => res.data || { bankAccounts: [], categories: [] },
        );
      setAccounts(accountsData);
      setCategories(categoriesData);

      form.reset({
        ...form.getValues(),
        userId: session?.user.id || "",
        bankAccountId:
          accountsData.find((a) => a.isPrimary)?.id ||
          accountsData[0]?.id ||
          "",
      });

      setIsLoading(false);
    }
    fetchData();
  }, [form, session?.user.id]);

  const handleAddTransaction = async (data: TransactionFormData) => {
    const res = await createTransaction(data as unknown as ClientTransaction);
    if (res.error) {
      toast.error(res.message || "Failed to create transaction");
    } else {
      toast.success("Transaction created successfully");
      closeDialog();
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (accounts.length === 0 || categories.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Hand />
          </EmptyMedia>
          <EmptyTitle>Add an account and a category to get started</EmptyTitle>
          <EmptyDescription>
            To create a transaction, you need at least one bank account and one
            category. Please add them first.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <ButtonGroup className="w-full">
            {accounts.length === 0 && (
              <ButtonGroup className="flex-1">
                <Button asChild variant={"outline"} className="w-full">
                  <Link href="/accounts">Create a Bank Account</Link>
                </Button>
              </ButtonGroup>
            )}
            {categories.length === 0 && (
              <ButtonGroup className="flex-1">
                <Button asChild variant={"outline"} className="w-full">
                  <Link href="/settings">Create a Category</Link>
                </Button>
              </ButtonGroup>
            )}
          </ButtonGroup>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(handleAddTransaction)}>
      <FieldGroup className="gap-4">
        <Controller
          name="date"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="date">Date</FieldLabel>
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
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
                    onDayClick={() => setShowCalendar(false)}
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
              </Field>
            )}
          />

          <Controller
            name="categoryId"
            control={form.control}
            render={({ field }) => (
              <Field className="flex-1">
                <FieldLabel htmlFor="categoryId">Category</FieldLabel>
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
                  step={0.01}
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
                Add
              </LoadingSwap>
            </Button>
          </Field>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}
