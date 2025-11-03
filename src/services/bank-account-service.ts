import {
  findManyBankAccountsByUserId,
  insertBankAccount,
  deleteBankAccountById,
  setPrimaryBankAccount,
  updateBankAccountById,
  findFirstBankAccountById,
  findFirstPrimaryBankAccountByUserId,
} from "@/repo/bank-account-repository";
import { findFirstUserById } from "@/repo/user-repository";
import type {
  ClientBankAccount,
  ClientBankAccountWithTransactions,
} from "@/drizzle/schema";

export type BankAccountActionResponse<T = void> = {
  error: boolean;
  data?: T;
  message?: string;
};

export class BankAccountService {
  static async getAllBankAccounts(
    userId: string,
  ): Promise<BankAccountActionResponse<ClientBankAccount[]>> {
    return this.handleErrors(async () => {
      const user = await findFirstUserById(userId);
      if (!user) throw new Error("User not found");
      const accounts = await findManyBankAccountsByUserId(userId);
      return accounts.map((account) => ({
        ...account,
        balance: Number(account.balance),
      })) as ClientBankAccount[];
    }, "Failed to retrieve bank accounts");
  }

  static async createBankAccount(
    data: ClientBankAccount,
  ): Promise<BankAccountActionResponse> {
    return this.handleErrors(async () => {
      const user = await findFirstUserById(data.userId);
      if (!user) throw new Error("User not found");
      const existingAccounts = await findManyBankAccountsByUserId(data.userId);
      const account = await insertBankAccount({
        ...data,
        balance: String(data.balance),
      });
      if (account && existingAccounts.length === 0) {
        await setPrimaryBankAccount(account.userId, account.id);
      }
    }, "Failed to create bank account");
  }

  static async deleteBankAccount(
    accountId: string,
  ): Promise<BankAccountActionResponse> {
    return this.handleErrors(async () => {
      const account = await findFirstBankAccountById(accountId);
      if (!account) throw new Error("Bank account not found");
      return await deleteBankAccountById(accountId);
    }, "Failed to delete bank account");
  }

  static async updateBankAccount(
    accountId: string,
    data: ClientBankAccount,
  ): Promise<BankAccountActionResponse> {
    return this.handleErrors(async () => {
      const account = await findFirstBankAccountById(accountId);
      if (!account) throw new Error("Bank account not found");
      return await updateBankAccountById(accountId, {
        ...data,
        balance: String(data.balance),
      });
    }, "Failed to update bank account");
  }

  static async setPrimaryBankAccount(
    userId: string,
    accountId: string,
  ): Promise<BankAccountActionResponse> {
    return this.handleErrors(async () => {
      const user = await findFirstUserById(userId);
      if (!user) throw new Error("User not found");
      const account = await findFirstBankAccountById(accountId);
      if (!account) throw new Error("Bank account not found");
      return await setPrimaryBankAccount(userId, accountId);
    }, "Failed to set primary bank account");
  }

  static async getPrimaryBankAccount(
    userId: string,
  ): Promise<BankAccountActionResponse<ClientBankAccountWithTransactions>> {
    return this.handleErrors(async () => {
      const user = await findFirstUserById(userId);
      if (!user) throw new Error("User not found");
      const account = await findFirstPrimaryBankAccountByUserId(userId);
      if (!account) throw new Error("Primary bank account not found");
      return {
        ...account,
        balance: Number(account.balance),
        transactions: account.transactions.map((tx) => ({
          ...tx,
          amount: Number(tx.amount),
        })),
      } as ClientBankAccountWithTransactions;
    }, "Failed to retrieve primary bank account");
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
