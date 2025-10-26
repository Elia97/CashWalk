"use client";

import Link from "next/link";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm } from "react-hook-form";
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
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { PasswordInput } from "@/components/ui/password-input";

const resetPasswordSchema = z.object({
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
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
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(handleResetPassword)}
            >
              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="Your Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password Field */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Confirm Your Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                <LoadingSwap isLoading={form.formState.isSubmitting}>
                  Reset Password
                </LoadingSwap>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
