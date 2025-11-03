import { eq, sql, and, lte, gte } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { type Transaction, bankAccount, transaction } from "@/drizzle/schema";

export const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

export async function findManyTransactionsByUserId(
  userId: string,
  {
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    from,
    to,
    transactionType,
  }: {
    page?: number;
    pageSize?: number;
    from?: Date;
    to?: Date;
    transactionType?: "income" | "expense";
  } = {},
): Promise<{ transactions: Transaction[]; totalCount: number }> {
  const size = Math.min(Math.max(pageSize, 1), MAX_PAGE_SIZE);
  const offset = Math.max(page - 1, 0) * size;

  const whereClause = and(
    eq(transaction.userId, userId),
    from ? gte(transaction.date, from) : undefined,
    to ? lte(transaction.date, to) : undefined,
    transactionType
      ? eq(transaction.transactionType, transactionType)
      : undefined,
  );

  const [countResult, transactions] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(transaction)
      .where(whereClause),
    db.query.transaction.findMany({
      where: () => whereClause,
      orderBy: (fields, operators) => operators.desc(fields.date),
      with: { bankAccount: true, category: { with: { parent: true } } },
      limit: size,
      offset,
    }),
  ]);

  return {
    transactions,
    totalCount: countResult[0]?.count ?? 0,
  };
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
