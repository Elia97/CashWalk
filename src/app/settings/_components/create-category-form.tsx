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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const { data: session } = authClient.useSession();
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

  return (
    <form onSubmit={form.handleSubmit(handleAddCategory)}>
      <FieldGroup className="gap-4">
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
            render={({ field }) => {
              const selectedType = form.watch("categoryType");
              const filteredCategories = categories.filter(
                (cat) => cat.categoryType === selectedType,
              );

              return (
                <Field className="flex-1">
                  <FieldLabel htmlFor="parentId">Parent Category</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent category" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.icon && category.icon} {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              );
            }}
          />
        </Field>

        <Field orientation={"responsive"}>
          <Controller
            name="icon"
            control={form.control}
            render={({ field }) => (
              <Field className="flex-1">
                <FieldLabel htmlFor="icon">Icon</FieldLabel>
                <Popover
                  open={showEmojiPicker}
                  onOpenChange={setShowEmojiPicker}
                >
                  <PopoverTrigger asChild>
                    <Input
                      id="icon"
                      placeholder="Choose an icon"
                      value={field.value}
                      readOnly
                    />
                  </PopoverTrigger>
                  <PopoverContent className="text-center">
                    {emojiList.map((emoji) => (
                      <Button
                        variant={"ghost"}
                        key={emoji}
                        className={`text-xl ${
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
                      </Button>
                    ))}
                  </PopoverContent>
                </Popover>
              </Field>
            )}
          />

          <Controller
            name="name"
            control={form.control}
            render={({ field }) => (
              <Field className="flex-1">
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
        </Field>

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
