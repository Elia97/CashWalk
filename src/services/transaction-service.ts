import { ClientTransaction } from '@/drizzle/schema';
import {
  findFirstBankAccountById,
  findManyBankAccountIdAndNameByUserId,
} from '@/repo/bank-account-repository';
import { findManyCategoryIdAndNameByUserId } from '@/repo/category-repository';
import {
  findManyTransactionsByUserId,
  insertTransaction,
  deleteTransactionById,
  updateTransactionById,
  findFirstTransactionById,
  DEFAULT_PAGE_SIZE,
} from '@/repo/transaction-repository';
import { findFirstUserById } from '@/repo/user-repository';

export type TransactionActionResponse<T = void> = {
  error: boolean;
  data?: T;
  message?: string;
};

export class TransactionService {
  static async getAllTransactions(
    userId: string,
    {
      page = 1,
      pageSize,
      from,
      to,
      transactionType,
    }: {
      page?: number;
      pageSize?: number;
      from?: Date;
      to?: Date;
      transactionType?: 'income' | 'expense';
    } = {},
  ): Promise<
    TransactionActionResponse<{
      transactions: ClientTransaction[];
      totalCount: number;
      page: number;
      pageSize: number;
    }>
  > {
    return this.handleErrors(async () => {
      const user = await findFirstUserById(userId);
      if (!user) throw new Error('User not found');
      const { transactions, totalCount } = await findManyTransactionsByUserId(userId, {
        page,
        pageSize: pageSize ?? DEFAULT_PAGE_SIZE,
        from,
        to,
        transactionType,
      });
      const clientTransactions = transactions.map((tx) => ({
        ...tx,
        amount: Number(tx.amount),
      })) as ClientTransaction[];
      const resolvedPageSize = pageSize ?? DEFAULT_PAGE_SIZE;

      return {
        transactions: clientTransactions,
        totalCount,
        page,
        pageSize: resolvedPageSize,
      };
    }, 'Failed to retrieve transactions');
  }

  static async createTransaction(data: ClientTransaction): Promise<TransactionActionResponse> {
    return this.handleErrors(async () => {
      const account = await findFirstBankAccountById(data.bankAccountId);
      if (!account) throw new Error('Bank account not found');
      const amountAdjustment = data.transactionType === 'income' ? data.amount : -data.amount;
      const currentBalance =
        typeof account.balance === 'string' ? parseFloat(account.balance) : account.balance;
      const newBalance = Number(currentBalance) + Number(amountAdjustment);
      return await insertTransaction(
        { ...data, amount: String(data.amount) },
        newBalance.toString(),
      );
    }, 'Failed to create transaction');
  }

  static async deleteTransaction(id: string): Promise<TransactionActionResponse> {
    return this.handleErrors(async () => {
      const transaction = await findFirstTransactionById(id);
      if (!transaction) throw new Error('Transaction not found');
      const account = await findFirstBankAccountById(transaction.bankAccountId);
      if (!account) throw new Error('Bank account not found');
      const amountAdjustment =
        transaction.transactionType === 'income' ? transaction.amount : -transaction.amount;
      const currentBalance =
        typeof account.balance === 'string' ? parseFloat(account.balance) : account.balance;
      const newBalance = Number(currentBalance) + Number(amountAdjustment);
      return await deleteTransactionById(id, account.id, newBalance.toString());
    }, 'Failed to delete transaction');
  }

  static async updateTransaction(
    id: string,
    data: ClientTransaction,
  ): Promise<TransactionActionResponse> {
    return this.handleErrors(async () => {
      const transaction = await findFirstTransactionById(id);
      if (!transaction) throw new Error('Transaction not found');
      const account = await findFirstBankAccountById(transaction.bankAccountId);
      if (!account) throw new Error('Bank account not found');
      const oldAdjustment =
        transaction.transactionType === 'income' ? transaction.amount : -transaction.amount;
      const newAdjustment = data.transactionType === 'income' ? data.amount : -data.amount;
      const currentBalance =
        typeof account.balance === 'string' ? parseFloat(account.balance) : account.balance;
      const newBalance = Number(currentBalance) - Number(oldAdjustment) + Number(newAdjustment);
      return await updateTransactionById(id, newBalance.toString(), {
        ...data,
        amount: String(data.amount),
      });
    }, 'Failed to update transaction');
  }

  static async getTransactionFormData(userId: string): Promise<
    TransactionActionResponse<{
      bankAccounts: { id: string; name: string; isPrimary: boolean }[];
      categories: { id: string; name: string; categoryType: string }[];
    }>
  > {
    return this.handleErrors(async () => {
      const [bankAccounts, categories] = await Promise.all([
        findManyBankAccountIdAndNameByUserId(userId),
        findManyCategoryIdAndNameByUserId(userId),
      ]);
      return { bankAccounts, categories };
    }, 'Failed to retrieve transaction form data');
  }

  private static async handleErrors<T>(
    fn: () => Promise<T>,
    defaultMessage = 'An error occurred',
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
