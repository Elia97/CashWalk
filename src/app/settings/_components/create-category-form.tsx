"use client";

import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldSeparator,
  FieldContent,
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
import { categoryIconGroups } from "@/lib/category-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { capitalize } from "@/lib/utils";

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
      <FieldGroup>
        <FieldSeparator />
        <FieldSet>
          <FieldLegend>Category Details</FieldLegend>
          <FieldDescription>
            Choose first the category type and then select a parent category.
          </FieldDescription>
          <Field orientation={"responsive"}>
            <Controller
              name="categoryType"
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
                      Select from income or expense
                    </FieldDescription>
                  </FieldContent>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select category type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
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
              name="parentId"
              control={form.control}
              render={({ field, fieldState }) => {
                const selectedType = form.watch("categoryType");
                const filteredCategories = categories.filter(
                  (cat) => cat.categoryType === selectedType,
                );

                return (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="relative flex-1"
                  >
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>
                        {capitalize(field.name)}
                      </FieldLabel>
                      <FieldDescription>
                        Select a parent category.
                      </FieldDescription>
                    </FieldContent>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                      >
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
                    {fieldState.error && (
                      <FieldError
                        errors={[fieldState.error]}
                        className="absolute top-full text-xs"
                      />
                    )}
                  </Field>
                );
              }}
            />
          </Field>
        </FieldSet>
        <FieldSeparator />
        <FieldSet>
          <FieldLegend>Category Info</FieldLegend>
          <FieldDescription>
            Choose an icon and a name for your new category.
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
                      Select an icon for your category.
                    </FieldDescription>
                  </FieldContent>
                  <Popover
                    open={showEmojiPicker}
                    onOpenChange={setShowEmojiPicker}
                  >
                    <PopoverTrigger asChild>
                      <Input
                        id={field.name}
                        placeholder="Choose an icon"
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
                      Enter the category name.
                    </FieldDescription>
                  </FieldContent>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Your Category Name"
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
                Add
              </LoadingSwap>
            </Button>
          </Field>
        </DialogFooter>
      </FieldGroup>
    </form>
  );
}
