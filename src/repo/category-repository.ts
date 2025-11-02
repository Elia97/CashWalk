import { db } from "@/drizzle/db";
import { category, Category, CategoryWithChildren } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function findManyCategoriesByUserId(
  userId: string,
): Promise<CategoryWithChildren[]> {
  return db.query.category.findMany({
    where(fields, operators) {
      return operators.isNull(fields.userId);
    },
    orderBy(fields, operators) {
      return operators.asc(fields.name);
    },
    columns: {
      id: true,
      name: true,
      description: true,
      icon: true,
      color: true,
      createdAt: true,
      updatedAt: true,
      userId: true,
      parentId: true,
      categoryType: true,
    },
    with: {
      children: {
        where(fields, operators) {
          return operators.eq(fields.userId, userId);
        },
        columns: {
          id: true,
          name: true,
          description: true,
          icon: true,
          color: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
          parentId: true,
          categoryType: true,
        },
      },
    },
  });
}

export async function findManyCategoryIdAndNameByUserId(
  userId: string,
): Promise<{ id: string; name: string; categoryType: string }[]> {
  return await db.query.category.findMany({
    where(fields, operators) {
      return operators.eq(fields.userId, userId);
    },
    columns: {
      id: true,
      name: true,
      categoryType: true,
    },
  });
}

export async function findFirstCategoryById(
  id: string,
): Promise<Category | undefined> {
  return await db.query.category.findFirst({
    where: (fields, operators) => operators.eq(fields.id, id),
  });
}

export async function insertCategory(data: Category): Promise<void> {
  await db.insert(category).values(data);
}

export async function deleteCategoryById(id: string): Promise<void> {
  await db.delete(category).where(eq(category.id, id));
}

export async function updateCategoryById(
  id: string,
  data: Partial<Category>,
): Promise<void> {
  await db.update(category).set(data).where(eq(category.id, id));
}
