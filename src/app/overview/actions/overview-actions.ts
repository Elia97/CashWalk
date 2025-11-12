'use server';

import { PrimaryBankAccountWithRelations } from '@/drizzle/schema';
import { BankAccountService } from '@/services/bank-account-service';
import { revalidatePath } from 'next/cache';

type ActionResult<T = void> = {
  error: boolean;
  data?: T;
  message?: string;
};

const service = new BankAccountService();

export async function getUserPrimaryBankAccount(
  userId: string,
): Promise<ActionResult<PrimaryBankAccountWithRelations | undefined>> {
  if (!userId || typeof userId !== 'string') throw new Error('Invalid user ID');
  return await service.getPrimaryBankAccount(userId);
}

export async function setUserPrimaryBankAccount(
  userId: string,
  accountId: string,
): Promise<ActionResult> {
  if (!userId || typeof userId !== 'string') throw new Error('Invalid user ID');
  if (!accountId || typeof accountId !== 'string') throw new Error('Invalid account ID');
  revalidatePath('/overview');
  return await service.setPrimaryBankAccount(userId, accountId);
}
