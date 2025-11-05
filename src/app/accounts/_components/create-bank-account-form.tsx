"use client";

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
import { capitalize } from "@/lib/utils";

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
      <FieldGroup>
        <FieldSeparator />
        <FieldSet>
          <FieldLegend>Account Details</FieldLegend>
          <FieldDescription>Tell us about your new account.</FieldDescription>
          <Field orientation={"responsive"}>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="relative flex-1"
                >
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>
                      {capitalize(field.name)}
                    </FieldLabel>
                    <FieldDescription>
                      Give it a name you&apos;ll recognize.
                    </FieldDescription>
                  </FieldContent>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Savings Account"
                    autoComplete="off"
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

            <Controller
              name="accountType"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="relative flex-1"
                >
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>
                      {capitalize(field.name)}
                    </FieldLabel>
                    <FieldDescription>
                      What kind of account is this?
                    </FieldDescription>
                  </FieldContent>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Choose type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Checking</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
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
          </Field>
        </FieldSet>
        <FieldSeparator />
        <FieldSet>
          <FieldLegend>Financial Details</FieldLegend>
          <FieldDescription>
            Set your currency and starting balance.
          </FieldDescription>
          <Field orientation="responsive">
            <Controller
              name="currency"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="relative flex-1"
                >
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>
                      {capitalize(field.name)}
                    </FieldLabel>
                    <FieldDescription>
                      Which currency do you use?
                    </FieldDescription>
                  </FieldContent>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Choose currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
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
              name="balance"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="relative flex-1"
                >
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>
                      {capitalize(field.name)}
                    </FieldLabel>
                    <FieldDescription>
                      Current balance in this account.
                    </FieldDescription>
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
                    <FieldError
                      errors={[fieldState.error]}
                      className="absolute top-full text-xs"
                    />
                  )}
                </Field>
              )}
            />
          </Field>

          <Controller
            name="accountNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="relative flex-1"
              >
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>
                    {capitalize(field.name)}
                  </FieldLabel>
                  <FieldDescription>
                    Optional - for your reference only.
                  </FieldDescription>
                </FieldContent>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="1234567890"
                  autoComplete="off"
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
        </FieldSet>
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
                Add Account
              </LoadingSwap>
            </Button>
          </Field>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}
