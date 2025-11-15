import { ClientBankAccount } from '@/drizzle/schema';
import { BankAccountService } from './bank-account-service';

const mockRepository = {
  findAll: jest.fn().mockResolvedValue([
    { id: '1', userId: 'user1', balance: '1000', name: 'Account 1' },
    { id: '2', userId: 'user1', balance: '2000', name: 'Account 2' },
  ]),
  insert: jest
    .fn()
    .mockResolvedValue({ id: '3', userId: 'user1', balance: '3000', name: 'Account 3' }),
  delete: jest.fn().mockResolvedValue({ id: '1' }),
  update: jest
    .fn()
    .mockResolvedValue({ id: '2', userId: 'user1', balance: '2500', name: 'Updated Account 2' }),
  setPrimary: jest.fn().mockResolvedValue({
    id: '2',
    userId: 'user1',
    balance: '2500',
    name: 'Updated Account 2',
    isPrimary: true,
  }),
  findPrimary: jest.fn().mockResolvedValue({
    id: '2',
    userId: 'user1',
    balance: '2500',
    name: 'Updated Account 2',
    isPrimary: true,
    transactions: [
      {
        id: 'tx1',
        accountId: '2',
        amount: '500',
        date: new Date(),
        description: 'Grocery',
        categoryId: 'cat1',
      },
    ],
  }),
};

// Override the constructor to inject the mock
jest.mock('./bank-account-service', () => {
  const originalModule = jest.requireActual('./bank-account-service');
  return {
    ...originalModule,
    BankAccountService: class extends originalModule.BankAccountService {
      constructor() {
        super();
        this.repository = mockRepository;
      }
    },
  };
});

