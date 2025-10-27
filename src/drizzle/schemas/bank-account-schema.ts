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
import { InferSelectModel } from "drizzle-orm";

export const accountTypeEnum = pgEnum("account_type", [
  "checking",
  "cash",
  "savings",
]);

export const bankAccount = pgTable(
  "bank_account",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    name: text("name").notNull(),
    accountNumber: text("account_number"),
    accountType: accountTypeEnum("account_type").notNull(),
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

export type BankAccount = InferSelectModel<typeof bankAccount>;
export type ClientBankAccount = Omit<BankAccount, "balance"> & {
  balance: number;
};
