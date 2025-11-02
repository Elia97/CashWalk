"use client";

import z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Passkey } from "better-auth/plugins/passkey";
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { capitalize } from "@/lib/utils";

const passkeySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
});

type PasskeyFormData = z.infer<typeof passkeySchema>;

export function PasskeyManagement({ passkeys }: { passkeys: Passkey[] }) {
  const router = useRouter();
  const form = useForm<PasskeyFormData>({
    resolver: zodResolver(passkeySchema),
    defaultValues: {
      name: "",
    },
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddPasskey = async (data: PasskeyFormData) => {
    await authClient.passkey.addPasskey(data, {
      onError: (error) => {
        toast.error(error.error.message || "Failed to add passkey");
      },
      onSuccess: () => {
        router.refresh();
        setIsDialogOpen(false);
      },
    });
  };

  return (
    <div className="space-y-6">
      {passkeys.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No passkeys yet</CardTitle>
            <CardDescription>
              Add your first for secure, passwordless authentication
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-4">
          {passkeys.map((passkey) => (
            <Card key={passkey.id}>
              <CardHeader className="flex gap-2 justify-between items-center">
                <div className="space-y-1">
                  <CardTitle>{passkey.name}</CardTitle>
                  <CardDescription>
                    Created at:{" "}
                    {new Date(passkey.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                <BetterAuthActionButton
                  requireAreYouSure
                  variant={"destructive"}
                  size={"icon"}
                  action={() =>
                    authClient.passkey.deletePasskey(
                      { id: passkey.id },
                      {
                        onSuccess: () => router.refresh(),
                      },
                    )
                  }
                >
                  <Trash2 />
                </BetterAuthActionButton>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(o) => {
          if (o) form.reset();
          setIsDialogOpen(o);
        }}
      >
        <DialogTrigger asChild>
          <Button>New Passkey</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Passkey</DialogTitle>
            <DialogDescription>
              Create a new passkey for secure, passwordless authentication
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleAddPasskey)}>
            <FieldGroup>
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
                        placeholder="Passkey Name"
                        autoComplete="off"
                      />
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />

              <Field orientation="horizontal">
                <Button
                  type="submit"
                  className="w-full mt-4"
                  disabled={form.formState.isSubmitting}
                >
                  <LoadingSwap isLoading={form.formState.isSubmitting}>
                    Add
                  </LoadingSwap>
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
