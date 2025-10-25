import { db } from "@/drizzle/db";

export function getUserById(userId: string) {
  return db.query.user.findFirst({
    where: (fields, operators) => operators.eq(fields.id, userId),
    columns: { id: true },
  });
}
