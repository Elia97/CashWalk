import { WelcomeService } from './welcome-service';
import { insertOnBoardingData } from '@/repo/welcome-repository';
import { getWelcomeCategoryMapping } from '@/lib/welcome-categories';

jest.mock('@/repo/welcome-repository', () => ({
  insertOnBoardingData: jest.fn(),
}));

jest.mock('@/repo/category-repository', () => ({
  CategoryRepository: jest.fn().mockImplementation(() => mockCategoryRepository),
}));

jest.mock('@/lib/welcome-categories', () => ({
  getWelcomeCategoryMapping: jest.fn(),
}));

const mockCategoryRepository = {
  findByName: jest.fn(),
};

describe('WelcomeService (Onboarding)', () => {
  let consoleWarnSpy: jest.SpyInstance;

  afterEach(() => {
    if (consoleWarnSpy) {
      consoleWarnSpy.mockRestore();
    }
  });
  it('ignores categories with no mapping', async () => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    (getWelcomeCategoryMapping as jest.Mock).mockReturnValueOnce(undefined);
    const service = new WelcomeService();
    const result = await service.createWelcomeData({
      bankAccount,
      categories: ['unknown'],
    });
    expect(result.error).toBe(false);
    expect(insertOnBoardingData).toHaveBeenCalledWith(
      expect.objectContaining({
        categories: [],
      }),
    );
  });

  it('ignores categories with missing system category', async () => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    (getWelcomeCategoryMapping as jest.Mock).mockReturnValueOnce({
      systemCategory: 'syscat',
      label: 'Sport',
      icon: '🏀',
      categoryType: 'expense',
    });
    mockCategoryRepository.findByName.mockResolvedValueOnce(undefined);
    const service = new WelcomeService();
    const result = await service.createWelcomeData({
      bankAccount,
      categories: ['sport'],
    });
    expect(result.error).toBe(false);
    expect(insertOnBoardingData).toHaveBeenCalledWith(
      expect.objectContaining({
        categories: [],
      }),
    );
  });
  const bankAccount = {
    id: 'acc1',
    userId: 'user1',
    name: 'Conto',
    balance: 1000,
    isPrimary: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    accountNumber: null,
    accountType: 'checking' as const,
    currency: 'EUR',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates onboarding data with valid categories and bank account', async () => {
    (getWelcomeCategoryMapping as jest.Mock).mockReturnValue({
      systemCategory: 'syscat',
      label: 'Sport',
      icon: '🏀',
      categoryType: 'expense',
    });
    mockCategoryRepository.findByName.mockResolvedValueOnce({ id: 'syscat' });
    (insertOnBoardingData as jest.Mock).mockResolvedValueOnce(undefined);

    const service = new WelcomeService();
    const result = await service.createWelcomeData({
      bankAccount,
      categories: ['sport'],
    });
    expect(result.error).toBe(false);
    expect(insertOnBoardingData).toHaveBeenCalledWith(
      expect.objectContaining({
        bankAccount: expect.objectContaining({
          ...bankAccount,
          isPrimary: true,
          balance: '1000',
        }),
        categories: [
          expect.objectContaining({
            parentId: 'syscat',
            userId: 'user1',
            name: 'Sport',
            icon: '🏀',
            categoryType: 'expense',
          }),
        ],
      }),
    );
  });

  it('returns an error if insertOnBoardingData fails (repository error)', async () => {
    (getWelcomeCategoryMapping as jest.Mock).mockReturnValue({
      systemCategory: 'syscat',
      label: 'Sport',
      icon: '🏀',
      categoryType: 'expense',
    });
    mockCategoryRepository.findByName.mockResolvedValueOnce({ id: 'syscat' });
    (insertOnBoardingData as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));
    const service = new WelcomeService();
    const result = await service.createWelcomeData({
      bankAccount,
      categories: ['sport'],
    });
    expect(result.error).toBe(true);
    expect(result.message).toBe('DB Error');
  });

  it('returns an error if an unexpected exception occurs during onboarding', async () => {
    (getWelcomeCategoryMapping as jest.Mock).mockImplementation(() => {
      throw new Error('Mapping Error');
    });
    const service = new WelcomeService();
    const result = await service.createWelcomeData({
      bankAccount,
      categories: ['sport'],
    });
    expect(result.error).toBe(true);
    expect(result.message).toBe('Mapping Error');
  });
});
