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
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { useState } from "react";
import { emojiList } from "@/lib/emoji-list";
import { updateUserCategory } from "../actions/category-actions";
import { toast } from "sonner";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  icon: z.string().max(100, "Icon URL is too long").optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export function UpdateCategoryForm({
  category,
  closeDialog,
}: {
  category: Category;
  closeDialog: () => void;
}) {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category.name,
      icon: category.icon || undefined,
    },
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleUpdateCategory = async (data: CategoryFormData) => {
    const res = await updateUserCategory(
      category.id,
      data as unknown as Category,
    );
    if (res.error) {
      toast.error(res.message || "Failed to update category");
    } else {
      toast.success("Category updated successfully");
      closeDialog();
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleUpdateCategory)}>
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
