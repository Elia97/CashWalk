"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  LoadingSwap,
} from "@/components/ui";

const profileUpdateSchema = z.object({
  name: z.string().min(1),
  email: z.email().min(1),
});

type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;

export function ProfileUpdateForm({
  user,
}: {
  user: { name?: string; email?: string };
}) {
  const router = useRouter();
  const form = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: user,
  });

  const handleProfileUpdate = async (data: ProfileUpdateFormData) => {
    const promises = [
      authClient.updateUser({
        name: data.name,
      }),
    ];
    if (data.email !== user.email) {
      promises.push(
        authClient.changeEmail({
          newEmail: data.email,
          callbackURL: "/profile",
        }),
      );
    }
    const res = await Promise.all(promises);
    const updateUserResult = res[0];
    const changeEmailResult = res[1] ?? { error: false };

    if (updateUserResult.error) {
      toast.error(
        updateUserResult.error.message || "Failed to update profile.",
      );
    } else if (changeEmailResult.error) {
      toast.error(
        changeEmailResult.error.message || "Failed to change email address.",
      );
    } else {
      if (data.email !== user.email) {
        toast.success(
          "Profile updated! Please check your new email to verify the change.",
        );
      } else {
        toast.success("Profile updated successfully!");
      }
      router.refresh();
    }
  };

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(handleProfileUpdate)}
      >
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Your Email" {...field} />
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
            Update Profile
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
}
