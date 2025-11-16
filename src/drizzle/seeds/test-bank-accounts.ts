import { db } from '@/drizzle/db';
import * as schema from '../schema';
const { bankAccount } = schema;
import { eq } from 'drizzle-orm';

export async function seedTestBankAccounts(
  customAccount?: Partial<typeof bankAccount._.inferInsert>,
) {
  // Account di default
  const testAccount = {
    id: 'test-bank-account-id',
    userId: 'test-user-id',
    name: 'Test Account',
    accountNumber: '00000001',
    accountType: 'checking' as const,
    currency: 'EUR',
    balance: '1000.00',
    isPrimary: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...customAccount,
  };
  // Elimina solo l'account specifico (non tutta la tabella!)
  await db.delete(bankAccount).where(eq(bankAccount.id, testAccount.id));
  await db.insert(bankAccount).values(testAccount);
}
