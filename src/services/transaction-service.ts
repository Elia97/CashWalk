import { ClientTransaction, Transaction } from "@/drizzle/schema";
import {
  getAllUserTransactions,
  createTransaction,
  deleteTransactionById,
  updateTransactionById,
  getTransactionFormData,
} from "@/repo/transaction-repository";
import { getUserById } from "@/repo/user-repository";

export type TransactionActionResponse<T = void> = {
  error: boolean;
  data?: T;
  message?: string;
};

export class TransactionService {
  static async findUserTransactions(
    userId: string,
  ): Promise<TransactionActionResponse<ClientTransaction[]>> {
    return this.handleErrors(async () => {
      const user = await getUserById(userId);
      if (!user) throw new Error("User not found");
      const transactions = await getAllUserTransactions(userId);
      return transactions.map((transaction) => ({
        ...transaction,
        amount: Number(transaction.amount),
      })) as ClientTransaction[];
    }, "Failed to retrieve transactions");
  }

  static async getTransactionFormData(userId: string): Promise<
    TransactionActionResponse<{
      bankAccounts: { id: string; name: string }[];
      categories: { id: string; name: string }[];
    }>
  > {
    return this.handleErrors(async () => {
      const { bankAccounts, categories } = await getTransactionFormData(userId);
      return { bankAccounts, categories };
    }, "Failed to retrieve transaction form data");
  }

  static async createTransaction(
    data: Transaction,
  ): Promise<TransactionActionResponse> {
    return this.handleErrors(async () => {
      await createTransaction(data);
    }, "Failed to create transaction");
  }

  static async deleteTransaction(
    id: string,
  ): Promise<TransactionActionResponse> {
    return this.handleErrors(async () => {
      await deleteTransactionById(id);
    }, "Failed to delete transaction");
  }

  static async updateTransaction(
    id: string,
    data: Partial<ClientTransaction>,
  ): Promise<TransactionActionResponse> {
    return this.handleErrors(async () => {
      await updateTransactionById(id, {
        ...data,
        amount: data.amount ? String(data.amount) : undefined,
      });
    }, "Failed to update transaction");
  }

  static async handleErrors<T>(
    fn: () => Promise<T>,
    defaultMessage = "An error occurred",
  ): Promise<TransactionActionResponse<T>> {
    try {
      const data = await fn();
      return { error: false, data };
    } catch (error) {
      return {
        error: true,
        message: error instanceof Error ? error.message : defaultMessage,
      };
    }
  }
}
