// DICHIARAZIONI MOCK PRIMA DI TUTTO
const mockBankAccountRepository = {
  findById: jest.fn().mockResolvedValue({
    id: 'acc1',
    userId: 'user1',
    balance: '1000',
    name: 'Account 1',
  }),
  findAll: jest
    .fn()
    .mockResolvedValue([{ id: 'acc1', userId: 'user1', balance: '1000', name: 'Account 1' }]),
};

const mockCategoryRepository = {
  findByUserId: jest.fn().mockResolvedValue([
    {
      id: 'cat1',
      name: 'Categoria 1',
      userId: 'user1',
      parentId: null,
      categoryType: 'income',
      createdAt: new Date(),
      updatedAt: new Date(),
      description: null,
      icon: null,
      color: null,
    },
  ]),
};

const mockTransactionRepository = {
  findAll: jest.fn().mockResolvedValue([]),
  findById: jest.fn().mockResolvedValue(undefined),
  insert: jest.fn().mockResolvedValue({ id: 'tx1' }),
  update: jest.fn().mockResolvedValue({ id: 'tx1' }),
  delete: jest.fn().mockResolvedValue({ id: 'tx1' }),
};

import { TransactionService } from './transaction-service';

jest.mock('./transaction-service', () => {
  const originalModule = jest.requireActual('./transaction-service');
  return {
    ...originalModule,
    TransactionService: class extends originalModule.TransactionService {
      constructor() {
        super();
        this.repository = mockTransactionRepository;
      }
    },
  };
});

jest.mock('@/repo/bank-account-repository', () => ({
  BankAccountRepository: jest.fn().mockImplementation(() => mockBankAccountRepository),
}));

jest.mock('@/repo/category-repository', () => ({
  CategoryRepository: jest.fn().mockImplementation(() => mockCategoryRepository),
}));

