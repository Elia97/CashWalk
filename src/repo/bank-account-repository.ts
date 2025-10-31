import { eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { type BankAccount, bankAccount } from "@/drizzle/schema";

export async function findManyBankAccountsByUserId(
  userId: string,
): Promise<BankAccount[]> {
  return await db.query.bankAccount.findMany({
    where(fields, operators) {
      return operators.eq(fields.userId, userId);
    },
    orderBy(fields, operators) {
      return operators.asc(fields.createdAt);
    },
  });
}

export async function findManyBankAccountIdAndNameByUserId(
  userId: string,
): Promise<{ id: string; name: string }[]> {
  return await db.query.bankAccount.findMany({
    where(fields, operators) {
      return operators.eq(fields.userId, userId);
    },
    columns: {
      id: true,
      name: true,
    },
  });
}

export async function findFirstBankAccountById(
  id: string,
): Promise<BankAccount | undefined> {
  return await db.query.bankAccount.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });
}

export async function insertBankAccount(data: BankAccount): Promise<void> {
  await db.insert(bankAccount).values(data);
}

export async function deleteBankAccountById(id: string): Promise<void> {
  await db.delete(bankAccount).where(eq(bankAccount.id, id));
}

export async function updateBankAccountById(
  id: string,
  data: Partial<BankAccount>,
): Promise<void> {
  await db.update(bankAccount).set(data).where(eq(bankAccount.id, id));
}

export async function setPrimaryBankAccount(
  userId: string,
  accountId: string,
): Promise<void> {
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
