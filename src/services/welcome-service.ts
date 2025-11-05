import { findFirstUserById } from "@/repo/user-repository";
import type { Category, ClientBankAccount } from "@/drizzle/schema";
import { insertOnBoardingData } from "@/repo/welcome-repository";
import { findFirstSystemCategoryByName } from "@/repo/category-repository";

export type WelcomeActionResponse<T = void> = {
  error: boolean;
  data?: T;
  message?: string;
};

export class WelcomeService {
  static async createWelcomeData(data: {
    bankAccount: ClientBankAccount;
    categories: string[];
  }): Promise<WelcomeActionResponse> {
    return this.handleErrors(async () => {
      const user = await findFirstUserById(data.bankAccount.userId);
      if (!user) throw new Error("User not found");
      const completedCategories: Category[] = [];
      if (data.categories.length > 0) {
        for (const category of data.categories) {
          switch (category) {
            case "Salary":
              {
                const systemCategory = await findFirstSystemCategoryByName(
                  "Work",
                );
                if (systemCategory) {
                  completedCategories.push({
                    parentId: systemCategory.id,
                    userId: data.bankAccount.userId,
                    name: category,
                    icon: systemCategory.icon,
                    categoryType: "income",
                  } as Category);
                }
              }
              break;
            case "Groceries":
              {
                const systemCategory = await findFirstSystemCategoryByName(
                  "Food & Dining",
                );
                if (systemCategory) {
                  completedCategories.push({
                    parentId: systemCategory.id,
                    userId: data.bankAccount.userId,
                    name: category,
                    icon: systemCategory.icon,
                    categoryType: "expense",
                  } as Category);
                }
              }
              break;
            case "Rent": {
              const systemCategory = await findFirstSystemCategoryByName(
                "Housing",
              );
              if (systemCategory) {
                completedCategories.push({
                  parentId: systemCategory.id,
                  userId: data.bankAccount.userId,
                  name: category,
                  icon: systemCategory.icon,
                  categoryType: "expense",
                } as Category);
              }
            }
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

  private static async handleErrors<T>(
    fn: () => Promise<T>,
    defaultMessage = "An error occurred",
  ): Promise<WelcomeActionResponse<T>> {
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