describe('TransactionService', () => {
  describe('getAll', () => {
    it('returns an empty list of transactions by default', async () => {
      const service = new TransactionService();
      const result = await service.getAll('user1');
      expect(result.error).toBe(false);
      expect(result.data?.transactions).toEqual([]);
      expect(result.data?.totalCount).toBe(0);
      expect(result.data?.page).toBe(1);
      expect(result.data?.pageSize).toBe(25);
      expect(mockTransactionRepository.findAll).toHaveBeenCalledWith('user1', undefined);
    });

    it('returns an error if the repository throws (getAll)', async () => {
      mockTransactionRepository.findAll.mockRejectedValueOnce(new Error('DB Error'));
      const service = new TransactionService();
      const result = await service.getAll('user1');
      expect(result.error).toBe(true);
      expect(result.message).toBe('DB Error');
    });

    it('returns filtered and paginated transactions when filters are provided', async () => {
      const transactions = [
        {
          id: 'tx1',
          userId: 'user1',
          bankAccountId: 'acc1',
          amount: '123',
          transactionType: 'income',
          date: new Date(),
          categoryId: 'cat1',
          description: 'desc',
          bankAccount: { id: 'acc1', userId: 'user1', balance: '1000', name: 'Account 1' },
          category: {},
        },
      ];
      mockTransactionRepository.findAll.mockResolvedValueOnce(transactions);
      const service = new TransactionService();
      const filters = {
        page: 2,
        pageSize: 10,
        from: new Date('2023-01-01'),
        to: new Date('2023-12-31'),
        transactionType: 'income' as const,
      };
      const result = await service.getAll('user1', filters);
      expect(result.error).toBe(false);
      expect(result.data?.transactions).toHaveLength(1);
      expect(result.data?.transactions[0].amount).toBe(123);
      expect(result.data?.transactions[0].bankAccount.balance).toBe(1000);
      expect(result.data?.page).toBe(2);
      expect(result.data?.pageSize).toBe(10);
      expect(mockTransactionRepository.findAll).toHaveBeenCalledWith('user1', filters);
    });
  });

  describe('createTransaction', () => {
    it('creates a new transaction if the bank account exists', async () => {
      const service = new TransactionService();
      const data = {
        id: 'tx1',
        userId: 'user1',
        bankAccountId: 'acc1',
        amount: 100,
        transactionType: 'income' as const,
        date: new Date(),
        categoryId: 'cat1',
        description: 'desc',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await service.createTransaction(data);
      expect(data.bankAccountId).toBe('acc1');
      expect(data.transactionType).toBe('income');
      expect(data.id).toBe('tx1');
      expect(data.userId).toBe('user1');
      expect(data.amount).toBe(100);
      expect(data.date).toBeInstanceOf(Date);
      expect(data.categoryId).toBe('cat1');
      expect(data.description).toBe('desc');
      expect(data.createdAt).toBeInstanceOf(Date);
      expect(data.updatedAt).toBeInstanceOf(Date);
      expect(result.error).toBe(false);
      expect(result.data).toEqual({ id: 'tx1' });
      expect(mockTransactionRepository.insert).toHaveBeenCalled();
    });

    it('creates an expense transaction and updates the account balance accordingly', async () => {
      mockBankAccountRepository.findById.mockResolvedValueOnce({
        id: 'acc1',
        userId: 'user1',
        balance: '1000',
        name: 'Account 1',
      });
      const service = new TransactionService();
      const data = {
        id: 'tx2',
        userId: 'user1',
        bankAccountId: 'acc1',
        amount: 200,
        transactionType: 'expense' as const,
        date: new Date(),
        categoryId: 'cat1',
        description: 'desc',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await service.createTransaction(data);
      // Il saldo deve essere 1000 - 200 = 800
      expect(mockTransactionRepository.insert).toHaveBeenCalledWith(
        expect.objectContaining({ amount: '200' }),
        '800',
      );
    });

    it('converts the account balance to string if it is already a number', async () => {
      mockBankAccountRepository.findById.mockResolvedValueOnce({
        id: 'acc1',
        userId: 'user1',
        balance: 500,
        name: 'Account 1',
      });
      const service = new TransactionService();
      const data = {
        id: 'tx3',
        userId: 'user1',
        bankAccountId: 'acc1',
        amount: 50,
        transactionType: 'income' as const,
        date: new Date(),
        categoryId: 'cat1',
        description: 'desc',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await service.createTransaction(data);
      expect(mockTransactionRepository.insert).toHaveBeenCalledWith(
        expect.objectContaining({ amount: '50' }),
        '550',
      );
    });

    it('returns an error if the bank account does not exist', async () => {
      mockBankAccountRepository.findById.mockResolvedValueOnce(undefined);
      const service = new TransactionService();
      const data = {
        id: 'tx1',
        userId: 'user1',
        bankAccountId: 'acc1',
        amount: 100,
        transactionType: 'income' as const,
        date: new Date(),
        categoryId: 'cat1',
        description: 'desc',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await service.createTransaction(data);
      expect(result.error).toBe(true);
      expect(result.message).toBe('Bank account not found');
    });

    it('returns an error if the repository throws (createTransaction)', async () => {
      mockTransactionRepository.insert.mockRejectedValueOnce(new Error('Insert Error'));
      const service = new TransactionService();
      const data = {
        id: 'tx1',
        userId: 'user1',
        bankAccountId: 'acc1',
        amount: 100,
        transactionType: 'income' as const,
        date: new Date(),
        categoryId: 'cat1',
        description: 'desc',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await service.createTransaction(data);
      expect(result.error).toBe(true);
      expect(result.message).toBe('Insert Error');
    });
  });

  describe('deleteTransaction', () => {
    it('deletes a transaction if it exists', async () => {
      mockTransactionRepository.findById.mockResolvedValueOnce({
        id: 'tx1',
        bankAccountId: 'acc1',
        amount: 100,
        transactionType: 'income',
      });
      const service = new TransactionService();
      const result = await service.deleteTransaction('tx1');
      expect(result.error).toBe(false);
      expect(result.data).toEqual({ id: 'tx1' });
      expect(mockTransactionRepository.delete).toHaveBeenCalled();
    });

    it('deletes an expense transaction and updates the account balance accordingly', async () => {
      mockTransactionRepository.findById.mockResolvedValueOnce({
        id: 'tx2',
        bankAccountId: 'acc1',
        amount: 200,
        transactionType: 'expense',
      });
      mockBankAccountRepository.findById.mockResolvedValueOnce({
        id: 'acc1',
        userId: 'user1',
        balance: '1000',
        name: 'Account 1',
      });
      const service = new TransactionService();
      await service.deleteTransaction('tx2');
      // Il saldo deve essere 1000 - 200 = 800
      expect(mockTransactionRepository.delete).toHaveBeenCalledWith('tx2', '800');
    });

    it('returns an error if the transaction does not exist', async () => {
      mockTransactionRepository.findById.mockResolvedValueOnce(undefined);
      const service = new TransactionService();
      const result = await service.deleteTransaction('tx1');
      expect(result.error).toBe(true);
      expect(result.message).toBe('Transaction not found');
    });

    it('returns an error if the bank account does not exist (deleteTransaction)', async () => {
      mockTransactionRepository.findById.mockResolvedValueOnce({
        id: 'tx1',
        bankAccountId: 'acc1',
        amount: 100,
        transactionType: 'income',
      });
      mockBankAccountRepository.findById.mockResolvedValueOnce(undefined);
      const service = new TransactionService();
      const result = await service.deleteTransaction('tx1');
      expect(result.error).toBe(true);
      expect(result.message).toBe('Bank account not found');
    });

    it('returns an error if the repository throws (deleteTransaction)', async () => {
      mockTransactionRepository.findById.mockResolvedValueOnce({
        id: 'tx1',
        bankAccountId: 'acc1',
        amount: 100,
        transactionType: 'income',
      });
      mockTransactionRepository.delete.mockRejectedValueOnce(new Error('Delete Error'));
      const service = new TransactionService();
      const result = await service.deleteTransaction('tx1');
      expect(result.error).toBe(true);
      expect(result.message).toBe('Delete Error');
    });

    it('returns the default error message if the thrown error is not an Error instance (deleteTransaction)', async () => {
      const service = new TransactionService();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (service as any).repository.findById = jest.fn().mockResolvedValue({
        id: 'tx1',
        bankAccountId: 'acc1',
        amount: 100,
        transactionType: 'income',
      });
      mockBankAccountRepository.findById.mockResolvedValueOnce({
        id: 'acc1',
        userId: 'user1',
        balance: '1000',
        name: 'Account 1',
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (service as any).repository.delete = jest.fn(() => Promise.reject('fail'));
      const result = await service.deleteTransaction('tx1');
      expect(result.error).toBe(true);
      expect(result.message).toBe('Failed to delete transaction');
    });
  });

  describe('updateTransaction', () => {
    afterEach(() => {
      jest.restoreAllMocks();
      mockTransactionRepository.update.mockReset();
      mockTransactionRepository.findById.mockReset();
      mockBankAccountRepository.findById.mockReset();
    });
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('returns the default error message if the thrown error is not an Error instance (updateTransaction)', async () => {
      const service = new TransactionService();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (service as any).repository.update = jest.fn(() => Promise.reject('fail'));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (service as any).repository.findById = jest.fn().mockResolvedValue({
        id: 'tx1',
        bankAccountId: 'acc1',
        amount: 100,
        transactionType: 'income',
      });
      mockBankAccountRepository.findById.mockResolvedValueOnce({
        id: 'acc1',
        userId: 'user1',
        balance: '1000',
        name: 'Account 1',
      });
      const data = {
        id: 'tx1',
        userId: 'user1',
        bankAccountId: 'acc1',
        amount: 200,
        transactionType: 'expense' as const,
        date: new Date(),
        categoryId: 'cat1',
        description: 'desc',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await service.updateTransaction('tx1', data);
      expect(result.error).toBe(true);
      expect(result.message).toBe('Failed to update transaction');
    });

    it('updates a transaction if it exists', async () => {
      mockTransactionRepository.findById.mockResolvedValueOnce({
        id: 'tx1',
        bankAccountId: 'acc1',
        amount: 100,
        transactionType: 'income',
      });
      mockBankAccountRepository.findById.mockResolvedValueOnce({
        id: 'acc1',
        userId: 'user1',
        balance: '1000',
        name: 'Account 1',
      });
      mockTransactionRepository.update.mockResolvedValueOnce({ id: 'tx1' });
      const service = new TransactionService();
      const data = {
        id: 'tx1',
        userId: 'user1',
        bankAccountId: 'acc1',
        amount: 200,
        transactionType: 'expense' as const,
        date: new Date(),
        categoryId: 'cat1',
        description: 'desc',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await service.updateTransaction('tx1', data);
      expect(data.bankAccountId).toBe('acc1');
      expect(data.transactionType).toBe('expense');
      expect(data.id).toBe('tx1');
      expect(data.userId).toBe('user1');
      expect(data.amount).toBe(200);
      expect(data.date).toBeInstanceOf(Date);
      expect(data.categoryId).toBe('cat1');
      expect(data.description).toBe('desc');
      expect(data.createdAt).toBeInstanceOf(Date);
      expect(data.updatedAt).toBeInstanceOf(Date);
      expect(result.error).toBe(false);
      expect(result.data).toEqual({ id: 'tx1' });
      expect(mockTransactionRepository.update).toHaveBeenCalled();
    });

    it('updates a transaction and changes its type from income to expense, updating the balance accordingly', async () => {
      mockTransactionRepository.findById.mockResolvedValueOnce({
        id: 'tx2',
        bankAccountId: 'acc1',
        amount: 100,
        transactionType: 'income',
      });
      mockBankAccountRepository.findById.mockResolvedValueOnce({
        id: 'acc1',
        userId: 'user1',
        balance: '1000',
        name: 'Account 1',
      });
      const service = new TransactionService();
      const data = {
        id: 'tx2',
        userId: 'user1',
        bankAccountId: 'acc1',
        amount: 200,
        transactionType: 'expense' as const,
        date: new Date(),
        categoryId: 'cat1',
        description: 'desc',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await service.updateTransaction('tx2', data);
      // saldo: 1000 - 100 (vecchia income) + (-200) (nuova expense) = 700
      expect(mockTransactionRepository.update).toHaveBeenCalledWith(
        'tx2',
        '700',
        expect.any(Object),
      );
    });

    it('updates a transaction without changing the amount, keeping the balance unchanged', async () => {
      mockTransactionRepository.findById.mockResolvedValueOnce({
        id: 'tx3',
        bankAccountId: 'acc1',
        amount: 100,
        transactionType: 'income',
      });
      mockBankAccountRepository.findById.mockResolvedValueOnce({
        id: 'acc1',
        userId: 'user1',
        balance: '1000',
        name: 'Account 1',
      });
      const service = new TransactionService();
      const data = {
        id: 'tx3',
        userId: 'user1',
        bankAccountId: 'acc1',
        amount: 100,
        transactionType: 'income' as const,
        date: new Date(),
        categoryId: 'cat1',
        description: 'desc',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await service.updateTransaction('tx3', data);
      // saldo: 1000 - 100 + 100 = 1000
      expect(mockTransactionRepository.update).toHaveBeenCalledWith(
        'tx3',
        '1000',
        expect.any(Object),
      );
    });

    it('returns an error if the transaction does not exist (updateTransaction)', async () => {
      mockTransactionRepository.findById.mockResolvedValueOnce(undefined);
      const service = new TransactionService();
      const data = {
        id: 'tx1',
        userId: 'user1',
        bankAccountId: 'acc1',
        amount: 200,
        transactionType: 'expense' as const,
        date: new Date(),
        categoryId: 'cat1',
        description: 'desc',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await service.updateTransaction('tx1', data);
      expect(result.error).toBe(true);
      expect(result.message).toBe('Transaction not found');
    });

    it('returns an error if the bank account does not exist (updateTransaction)', async () => {
      mockTransactionRepository.findById.mockResolvedValueOnce({
        id: 'tx1',
        bankAccountId: 'acc1',
        amount: 100,
        transactionType: 'income',
      });
      mockBankAccountRepository.findById.mockResolvedValueOnce(undefined);
      const service = new TransactionService();
      const data = {
        id: 'tx1',
        userId: 'user1',
        bankAccountId: 'acc1',
        amount: 200,
        transactionType: 'expense' as const,
        date: new Date(),
        categoryId: 'cat1',
        description: 'desc',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await service.updateTransaction('tx1', data);
      expect(result.error).toBe(true);
      expect(result.message).toBe('Bank account not found');
    });

    it('returns an error if the repository throws (updateTransaction)', async () => {
      mockTransactionRepository.findById.mockResolvedValueOnce({
        id: 'tx1',
        bankAccountId: 'acc1',
        amount: 100,
        transactionType: 'income',
      });
      mockBankAccountRepository.findById.mockResolvedValueOnce({
        id: 'acc1',
        userId: 'user1',
        balance: '1000',
        name: 'Account 1',
      });
      mockTransactionRepository.update.mockRejectedValueOnce(new Error('Update Error'));
      const service = new TransactionService();
      const data = {
        id: 'tx1',
        userId: 'user1',
        bankAccountId: 'acc1',
        amount: 200,
        transactionType: 'expense' as const,
        date: new Date(),
        categoryId: 'cat1',
        description: 'desc',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await service.updateTransaction('tx1', data);
      expect(result.error).toBe(true);
      expect(result.message).toBe('Update Error');
    });
  });

  describe('getTransactionFormData', () => {
    it('returns the default error message if the thrown error is not an Error instance (getTransactionFormData)', async () => {
      const service = new TransactionService();
      mockBankAccountRepository.findAll.mockRejectedValueOnce('fail');
      const result = await service.getTransactionFormData('user1');
      expect(result.error).toBe(true);
      expect(result.message).toBe('Failed to retrieve transaction form data');
    });
    it('returns the form data needed to create a transaction (bank accounts and categories)', async () => {
      const service = new TransactionService();
      const result = await service.getTransactionFormData('user1');
      expect(result.error).toBe(false);
      expect(result.data?.bankAccounts).toBeDefined();
      expect(result.data?.categories).toBeDefined();
      expect(Array.isArray(result.data?.bankAccounts)).toBe(true);
      expect(Array.isArray(result.data?.categories)).toBe(true);
      // balance sempre number
      expect(typeof result.data?.bankAccounts[0].balance).toBe('number');
    });

    it('returns an error if the repository throws (getTransactionFormData)', async () => {
      mockBankAccountRepository.findAll.mockRejectedValueOnce(new Error('Form Error'));
      const service = new TransactionService();
      const result = await service.getTransactionFormData('user1');
      expect(result.error).toBe(true);
      expect(result.message).toBe('Form Error');
    });

    it('returns an error if fetching categories fails (getTransactionFormData)', async () => {
      mockCategoryRepository.findByUserId.mockRejectedValueOnce(new Error('Cat Error'));
      const service = new TransactionService();
      const result = await service.getTransactionFormData('user1');
      expect(result.error).toBe(true);
      expect(result.message).toBe('Cat Error');
    });
  });

  describe('handleErrors', () => {
    it('returns the default error message if the thrown error is not an Error instance (getAll)', async () => {
      const service = new TransactionService();
      const result = await service['handleErrors'](
        () => Promise.reject('fail'),
        'Default error message',
      );
      expect(result.error).toBe(true);
      expect(result.message).toBe('Default error message');
    });

    it('returns the default error message if the thrown error is not an Error instance (createTransaction)', async () => {
      const service = new TransactionService();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (service as any).repository.insert = jest.fn(() => Promise.reject('fail'));
      const data = {
        id: 'tx1',
        userId: 'user1',
        bankAccountId: 'acc1',
        amount: 100,
        transactionType: 'income' as const,
        date: new Date(),
        categoryId: 'cat1',
        description: 'desc',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      // Forza il bank account esistente
      mockBankAccountRepository.findById.mockResolvedValueOnce({
        id: 'acc1',
        userId: 'user1',
        balance: '1000',
        name: 'Account 1',
      });
      const result = await service.createTransaction(data);
      expect(result.error).toBe(true);
      expect(result.message).toBe('Failed to create transaction');
    });

    it('returns the default error message if the thrown error is not an Error instance (updateTransaction)', async () => {
      const service = new TransactionService();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (service as any).repository.update = jest.fn(() => Promise.reject('fail'));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (service as any).repository.findById = jest.fn().mockResolvedValue({
        id: 'tx1',
        bankAccountId: 'acc1',
        amount: 100,
        transactionType: 'income',
      });
      mockBankAccountRepository.findById.mockResolvedValueOnce({
        id: 'acc1',
        userId: 'user1',
        balance: '1000',
        name: 'Account 1',
      });
      const data = {
        id: 'tx1',
        userId: 'user1',
        bankAccountId: 'acc1',
        amount: 200,
        transactionType: 'expense' as const,
        date: new Date(),
        categoryId: 'cat1',
        description: 'desc',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await service.updateTransaction('tx1', data);
      expect(result.error).toBe(true);
      expect(result.message).toBe('Failed to update transaction');
    });

    it('returns the default error message if the thrown error is not an Error instance (getTransactionFormData)', async () => {
      const service = new TransactionService();
      mockBankAccountRepository.findAll.mockRejectedValueOnce('fail');
      const result = await service.getTransactionFormData('user1');
      expect(result.error).toBe(true);
      expect(result.message).toBe('Failed to retrieve transaction form data');
    });
  });
});
