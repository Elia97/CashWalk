import { bankAccount, user, transaction, category } from './schema';

export const allTables = [bankAccount, user, transaction, category] as const;

export type AllTableTypes = typeof bankAccount | typeof user | typeof transaction | typeof category;
