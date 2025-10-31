import { eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import {
  type BankAccount,
  bankAccount,
  BankAccountWithTransactions,
} from "@/drizzle/schema";

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
): Promise<{ id: string; name: string; isPrimary: boolean }[]> {
  return await db.query.bankAccount.findMany({
    where(fields, operators) {
      return operators.eq(fields.userId, userId);
    },
    columns: {
      id: true,
      name: true,
      isPrimary: true,
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

export async function findFirstPrimaryBankAccountByUserId(
  userId: string,
): Promise<BankAccountWithTransactions | undefined> {
  return await db.query.bankAccount.findFirst({
    where(fields, operators) {
      return (
        operators.eq(fields.userId, userId) &&
        operators.eq(fields.isPrimary, true)
      );
    },
    with: {
      transactions: {
        where(fields, operators) {
          return operators.gte(
            fields.date,
            new Date(new Date().getFullYear(), 0, 1),
          );
        },
        orderBy(fields, operators) {
          return operators.desc(fields.date);
        },
      },
    },
  });
}

export async function insertBankAccount(
  data: BankAccount,
): Promise<BankAccount> {
  const [result] = await db.insert(bankAccount).values(data).returning();
  if (!result) throw new Error("Failed to insert bank account");
  return result as BankAccount;
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