describe('BankAccountService', () => {
  describe('getAll', () => {
    it('returns all bank accounts for a user, with balances as numbers', async () => {
      const service = new BankAccountService();
      const result = await service.getAll('user1');
      expect(result.error).toBe(false);
      expect(result.data).toHaveLength(2);
      expect(result.data?.[0].balance).toBe(1000);
    });

    it('returns an error if the repository throws (getAll)', async () => {
      mockRepository.findAll.mockRejectedValueOnce(new Error('DB Error'));
      const service = new BankAccountService();
      const result = await service.getAll('user1');
      expect(result.error).toBe(true);
      expect(result.message).toBe('DB Error');
    });

    it('returns an empty list if the user has no bank accounts', async () => {
      mockRepository.findAll.mockResolvedValueOnce([]);
      const service = new BankAccountService();
      const result = await service.getAll('user1');
      expect(result.error).toBe(false);
      expect(result.data).toEqual([]);
    });

    it('converts the balance from string to number for each account', async () => {
      mockRepository.findAll.mockResolvedValueOnce([
        { id: '3', userId: 'user1', balance: '1234', name: 'Account 3' },
      ]);
      const service = new BankAccountService();
      const result = await service.getAll('user1');
      expect(result.error).toBe(false);
      expect(typeof result.data?.[0].balance).toBe('number');
      expect(result.data?.[0].balance).toBe(1234);
    });
  });

  describe('create', () => {
    it('creates a new bank account for a user', async () => {
      const service = new BankAccountService();
      const newAccount = { userId: 'user1', balance: 3000, name: 'Account 3' };
      const result = await service.create(newAccount as ClientBankAccount);
      expect(result.error).toBe(false);
      expect(result.data?.id).toBe('3');
    });

    it('returns an error if the repository throws (create)', async () => {
      mockRepository.insert.mockRejectedValueOnce(new Error('Insert Error'));
      const service = new BankAccountService();
      const newAccount = { userId: 'user1', balance: 3000, name: 'Account 3' };
      const result = await service.create(newAccount as ClientBankAccount);
      expect(result.error).toBe(true);
      expect(result.message).toBe('Insert Error');
    });

    it('ensures the balance is stored as a string in the repository', async () => {
      const service = new BankAccountService();
      const newAccount = { userId: 'user1', balance: 4500, name: 'Account 4' };
      await service.create(newAccount as ClientBankAccount);
      expect(mockRepository.insert).toHaveBeenCalledWith(
        expect.objectContaining({ balance: '4500' }),
      );
    });
  });

  describe('delete', () => {
    it('deletes a bank account by id', async () => {
      const service = new BankAccountService();
      const result = await service.delete('1');
      expect(result.error).toBe(false);
      expect(result.data?.id).toBe('1');
    });

    it('returns an error if the repository throws (delete)', async () => {
      mockRepository.delete.mockRejectedValueOnce(new Error('Delete Error'));
      const service = new BankAccountService();
      const result = await service.delete('1');
      expect(result.error).toBe(true);
      expect(result.message).toBe('Delete Error');
    });
  });

  describe('update', () => {
    it('updates a bank account with new data', async () => {
      const service = new BankAccountService();
      const updatedData = { userId: 'user1', balance: 2500, name: 'Updated Account 2' };
      const result = await service.update('2', updatedData as ClientBankAccount);
      expect(result.error).toBe(false);
      expect(result.data?.balance).toBe('2500');
    });

    it('returns an error if the repository throws (update)', async () => {
      mockRepository.update.mockRejectedValueOnce(new Error('Update Error'));
      const service = new BankAccountService();
      const updatedData = { userId: 'user1', balance: 2500, name: 'Updated Account 2' };
      const result = await service.update('2', updatedData as ClientBankAccount);
      expect(result.error).toBe(true);
      expect(result.message).toBe('Update Error');
    });

    it('ensures the balance is stored as a string when updating', async () => {
      const service = new BankAccountService();
      const updatedData = { userId: 'user1', balance: 9999, name: 'Updated Account 2' };
      await service.update('2', updatedData as ClientBankAccount);
      expect(mockRepository.update).toHaveBeenCalledWith(
        '2',
        expect.objectContaining({ balance: '9999' }),
      );
    });
  });

  describe('setPrimary', () => {
    it('sets a bank account as primary for a user', async () => {
      const service = new BankAccountService();
      const result = await service.setPrimaryBankAccount('user1', '2');
      expect(result.error).toBe(false);
      expect(mockRepository.setPrimary).toHaveBeenCalledWith('user1', '2');
    });

    it('returns an error if the repository throws (setPrimary)', async () => {
      mockRepository.setPrimary.mockRejectedValueOnce(new Error('SetPrimary Error'));
      const service = new BankAccountService();
      const result = await service.setPrimaryBankAccount('user1', '2');
      expect(result.error).toBe(true);
      expect(result.message).toBe('SetPrimary Error');
    });
  });

  describe('findPrimary', () => {
    it('retrieves the primary bank account for a user, with transactions and numeric balances', async () => {
      const service = new BankAccountService();
      const result = await service.getPrimaryBankAccount('user1');
      expect(result.error).toBe(false);
      expect(result.data?.id).toBe('2');
      expect(result.data?.isPrimary).toBe(true);
      expect(typeof result.data?.balance).toBe('number');
      expect(result.data?.balance).toBe(2500);
      expect(Array.isArray(result.data?.transactions)).toBe(true);
      expect(typeof result.data?.transactions[0].amount).toBe('number');
      expect(result.data?.transactions[0].amount).toBe(500);
    });

    it('returns an error if the repository throws (findPrimary)', async () => {
      mockRepository.findPrimary.mockRejectedValueOnce(new Error('FindPrimary Error'));
      const service = new BankAccountService();
      const result = await service.getPrimaryBankAccount('user1');
      expect(result.error).toBe(true);
      expect(result.message).toBe('FindPrimary Error');
    });

    it('returns an error if the user has no primary bank account', async () => {
      mockRepository.findPrimary.mockResolvedValueOnce(undefined);
      const service = new BankAccountService();
      const result = await service.getPrimaryBankAccount('user1');
      expect(result.error).toBe(true);
      expect(result.message).toBe('Primary bank account not found');
    });
  });

  describe('handleErrors', () => {
    it('returns the default error message if the thrown error is not an Error instance', async () => {
      const service = new BankAccountService();
      const result = await service['handleErrors'](
        () => Promise.reject('fail'),
        'Default error message',
      );
      expect(result.error).toBe(true);
      expect(result.message).toBe('Default error message');
    });
  });
});
