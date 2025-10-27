import {
  createBankAccount,
  deleteBankAccountById,
  getAllBankAccountsByUserId,
  setPrimaryBankAccount,
  updateBankAccountById,
} from "@/repo/bank-account-repository";
import { getUserById } from "@/repo/user-repository";
import type { ClientBankAccount } from "@/drizzle/schema";

export type BankAccountActionResponse<T = void> = {
  error: boolean;
  data?: T;
  message?: string;
};

export class BankAccountService {
  static async findUserBankAccounts(
    userId: string,
  ): Promise<BankAccountActionResponse<ClientBankAccount[]>> {
    return this.handleErrors(async () => {
      const user = await getUserById(userId);
      if (!user) throw new Error("User not found");
      const accounts = await getAllBankAccountsByUserId(userId);
      return accounts.map((account) => ({
        ...account,
        balance: Number(account.balance),
      })) as ClientBankAccount[];
    }, "Failed to retrieve bank accounts");
  }

  static async createBankAccount(
    data: ClientBankAccount,
  ): Promise<BankAccountActionResponse> {
    return this.handleErrors(
      async () =>
        await createBankAccount({
          ...data,
          balance: String(data.balance),
        }),
      "Failed to create bank account",
    );
  }

  static async deleteBankAccount(
    accountId: string,
  ): Promise<BankAccountActionResponse> {
    return this.handleErrors(
      async () => await deleteBankAccountById(accountId),
      "Failed to delete bank account",
    );
  }

  static async updateBankAccount(
    accountId: string,
    data: Partial<ClientBankAccount>,
  ): Promise<BankAccountActionResponse> {
    return this.handleErrors(
      async () =>
        await updateBankAccountById(accountId, {
          ...data,
          balance: String(data.balance),
        }),
      "Failed to update bank account",
    );
  }

  static async setPrimaryBankAccount(
    userId: string,
    accountId: string,
  ): Promise<BankAccountActionResponse> {
    return this.handleErrors(
      async () => await setPrimaryBankAccount(userId, accountId),
      "Failed to set primary bank account",
    );
  }

  static async handleErrors<T>(
    fn: () => Promise<T>,
    defaultMessage = "An error occurred",
  ): Promise<BankAccountActionResponse<T>> {
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
