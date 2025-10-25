"use server";

import { BankAccountService } from "@/services/bank-account-service";

export async function getUserBankAccounts(userId: string) {
  if (!userId || typeof userId !== "string") throw new Error("Invalid user ID");
  return await BankAccountService.findUserBankAccounts(userId);
}
