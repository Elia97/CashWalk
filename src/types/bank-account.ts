import type { InferSelectModel } from "drizzle-orm";
import { bankAccount } from "@/drizzle/schema";

export type BankAccount = InferSelectModel<typeof bankAccount>;
export type ClientBankAccount = Omit<BankAccount, "balance"> & {
  balance: number;
};
export type BankAccountActionResponse<T = void> = {
  error: boolean;
  data?: T;
  message?: string;
};
