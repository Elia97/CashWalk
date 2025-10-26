import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PiggyBank, Wallet } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "medium",
  }).format(new Date(date));
}

export const getAccountIcon = (type: string) => {
  switch (type) {
    case "checking":
      return Wallet;
    case "cash":
      return PiggyBank;
    case "savings":
      return Wallet;
    default:
      return Wallet;
  }
};

export const getAccountTypeLabel = (type: string) => {
  switch (type) {
    case "checking":
      return "Checking Account";
    case "cash":
      return "Cash Account";
    case "savings":
      return "Savings Account";
    default:
      return "Unknown Account";
  }
};
