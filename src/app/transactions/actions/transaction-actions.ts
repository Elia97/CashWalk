'use server';

import {
  Category,
  ClientTransaction,
  ClientTransactionWithRelations,
  Transaction,
} from '@/drizzle/schema';
import { TransactionService } from '@/services/transaction-service';
import { revalidatePath } from 'next/cache';
import { ClientBankAccount } from '../../../drizzle/schemas/bank-account-schema';

type ActionResult<T = void> = {
  error: boolean;
  data?: T;
  message?: string;
};

const service = new TransactionService();

export async function getUserTransactions(
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
  ActionResult<{
    transactions: ClientTransactionWithRelations[];
    totalCount: number;
    page: number;
    pageSize: number;
  }>
> {
  if (!userId || typeof userId !== 'string') throw new Error('Invalid user ID');
  return service.getAll(userId, {
    page,
    pageSize,
    from,
    to,
    transactionType,
  });
}

export async function getTransactionFormData(userId: string): Promise<
  ActionResult<{
    bankAccounts: ClientBankAccount[];
    categories: Category[];
  }>
> {
  if (!userId || typeof userId !== 'string') throw new Error('Invalid user ID');
  return service.getTransactionFormData(userId);
}

export async function createTransaction(
  data: ClientTransaction,
): Promise<ActionResult<Transaction>> {
  if (!data.userId || typeof data.userId !== 'string') throw new Error('Invalid user ID');
  const result = await service.createTransaction(data);
  if (!result.error) {
    revalidatePath('/transactions');
  }
  return result;
}

export async function deleteTransaction(id: string): Promise<ActionResult<Transaction>> {
  if (!id || typeof id !== 'string') throw new Error('Invalid transaction ID');
  const result = await service.deleteTransaction(id);
  if (!result.error) {
    revalidatePath('/transactions');
  }
  return result;
}

export async function updateTransaction(
  transactionId: string,
  data: ClientTransaction,
): Promise<ActionResult<Transaction>> {
  if (!transactionId || typeof transactionId !== 'string')
    throw new Error('Invalid transaction ID');
  if (!data || typeof data !== 'object') throw new Error('Invalid transaction data');
  const result = await service.updateTransaction(transactionId, data);
  if (!result.error) {
    revalidatePath('/transactions');
  }
  return result;
}
