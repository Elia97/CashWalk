import { db, pool } from '@/drizzle/db';
import { CategoryRepository } from './category-repository';
import { Category, category } from '@/drizzle/schema';
import { seedTestUsers } from '@/drizzle/seeds/test-users';
import { and, isNull } from 'drizzle-orm';
import { seedTestCategories } from '@/drizzle/seeds/test-categories';

describe('CategoryRepository (integration)', () => {
  const repository = new CategoryRepository();
  let createdCategoryId: string;
  const userId = 'test-user-id-cat';

  beforeEach(async () => {
    await db.delete(category);
    await seedTestCategories(); // Ricrea sempre le categorie di sistema
    await seedTestUsers({ id: userId, email: 'cat@email.com', name: 'Cat Test User' });
    const newCategory = {
      id: crypto.randomUUID(),
      name: 'Test Category',
      userId,
      categoryType: 'expense' as const,
      icon: '🧪',
      color: '#000000',
      description: 'Categoria di test',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const inserted = await repository.insert(newCategory);
    createdCategoryId = inserted.id;
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should find all system categories with user children', async () => {
    // Inserisci una categoria figlia per l'utente, con parentId di una categoria di sistema
    // Prima recupera una categoria di sistema (userId null, parentId null)
    const systemCategories = await db.query.category.findMany({
      where: and(isNull(category.userId), isNull(category.parentId)),
    });
    expect(systemCategories.length).toBeGreaterThan(0);
    const parent = systemCategories[0];
    // Inserisci una categoria figlia custom per l'utente
    const childCategory = {
      id: crypto.randomUUID(),
      name: 'Child Category',
      userId,
      parentId: parent.id,
      categoryType: 'expense' as const,
      icon: '🧪',
      color: '#000000',
      description: 'Child of system category',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await repository.insert(childCategory);

    // Ora testiamo findAll
    const all = await repository.findAll(userId);
    expect(Array.isArray(all)).toBe(true);
    // Deve trovare tutte le categorie di sistema
    expect(all.length).toBe(systemCategories.length);
    // Il primo elemento deve avere children, e tra questi il nostro inserito
    const parentWithChildren = all.find((c) => c.id === parent.id);
    expect(parentWithChildren).toBeDefined();
    expect(Array.isArray(parentWithChildren!.children)).toBe(true);
    const childIds = parentWithChildren!.children.map((c: Category) => c.id);
    expect(childIds).toContain(childCategory.id);
  });

  it('should find category by id', async () => {
    const found = await repository.findById(createdCategoryId);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(createdCategoryId);
  });

  it('should update the category', async () => {
    const updated = await repository.update(createdCategoryId, {
      name: 'Updated Category',
      updatedAt: new Date(),
    });
    expect(updated).not.toBeNull();
    expect(updated?.name).toBe('Updated Category');
  });

  it('should find by name', async () => {
    await repository.update(createdCategoryId, { name: 'Updated Category', updatedAt: new Date() });
    const found = await repository.findByName('Updated Category');
    expect(found).not.toBeNull();
    expect(found?.id).toBe(createdCategoryId);
  });

  it('should delete the category', async () => {
    const deleted = await repository.delete(createdCategoryId);
    expect(deleted).not.toBeNull();
    expect(deleted?.id).toBe(createdCategoryId);
    const shouldBeNull = await repository.findById(createdCategoryId);
    expect(shouldBeNull).toBeUndefined();
  });

  it('should insert and retrieve a user category with all fields', async () => {
    const newCategory = {
      id: crypto.randomUUID(),
      name: 'Full Test Category',
      userId,
      categoryType: 'expense' as const,
      icon: '🧪',
      color: '#123456',
      description: 'Categoria completa',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await repository.insert(newCategory);
    const found = await repository.findById(newCategory.id);
    expect(found).not.toBeNull();
    expect(found).toMatchObject({
      id: newCategory.id,
      name: newCategory.name,
      userId: newCategory.userId,
      categoryType: newCategory.categoryType,
      icon: newCategory.icon,
      color: newCategory.color,
      description: newCategory.description,
    });
  });

  it('should insert and retrieve a user category with all fields (full coverage)', async () => {
    const newCategory = {
      id: crypto.randomUUID(),
      name: 'Full Test Category',
      userId: userId,
      categoryType: 'expense' as const,
      icon: '🧪',
      color: '#123456',
      description: 'Categoria completa',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const inserted = await repository.insert(newCategory);
    expect(inserted).not.toBeNull();
    expect(inserted).toMatchObject({
      id: newCategory.id,
      name: newCategory.name,
      userId: newCategory.userId,
      categoryType: newCategory.categoryType,
      icon: newCategory.icon,
      color: newCategory.color,
      description: newCategory.description,
    });
    const found = await repository.findById(newCategory.id);
    expect(found).not.toBeNull();
    expect(found).toMatchObject({
      id: newCategory.id,
      name: newCategory.name,
      userId: newCategory.userId,
      categoryType: newCategory.categoryType,
      icon: newCategory.icon,
      color: newCategory.color,
      description: newCategory.description,
    });
    // Verifica anche i campi data
    expect(new Date(found!.createdAt).getTime()).toBeCloseTo(newCategory.createdAt.getTime(), -2);
    expect(new Date(found!.updatedAt).getTime()).toBeCloseTo(newCategory.updatedAt.getTime(), -2);
  });

  it('should insert a user category with all explicit fields and retrieve it', async () => {
    const newCategory = {
      id: crypto.randomUUID(),
      name: 'Coverage Category',
      userId: userId,
      categoryType: 'expense' as const,
      icon: '🧪',
      color: '#abcdef',
      description: 'Forza coverage',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const inserted = await repository.insert(newCategory);
    expect(inserted).not.toBeNull();
    expect(inserted.id).toBe(newCategory.id);
    expect(inserted.name).toBe(newCategory.name);
    expect(inserted.userId).toBe(newCategory.userId);
    expect(inserted.categoryType).toBe(newCategory.categoryType);
    expect(inserted.icon).toBe(newCategory.icon);
    expect(inserted.color).toBe(newCategory.color);
    expect(inserted.description).toBe(newCategory.description);
    expect(new Date(inserted.createdAt).getTime()).toBeCloseTo(newCategory.createdAt.getTime(), -2);
    expect(new Date(inserted.updatedAt).getTime()).toBeCloseTo(newCategory.updatedAt.getTime(), -2);
  });
});
