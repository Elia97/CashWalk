import { pgTable, uuid, text, pgEnum, timestamp, AnyPgColumn } from 'drizzle-orm/pg-core';
import { user } from './auth-schema';
import { InferSelectModel, relations } from 'drizzle-orm';
import { transaction } from './transaction-schema';

export const categoryTypeEnum = pgEnum('category_type', ['income', 'expense']);

export const category = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  userId: text('user_id').references(() => user.id),
  parentId: uuid('parent_id').references((): AnyPgColumn => category.id),
  categoryType: categoryTypeEnum('category_type').notNull(),
  description: text('description'),
  icon: text('icon'),
  color: text('color'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date()),
});

export const categoryRelations = relations(category, ({ one, many }) => ({
  parent: one(category, {
    fields: [category.parentId],
    references: [category.id],
    relationName: 'category_children',
  }),
  children: many(category, {
    relationName: 'category_children',
  }),
  user: one(user, {
    fields: [category.userId],
    references: [user.id],
    relationName: 'user_categories',
  }),
  transactions: many(transaction, {
    relationName: 'category_transactions',
  }),
}));

export type Category = InferSelectModel<typeof category>;
export type CategoryWithChildren = Category & {
  children: Category[];
};
