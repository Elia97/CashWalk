"use client";

import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
  FieldSeparator,
  FieldContent,
  FieldDescription,
  FieldLegend,
  FieldSet,
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
import { updateUserCategory } from "../actions/category-actions";
import { toast } from "sonner";
import { capitalize } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { categoryIconGroups } from "@/lib/category-icons";

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
      <FieldGroup>
        <FieldSeparator />
        <FieldSet>
          <FieldLegend>Update Category</FieldLegend>
          <FieldDescription>
            Change the name or icon to better suit your needs.
          </FieldDescription>
          <Field orientation={"responsive"}>
            <Controller
              name="icon"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="relative flex-1"
                >
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>
                      {capitalize(field.name)}
                    </FieldLabel>
                    <FieldDescription>
                      Pick a different icon if you&apos;d like.
                    </FieldDescription>
                  </FieldContent>
                  <Popover
                    open={showEmojiPicker}
                    onOpenChange={setShowEmojiPicker}
                  >
                    <PopoverTrigger asChild>
                      <Input
                        id={field.name}
                        placeholder="Pick an icon"
                        value={field.value || ""}
                        readOnly
                        className="text-2xl text-center cursor-pointer"
                      />
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-72 max-h-60 overflow-y-auto scrollbar"
                      onWheel={(e) => e.stopPropagation()}
                      side="top"
                      align="center"
                      sideOffset={5}
                      avoidCollisions={false}
                    >
                      {/* Griglia icone organizzate per gruppo */}
                      <div className="space-y-4">
                        {Object.entries(categoryIconGroups)
                          .filter(([key]) => key !== "all")
                          .map(([key, group]) => (
                            <div key={key}>
                              <h4 className="text-xs font-semibold text-muted-foreground mb-2">
                                {group.label}
                              </h4>
                              <div className="grid grid-cols-5 gap-1">
                                {group.icons.map((icon) => (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    key={icon}
                                    className={`h-10 w-10 p-0 text-xl ${
                                      field.value === icon
                                        ? "border-primary bg-primary/10"
                                        : ""
                                    }`}
                                    onClick={() => {
                                      field.onChange(icon);
                                      setShowEmojiPicker(false);
                                    }}
                                  >
                                    {icon}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  {fieldState.error && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="absolute top-full text-xs"
                    />
                  )}
                </Field>
              )}
            />

            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="relative flex-1"
                >
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>
                      {capitalize(field.name)}
                    </FieldLabel>
                    <FieldDescription>
                      Give it a new name if needed.
                    </FieldDescription>
                  </FieldContent>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Category Name"
                    autoComplete="off"
                  />
                  {fieldState.error && (
                    <FieldError
                      errors={[fieldState.error]}
                      className="absolute top-full text-xs"
                    />
                  )}
                </Field>
              )}
            />
          </Field>
        </FieldSet>
        <FieldSeparator />
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
                Save Changes
              </LoadingSwap>
            </Button>
          </Field>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}
