"use server";

import { Category, CategoryWithChildren } from "@/drizzle/schema";
import {
  type CategoryActionResponse,
  CategoryService,
} from "@/services/category-service";
import { revalidatePath } from "next/cache";

export async function getUserCategories(
  userId: string,
): Promise<CategoryActionResponse<CategoryWithChildren[]>> {
  if (!userId || typeof userId !== "string") throw new Error("Invalid user ID");
  return await CategoryService.findUserCategories(userId);
}

export async function createUserCategory(
  data: Category,
): Promise<CategoryActionResponse> {
  if (!data.userId || typeof data.userId !== "string")
    throw new Error("Invalid user ID");
  revalidatePath("/settings");
  return await CategoryService.createCategory(data);
}

export async function deleteUserCategory(
  id: string,
): Promise<CategoryActionResponse> {
  if (!id || typeof id !== "string") throw new Error("Invalid category ID");
  revalidatePath("/settings");
  return await CategoryService.deleteCategory(id);
}

export async function updateUserCategory(
  categoryId: string,
  data: Partial<Category>,
): Promise<CategoryActionResponse> {
  if (!categoryId || typeof categoryId !== "string")
    throw new Error("Invalid category ID");
  revalidatePath("/settings");
  return await CategoryService.updateCategory(categoryId, data);
}
