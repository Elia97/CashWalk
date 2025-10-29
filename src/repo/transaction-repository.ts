import { db } from "@/drizzle/db";
import { bankAccount, transaction, Transaction } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getAllUserTransactions(
  userId: string,
): Promise<Transaction[]> {
  return await db.query.transaction.findMany({
    where(fields, operators) {
      return operators.eq(fields.userId, userId);
    },
    orderBy(fields, operators) {
      return operators.desc(fields.createdAt);
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

export async function getTransactionFormData(userId: string): Promise<{
  bankAccounts: { id: string; name: string }[];
  categories: { id: string; name: string }[];
}> {
  const [bankAccounts, categories] = await Promise.all([
    db.query.bankAccount.findMany({
      where(fields, operators) {
        return operators.eq(fields.userId, userId);
      },
      columns: {
        id: true,
        name: true,
      },
    }),
    db.query.category.findMany({
      where(fields, operators) {
        return operators.eq(fields.userId, userId);
      },
      columns: {
        id: true,
        name: true,
      },
    }),
  ]);

  return { bankAccounts, categories };
}

export async function createTransaction(data: Transaction): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.insert(transaction).values(data);

    const amountAdjustment =
      data.transactionType === "income" ? data.amount : -data.amount;

    const account = await tx.query.bankAccount.findFirst({
      where(fields, operators) {
        return operators.eq(fields.id, data.bankAccountId);
      },
      columns: {
        balance: true,
      },
    });

    if (!account) {
      throw new Error("Bank account not found");
    }

    const currentBalance =
      typeof account.balance === "string"
        ? parseFloat(account.balance)
        : account.balance;
    const newBalance = Number(currentBalance) + Number(amountAdjustment);

    await tx
      .update(bankAccount)
      .set({
        balance: String(newBalance),
      })
      .where(eq(bankAccount.id, data.bankAccountId));
  });
}

export async function deleteTransactionById(id: string): Promise<void> {
  await db.delete(transaction).where(eq(transaction.id, id));
}

export async function updateTransactionById(
  id: string,
  data: Partial<Transaction>,
): Promise<void> {
  await db.update(transaction).set(data).where(eq(transaction.id, id));
}
