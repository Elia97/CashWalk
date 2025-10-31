import { eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { type Transaction, bankAccount, transaction } from "@/drizzle/schema";

export async function findManyTransactionsByUserId(
  userId: string,
): Promise<Transaction[]> {
  return await db.query.transaction.findMany({
    where(fields, operators) {
      return operators.eq(fields.userId, userId);
    },
    orderBy(fields, operators) {
      return operators.desc(fields.date);
    },
    with: {
      bankAccount: true,
      category: {
        with: {
          parent: true,
        },
      },
    },
  });
}

export async function findFirstTransactionById(
  id: string,
): Promise<Transaction | undefined> {
  return await db.query.transaction.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
    with: {
      bankAccount: {
        columns: {
          id: true,
          balance: true,
        },
      },
    },
  });
}

export async function insertTransaction(
  data: Transaction,
  newBalance: string,
): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.insert(transaction).values(data);
    await tx
      .update(bankAccount)
      .set({
        balance: newBalance,
      })
      .where(eq(bankAccount.id, data.bankAccountId));
  });
}

export async function deleteTransactionById(
  id: string,
  accountId: string,
  newBalance: string,
): Promise<void> {
  await db.transaction(async (tx) => {
    await tx
      .update(bankAccount)
      .set({
        balance: newBalance.toString(),
      })
      .where(eq(bankAccount.id, accountId));
    await tx.delete(transaction).where(eq(transaction.id, id));
  });
}

export async function updateTransactionById(
  id: string,
  newBalance: string,
  data: Transaction,
): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.update(transaction).set(data).where(eq(transaction.id, id));
    await tx
      .update(bankAccount)
      .set({ balance: newBalance })
      .where(eq(bankAccount.id, data.bankAccountId));
  });
}
