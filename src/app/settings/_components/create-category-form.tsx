"use client";

import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Category } from "@/drizzle/schema";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { createUserCategory } from "../actions/category-actions";
import { emojiList } from "@/lib/emoji-list";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  icon: z.string().max(100, "Icon URL is too long").optional(),
  userId: z.string().min(1, "User ID is required"),
  parentId: z.string().min(1, "Parent ID is required"),
  categoryType: z.enum(["income", "expense"], {
    message: "Category type is required",
  }),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export function CreateCategoryForm({
  closeDialog,
  categories,
}: {
  closeDialog: () => void;
  categories: Category[];
}) {
  const { data: session, isPending } = authClient.useSession();
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      icon: "",
      userId: "",
      parentId: "",
      categoryType: "expense",
    },
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    form.reset({
      ...form.getValues(),
      userId: session?.user.id || "",
    });
  }, [form, session?.user.id]);

  const handleAddCategory = async (data: CategoryFormData) => {
    const res = await createUserCategory(data as unknown as Category);
    if (res.error) {
      toast.error(res.message || "Failed to create category");
    } else {
      toast.success("Category created successfully");
      closeDialog();
    }
  };

  if (isPending) {
    return (
      <section className="flex justify-center h-screen">
        <Loader2 className="animate-spin" />
      </section>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(handleAddCategory)}>
      <FieldGroup className="gap-4">
        <Controller
          name="icon"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="icon">Icon</FieldLabel>
              <div className="relative">
                <Input
                  id="icon"
                  placeholder="Choose an icon"
                  value={field.value}
                  readOnly
                  onClick={() => setShowEmojiPicker((v) => !v)}
                />
                {showEmojiPicker && (
                  <div className="absolute left-0 top-full mt-2 z-50 w-full grid grid-cols-4 sm:grid-cols-6 bg-muted p-4 rounded-lg">
                    {emojiList.map((emoji) => (
                      <button
                        type="button"
                        key={emoji}
                        className={`text-2xl p-1 border rounded hover:bg-accent transition ${
                          field.value === emoji
                            ? "border-primary"
                            : "border-transparent"
                        }`}
                        onClick={() => {
                          field.onChange(emoji);
                          setShowEmojiPicker(false);
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Field>
          )}
        />

        <Field orientation={"responsive"}>
          <Controller
            name="categoryType"
            control={form.control}
            render={({ field }) => (
              <Field className="flex-1">
                <FieldLabel htmlFor="categoryType">Category Type</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />

          <Controller
            name="parentId"
            control={form.control}
            render={({ field }) => (
              <Field className="flex-1">
                <FieldLabel htmlFor="parentId">Parent Category</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
        </Field>

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
                placeholder="Category Name"
                autoComplete="off"
                {...field}
              />
            </Field>
          )}
        />

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
