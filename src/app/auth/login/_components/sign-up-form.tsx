"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { capitalize } from "@/lib/utils";

const signUpSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    email: z.email().min(1, "Email is required").max(100, "Email is too long"),
    password: z
      .string()
      .min(6, "Password is too short")
      .max(100, "Password is too long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password is required")
      .max(100, "Confirm Password is too long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export function SignUpForm({
  openEmailVerificationTab,
}: {
  openEmailVerificationTab: (email: string) => void;
}) {
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSignUp = async (data: SignUpFormData) => {
    const res = await authClient.signUp.email(
      { ...data, callbackURL: "/" },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to sign up");
        },
      },
    );
    if (res.error === null && !res.data.user.emailVerified) {
      openEmailVerificationTab(data.email);
    }
    form.reset();
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSignUp)}>
      <FieldGroup>
        <FieldGroup>
          <Field orientation={"responsive"}>
            {/* Name Field */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="flex-1">
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>
                      {capitalize(field.name)}
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Your Name"
                      autoComplete="name webauthn"
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
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
                    <FieldLabel htmlFor={field.name}>
                      {capitalize(field.name)}
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Your Email"
                      autoComplete="email webauthn"
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                </Field>
              )}
            />
          </Field>

          <Field orientation={"responsive"}>
            {/* Password Field */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="flex-1">
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>
                      {capitalize(field.name)}
                    </FieldLabel>
                    <PasswordInput
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Your Password"
                      autoComplete="new-password webauthn"
                    />
                    {fieldState.error && (
                      <FieldError
                        errors={[fieldState.error]}
                        className="text-nowrap"
                      />
                    )}
                  </FieldContent>
                </Field>
              )}
            />

            {/* Confirm Password Field */}
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="flex-1">
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>
                      {capitalize(field.name)}
                    </FieldLabel>
                    <PasswordInput
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Confirm Your Password"
                      autoComplete="new-password webauthn"
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                </Field>
              )}
            />
          </Field>
        </FieldGroup>

        <Field orientation="horizontal">
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            <LoadingSwap isLoading={form.formState.isSubmitting}>
              Sign Up
            </LoadingSwap>
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
