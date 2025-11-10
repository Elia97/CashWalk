'use server';

import { ClientTransaction } from '@/drizzle/schema';
import { TransactionService } from '@/services/transaction-service';
import type { TransactionActionResponse } from '@/services/transaction-service';
import { revalidatePath } from 'next/cache';

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
  TransactionActionResponse<{
    transactions: ClientTransaction[];
    totalCount: number;
    page: number;
    pageSize: number;
  }>
> {
  if (!userId || typeof userId !== 'string') throw new Error('Invalid user ID');
  return TransactionService.getAllTransactions(userId, {
    page,
    pageSize,
    from,
    to,
    transactionType,
  });
}

export async function getTransactionFormData(userId: string): Promise<
  TransactionActionResponse<{
    bankAccounts: { id: string; name: string; isPrimary: boolean }[];
    categories: { id: string; name: string; categoryType: string }[];
  }>
> {
  if (!userId || typeof userId !== 'string') throw new Error('Invalid user ID');
  return TransactionService.getTransactionFormData(userId);
}

export async function createTransaction(
  data: ClientTransaction,
): Promise<TransactionActionResponse> {
  if (!data.userId || typeof data.userId !== 'string') throw new Error('Invalid user ID');
  revalidatePath('/transactions');
  return await TransactionService.createTransaction(data);
}

export async function deleteTransaction(id: string): Promise<TransactionActionResponse> {
  if (!id || typeof id !== 'string') throw new Error('Invalid transaction ID');
  revalidatePath('/transactions');
  return await TransactionService.deleteTransaction(id);
}

export async function updateTransaction(
  transactionId: string,
  data: ClientTransaction,
): Promise<TransactionActionResponse> {
  if (!transactionId || typeof transactionId !== 'string')
    throw new Error('Invalid transaction ID');
  if (!data || typeof data !== 'object') throw new Error('Invalid transaction data');
  revalidatePath('/transactions');
  return await TransactionService.updateTransaction(transactionId, data);
}
