import { db } from '@/drizzle/db';
import { bankAccount } from '@/drizzle/schema';
import { and, eq } from 'drizzle-orm';

export class BankAccountRepository {
  async findAll(userId: string) {
    return await db.query.bankAccount.findMany({
      where: eq(bankAccount.userId, userId),
    });
  }

  async findById(id: string) {
    return await db.query.bankAccount.findFirst({
      where: eq(bankAccount.id, id),
    });
  }

  async insert(data: typeof bankAccount.$inferInsert) {
    return await db
      .insert(bankAccount)
      .values(data)
      .returning()
      .then((rows) => rows[0]);
  }

  async update(id: string, data: Partial<typeof bankAccount.$inferInsert>) {
    return await db
      .update(bankAccount)
      .set(data)
      .where(eq(bankAccount.id, id))
      .returning()
      .then((rows) => rows[0]);
  }

  async delete(id: string) {
    return await db
      .delete(bankAccount)
      .where(eq(bankAccount.id, id))
      .returning()
      .then((rows) => rows[0]);
  }

  async findPrimary(userId: string) {
    return await db.query.bankAccount.findFirst({
      where: and(eq(bankAccount.userId, userId), eq(bankAccount.isPrimary, true)),
      with: {
        transactions: {
          with: {
            category: {
              with: {
                parent: true,
              },
            },
          },
        },
      },
    });
  }

  async setPrimary(userId: string, accountId: string) {
    return await db.transaction(async (tx) => {
      await tx.update(bankAccount).set({ isPrimary: false }).where(eq(bankAccount.userId, userId));
      await tx.update(bankAccount).set({ isPrimary: true }).where(eq(bankAccount.id, accountId));
    });
  }
}
