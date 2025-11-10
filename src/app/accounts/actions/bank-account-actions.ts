'use server';

import { ClientBankAccount } from '@/drizzle/schema';
import {
  type BankAccountActionResponse,
  BankAccountService,
} from '@/services/bank-account-service';
import { revalidatePath } from 'next/cache';

export async function getUserBankAccounts(
  userId: string,
): Promise<BankAccountActionResponse<ClientBankAccount[]>> {
  if (!userId || typeof userId !== 'string') throw new Error('Invalid user ID');
  return await BankAccountService.getAllBankAccounts(userId);
}

export async function createUserBankAccount(
  data: ClientBankAccount,
): Promise<BankAccountActionResponse> {
  if (!data.userId || typeof data.userId !== 'string') throw new Error('Invalid user ID');
  revalidatePath('/accounts');
  return await BankAccountService.createBankAccount(data);
}

export async function deleteUserBankAccount(accountId: string): Promise<BankAccountActionResponse> {
  if (!accountId) throw new Error('Invalid account ID');
  revalidatePath('/accounts');
  return await BankAccountService.deleteBankAccount(accountId);
}

export async function updateUserBankAccount(
  accountId: string,
  data: ClientBankAccount,
): Promise<BankAccountActionResponse> {
  if (!accountId) throw new Error('Invalid account ID');
  revalidatePath('/accounts');
  return await BankAccountService.updateBankAccount(accountId, data);
}
