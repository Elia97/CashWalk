"use server";

import { Category, ClientBankAccount } from "@/drizzle/schema";
import {
  WelcomeActionResponse,
  WelcomeService,
} from "@/services/welcome-service";

export async function createWelcomeDataAction(data: {
  bankAccount: ClientBankAccount;
  categories: string[];
}): Promise<WelcomeActionResponse> {
  return await WelcomeService.createWelcomeData(data);
}
