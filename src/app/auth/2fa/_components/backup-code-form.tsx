"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm } from "react-hook-form";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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

const backupCodeFormSchema = z.object({
  code: z.string().min(1),
});

type BackupCodeFormData = z.infer<typeof backupCodeFormSchema>;

export function BackupCodeForm() {
  const router = useRouter();
  const form = useForm<BackupCodeFormData>({
    resolver: zodResolver(backupCodeFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleBackupCodeSubmit = async (data: BackupCodeFormData) => {
    await authClient.twoFactor.verifyBackupCode(data, {
      onError: (error) => {
        toast.error(error.error.message || "Failed to verify code");
      },
      onSuccess: () => {
        router.push("/");
      },
    });
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(handleBackupCodeSubmit)}
      >
        {/* Code Field */}
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Backup Code</FormLabel>
              <FormControl>
                <Input placeholder="Your Code" {...field} />
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
            Verify
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
}
