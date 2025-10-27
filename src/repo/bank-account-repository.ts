import { db } from "@/drizzle/db";
import { bankAccount } from "@/drizzle/schema";
import type { BankAccount } from "@/drizzle/schemas/bank-account-schema";
import { eq } from "drizzle-orm";

export function getAllBankAccountsByUserId(userId: string) {
  return db.query.bankAccount.findMany({
    where(fields, operators) {
      return operators.eq(fields.userId, userId);
    },
    orderBy(fields, operators) {
      return operators.asc(fields.createdAt);
    },
    columns: {
      id: true,
      userId: true,
      name: true,
      accountNumber: true,
      type: true,
      currency: true,
      balance: true,
      isPrimary: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function createBankAccount(data: BankAccount) {
  await db.insert(bankAccount).values(data);
}

export async function deleteBankAccountById(id: string) {
  await db.delete(bankAccount).where(eq(bankAccount.id, id));
}

export async function updateBankAccountById(
  id: string,
  data: Partial<BankAccount>,
) {
  await db.update(bankAccount).set(data).where(eq(bankAccount.id, id));
}

export async function setPrimaryBankAccount(userId: string, accountId: string) {
  await db.transaction(async (tx) => {
    await tx
      .update(bankAccount)
      .set({ isPrimary: false })
      .where(eq(bankAccount.userId, userId));

    await tx
      .update(bankAccount)
      .set({ isPrimary: true })
      .where(eq(bankAccount.id, accountId));
  });
}
