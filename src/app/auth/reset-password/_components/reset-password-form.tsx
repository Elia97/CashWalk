"use client";

import Link from "next/link";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(100, "Password is too long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters long")
      .max(100, "Confirm Password is too long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const error = searchParams.get("error");
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    if (!token) return;
    await authClient.resetPassword(
      {
        newPassword: data.password,
        token: token,
      },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to reset password");
        },
        onSuccess: () => {
          toast.success("Password reset successfully", {
            description: "Redirecting to login...",
          });
          setTimeout(() => {
            router.push("/auth/login");
          }, 1000);
        },
      },
    );
    form.reset();
  };

  if (token === null || error !== null) {
    return (
      <div className="my-6 px-4">
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Invalid Reset Link
            </CardTitle>
            <CardDescription>
              The reset link is either invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href={"/auth/login"}>Back to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="my-6 px-4">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleResetPassword)}
          >
            <FieldGroup className="gap-4">
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
                      <FieldError
                        errors={[form.formState.errors.confirmPassword]}
                      />
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
                    Reset Password
                  </LoadingSwap>
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
