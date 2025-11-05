/**
 * Mapping delle categorie comuni per il welcome form
 * Collega le scelte user-friendly alle categorie di sistema
 */

export type WelcomeCategoryMapping = {
  label: string; // Nome mostrato all'utente
  value: string; // Valore univoco
  systemCategory: string; // Nome della categoria di sistema a cui collegarla
  categoryType: "income" | "expense";
  icon: string; // Icona suggerita
};

export const WELCOME_CATEGORIES: WelcomeCategoryMapping[] = [
  // Income categories
  {
    label: "Monthly Salary",
    value: "monthly-salary",
    systemCategory: "Salary & Wages",
    categoryType: "income",
    icon: "💼",
  },
  {
    label: "Freelance Work",
    value: "freelance-work",
    systemCategory: "Freelance & Side Work",
    categoryType: "income",
    icon: "💻",
  },
  {
    label: "Side Hustle",
    value: "side-hustle",
    systemCategory: "Freelance & Side Work",
    categoryType: "income",
    icon: "🚀",
  },
  {
    label: "Gift Money",
    value: "gift-money",
    systemCategory: "Gifts & Transfers",
    categoryType: "income",
    icon: "🎁",
  },
  {
    label: "Cashback & Rewards",
    value: "cashback-rewards",
    systemCategory: "Refunds & Cashback",
    categoryType: "income",
    icon: "💳",
  },

  // Expense categories
  {
    label: "Rent",
    value: "rent",
    systemCategory: "Housing",
    categoryType: "expense",
    icon: "🏠",
  },
  {
    label: "Mortgage",
    value: "mortgage",
    systemCategory: "Housing",
    categoryType: "expense",
    icon: "🏡",
  },
  {
    label: "Groceries",
    value: "groceries",
    systemCategory: "Groceries",
    categoryType: "expense",
    icon: "🛒",
  },
  {
    label: "Restaurants & Cafes",
    value: "restaurants-cafes",
    systemCategory: "Dining & Takeout",
    categoryType: "expense",
    icon: "🍽️",
  },
  {
    label: "Gas & Fuel",
    value: "gas-fuel",
    systemCategory: "Transportation",
    categoryType: "expense",
    icon: "⛽",
  },
  {
    label: "Public Transport",
    value: "public-transport",
    systemCategory: "Transportation",
    categoryType: "expense",
    icon: "🚇",
  },
  {
    label: "Car Payment",
    value: "car-payment",
    systemCategory: "Auto & Vehicle",
    categoryType: "expense",
    icon: "🚗",
  },
  {
    label: "Internet & Phone",
    value: "internet-phone",
    systemCategory: "Utilities",
    categoryType: "expense",
    icon: "📱",
  },
  {
    label: "Electricity & Gas",
    value: "electricity-gas",
    systemCategory: "Utilities",
    categoryType: "expense",
    icon: "💡",
  },
  {
    label: "Gym Membership",
    value: "gym-membership",
    systemCategory: "Fitness & Wellness",
    categoryType: "expense",
    icon: "💪",
  },
  {
    label: "Netflix & Streaming",
    value: "streaming-services",
    systemCategory: "Subscriptions & Streaming",
    categoryType: "expense",
    icon: "📺",
  },
  {
    label: "Shopping & Clothes",
    value: "shopping-clothes",
    systemCategory: "Shopping",
    categoryType: "expense",
    icon: "🛍️",
  },
  {
    label: "Pet Care",
    value: "pet-care",
    systemCategory: "Pets",
    categoryType: "expense",
    icon: "🐾",
  },
];

/**
 * Trova la configurazione della categoria in base al value
 */
export function getWelcomeCategoryMapping(
  value: string,
): WelcomeCategoryMapping | undefined {
  return WELCOME_CATEGORIES.find((cat) => cat.value === value);
}

/**
 * Raggruppa le categorie per tipo
 */
export function getWelcomeCategoriesByType() {
  return {
    income: WELCOME_CATEGORIES.filter((cat) => cat.categoryType === "income"),
    expense: WELCOME_CATEGORIES.filter((cat) => cat.categoryType === "expense"),
  };
}
