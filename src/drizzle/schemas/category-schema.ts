import {
  pgTable,
  uuid,
  text,
  pgEnum,
  timestamp,
  AnyPgColumn,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { InferSelectModel } from "drizzle-orm";

export const categoryTypeEnum = pgEnum("category_type", ["income", "expense"]);

export const category = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  userId: text("user_id").references(() => user.id),
  parentId: uuid("parent_id").references((): AnyPgColumn => category.id),
  categoryType: categoryTypeEnum("category_type").notNull(),
  description: text("description"),
  icon: text("icon"),
  color: text("color"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date()),
});

export type Category = InferSelectModel<typeof category>;
