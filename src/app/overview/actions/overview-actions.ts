"use server";

import { ClientBankAccountWithTransactions } from "@/drizzle/schema";
import {
  type BankAccountActionResponse,
  BankAccountService,
} from "@/services/bank-account-service";
import { revalidatePath } from "next/cache";

export async function getUserPrimaryBankAccount(
  userId: string,
): Promise<
  BankAccountActionResponse<ClientBankAccountWithTransactions | undefined>
> {
  if (!userId || typeof userId !== "string") throw new Error("Invalid user ID");
  return await BankAccountService.getPrimaryBankAccount(userId);
}

export async function setUserPrimaryBankAccount(
  userId: string,
  accountId: string,
): Promise<BankAccountActionResponse> {
  if (!userId || typeof userId !== "string") throw new Error("Invalid user ID");
  if (!accountId || typeof accountId !== "string")
    throw new Error("Invalid account ID");
  revalidatePath("/overview");
  return await BankAccountService.setPrimaryBankAccount(userId, accountId);
}
