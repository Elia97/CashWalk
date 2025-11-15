import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { Pool } from 'pg';

const dbUrl =
  process.env.NODE_ENV === 'test' ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL;

export const pool = new Pool({ connectionString: dbUrl });
export const db = drizzle(pool, { schema });
