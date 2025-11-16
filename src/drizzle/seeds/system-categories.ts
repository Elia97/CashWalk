import 'dotenv/config';
import { InferInsertModel } from 'drizzle-orm';
import { db, pool } from '../db';
import { category } from '../schema';

const incomeCategories: InferInsertModel<typeof category>[] = [
  {
    name: 'Salary & Wages',
    categoryType: 'income',
    icon: '💼',
    color: '#22c55e',
    description: 'Employment income, bonuses, commissions',
  },
  {
    name: 'Freelance & Side Work',
    categoryType: 'income',
    icon: '💻',
    color: '#10b981',
    description: 'Self-employment, consulting, gigs, side projects',
  },
  {
    name: 'Gifts & Transfers',
    categoryType: 'income',
    icon: '🎁',
    color: '#34d399',
    description: 'Money received as gifts, family support',
  },
  {
    name: 'Refunds & Cashback',
    categoryType: 'income',
    icon: '💳',
    color: '#6ee7b7',
    description: 'Tax refunds, cashback, returns, reimbursements',
  },
  {
    name: 'Other Income',
    categoryType: 'income',
    icon: '💸',
    color: '#d1fae5',
    description: 'Miscellaneous income sources',
  },
];

const expenseCategories: InferInsertModel<typeof category>[] = [
  // Essential Living
  {
    name: 'Housing',
    categoryType: 'expense',
    icon: '🏠',
    color: '#f59e0b',
    description: 'Rent, mortgage, property tax, home insurance',
  },
  {
    name: 'Utilities',
    categoryType: 'expense',
    icon: '💡',
    color: '#fbbf24',
    description: 'Electricity, gas, water, internet, phone',
  },
  {
    name: 'Groceries',
    categoryType: 'expense',
    icon: '🛒',
    color: '#ef4444',
    description: 'Food and household supplies',
  },
  {
    name: 'Dining & Takeout',
    categoryType: 'expense',
    icon: '🍽️',
    color: '#f87171',
    description: 'Restaurants, cafes, food delivery',
  },

  // Transportation
  {
    name: 'Transportation',
    categoryType: 'expense',
    icon: '🚗',
    color: '#3b82f6',
    description: 'Gas, public transit, parking, tolls',
  },
  {
    name: 'Auto & Vehicle',
    categoryType: 'expense',
    icon: '🔧',
    color: '#60a5fa',
    description: 'Car payments, insurance, maintenance, repairs',
  },

  // Health & Wellness
  {
    name: 'Healthcare',
    categoryType: 'expense',
    icon: '🏥',
    color: '#dc2626',
    description: 'Doctor visits, prescriptions, medical expenses',
  },
  {
    name: 'Fitness & Wellness',
    categoryType: 'expense',
    icon: '💪',
    color: '#f43f5e',
    description: 'Gym, sports, fitness classes, wellness',
  },
  {
    name: 'Personal Care',
    categoryType: 'expense',
    icon: '💇',
    color: '#fb7185',
    description: 'Haircuts, salon, cosmetics, hygiene products',
  },

  // Shopping & Lifestyle
  {
    name: 'Shopping',
    categoryType: 'expense',
    icon: '🛍️',
    color: '#ec4899',
    description: 'Clothing, shoes, accessories',
  },
  {
    name: 'Electronics & Tech',
    categoryType: 'expense',
    icon: '📱',
    color: '#a855f7',
    description: 'Gadgets, computers, software, apps',
  },
  {
    name: 'Home & Garden',
    categoryType: 'expense',
    icon: '🪴',
    color: '#84cc16',
    description: 'Furniture, decor, home improvement, gardening',
  },

  // Entertainment & Leisure
  {
    name: 'Entertainment',
    categoryType: 'expense',
    icon: '🎬',
    color: '#8b5cf6',
    description: 'Movies, concerts, events, hobbies',
  },
  {
    name: 'Subscriptions & Streaming',
    categoryType: 'expense',
    icon: '📺',
    color: '#a78bfa',
    description: 'Netflix, Spotify, news, memberships',
  },
  {
    name: 'Travel & Vacation',
    categoryType: 'expense',
    icon: '✈️',
    color: '#06b6d4',
    description: 'Flights, hotels, vacation activities',
  },

  // Education & Development
  {
    name: 'Education',
    categoryType: 'expense',
    icon: '🎓',
    color: '#10b981',
    description: 'Tuition, courses, school supplies, textbooks',
  },
  {
    name: 'Books & Learning',
    categoryType: 'expense',
    icon: '📚',
    color: '#34d399',
    description: 'Books, audiobooks, online courses, training',
  },

  // Financial Services
  {
    name: 'Bank Fees',
    categoryType: 'expense',
    icon: '🏦',
    color: '#6366f1',
    description: 'ATM fees, account fees, service charges',
  },
  {
    name: 'Insurance',
    categoryType: 'expense',
    icon: '🛡️',
    color: '#818cf8',
    description: 'Life, health, home, auto insurance premiums',
  },

  // Family & Pets
  {
    name: 'Childcare & Kids',
    categoryType: 'expense',
    icon: '👶',
    color: '#f472b6',
    description: "Daycare, babysitting, children's activities",
  },
  {
    name: 'Pets',
    categoryType: 'expense',
    icon: '🐾',
    color: '#fbbf24',
    description: 'Pet food, vet, grooming, pet supplies',
  },

  // Social & Giving
  {
    name: 'Gifts & Celebrations',
    categoryType: 'expense',
    icon: '🎁',
    color: '#fb923c',
    description: 'Presents, parties, special occasions',
  },
  {
    name: 'Charity & Donations',
    categoryType: 'expense',
    icon: '❤️',
    color: '#f97316',
    description: 'Charitable giving, donations, support',
  },

  // Catch-all
  {
    name: 'Miscellaneous',
    categoryType: 'expense',
    icon: '📦',
    color: '#6b7280',
    description: "Other expenses that don't fit elsewhere",
  },
];

const allCategories = [...incomeCategories, ...expenseCategories];

export async function seedCategories() {
  console.log('🌱 Avvio seed categorie...');
  const res = await db.insert(category).values(allCategories).onConflictDoNothing();
  console.log('✅ Seed completato:', res);
  await pool.end();
}

if (require.main === module) {
  seedCategories().catch((err) => {
    console.error('❌ Errore durante il seed:', err);
    process.exit(1);
  });
}
