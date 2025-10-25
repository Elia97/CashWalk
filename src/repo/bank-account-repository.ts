import { db } from "@/drizzle/db";

export function getAllBankAccountsByUserId(userId: string) {
  return db.query.bankAccount.findMany({
    where(fields, operators) {
      return operators.eq(fields.userId, userId);
    },
    orderBy(fields, operators) {
      return operators.desc(fields.createdAt);
    },
    columns: {
      id: true,
      userId: false,
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
