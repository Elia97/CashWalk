import type { Category, ClientBankAccount } from '@/drizzle/schema';
import { insertOnBoardingData } from '@/repo/welcome-repository';
import { CategoryRepository } from '@/repo/category-repository';
import { getWelcomeCategoryMapping } from '@/lib/welcome-categories';

export type ServiceResult<T = void> = {
  error: boolean;
  data?: T;
  message?: string;
};

export class WelcomeService {
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

  async createWelcomeData(data: {
    bankAccount: ClientBankAccount;
    categories: string[];
  }): Promise<ServiceResult> {
    return this.handleErrors(async () => {
      const completedCategories: Category[] = [];

      if (data.categories.length > 0) {
        for (const categoryValue of data.categories) {
          const mapping = getWelcomeCategoryMapping(categoryValue);

          if (!mapping) {
            console.warn(`No mapping found for category: ${categoryValue}`);
            continue;
          }

          const systemCategory = await this.repository.findByName(mapping.systemCategory);

          if (systemCategory) {
            completedCategories.push({
              parentId: systemCategory.id,
              userId: data.bankAccount.userId,
              name: mapping.label,
              icon: mapping.icon,
              categoryType: mapping.categoryType,
            } as Category);
          } else {
            console.warn(`System category not found: ${mapping.systemCategory}`);
          }
        }
      }

      return await insertOnBoardingData({
        categories: completedCategories,
        bankAccount: {
          ...data.bankAccount,
          isPrimary: true,
          balance: String(data.bankAccount.balance),
        },
      });
    });
  }
}
