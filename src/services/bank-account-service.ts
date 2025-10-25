import { getAllBankAccountsByUserId } from "@/repo/bank-account-repository";
import { getUserById } from "@/repo/user-repository";
import { serializeData } from "@/lib/utils";

export class BankAccountService {
  static async findUserBankAccounts(userId: string) {
    return this.handleErrors(async () => {
      const user = await getUserById(userId);
      if (!user) throw new Error("User not found");
      const accounts = await getAllBankAccountsByUserId(userId);
      return serializeData(accounts);
    }, "Failed to retrieve bank accounts");
  }

  static async handleErrors<T>(
    fn: () => Promise<T>,
    defaultMessage = "An error occurred",
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const data = await fn();
      return { success: true, data };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : defaultMessage,
      };
    }
  }
}
