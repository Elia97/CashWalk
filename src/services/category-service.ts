import { Category, CategoryWithChildren } from '@/drizzle/schema';
import { CategoryRepository } from '@/repo/category-repository';

type ServiceResult<T = void> = {
  error: boolean;
  data?: T;
  message?: string;
};

export class CategoryService {
  private repository: CategoryRepository;

  constructor() {
    this.repository = new CategoryRepository();
  }

  private async handleErrors<T>(
    fn: () => Promise<T>,
    defaultMessage = 'An error occurred',
  ): Promise<ServiceResult<T>> {
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

  async getAll(userId: string): Promise<ServiceResult<CategoryWithChildren[]>> {
    return this.handleErrors(
      async () => await this.repository.findAll(userId),
      'Failed to retrieve categories',
    );
  }

  async create(data: Category): Promise<ServiceResult<Category>> {
    return this.handleErrors(
      async () => await this.repository.insert(data),
      'Failed to create category',
    );
  }

  async delete(categoryId: string): Promise<ServiceResult<Category>> {
    return this.handleErrors(
      async () => await this.repository.delete(categoryId),
      'Failed to delete category',
    );
  }

  async update(categoryId: string, data: Partial<Category>): Promise<ServiceResult<Category>> {
    return this.handleErrors(
      async () => await this.repository.update(categoryId, data),
      'Failed to update category',
    );
  }
}
