import { db, pool } from '@/drizzle/db';
import { BankAccountRepository } from './bank-account-repository';
import { bankAccount } from '@/drizzle/schema';
import { seedTestUsers } from '@/drizzle/seeds/test-users';

describe('BankAccountRepository (integration)', () => {
  const repository = new BankAccountRepository();
  const nonExistentId = crypto.randomUUID();
  const testUserId = 'test-user-id-bank'; // già unico, nessuna modifica necessaria

  beforeAll(async () => {
    await seedTestUsers({ id: testUserId, email: 'bank@email.com', name: 'Bank Test User' });
  });

  beforeEach(async () => {
    // Pulisci solo la tabella degli account
    await db.delete(bankAccount);
  });

  afterAll(async () => {
    await db.delete(bankAccount);
    await pool.end();
  });

  it('should return an empty array of bank accounts', async () => {
    const result = await repository.findAll(testUserId);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it('should insert a new bank account', async () => {
    const newAccount = {
      id: crypto.randomUUID(),
      userId: testUserId,
      name: 'Test Bank',
      accountType: 'checking' as const,
      accountNumber: '123456789',
      isPrimary: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const insertedAccount = await repository.insert(newAccount);
    expect(insertedAccount).toMatchObject(newAccount);
    expect(insertedAccount.createdAt).toBeInstanceOf(Date);
    expect(insertedAccount.updatedAt).toBeInstanceOf(Date);
  });

  it('should not insert a bank account with non-existent userId (if FK exists)', async () => {
    const newAccount = {
      id: crypto.randomUUID(),
      userId: 'not-a-real-user',
      name: 'Invalid User',
      accountType: 'checking' as const,
      accountNumber: '000000000',
      isPrimary: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    let error;
    try {
      await repository.insert(newAccount);
    } catch (e) {
      error = e;
    }
    // Se non hai FK, questo test può essere tolto o modificato
    expect(error).toBeDefined();
  });

  it('should not insert two accounts with the same id', async () => {
    const id = crypto.randomUUID();
    const acc1 = {
      id,
      userId: testUserId,
      name: 'First',
      accountType: 'checking' as const,
      accountNumber: '111111111',
      isPrimary: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const acc2 = {
      id,
      userId: testUserId,
      name: 'Duplicate',
      accountType: 'checking' as const,
      accountNumber: '999999999',
      isPrimary: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await repository.insert(acc1);
    let error;
    try {
      await repository.insert(acc2);
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('should find the bank account by ID', async () => {
    const newAccount = {
      id: crypto.randomUUID(),
      userId: testUserId,
      name: 'Find Me',
      accountType: 'checking' as const,
      accountNumber: '222222222',
      isPrimary: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await repository.insert(newAccount);
    const foundAccount = await repository.findById(newAccount.id);
    expect(foundAccount).not.toBeNull();
    expect(foundAccount?.id).toBe(newAccount.id);
  });

  it('should return undefined for non-existent id', async () => {
    const found = await repository.findById(nonExistentId);
    expect(found).toBeUndefined();
  });

  it('should update the bank account', async () => {
    const newAccount = {
      id: crypto.randomUUID(),
      userId: testUserId,
      name: 'To Update',
      accountType: 'checking' as const,
      accountNumber: '333333333',
      isPrimary: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await repository.insert(newAccount);
    const updatedName = 'Updated Test Bank';
    const updatedAccount = await repository.update(newAccount.id, {
      name: updatedName,
      updatedAt: new Date(),
    });
    expect(updatedAccount).not.toBeNull();
    expect(updatedAccount?.name).toBe(updatedName);
  });

  it('should return undefined when updating a non-existent account', async () => {
    const updated = await repository.update(nonExistentId, { name: 'Nope' });
    expect(updated).toBeUndefined();
  });

  it('should delete the bank account', async () => {
    const newAccount = {
      id: crypto.randomUUID(),
      userId: testUserId,
      name: 'To Delete',
      accountType: 'checking' as const,
      accountNumber: '444444444',
      isPrimary: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await repository.insert(newAccount);
    const deletedAccount = await repository.delete(newAccount.id);
    expect(deletedAccount).not.toBeNull();
    expect(deletedAccount?.id).toBe(newAccount.id);

    const shouldBeNull = await repository.findById(newAccount.id);
    expect(shouldBeNull).toBeUndefined();
  });

  it('should return undefined when deleting a non-existent account', async () => {
    const deleted = await repository.delete(nonExistentId);
    expect(deleted).toBeUndefined();
  });

  it('should insert and find multiple accounts for the same user', async () => {
    const accounts = [
      {
        id: crypto.randomUUID(),
        userId: testUserId,
        name: 'Bank 1',
        accountType: 'checking' as const,
        accountNumber: '111',
        isPrimary: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: crypto.randomUUID(),
        userId: testUserId,
        name: 'Bank 2',
        accountType: 'savings' as const,
        accountNumber: '222',
        isPrimary: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    for (const acc of accounts) {
      await repository.insert(acc);
    }
    const found = await repository.findAll(testUserId);
    expect(found.length).toBeGreaterThanOrEqual(2);
    const names = found.map((a) => a.name);
    expect(names).toEqual(expect.arrayContaining(['Bank 1', 'Bank 2']));
  });

  it('should find the primary bank account for a user', async () => {
    // Inserisci due account, uno primario e uno no
    const primaryAccount = {
      id: crypto.randomUUID(),
      userId: testUserId,
      name: 'Primary Account',
      accountType: 'checking' as const,
      accountNumber: '333',
      isPrimary: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const secondaryAccount = {
      id: crypto.randomUUID(),
      userId: testUserId,
      name: 'Secondary Account',
      accountType: 'savings' as const,
      accountNumber: '444',
      isPrimary: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await repository.insert(primaryAccount);
    await repository.insert(secondaryAccount);
    const foundPrimary = await repository.findPrimary(testUserId);
    expect(foundPrimary).not.toBeNull();
    expect(foundPrimary?.id).toBe(primaryAccount.id);
    expect(foundPrimary?.isPrimary).toBe(true);
  });

  it('should set a new primary bank account for a user', async () => {
    // Inserisci due account, entrambi non primari
    const acc1 = {
      id: crypto.randomUUID(),
      userId: testUserId,
      name: 'SetPrimary1',
      accountType: 'checking' as const,
      accountNumber: '555',
      isPrimary: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const acc2 = {
      id: crypto.randomUUID(),
      userId: testUserId,
      name: 'SetPrimary2',
      accountType: 'savings' as const,
      accountNumber: '666',
      isPrimary: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await repository.insert(acc1);
    await repository.insert(acc2);
    // Set acc2 come primario
    await repository.setPrimary(testUserId, acc2.id);
    const foundPrimary = await repository.findPrimary(testUserId);
    expect(foundPrimary).not.toBeNull();
    expect(foundPrimary?.id).toBe(acc2.id);
    expect(foundPrimary?.isPrimary).toBe(true);
    // Verifica che acc1 non sia più primario
    const foundAcc1 = await repository.findById(acc1.id);
    expect(foundAcc1?.isPrimary).toBe(false);
  });
});
