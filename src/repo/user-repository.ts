import { db } from '@/drizzle/db';

export function findFirstUserById(userId: string) {
  return db.query.user.findFirst({
    where: (fields, operators) => operators.eq(fields.id, userId),
    columns: { id: true },
  });
}
