import "dotenv/config";
import * as schema from "../schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { InferInsertModel } from "drizzle-orm";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });
const { category } = schema;

const incomeCategories: InferInsertModel<typeof category>[] = [
  {
    name: "Other Income",
    categoryType: "income",
    icon: "💸",
    color: "#059669",
    description: "Sales, gifts, refunds, misc",
  },
  {
    name: "Work",
    categoryType: "income",
    icon: "💼",
    color: "#22c55e",
    description: "Salary, freelance, bonuses",
  },
];

const expenseCategories: InferInsertModel<typeof category>[] = [
  {
    name: "Entertainment",
    categoryType: "expense",
    icon: "🎉",
    color: "#8b5cf6",
    description: "Movies, streaming, books, leisure",
  },
  {
    name: "Financial Services",
    categoryType: "expense",
    icon: "💳",
    color: "#6366f1",
    description: "Fees, insurance",
  },
  {
    name: "Food & Dining",
    categoryType: "expense",
    icon: "🍽️",
    color: "#ef4444",
    description: "Groceries, restaurants, bars",
  },
  {
    name: "Gifts & Donations",
    categoryType: "expense",
    icon: "🎁",
    color: "#f472b6",
    description: "Gifts, charity",
  },
  {
    name: "Healthcare",
    categoryType: "expense",
    icon: "🩺",
    color: "#dc2626",
    description: "Medical, pharmacy, gym",
  },
  {
    name: "Housing",
    categoryType: "expense",
    icon: "🏠",
    color: "#f59e0b",
    description: "Rent/mortgage, maintenance",
  },
  {
    name: "Learning",
    categoryType: "expense",
    icon: "📚",
    color: "#10b981",
    description: "Courses, books, training",
  },
  {
    name: "Miscellaneous",
    categoryType: "expense",
    icon: "🔖",
    color: "#6b7280",
    description: "Everything else",
  },
  {
    name: "Shopping",
    categoryType: "expense",
    icon: "🛒",
    color: "#ec4899",
    description: "Clothing, electronics, home",
  },
  {
    name: "Taxes & Obligations",
    categoryType: "expense",
    icon: "🧾",
    color: "#64748b",
    description: "Taxes, fines, stamps",
  },
  {
    name: "Transportation",
    categoryType: "expense",
    icon: "🚗",
    color: "#3b82f6",
    description: "Gas, public transport, car maintenance",
  },
  {
    name: "Travel",
    categoryType: "expense",
    icon: "✈️",
    color: "#06b6d4",
    description: "Vacations, hotels, transport",
  },
  {
    name: "Utilities",
    categoryType: "expense",
    icon: "💡",
    color: "#fbbf24",
    description: "Electricity, gas, water, internet, phone",
  },
];

const allCategories = [...incomeCategories, ...expenseCategories];

export async function seedCategories() {
  console.log("🌱 Avvio seed categorie...");
  const res = await db
    .insert(category)
    .values(allCategories)
    .onConflictDoNothing();
  console.log("✅ Seed completato:", res);
  await pool.end();
}

if (require.main === module) {
  seedCategories().catch((err) => {
    console.error("❌ Errore durante il seed:", err);
    process.exit(1);
  });
}
