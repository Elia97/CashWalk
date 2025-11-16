import { db } from '@/drizzle/db';
import * as schema from '../schema';
const { user } = schema;
import { eq } from 'drizzle-orm';

export async function seedTestUsers(customUser?: Partial<typeof user._.inferInsert>) {
  // Se non viene passato un utente, usa quello di default
  const testUser = {
    id: 'test-user-id',
    email: 'test@email.com',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...customUser,
  };
  // Elimina solo l'utente specifico (non tutta la tabella!)
  await db.delete(user).where(eq(user.id, testUser.id));
  await db.insert(user).values(testUser);
}
