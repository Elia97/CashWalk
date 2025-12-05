import {
  Category,
  ClientBankAccount,
  ClientTransaction,
  ClientTransactionWithRelations,
  Transaction,
} from '@/drizzle/schema';
import { BankAccountRepository } from '@/repo/bank-account-repository';
import { CategoryRepository } from '@/repo/category-repository';
import { TransactionRepository } from '@/repo/transaction-repository';

type ServiceResult<T = void> = {
  error: boolean;
  data?: T;
  message?: string;
};

const bankAccountRepository = new BankAccountRepository();
const categoryRepository = new CategoryRepository();

export class TransactionService {
  private repository: TransactionRepository;

  constructor() {
    this.repository = new TransactionRepository();
  }

  async handleErrors<T>(
    fn: () => Promise<T>,
    defaultMessage = 'An error occurred',
  ): Promise<ServiceResult<T>> {
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

  async getAll(
    userId: string,
    options?: {
      page?: number;
      pageSize?: number;
      from?: Date;
      to?: Date;
      transactionType?: 'income' | 'expense';
    },
  ): Promise<
    ServiceResult<{
      transactions: ClientTransactionWithRelations[];
      totalCount: number;
      page: number;
      pageSize: number;
    }>
  > {
    return this.handleErrors(async () => {
      const result = await this.repository.findAll(userId, options);

      const transactions: ClientTransactionWithRelations[] = result.map((tx) => ({
        ...tx,
        amount: Number(tx.amount),
        bankAccount: {
          ...tx.bankAccount,
          balance: Number(tx.bankAccount.balance),
        },
      }));

      return {
        transactions,
        totalCount: transactions.length,
        page: options?.page ?? 1,
        pageSize: options?.pageSize ?? 25,
      };
    }, 'Failed to retrieve transactions');
  }

  async createTransaction(data: ClientTransaction): Promise<ServiceResult<Transaction>> {
    return this.handleErrors(async () => {
      const account = await bankAccountRepository.findById(data.bankAccountId);
      if (!account) throw new Error('Bank account not found');
      const amountAdjustment = data.transactionType === 'income' ? data.amount : -data.amount;
      const currentBalance =
        typeof account.balance === 'string' ? parseFloat(account.balance) : account.balance;
      const newBalance = Number(currentBalance) + Number(amountAdjustment);
      return await this.repository.insert(
        { ...data, amount: String(data.amount) },
        newBalance.toString(),
      );
    }, 'Failed to create transaction');
  }

  async deleteTransaction(id: string): Promise<ServiceResult<Transaction>> {
    return this.handleErrors(async () => {
      const transaction = await this.repository.findById(id);
      if (!transaction) throw new Error('Transaction not found');
      const account = await bankAccountRepository.findById(transaction.bankAccountId);
      if (!account) throw new Error('Bank account not found');
      const amountAdjustment =
        transaction.transactionType === 'income' ? transaction.amount : -transaction.amount;
      const currentBalance =
        typeof account.balance === 'string' ? parseFloat(account.balance) : account.balance;
      const newBalance = Number(currentBalance) + Number(amountAdjustment);
      const deleted = await this.repository.delete(id, newBalance.toString());
      if (!deleted) throw new Error('Transaction not found');
      return deleted;
    }, 'Failed to delete transaction');
  }

  async updateTransaction(
    id: string,
    data: ClientTransaction,
  ): Promise<ServiceResult<Transaction>> {
    return this.handleErrors(async () => {
      const transaction = await this.repository.findById(id);
      if (!transaction) throw new Error('Transaction not found');
      const account = await bankAccountRepository.findById(transaction.bankAccountId);
      if (!account) throw new Error('Bank account not found');
      const oldAdjustment =
        transaction.transactionType === 'income' ? transaction.amount : -transaction.amount;
      const newAdjustment = data.transactionType === 'income' ? data.amount : -data.amount;
      const currentBalance =
        typeof account.balance === 'string' ? parseFloat(account.balance) : account.balance;
      const newBalance = Number(currentBalance) - Number(oldAdjustment) + Number(newAdjustment);
      const updated = await this.repository.update(id, newBalance.toString(), {
        ...data,
        amount: String(data.amount),
      });
      if (!updated) throw new Error('Transaction not found');
      return updated;
    }, 'Failed to update transaction');
  }

  async getTransactionFormData(userId: string): Promise<
    ServiceResult<{
      bankAccounts: ClientBankAccount[];
      categories: Category[];
    }>
  > {
    return this.handleErrors(async () => {
      const [bankAccounts, categories] = await Promise.all([
        bankAccountRepository.findAll(userId),
        categoryRepository.findByUserId(userId),
      ]);
      const clientBankAccounts = bankAccounts.map((acc) => ({
        ...acc,
        balance: Number(acc.balance),
      }));
      return { bankAccounts: clientBankAccounts, categories };
    }, 'Failed to retrieve transaction form data');
  }
}
