import { CategoryService } from './category-service';

const mockRepository = {
  findAll: jest.fn().mockResolvedValue([
    {
      id: 'cat1',
      name: 'Categoria 1',
      userId: null,
      parentId: null,
      categoryType: 'income' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      description: null,
      icon: null,
      color: null,
      children: [],
    },
    {
      id: 'cat2',
      name: 'Categoria 2',
      userId: 'user1',
      parentId: 'cat1',
      categoryType: 'expense' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      description: null,
      icon: null,
      color: null,
      children: [],
    },
  ]),
  insert: jest.fn().mockResolvedValue({
    id: 'cat5',
    name: 'Nuova Categoria',
    userId: 'user1',
    parentId: null,
    categoryType: 'income' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    description: null,
    icon: null,
    color: null,
  }),
  update: jest.fn().mockResolvedValue({
    id: 'cat6',
    name: 'Categoria Aggiornata',
    userId: 'user1',
    parentId: null,
    categoryType: 'expense' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    description: null,
    icon: null,
    color: null,
  }),
  delete: jest.fn().mockResolvedValue({
    id: 'cat7',
    name: 'Categoria Eliminata',
    userId: 'user1',
    parentId: null,
    categoryType: 'income' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    description: null,
    icon: null,
    color: null,
  }),
};

jest.mock('./category-service', () => {
  const originalModule = jest.requireActual('./category-service');
  return {
    ...originalModule,
    CategoryService: class extends originalModule.CategoryService {
      constructor() {
        super();
        this.repository = mockRepository;
      }
    },
  };
});

describe('CategoryService', () => {
  describe('getAll', () => {
    it('returns all categories for a user', async () => {
      const service = new CategoryService();
      const result = await service.getAll('user1');
      expect(result.error).toBe(false);
      expect(result.data).toEqual(await mockRepository.findAll());
      expect(mockRepository.findAll).toHaveBeenCalledWith('user1');
    });

    it('returns an error if the repository throws (getAll)', async () => {
      mockRepository.findAll.mockRejectedValueOnce(new Error('DB Error'));
      const service = new CategoryService();
      const result = await service.getAll('user1');
      expect(result.error).toBe(true);
      expect(result.message).toBe('DB Error');
    });

    it('returns an empty list if the user has no categories', async () => {
      mockRepository.findAll.mockResolvedValueOnce([]);
      const service = new CategoryService();
      const result = await service.getAll('user1');
      expect(result.error).toBe(false);
      expect(result.data).toEqual([]);
    });
  });

  describe('create', () => {
    it('creates a new category for a user', async () => {
      const newCategory = {
        id: 'cat5',
        name: 'Nuova Categoria',
        userId: 'user1',
        parentId: null,
        categoryType: 'income' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        description: null,
        icon: null,
        color: null,
      };
      const service = new CategoryService();
      const result = await service.create(newCategory);
      expect(result.error).toBe(false);
      expect(result.data).toEqual(await mockRepository.insert());
      expect(mockRepository.insert).toHaveBeenCalledWith(newCategory);
    });

    it('returns an error if the repository throws (create)', async () => {
      mockRepository.insert.mockRejectedValueOnce(new Error('Insert Error'));
      const service = new CategoryService();
      const newCategory = {
        id: 'cat5',
        name: 'Nuova Categoria',
        userId: 'user1',
        parentId: null,
        categoryType: 'income' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        description: null,
        icon: null,
        color: null,
      };
      const result = await service.create(newCategory);
      expect(result.error).toBe(true);
      expect(result.message).toBe('Insert Error');
    });
  });

  describe('update', () => {
    it('updates a category with new data', async () => {
      const updatedCategory = {
        id: 'cat6',
        name: 'Categoria Aggiornata',
        userId: 'user1',
        parentId: null,
        categoryType: 'expense' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        description: null,
        icon: null,
        color: null,
      };
      const service = new CategoryService();
      const result = await service.update('cat6', updatedCategory);
      expect(result.error).toBe(false);
      expect(result.data).toEqual(await mockRepository.update());
      expect(mockRepository.update).toHaveBeenCalledWith('cat6', updatedCategory);
    });

    it('returns an error if the repository throws (update)', async () => {
      mockRepository.update.mockRejectedValueOnce(new Error('Update Error'));
      const service = new CategoryService();
      const updatedCategory = {
        id: 'cat6',
        name: 'Categoria Aggiornata',
        userId: 'user1',
        parentId: null,
        categoryType: 'expense' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        description: null,
        icon: null,
        color: null,
      };
      const result = await service.update('cat6', updatedCategory);
      expect(result.error).toBe(true);
      expect(result.message).toBe('Update Error');
    });
  });

  describe('delete', () => {
    it('deletes a category by id', async () => {
      const service = new CategoryService();
      const result = await service.delete('cat7');
      expect(result.error).toBe(false);
      expect(result.data).toEqual(await mockRepository.delete());
      expect(mockRepository.delete).toHaveBeenCalledWith('cat7');
    });

    it('returns an error if the repository throws (delete)', async () => {
      mockRepository.delete.mockRejectedValueOnce(new Error('Delete Error'));
      const service = new CategoryService();
      const result = await service.delete('cat7');
      expect(result.error).toBe(true);
      expect(result.message).toBe('Delete Error');
    });
  });

  describe('handleErrors', () => {
    it('returns the default error message if the thrown error is not an Error instance', async () => {
      const service = new CategoryService();
      const result = await service['handleErrors'](
        () => Promise.reject('fail'),
        'Default error message',
      );
      expect(result.error).toBe(true);
      expect(result.message).toBe('Default error message');
    });
  });
});
