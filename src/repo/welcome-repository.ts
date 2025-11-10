import { db } from '@/drizzle/db';
import { bankAccount, BankAccount, category, Category } from '@/drizzle/schema';

export async function insertOnBoardingData(data: {
  bankAccount: BankAccount;
  categories: Category[];
}): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.insert(bankAccount).values(data.bankAccount);
    for (const cat of data.categories) {
      await tx.insert(category).values(cat);
    }
  });
}
