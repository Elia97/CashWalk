import { db } from '@/drizzle/db';
import * as schema from '../schema';
const { category } = schema;

const testCategories = [
  {
    name: 'Salary & Wages',
    categoryType: 'income' as const,
    icon: '💼',
    color: '#22c55e',
    description: 'Employment income, bonuses, commissions',
  },
  {
    name: 'Housing',
    categoryType: 'expense' as const,
    icon: '🏠',
    color: '#f59e0b',
    description: 'Rent, mortgage, property tax, home insurance',
  },
];

export async function seedTestCategories() {
  await db.delete(category);
  await db.insert(category).values(testCategories);
}
