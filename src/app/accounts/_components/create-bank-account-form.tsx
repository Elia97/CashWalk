"use client";

import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { createUserBankAccount } from "../actions/bank-account-actions";
import z from "zod";
import { ClientBankAccount } from "@/drizzle/schema";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { NumberInput } from "@/components/ui/number-input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const bankAccountSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  userId: z.string().min(1, "User ID is required"),
  balance: z
    .number()
    .min(0, "Balance must be at least 0")
    .max(10_000_000, "Balance is too high"),
  accountType: z.enum(["checking", "savings", "cash"], {
    message: "Type is required",
  }),
  currency: z.enum(["USD", "EUR", "GBP"], {
    message: "Currency is required",
  }),
  accountNumber: z.string().max(18, "Account number is too long").optional(),
});

type BankAccountFormData = z.infer<typeof bankAccountSchema>;

export function CreateBankAccountForm({
  closeDialog,
}: {
  closeDialog: () => void;
}) {
  const { data: session } = authClient.useSession();
  const form = useForm<BankAccountFormData>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      name: "",
      userId: "",
      balance: 0,
      accountType: "checking",
      currency: "EUR",
      accountNumber: "",
    },
  });

  useEffect(() => {
    form.reset({
      ...form.getValues(),
      userId: session?.user.id || "",
    });
  }, [form, session?.user.id]);

  const handleAddBankAccount = async (data: BankAccountFormData) => {
    const res = await createUserBankAccount(
      data as unknown as ClientBankAccount,
    );
    if (res.error) {
      toast.error(res.message || "Failed to create bank account");
    } else {
      toast.success("Bank account created successfully");
      closeDialog();
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleAddBankAccount)}>
      <FieldGroup className="gap-4">
        <Controller
          name="name"
          control={form.control}
          render={({ field }) => (
            <Field>
              <div className="flex items-center gap-2">
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <FieldError errors={[form.formState.errors.name]} />
              </div>
              <Input
                id="name"
                placeholder="Your Account Name"
                autoComplete="additional-name"
                {...field}
              />
            </Field>
          )}
        />

        <Controller
          name="balance"
          control={form.control}
          render={({ field }) => (
            <Field>
              <div className="flex items-center gap-2">
                <FieldLabel htmlFor="balance">Balance</FieldLabel>
                <FieldError errors={[form.formState.errors.balance]} />
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

        <Controller
          name="accountType"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="accountType">Type</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        <Controller
          name="currency"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="currency">Currency</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        <Controller
          name="accountNumber"
          control={form.control}
          render={({ field }) => (
            <Field>
              <div className="flex items-center gap-2">
                <FieldLabel htmlFor="accountNumber">Account Number</FieldLabel>
                <FieldError errors={[form.formState.errors.accountNumber]} />
              </div>

              <Input
                id="accountNumber"
                placeholder="Your Account Number"
                autoComplete="off"
                {...field}
              />
            </Field>
          )}
        />

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
