'use server';

import { BankAccount, ClientBankAccount } from '@/drizzle/schema';
import { BankAccountService } from '@/services/bank-account-service';
import { revalidatePath } from 'next/cache';

type ActionResult<T = void> = {
  error: boolean;
  data?: T;
  message?: string;
};

const service = new BankAccountService();

export async function getAllUserBankAccounts(
  userId: string,
): Promise<ActionResult<ClientBankAccount[]>> {
  return await service.getAll(userId);
}

export async function createBankAccount(
  data: ClientBankAccount,
): Promise<ActionResult<BankAccount>> {
  const result = await service.create(data);
  if (!result.error) {
    revalidatePath('/accounts');
  }
  return result;
}

export async function updateBankAccount(
  id: string,
  data: ClientBankAccount,
): Promise<ActionResult<BankAccount>> {
  const result = await service.update(id, data);
  if (!result.error) {
    revalidatePath('/accounts');
  }
  return result;
}

export async function deleteBankAccount(id: string): Promise<ActionResult<BankAccount>> {
  const result = await service.delete(id);
  if (!result.error) {
    revalidatePath('/accounts');
  }
  return result;
}
