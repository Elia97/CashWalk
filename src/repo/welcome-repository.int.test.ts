import { db, pool } from '@/drizzle/db';
import { seedTestUsers } from '@/drizzle/seeds/test-users';
import { bankAccount, category } from '@/drizzle/schema';
import { insertOnBoardingData } from './welcome-repository';
import { eq } from 'drizzle-orm';

describe('insertOnBoardingData (integration)', () => {
  const testUserId = 'test-user-id-onboarding';
  const testBankAccountId = crypto.randomUUID();
  const systemCategoryId = crypto.randomUUID();
  const userCategoryId1 = crypto.randomUUID();
  const userCategoryId2 = crypto.randomUUID();

  beforeEach(async () => {
    await db.delete(bankAccount).where(eq(bankAccount.userId, testUserId));
    await db.delete(category).where(eq(category.userId, testUserId));
    await db.delete(category).where(eq(category.id, systemCategoryId));
    // Crea l'utente di test (necessario per FK)
    await seedTestUsers({
      id: testUserId,
      email: 'onboarding@email.com',
      name: 'Onboarding Test User',
    });
    // Crea la categoria di sistema
    await db.insert(category).values({
      id: systemCategoryId,
      name: 'System Cat',
      userId: null,
      parentId: null,
      categoryType: 'expense',
      icon: '💼',
      color: '#123456',
      description: 'Categoria di sistema',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  afterAll(async () => {
    await db.delete(bankAccount).where(eq(bankAccount.userId, testUserId));
    await db.delete(category).where(eq(category.userId, testUserId));
    await pool.end();
  });

  it('should insert bank account and categories atomically', async () => {
    const onboardingData = {
      bankAccount: {
        id: testBankAccountId,
        userId: testUserId,
        name: 'Onboarding Account',
        accountType: 'checking' as const,
        accountNumber: '123456789',
        currency: 'EUR',
        balance: '1000.00',
        isPrimary: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      categories: [
        {
          id: userCategoryId1,
          name: 'Onboarding Cat 1',
          userId: testUserId,
          parentId: systemCategoryId,
          categoryType: 'expense' as const,
          icon: '🧪',
          color: '#000',
          description: 'Test cat 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: userCategoryId2,
          name: 'Onboarding Cat 2',
          userId: testUserId,
          parentId: systemCategoryId,
          categoryType: 'income' as const,
          icon: '💰',
          color: '#fff',
          description: 'Test cat 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    await insertOnBoardingData(onboardingData);

    const acc = await db.query.bankAccount.findFirst({
      where: eq(bankAccount.id, testBankAccountId),
    });
    expect(acc).toBeDefined();
    expect(acc?.userId).toBe(testUserId);

    const cats = await db.query.category.findMany({ where: eq(category.userId, testUserId) });
    expect(cats.length).toBe(2);
    const catIds = cats.map((c) => c.id);
    expect(catIds).toContain(userCategoryId1);
    expect(catIds).toContain(userCategoryId2);
    // Verifica che siano collegate alla categoria di sistema
    cats.forEach((cat) => {
      expect(cat.parentId).toBe(systemCategoryId);
    });
  });
});
