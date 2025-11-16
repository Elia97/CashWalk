import { db, pool } from '@/drizzle/db';
import { TransactionRepository } from './transaction-repository';
import { transaction, bankAccount, category } from '@/drizzle/schema';
import { seedTestUsers } from '@/drizzle/seeds/test-users';
import { seedTestBankAccounts } from '@/drizzle/seeds/test-bank-accounts';
import { eq } from 'drizzle-orm';

describe('TransactionRepository (integration)', () => {
  const repository = new TransactionRepository();
  const testUserId = 'test-user-id-trans'; // già unico, nessuna modifica necessaria
  let testBankAccountId: string;
  let testCategoryId: string;

  beforeAll(async () => {
    await seedTestUsers({ id: testUserId, email: 'trans@email.com', name: 'Trans Test User' });
  });

  beforeEach(async () => {
    testBankAccountId = crypto.randomUUID();
    testCategoryId = crypto.randomUUID();
    // Elimina tutte le transazioni, tutti i bank account e tutte le categorie dell'utente di test
    await db.delete(transaction).where(eq(transaction.userId, testUserId));
    await db.delete(bankAccount).where(eq(bankAccount.userId, testUserId));
    await db.delete(category).where(eq(category.categoryType, 'expense'));
    // Crea l'utente di test (necessario per FK)
    await seedTestUsers({ id: testUserId, email: 'trans@email.com', name: 'Trans Test User' });
    await seedTestBankAccounts({
      id: testBankAccountId,
      userId: testUserId,
      name: 'Trans Account',
      balance: '1000.00',
      isPrimary: true,
    });
    await db.insert(category).values({
      id: testCategoryId,
      name: 'Test Category',
      userId: testUserId, // Categoria utente
      categoryType: 'expense',
      icon: '🧪',
      color: '#000',
      description: 'Test',
    });
    // Verifica che i dati siano effettivamente presenti
    const acc = await db.query.bankAccount.findFirst({
      where: eq(bankAccount.id, testBankAccountId),
    });
    const cat = await db.query.category.findFirst({ where: eq(category.id, testCategoryId) });
    if (!acc) throw new Error('Bank account di test non trovato!');
    if (!cat) throw new Error('Categoria di test non trovata!');
  });

  afterAll(async () => {
    await db.delete(transaction).where(eq(transaction.userId, testUserId));
    await db.delete(bankAccount).where(eq(bankAccount.userId, testUserId));
    await db.delete(category).where(eq(category.categoryType, 'expense'));
    await pool.end();
  });

  it('should insert and find a transaction', async () => {
    const txData = {
      id: crypto.randomUUID(),
      userId: testUserId,
      bankAccountId: testBankAccountId,
      categoryId: testCategoryId,
      transactionType: 'expense' as const,
      amount: '10.00',
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const newBalance = '990.00';
    const inserted = await repository.insert(txData, newBalance);
    expect(inserted).toMatchObject({ ...txData, amount: expect.anything() });
    const found = await repository.findById(txData.id);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(txData.id);
  });

  it('should update a transaction', async () => {
    const txData = {
      id: crypto.randomUUID(),
      userId: testUserId,
      bankAccountId: testBankAccountId,
      categoryId: testCategoryId,
      transactionType: 'expense' as const,
      amount: '10.00',
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const newBalance = '990.00';
    await repository.insert(txData, newBalance);
    const updated = await repository.update(txData.id, '980.00', {
      amount: '20.00',
      updatedAt: new Date(),
    });
    expect(updated).not.toBeNull();
    expect(updated?.amount).toBe('20.00');
    // Verifica che il saldo sia stato aggiornato
    const acc = await db.query.bankAccount.findFirst({
      where: eq(bankAccount.id, testBankAccountId),
    });
    expect(acc?.balance).toBe('980.00');
  });

  it('should return undefined when updating a non-existent transaction', async () => {
    const updated = await repository.update(crypto.randomUUID(), '1000.00', { amount: '99.99' });
    expect(updated).toBeUndefined();
  });

  it('should return undefined when deleting a non-existent transaction', async () => {
    const deleted = await repository.delete(crypto.randomUUID(), '1000.00');
    expect(deleted).toBeUndefined();
  });

  it('should return undefined when finding a non-existent transaction', async () => {
    const found = await repository.findById(crypto.randomUUID());
    expect(found).toBeUndefined();
  });

  it('should findAll with pagination and filters', async () => {
    // Inserisci 3 transazioni: 2 expense, 1 income
    const txs = [
      {
        id: crypto.randomUUID(),
        userId: testUserId,
        bankAccountId: testBankAccountId,
        categoryId: testCategoryId,
        transactionType: 'expense' as const,
        amount: '10.00',
        date: new Date('2025-01-01'),
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01'),
      },
      {
        id: crypto.randomUUID(),
        userId: testUserId,
        bankAccountId: testBankAccountId,
        categoryId: testCategoryId,
        transactionType: 'income' as const,
        amount: '100.00',
        date: new Date('2025-02-01'),
        createdAt: new Date('2025-02-01'),
        updatedAt: new Date('2025-02-01'),
      },
      {
        id: crypto.randomUUID(),
        userId: testUserId,
        bankAccountId: testBankAccountId,
        categoryId: testCategoryId,
        transactionType: 'expense' as const,
        amount: '5.00',
        date: new Date('2025-03-01'),
        createdAt: new Date('2025-03-01'),
        updatedAt: new Date('2025-03-01'),
      },
    ];
    for (const tx of txs) {
      await repository.insert(tx, '1000.00');
    }
    // findAll base
    const all = await repository.findAll(testUserId);
    expect(all.length).toBeGreaterThanOrEqual(3);
    // paginazione
    const page1 = await repository.findAll(testUserId, { page: 1, pageSize: 2 });
    expect(page1.length).toBe(2);
    const page2 = await repository.findAll(testUserId, { page: 2, pageSize: 2 });
    expect(page2.length).toBeGreaterThanOrEqual(1);
    // filtro tipo
    const onlyIncome = await repository.findAll(testUserId, { transactionType: 'income' });
    expect(onlyIncome.every((t) => t.transactionType === 'income')).toBe(true);
    // filtro date
    const jan = await repository.findAll(testUserId, {
      from: new Date('2025-01-01'),
      to: new Date('2025-01-31'),
    });
    expect(jan.length).toBe(1);
    expect(jan[0].amount).toBe('10.00');
  });

  it('should delete a transaction', async () => {
    const txData = {
      id: crypto.randomUUID(),
      userId: testUserId,
      bankAccountId: testBankAccountId,
      categoryId: testCategoryId,
      transactionType: 'expense' as const,
      amount: '10.00',
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const newBalance = '990.00';
    await repository.insert(txData, newBalance);
    const deleted = await repository.delete(txData.id, '1000.00');
    expect(deleted).not.toBeNull();
    expect(deleted?.id).toBe(txData.id);
    const shouldBeUndefined = await repository.findById(txData.id);
    expect(shouldBeUndefined).toBeUndefined();
  });
});
