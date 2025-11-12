import { db } from '@/drizzle/db';
import { category } from '@/drizzle/schema';
import { and, eq, isNull } from 'drizzle-orm';

export class CategoryRepository {
  async findAll(userId: string) {
    return await db.query.category.findMany({
      where: and(isNull(category.userId), isNull(category.parentId)),
      with: {
        children: {
          where: eq(category.userId, userId),
        },
      },
    });
  }

  async findByUserId(userId: string) {
    return await db.query.category.findMany({
      where: eq(category.userId, userId),
    });
  }

  async findById(id: string) {
    return await db.query.category.findFirst({
      where: eq(category.id, id),
    });
  }

  async findByName(name: string) {
    return await db.query.category.findFirst({
      where: eq(category.name, name),
    });
  }

  async insert(data: typeof category.$inferInsert) {
    return await db
      .insert(category)
      .values(data)
      .returning()
      .then((rows) => rows[0]);
  }

  async update(id: string, data: Partial<typeof category.$inferInsert>) {
    return await db
      .update(category)
      .set(data)
      .where(eq(category.id, id))
      .returning()
      .then((rows) => rows[0]);
  }

  async delete(id: string) {
    return await db
      .delete(category)
      .where(eq(category.id, id))
      .returning()
      .then((rows) => rows[0]);
  }
}
