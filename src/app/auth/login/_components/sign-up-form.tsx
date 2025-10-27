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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const signUpSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    email: z.email().min(1, "Email is required").max(100, "Email is too long"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
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
      <FieldGroup className="gap-4">
        {/* Name Field */}
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
                placeholder="Your Name"
                autoComplete="name webauthn"
                {...field}
              />
            </Field>
          )}
        />

        {/* Email Field */}
        <Controller
          name="email"
          control={form.control}
          render={({ field }) => (
            <Field>
              <div className="flex items-center gap-2">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <FieldError errors={[form.formState.errors.email]} />
              </div>
              <Input
                id="email"
                placeholder="Your Email"
                autoComplete="email webauthn"
                {...field}
              />
            </Field>
          )}
        />

        {/* Password Field */}
        <Controller
          name="password"
          control={form.control}
          render={({ field }) => (
            <Field>
              <div className="flex items-center gap-2">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <FieldError errors={[form.formState.errors.password]} />
              </div>
              <PasswordInput
                id="password"
                placeholder="Your Password"
                autoComplete="new-password webauthn"
                {...field}
              />
            </Field>
          )}
        />

        {/* Confirm Password Field */}
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field }) => (
            <Field>
              <div className="flex items-center gap-2">
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <FieldError errors={[form.formState.errors.confirmPassword]} />
              </div>
              <PasswordInput
                id="confirmPassword"
                placeholder="Confirm Your Password"
                autoComplete="new-password webauthn"
                {...field}
              />
            </Field>
          )}
        />

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
