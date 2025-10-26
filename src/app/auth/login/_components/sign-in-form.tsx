"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";
import { authClient } from "@/lib/auth/auth-client";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { PasswordInput } from "@/components/ui/password-input";

const signInSchema = z.object({
  email: z.email().min(1),
  password: z.string().min(6),
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
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { refetch } = authClient.useSession();

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
      { ...data, callbackURL: "/" },
      {
        onError: (error) => {
          if (error.error.code === "EMAIL_NOT_VERIFIED") {
            openEmailVerificationTab(data.email);
          }
          toast.error(error.error.message || "Failed to sign in");
        },
        onSuccess: () => {
          router.push("/");
        },
      },
    );
    form.reset();
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSignIn)}>
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    autoComplete="email webauthn"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>Password</FormLabel>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="text-sm font-normal underline"
                    onClick={openForgotPasswordTab}
                  >
                    Forgot Password?
                  </Button>
                </div>
                <FormControl>
                  <PasswordInput
                    placeholder="Your Password"
                    autoComplete="current-password webauthn"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full mt-4"
            disabled={form.formState.isSubmitting}
          >
            <LoadingSwap isLoading={form.formState.isSubmitting}>
              Sign In
            </LoadingSwap>
          </Button>
        </form>
      </Form>
      <BetterAuthActionButton
        variant={"outline"}
        className="w-full"
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
    </div>
  );
}
