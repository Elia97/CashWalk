import { db } from '@/drizzle/db';
import * as schema from '../schema';
const { user } = schema;

const testUser = {
  id: 'test-user-id',
  email: 'test@email.com',
  name: 'Test User',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export async function seedTestUsers() {
  await db.delete(user);
  await db.insert(user).values(testUser);
}
