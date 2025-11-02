"use client";

import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
  FieldContent,
  FieldDescription,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { updateUserBankAccount } from "../actions/bank-account-actions";
import z from "zod";
import { ClientBankAccount } from "@/drizzle/schema";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
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

export function UpdateBankAccountForm({
  account,
  closeDialog,
}: {
  account: ClientBankAccount;
  closeDialog: () => void;
}) {
  const form = useForm<BankAccountFormData>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      name: account.name,
      balance: account.balance,
      accountType: account.accountType as BankAccountFormData["accountType"],
      currency: account.currency as BankAccountFormData["currency"],
      accountNumber: account.accountNumber ?? "",
    },
  });

  const handleUpdateBankAccount = async (data: BankAccountFormData) => {
    const res = await updateUserBankAccount(
      account.id,
      data as unknown as ClientBankAccount,
    );
    if (res.error) {
      toast.error(res.message || "Failed to update bank account");
    } else {
      toast.success("Bank account updated successfully");
      closeDialog();
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleUpdateBankAccount)}>
      <FieldGroup>
        <FieldSeparator />
        <FieldSet>
          <FieldLegend>Account details</FieldLegend>
          <FieldDescription>
            Provide the details of the bank account.
          </FieldDescription>
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
                      Your bank account display name.
                    </FieldDescription>
                  </FieldContent>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Your Bank Account Name"
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
                      Select the type of bank account.
                    </FieldDescription>
                  </FieldContent>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select type" />
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
          <FieldLegend>Additional info</FieldLegend>
          <FieldDescription>
            Provide any additional information about the bank account.
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
                      Select the currency for the account.
                    </FieldDescription>
                  </FieldContent>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select currency" />
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
                      Initial balance ({form.watch("currency")}).
                    </FieldDescription>
                  </FieldContent>
                  <NumberInput
                    id="balance"
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
                    Your bank account number (optional).
                  </FieldDescription>
                </FieldContent>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
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
