import { Category, CategoryWithChildren } from "@/drizzle/schema";
import {
  getAllUserCategories,
  createCategory,
  deleteCategoryById,
  updateCategoryById,
} from "@/repo/category-repository";

export type CategoryActionResponse<T = void> = {
  error: boolean;
  data?: T;
  message?: string;
};

export class CategoryService {
  static async findUserCategories(
    userId: string,
  ): Promise<CategoryActionResponse<CategoryWithChildren[]>> {
    return this.handleErrors(
      async () => await getAllUserCategories(userId),
      "Failed to retrieve categories",
    );
  }

  static async createCategory(data: Category): Promise<CategoryActionResponse> {
    return this.handleErrors(async () => {
      await createCategory(data);
    }, "Failed to create category");
  }

  static async deleteCategory(id: string): Promise<CategoryActionResponse> {
    return this.handleErrors(async () => {
      await deleteCategoryById(id);
    }, "Failed to delete category");
  }

  static async updateCategory(
    id: string,
    data: Partial<Category>,
  ): Promise<CategoryActionResponse> {
    return this.handleErrors(async () => {
      await updateCategoryById(id, data);
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
