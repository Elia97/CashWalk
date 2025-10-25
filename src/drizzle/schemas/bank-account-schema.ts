import {
  pgTable,
  uuid,
  text,
  pgEnum,
  decimal,
  boolean,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const accountTypeEnum = pgEnum("type", ["checking", "cash", "savings"]);

export const bankAccount = pgTable(
  "bank_account",
  {
    id: uuid("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    name: text("name").notNull(),
    accountNumber: text("account_number"),
    type: accountTypeEnum("type").notNull(),
    currency: text("currency").notNull().default("EUR"),
    balance: decimal("balance", { precision: 14, scale: 2 })
      .notNull()
      .default("0"),
    isPrimary: boolean("is_primary").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date()),
  },
  (table) => [
    {
      userIdAccountNumberUnique: unique().on(table.userId, table.accountNumber),
    },
  ],
);
