import { db } from "@/drizzle/db";
import { Transaction } from "@/drizzle/schema";

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
