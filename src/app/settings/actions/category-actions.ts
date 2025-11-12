'use server';

import { Category, CategoryWithChildren } from '@/drizzle/schema';
import { CategoryService } from '@/services/category-service';
import { revalidatePath } from 'next/cache';

type ActionResult<T = void> = {
  error: boolean;
  data?: T;
  message?: string;
};

const service = new CategoryService();

export async function getAllUserCategories(
  userId: string,
): Promise<ActionResult<CategoryWithChildren[]>> {
  return await service.getAll(userId);
}

export async function createUserCategory(data: Category): Promise<ActionResult<Category>> {
  const result = await service.create(data);
  if (!result.error) {
    revalidatePath('/settings');
  }
  return result;
}

export async function deleteUserCategory(id: string): Promise<ActionResult<Category>> {
  const result = await service.delete(id);
  if (!result.error) {
    revalidatePath('/settings');
  }
  return result;
}

export async function updateUserCategory(
  categoryId: string,
  data: Category,
): Promise<ActionResult<Category>> {
  const result = await service.update(categoryId, data);
  if (!result.error) {
    revalidatePath('/settings');
  }
  return result;
}
