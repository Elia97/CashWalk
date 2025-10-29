import {
  decimal,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { BankAccount, bankAccount } from "./bank-account-schema";
import { Category, category } from "./category-schema";
import { InferSelectModel, relations } from "drizzle-orm";

export const transactionTypeEnum = pgEnum("transaction_type", [
  "income",
  "expense",
]);

export const transaction = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  bankAccountId: uuid("bank_account_id")
    .notNull()
    .references(() => bankAccount.id),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => category.id),
  transactionType: transactionTypeEnum("transaction_type").notNull(),
  amount: decimal("amount", { precision: 14, scale: 2 }).notNull(),
  date: timestamp("date").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date()),
});

export const transactionRelations = relations(transaction, ({ one }) => ({
  user: one(user, {
    fields: [transaction.userId],
    references: [user.id],
    relationName: "user_transactions",
  }),
  bankAccount: one(bankAccount, {
    fields: [transaction.bankAccountId],
    references: [bankAccount.id],
    relationName: "bank_account_transactions",
  }),
  category: one(category, {
    fields: [transaction.categoryId],
    references: [category.id],
    relationName: "category_transactions",
  }),
}));

export type Transaction = InferSelectModel<typeof transaction>;
export type ClientTransaction = Omit<Transaction, "amount"> & {
  amount: number;
  bankAccount: BankAccount;
  category: Category & { parent: Category | null };
};
