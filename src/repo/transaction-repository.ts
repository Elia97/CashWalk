import { db } from '@/drizzle/db';
import { transaction, bankAccount } from '@/drizzle/schema';
import { and, desc, eq, gte, lte } from 'drizzle-orm';

export class TransactionRepository {
  async findAll(
    userId: string,
    {
      page = 1,
      pageSize = 25,
      from,
      to,
      transactionType,
    }: {
      page?: number;
      pageSize?: number;
      from?: Date;
      to?: Date;
      transactionType?: 'income' | 'expense';
    } = {},
  ) {
    const size = Math.max(1, Math.min(pageSize, 100));
    const offset = (Math.max(page, 1) - 1) * size;

    const whereClause = and(
      eq(transaction.userId, userId),
      from ? gte(transaction.date, from) : undefined,
      to ? lte(transaction.date, to) : undefined,
      transactionType ? eq(transaction.transactionType, transactionType) : undefined,
    );

    const res = await db.query.transaction.findMany({
      where: whereClause,
      limit: size,
      offset: offset,
      with: {
        category: {
          with: {
            parent: true,
          },
        },
        bankAccount: true,
      },
      orderBy: desc(transaction.createdAt),
    });

    return res;
  }

  async findById(id: string) {
    return await db.query.transaction.findFirst({
      where: eq(transaction.id, id),
      with: {
        category: true,
        bankAccount: true,
      },
    });
  }

  async insert(data: typeof transaction.$inferInsert, newBalance: string) {
    return await db.transaction(async (tx) => {
      const insertedTransactions = await tx
        .insert(transaction)
        .values(data)
        .returning()
        .then((rows) => rows[0]);

      await tx
        .update(bankAccount)
        .set({ balance: newBalance })
        .where(eq(bankAccount.id, data.bankAccountId));

      return insertedTransactions;
    });
  }

  async update(id: string, newBalance: string, data: Partial<typeof transaction.$inferInsert>) {
    return await db.transaction(async (tx) => {
      const updatedTransactions = await tx
        .update(transaction)
        .set(data)
        .where(eq(transaction.id, id))
        .returning()
        .then((rows) => rows[0]);

      await tx
        .update(bankAccount)
        .set({ balance: newBalance })
        .where(eq(bankAccount.id, updatedTransactions.bankAccountId));

      return updatedTransactions;
    });
  }

  async delete(id: string, newBalance: string) {
    return await db.transaction(async (tx) => {
      const deletedTransactions = await tx
        .delete(transaction)
        .where(eq(transaction.id, id))
        .returning()
        .then((rows) => rows[0]);

      await tx
        .update(bankAccount)
        .set({ balance: newBalance })
        .where(eq(bankAccount.id, deletedTransactions.bankAccountId));

      return deletedTransactions;
    });
  }
}
