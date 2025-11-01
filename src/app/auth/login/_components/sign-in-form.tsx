"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";
import { authClient } from "@/lib/auth/auth-client";
import { useEffect } from "react";
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

const signInSchema = z.object({
  email: z.email().min(1, "Email is required").max(100, "Email is too long"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password is too long"),
});

type SignInFormData = z.infer<typeof signInSchema>;

export function SignInForm({
  openEmailVerificationTab,
  openForgotPasswordTab,
}: {
  openEmailVerificationTab: (email: string) => void;
  openForgotPasswordTab: () => void;
}) {
  const router = useRouter();
  const { refetch } = authClient.useSession();
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    authClient.signIn.passkey(
      { autoFill: true },
      {
        onSuccess: () => {
          refetch();
          router.push("/");
        },
      },
    );
  }, [refetch, router]);

  const handleSignIn = async (data: SignInFormData) => {
    await authClient.signIn.email(
      { ...data, callbackURL: "/overview" },
      {
        onError: (error) => {
          if (error.error.code === "EMAIL_NOT_VERIFIED") {
            openEmailVerificationTab(data.email);
          }
          toast.error(error.error.message || "Failed to sign in");
        },
        onSuccess: () => {
          toast.success("Successfully signed in");
        },
      },
    );
    form.reset();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={form.handleSubmit(handleSignIn)}>
        <FieldGroup className="gap-4">
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
                  autoComplete="current-password webauthn"
                  {...field}
                />
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="text-sm font-normal hover:underline"
                    onClick={openForgotPasswordTab}
                  >
                    Forgot Password?
                  </Button>
                </div>
              </Field>
            )}
          />

          <Field orientation="horizontal">
            <Button
              type="submit"
              className="flex-1"
              disabled={form.formState.isSubmitting}
            >
              <LoadingSwap isLoading={form.formState.isSubmitting}>
                Sign In
              </LoadingSwap>
            </Button>
            <BetterAuthActionButton
              variant={"outline"}
              className="flex-1"
              action={() =>
                authClient.signIn.passkey(undefined, {
                  onSuccess: () => {
                    refetch();
                    router.push("/");
                  },
                })
              }
            >
              Use Passkey
            </BetterAuthActionButton>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
