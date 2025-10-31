import { Category, CategoryWithChildren } from "@/drizzle/schema";
import {
  findManyCategoriesByUserId,
  insertCategory,
  deleteCategoryById,
  updateCategoryById,
  findFirstCategoryById,
} from "@/repo/category-repository";
import { findFirstUserById } from "@/repo/user-repository";

export type CategoryActionResponse<T = void> = {
  error: boolean;
  data?: T;
  message?: string;
};

export class CategoryService {
  static async findUserCategories(
    userId: string,
  ): Promise<CategoryActionResponse<CategoryWithChildren[]>> {
    return this.handleErrors(async () => {
      const user = await findFirstUserById(userId);
      if (!user) throw new Error("User not found");
      return await findManyCategoriesByUserId(userId);
    }, "Failed to retrieve categories");
  }

  static async createCategory(data: Category): Promise<CategoryActionResponse> {
    return this.handleErrors(async () => {
      const user = await findFirstUserById(data.userId!);
      if (!user) throw new Error("User not found");
      return await insertCategory(data);
    }, "Failed to create category");
  }

  static async deleteCategory(id: string): Promise<CategoryActionResponse> {
    return this.handleErrors(async () => {
      const category = await findFirstCategoryById(id);
      if (!category) throw new Error("Category not found");
      return await deleteCategoryById(id);
    }, "Failed to delete category");
  }

  static async updateCategory(
    id: string,
    data: Category,
  ): Promise<CategoryActionResponse> {
    return this.handleErrors(async () => {
      const category = await findFirstCategoryById(id);
      if (!category) throw new Error("Category not found");
      return await updateCategoryById(id, data);
    }, "Failed to update category");
  }

  static async handleErrors<T>(
    fn: () => Promise<T>,
    defaultMessage = "An error occurred",
  ): Promise<CategoryActionResponse<T>> {
    try {
      const data = await fn();
      return { error: false, data: data! };
    } catch (error: unknown) {
      return {
        error: true,
        message: error instanceof Error ? error.message : defaultMessage,
      };
    }
  }
}
